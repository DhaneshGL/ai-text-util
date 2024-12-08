
from django.urls import path
from . import views

urlpatterns = [
    path('summarize/', views.TextSummarizationView.as_view(), name='text-summarize'),
    path('sentiment/', views.TextSentimentView.as_view(), name='text-sentiment'),
    path('generate/', views.TextGenerateView.as_view(), name='text-generate'),
    path('grammar-correct/', views.GrammarCorrectionView.as_view(), name='grammar-correct'),
    path('translate/', views.TranslationView.as_view(), name='translate'),
    path('toxicity/', views.ToxicityDetectionView.as_view(), name='toxicity-detect'),
    path('reply/', views.ReplyTextView.as_view(), name='generate-reply'),
]
