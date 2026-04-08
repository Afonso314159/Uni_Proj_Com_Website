from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from django.template import loader
from .models import Noticia

def index(request):
    latest_noticia_list = Noticia.objects.order_by("-data_criacao")[:5]
    context = {"latest_noticia_list": latest_noticia_list}
    return render(request, "com_soc/index.html", context)

def noticia(request, noticia_id):
    return HttpResponse("You're looking at noticia %s." % noticia_id)



def comentario(request, noticia_id):
    response = "You're looking at the comment of noticia %s."
    return HttpResponse(response % noticia_id)
