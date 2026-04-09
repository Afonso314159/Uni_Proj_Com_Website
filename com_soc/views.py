# Create your views here.
from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Noticia
from django.contrib.auth.decorators import login_required
from .forms import RegisterForm
from django.contrib.auth import login, logout, authenticate

def landing_page(request):
    # Get published news, prioritize ones with images for the featured spot
    all_news = Noticia.objects.filter(
        estado_publicacao=Noticia.EstadoPublicacao.PUBLICADA
    ).order_by("-data_publicacao", "-data_criacao")[:6]
    
    # Find a featured news (one with an image) for the center spot
    featured_news = None
    side_news = []
    
    for news in all_news:
        if featured_news is None and news.imagens.exists():
            featured_news = news
        else:
            side_news.append(news)
        if len(side_news) >= 5:
            break
    
    # If no news with image, use first news as featured
    if featured_news is None and all_news.exists():
        featured_news = all_news.first()
        side_news = list(all_news[1:6])
    
    context = {
        "featured_news": featured_news,
        "side_news": side_news,
    }
    return render(request, "com_soc/landing_page.html", context)


def register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request,user)
            return redirect('/com_soc')
    else:
        form = RegisterForm()
    return render(request, 'registration/register.html', {"form": form})

@login_required
def home(request):
    """Home page - shows only PUBLIC news"""
    news_list = Noticia.objects.filter(
        estado_publicacao=Noticia.EstadoPublicacao.PUBLICADA,
        categoria=Noticia.CategoriaAcesso.PUBLICO
    ).order_by("-data_publicacao", "-data_criacao")
    
    context = {
        "news_list": news_list,
        "page_type": "home",
        "page_title": "Notícias Públicas",
        "page_subtitle": "Últimas notícias de acesso público"
    }
    return render(request, "com_soc/home.html", context)


@login_required
def subscriber(request):
    """Subscriber page - shows PUBLIC and PREMIUM news"""
    news_list = Noticia.objects.filter(
        estado_publicacao=Noticia.EstadoPublicacao.PUBLICADA
    ).order_by("-data_publicacao", "-data_criacao")
    
    context = {
        "news_list": news_list,
        "page_type": "subscriber",
        "page_title": "Notícias Premium",
        "page_subtitle": "Conteúdo exclusivo para subscritores"
    }
    return render(request, "com_soc/subscriber.html", context)


@login_required
def noticia_detail(request, noticia_id):
    """News detail page - minimal placeholder for now"""
    try:
        news = Noticia.objects.get(pk=noticia_id)
    except Noticia.DoesNotExist:
        news = None
    
    context = {
        "news": news,
    }
    return render(request, "com_soc/noticia_detail.html", context)
