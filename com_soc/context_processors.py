from .models import Noticia

def global_context(request):
    return {
        'categoria_choices': Noticia.Categoria.choices,
    }