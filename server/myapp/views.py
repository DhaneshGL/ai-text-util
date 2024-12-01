from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    TextSummarizationSerializer, 
    TextSummarizationSerializerr,
    GrammarCorrectionSerializer,
    TranslationSerializer,
    ToxicitySerializer,
    ReplyTextSerializer
)
from .services import (
    summarize_text, 
    sentiment_text, 
    generate_text,
    correct_grammar,
    translate_text,
    detect_toxicity,
    generate_reply
)

class TextSummarizationView(APIView):
    def post(self, request):
        serializer = TextSummarizationSerializer(data=request.data)
        if serializer.is_valid():
            text = serializer.validated_data.get('text')
            summarized_text = summarize_text(text)
            return Response({'text': summarized_text}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TextSentimentView(APIView):
    def post(self, request):
        serializer = TextSummarizationSerializer(data=request.data)
        if serializer.is_valid():
            text = serializer.validated_data.get('text')
            sentiment_result = sentiment_text(text)
            return Response({'sentiment': sentiment_result}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TextGenerateView(APIView):
    def post(self, request):
        serializer = TextSummarizationSerializerr(data=request.data)
        if serializer.is_valid():
            text = serializer.validated_data.get('text')
            question = serializer.validated_data.get('question')
            generated_text = generate_text(text, question)
            return Response({'answer': generated_text}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GrammarCorrectionView(APIView):
    def post(self, request):
        serializer = GrammarCorrectionSerializer(data=request.data)
        if serializer.is_valid():
            text = serializer.validated_data.get('text')
            corrected_text = correct_grammar(text)
            return Response({'corrected_text': corrected_text}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TranslationView(APIView):
    def post(self, request):
        serializer = TranslationSerializer(data=request.data)
        if serializer.is_valid():
            text = serializer.validated_data.get('text')
            source_lang = serializer.validated_data.get('source_language', 'auto')
            target_lang = serializer.validated_data.get('target_language')
            translated_text = translate_text(text, source_lang, target_lang)
            return Response({
                'translated_text': translated_text,
                'source_language': source_lang,
                'target_language': target_lang
            }, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ToxicityDetectionView(APIView):
    def post(self, request):
        serializer = ToxicitySerializer(data=request.data)
        if serializer.is_valid():
            text = serializer.validated_data.get('text')
            toxicity_result = detect_toxicity(text)
            return Response(toxicity_result, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReplyTextView(APIView):
    def post(self, request):
        serializer = ReplyTextSerializer(data=request.data)
        if serializer.is_valid():
            text = serializer.validated_data.get('text')
            context = serializer.validated_data.get('context', '')
            tone = serializer.validated_data.get('tone', 'professional')
            reply_text = generate_reply(text, context, tone)
            return Response({'reply': reply_text}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)