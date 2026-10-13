from django.contrib.auth import get_user_model
from django.test import Client, TestCase
from django.urls import reverse

from .models import Contract


class WebsiteRoutingTests(TestCase):
    def test_public_pages_support_direct_visits(self):
        for url in ("/products/", "/products/uhmwpe-braided-rope/", "/materials/", "/custom-solutions/", "/manufacturing-quality/", "/applications/", "/about-us/", "/request-a-quote/"):
            with self.subTest(url=url):
                response = self.client.get(url)
                self.assertEqual(response.status_code, 200)
                self.assertContains(response, '<div id="app"></div>')

    def test_unknown_api_is_not_a_frontend_page(self):
        self.assertEqual(self.client.get("/api/not-a-route/").status_code, 404)


class RFQApiTests(TestCase):
    def test_csrf_endpoint_sets_cookie(self):
        response = self.client.get(reverse("csrf"))

        self.assertEqual(response.status_code, 200)
        self.assertIn("csrftoken", response.cookies)

    def test_rfq_endpoint_creates_contract(self):
        csrf_client = Client(enforce_csrf_checks=True)
        csrf_client.get(reverse("csrf"))
        response = csrf_client.post(
            reverse("rfq-create"),
            {
                "name": "Example Buyer",
                "company": "Example Industrial Co.",
                "country": "United States",
                "business_email": "buyer@example.com",
                "material": "UHMWPE",
                "product": "UHMWPE Braided Rope",
                "estimated_quantity": "1,000 m",
                "application": "Industrial equipment",
                "message": "Please quote for industrial equipment.",
            },
            HTTP_X_CSRFTOKEN=csrf_client.cookies["csrftoken"].value,
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Contract.objects.count(), 1)
        self.assertEqual(Contract.objects.get().business_email, "buyer@example.com")

    def test_short_form_saves_new_contact_fields_without_country(self):
        response = self.client.post(reverse("rfq-create"), {
            "name": "Short Form Buyer", "business_email": "buyer@example.com",
            "message": "Please quote for rope.", "contact_number": "+1 555 0100",
            "contact_address": "Example address", "message_topic": "Rope enquiry",
        })
        self.assertEqual(response.status_code, 201)
        item = Contract.objects.get(pk=response.json()["id"])
        self.assertEqual(item.contact_number, "+1 555 0100")
        self.assertEqual(item.contact_address, "Example address")
        self.assertEqual(item.message_topic, "Rope enquiry")
        self.assertEqual(item.country, "")
        self.assertEqual(item.company, "")

    def test_short_form_requires_name_email_message(self):
        data = {"name": "Buyer", "business_email": "buyer@example.com", "message": "Please quote."}
        for field in data:
            response = self.client.post(reverse("rfq-create"), {**data, field: " "})
            self.assertEqual(response.status_code, 400)
            self.assertIn(field, response.json()["errors"])
        self.assertEqual(Contract.objects.count(), 0)


class ContactFormAdminMenuTests(TestCase):
    def test_contact_form_menu_is_visible_to_an_administrator(self):
        user = get_user_model().objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="test-password",
        )
        self.client.force_login(user)

        response = self.client.get("/admin/")

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "\\u8054\\u7cfb\\u8868\\u5355")
        self.assertContains(response, "/admin/core/contract/")

    def test_contact_form_admin_shows_new_fields_and_preserves_history(self):
        user = get_user_model().objects.create_superuser(
            username="reviewer", email="reviewer@example.com", password="test-password",
        )
        self.client.force_login(user)
        item = Contract.objects.create(
            name="Example Buyer", business_email="buyer@example.com",
            contact_number="+1 555 0100", contact_address="Example address",
            message_topic="Rope enquiry", message="Please quote.",
            material="UHMWPE", required_strength="Historical requirement",
        )
        response = self.client.get(reverse("admin:core_contract_change", args=[item.pk]))
        self.assertEqual(response.status_code, 200)
        for field in ("contact_number", "contact_address", "message_topic", "message"):
            self.assertContains(response, f'name="{field}"')
        self.assertContains(response, "Rope enquiry")
        self.assertContains(response, "Historical requirement")
