"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, re_path
from django.views.generic import TemplateView

from core import views as core_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/csrf/', core_views.csrf, name='csrf'),
    path('api/rfq/', core_views.create_rfq, name='rfq-create'),
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    # Serve the Vue entry only for public website routes, never for API/admin paths.
    re_path(
        r'^(?:products(?:/[-a-z0-9]+)?|materials|custom-solutions|manufacturing-quality|applications|about-us|request-a-quote)/$',
        TemplateView.as_view(template_name='index.html'),
        name='website-page',
    ),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
