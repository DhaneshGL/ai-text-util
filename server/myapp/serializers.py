
 from rest_framework import serializers

class TextSummarizationSerializer(serializers.Serializer):
    text = serializers.CharField()

class TextSummarizationSerializerr(serializers.Serializer):
    text = serializers.CharField()
    question = serializers.CharField()

class GrammarCorrectionSerializer(serializers.Serializer):
    text = serializers.CharField()

class TranslationSerializer(serializers.Serializer):
    text = serializers.CharField()
    source_language = serializers.CharField(default='auto', required=False)
    target_language = serializers.CharField()

class ToxicitySerializer(serializers.Serializer):
    text = serializers.CharField()

class ReplyTextSerializer(serializers.Serializer):
    text = serializers.CharField()
    context = serializers.CharField(required=False, allow_blank=True)
    tone = serializers.ChoiceField(
        choices=['professional', 'casual', 'friendly', 'formal'],
        default='professional',
        required=False
    )
