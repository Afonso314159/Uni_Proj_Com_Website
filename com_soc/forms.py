from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import Utilizador, Noticia

class RegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = Utilizador
        fields = ["username","email","password1","password2"]

class NoticiaForm(forms.ModelForm):
    class Meta:
        model = Noticia
        fields = ['titulo', 'corpo_texto', 'categoria_1', 'categoria_2', 'categoria_3', 'acesso']

    def __init__(self, *args, **kwargs):
        self.is_staff = kwargs.pop('is_staff', False)
        super().__init__(*args, **kwargs)
        # Non staff cant choose acesso, always publico
        if not self.is_staff:
            self.fields.pop('acesso')

    def clean(self):
        cleaned_data = super().clean()
        if not cleaned_data.get('categoria_1'):
            raise forms.ValidationError('Selecione pelo menos uma categoria.')
        return cleaned_data