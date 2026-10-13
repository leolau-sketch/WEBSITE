"""Read-only audit of the live database; all test writes use Django's isolated database."""
import tempfile
from pathlib import Path
from django.test import TestCase, Client, override_settings
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model
from core.models import Contract

class AuditRFQTests(TestCase):
    data = {'name':'Audit Buyer', 'company':'Audit Company', 'country':'Test', 'business_email':'audit@example.com'}

    def test_csrf_required(self):
        self.assertEqual(Client(enforce_csrf_checks=True).post('/api/rfq/',self.data).status_code,403)
        self.assertEqual(Contract.objects.count(),0)

    def test_required_fields_and_email(self):
        for data in ({},dict(self.data,business_email='not-an-email')):
            self.assertEqual(self.client.post('/api/rfq/',data).status_code,400)
        self.assertEqual(Contract.objects.count(),0)

    def test_method_restriction(self):
        self.assertEqual(self.client.get('/api/rfq/').status_code,405)

    def test_bad_extension_rejected(self):
        file=SimpleUploadedFile('audit.exe',b'test')
        self.assertEqual(self.client.post('/api/rfq/',dict(self.data,drawing_specification_pdf=file)).status_code,400)
        self.assertEqual(Contract.objects.count(),0)

    def test_oversized_attachment_rejected(self):
        file=SimpleUploadedFile('audit.pdf',b'x'*(10*1024*1024+1))
        self.assertEqual(self.client.post('/api/rfq/',dict(self.data,drawing_specification_pdf=file)).status_code,400)

    def test_attachment_save_and_admin_visibility(self):
        with tempfile.TemporaryDirectory(prefix='sensin-audit-') as folder, override_settings(MEDIA_ROOT=folder):
            browser=Client(enforce_csrf_checks=True)
            browser.get('/api/csrf/')
            file=SimpleUploadedFile('audit.pdf',b'%PDF-1.4\n%%EOF',content_type='application/pdf')
            response=browser.post('/api/rfq/',dict(self.data,drawing_specification_pdf=file),HTTP_X_CSRFTOKEN=browser.cookies['csrftoken'].value)
            self.assertEqual(response.status_code,201)
            item=Contract.objects.get(pk=response.json()['id'])
            self.assertTrue(Path(item.drawing_specification_pdf.path).exists())
            self.assertEqual(self.client.get('/admin/core/contract/').status_code,302)
            user=get_user_model().objects.create_superuser('audit-admin','audit@example.com','temporary-test-password')
            self.client.force_login(user)
            result=self.client.get('/admin/core/contract/')
            self.assertContains(result,'Audit Buyer')
