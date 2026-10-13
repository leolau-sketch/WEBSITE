from django.db import models


class Contract(models.Model):
    """A Request a Quote inquiry submitted by a prospective customer."""

    name = models.CharField("Name", max_length=120)
    company = models.CharField("Company", max_length=200, blank=True)
    country = models.CharField("Country", max_length=100, blank=True)
    business_email = models.EmailField("Business Email")
    contact_number = models.CharField("Contact Number / 联系电话", max_length=50, blank=True)
    contact_address = models.CharField("Contact Address / 联系地址", max_length=300, blank=True)
    message_topic = models.CharField("Message Topic / 留言主题", max_length=200, blank=True)
    whatsapp = models.CharField("WhatsApp", max_length=50, blank=True)

    material = models.CharField("Material", max_length=100, blank=True)
    product = models.CharField("Product", max_length=150, blank=True)
    diameter_size = models.CharField("Diameter / Size", max_length=150, blank=True)
    required_strength = models.CharField("Required Strength", max_length=150, blank=True)
    required_length = models.CharField("Required Length", max_length=150, blank=True)
    estimated_quantity = models.CharField("Estimated Quantity", max_length=150, blank=True)
    application = models.TextField("Application", blank=True)
    custom_requirements = models.TextField("Custom Requirements", blank=True)
    drawing_specification_pdf = models.FileField(
        "Drawing / Specification / PDF",
        upload_to="rfq_attachments/%Y/%m/",
        blank=True,
    )
    message = models.TextField("Message", blank=True)

    class Meta:
        db_table = "contract"
        verbose_name = "联系表单"
        verbose_name_plural = "联系表单"

    def __str__(self):
        return f"{self.name} — {self.company}"
