from pathlib import Path

from django import forms
from django.core.exceptions import ValidationError

from .models import Contract


class ContractRFQForm(forms.ModelForm):
    """Validates browser-submitted RFQ data before it is stored."""
    message = forms.CharField(label="Message Content", required=True, max_length=10000, widget=forms.Textarea)

    max_attachment_size = 10 * 1024 * 1024
    allowed_attachment_extensions = {".pdf", ".dwg", ".dxf", ".doc", ".docx", ".jpg", ".jpeg", ".png"}

    class Meta:
        model = Contract
        fields = (
            "name",
            "company",
            "country",
            "business_email",
            "contact_number",
            "contact_address",
            "message_topic",
            "whatsapp",
            "material",
            "product",
            "diameter_size",
            "required_strength",
            "required_length",
            "estimated_quantity",
            "application",
            "custom_requirements",
            "drawing_specification_pdf",
            "message",
        )

    def clean_drawing_specification_pdf(self):
        attachment = self.cleaned_data.get("drawing_specification_pdf")
        if not attachment:
            return attachment

        if attachment.size > self.max_attachment_size:
            raise ValidationError("Attachment must be 10 MB or smaller.")

        extension = Path(attachment.name).suffix.lower()
        if extension not in self.allowed_attachment_extensions:
            raise ValidationError("Upload a PDF, drawing, document, JPG or PNG file.")

        return attachment
