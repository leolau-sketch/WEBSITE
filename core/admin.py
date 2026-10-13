from django.contrib import admin

from .models import Contract


@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ("name", "company", "business_email", "contact_number", "message_topic")
    search_fields = ("name", "company", "business_email", "contact_number", "message_topic", "material", "product")
    list_filter = ("material",)
    fieldsets = (
        ("联系表单", {"fields": ("company", "name", "contact_number", "contact_address", "business_email", "message_topic", "message")}),
        ("历史详细需求（保留旧数据）", {"classes": ("collapse",), "fields": ("country", "whatsapp", "material", "product", "diameter_size", "required_strength", "required_length", "estimated_quantity", "application", "custom_requirements", "drawing_specification_pdf")}),
    )
