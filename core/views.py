from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST

from .forms import ContractRFQForm


@require_GET
@ensure_csrf_cookie
def csrf(request):
    """Sets a same-origin CSRF cookie for the Vue RFQ form."""
    return JsonResponse({"detail": "CSRF cookie set."})


@require_POST
@csrf_protect
def create_rfq(request):
    """Creates a Contract record from a multipart RFQ form submission."""
    form = ContractRFQForm(request.POST, request.FILES)
    if not form.is_valid():
        return JsonResponse({"errors": form.errors.get_json_data()}, status=400)

    inquiry = form.save()
    return JsonResponse(
        {
            "id": inquiry.pk,
            "message": "Thank you. Your RFQ has been received.",
        },
        status=201,
    )
