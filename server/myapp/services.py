 from transformers import pipeline
from transformers import AutoModelForSequenceClassification
from transformers import AutoTokenizer, AutoConfig
from scipy.special import softmax
from transformers import T5Tokenizer, T5ForConditionalGeneration
from transformers import AutoModelForQuestionAnswering
import numpy as np

 model_name = "deepset/roberta-base-squad2"
nlp = pipeline('question-answering', model=model_name, tokenizer=model_name)
tokenizer = T5Tokenizer.from_pretrained("google/flan-t5-base")
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

 grammar_corrector = pipeline("text2text-generation", model="vennify/t5-base-grammar-correction")

 translator = pipeline("translation", model="Helsinki-NLP/opus-mt-en-mul")

 toxicity_classifier = pipeline("text-classification", model="unitary/toxic-bert")

 text_generator = pipeline("text-generation", model="microsoft/DialoGPT-medium")

def summarize_text(text):
    return summarizer(text, do_sample=False)[0]['summary_text']

def sentiment_text(text):
    def preprocess(innertext):
        new_text = []
        for t in innertext.split(" "):
            t = '@user' if t.startswith('@') and len(t) > 1 else t
            t = 'http' if t.startswith('http') else t
            new_text.append(t)
        return " ".join(new_text)

    MODEL = f"cardiffnlp/twitter-roberta-base-sentiment-latest"
    tokenizer = AutoTokenizer.from_pretrained(MODEL)
    config = AutoConfig.from_pretrained(MODEL)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL)

    ptext = preprocess(text)
    encoded_input = tokenizer(ptext, return_tensors='pt')
    output = model(**encoded_input)
    scores = output[0][0].detach().numpy()
    scores = softmax(scores)

    ranking = np.argsort(scores)
    ranking = ranking[::-1]
    number = []
    result = []
    
    for i in range(scores.shape[0]):
        l = config.id2label[ranking[i]]
        s = scores[ranking[i]]
        number.append(np.round(float(s), 4))
        result.append(l)
    
    largest_number = max(number)
    index = number.index(largest_number)
    return result[index]

def generate_text(text, question):
    QA_input = {
        'question': question,
        'context': text
    }
    
    res = nlp(QA_input)
    model = AutoModelForQuestionAnswering.from_pretrained(model_name)
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    
    answer = res['answer']
    return answer

def correct_grammar(text):
 
    try:
         corrected = grammar_corrector(f"grammar: {text}", max_length=512, num_return_sequences=1)
        return corrected[0]['generated_text']
    except Exception as e:
         return text

def translate_text(text, source_lang='auto', target_lang='es'):
 
    try:
         if target_lang == 'es':
            model_name = "Helsinki-NLP/opus-mt-en-es"
        elif target_lang == 'fr':
            model_name = "Helsinki-NLP/opus-mt-en-fr"
        elif target_lang == 'de':
            model_name = "Helsinki-NLP/opus-mt-en-de"
        else:
            model_name = "Helsinki-NLP/opus-mt-en-mul"
        
        translator = pipeline("translation", model=model_name)
        result = translator(text, max_length=512)
        return result[0]['translation_text']
    except Exception as e:
        return f"Translation error: {str(e)}"

def detect_toxicity(text):
 
    try:
        result = toxicity_classifier(text)
        toxicity_score = result[0]['score'] if result[0]['label'] == 'TOXIC' else 1 - result[0]['score']
        
        return {
            'is_toxic': result[0]['label'] == 'TOXIC',
            'toxicity_score': round(toxicity_score, 4),
            'label': result[0]['label'],
            'confidence': round(result[0]['score'], 4)
        }
    except Exception as e:
        return {
            'is_toxic': False,
            'toxicity_score': 0.0,
            'label': 'UNKNOWN',
            'confidence': 0.0,
            'error': str(e)
        }

def generate_reply(text, context='', tone='professional'):
 
    try:
         tone_prompts = {
            'professional': f"Please provide a professional response to: {text}",
            'casual': f"Reply casually to: {text}",
            'friendly': f"Give a friendly response to: {text}",
            'formal': f"Provide a formal reply to: {text}"
        }
        
        prompt = tone_prompts.get(tone, tone_prompts['professional'])
        
        if context:
            prompt = f"Context: {context}\n{prompt}"
        
         result = text_generator(prompt, max_length=150, num_return_sequences=1, 
                              temperature=0.7, do_sample=True, pad_token_id=50256)
        
        generated_text = result[0]['generated_text']
         reply = generated_text.replace(prompt, '').strip()
        
        return reply if reply else "I understand your message. How can I help you further?"
        
    except Exception as e:
        return f"Could you please elaborate on that? I'd be happy to help."