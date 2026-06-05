from portfolio.urls.api import urlpatterns as api_urlpatterns
from portfolio.urls.web import urlpatterns as web_urlpatterns

app_name = "portfolio"

urlpatterns = web_urlpatterns + api_urlpatterns
