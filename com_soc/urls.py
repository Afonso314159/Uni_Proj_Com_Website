from django.urls import path

from . import views

urlpatterns = [
    # ex: /com_soc/
    path("", views.home, name="home"),
    # Subscriber page - premium news + chat
    path("subscriber/", views.subscriber, name="subscriber"),
    # News detail page
    path("noticia/<int:noticia_id>/", views.noticia_detail, name="noticia_detail"),
    # Comments
]