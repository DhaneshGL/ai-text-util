import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Alert from "./Alert";
import RecordRTC from "recordrtc";
import { AssemblyAI } from "assemblyai";
import axios from "axios";

const { SpeechSynthesisUtterance, speechSynthesis } = window;

export default function Form(props) {
  const [text, setText] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcriptText, setTranscriptText] = useState("");
  const recorderRef = useRef(null);
  const client = new AssemblyAI({ apiKey: "dd9778660e5549409fd1dae97f898c26" });
  
   const [sum, setSum] = useState("");
  const [sent, setSent] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  
  const [correctedText, setCorrectedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [toxicityResult, setToxicityResult] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyTone, setReplyTone] = useState("professional");
  const [replyContext, setReplyContext] = useState("");

  const startRecording = () => {
    setAlertText("Recording");
    setShowAlert(true);
    dismissAlertAfterDelay();
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new RecordRTC(stream, { type: "audio" });
        recorder.startRecording();
        recorderRef.current = recorder;
        setRecording(true);
      })
      .catch((error) => console.error("Error accessing microphone:", error));
  };

  const stopRecording = async () => {
    setAlertText("please wait while audio is being converted to text");
    setShowAlert(true);
    dismissAlertAfterDelay();
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current.getBlob();
        setAudioBlob(blob);
        setRecording(false);
        recorderRef.current = null;
        transcribeAudio(blob);
      });
    }
  };

  const transcribeAudio = async (blob) => {
    try {
      const response = await client.transcripts.transcribe({ audio: blob });
      setTranscriptText(response.text);
      setText(response.text);
    } catch (error) {
      console.error("Error transcribing audio:", error);
    }
  };

  const upper = () => {
    let newtext = text.toUpperCase();
    setText(newtext);
    setAlertText("converted to upper case");
    setShowAlert(true);
    dismissAlertAfterDelay();
  };

  const lower = () => {
    let newtext = text.toLowerCase();
    setText(newtext);
    setAlertText("converted to lower case");
    setShowAlert(true);
    dismissAlertAfterDelay();
  };

  const clear = () => {
    let newtext = "";
    setText(newtext);
    setCorrectedText("");
    setTranslatedText("");
    setToxicityResult(null);
    setReplyText("");
    setSum("");
    setSent("");
    setAnswer("");
    setAlertText("text cleared");
    setShowAlert(true);
    dismissAlertAfterDelay();
  };

  const space = () => {
    let newtext = text.replace(/ +/g, " ");
    newtext = newtext.replace(/(\n\s*)+/g, "\n");
    setText(newtext);
    setAlertText("removed extra spaces");
    setShowAlert(true);
    dismissAlertAfterDelay();
  };

  const speech = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
    setAlertText("playing text to speech");
    setShowAlert(true);
    dismissAlertAfterDelay();
  };

  const copy = () => {
    navigator.clipboard.writeText(text);
    setAlertText("text copied to clipboard");
    setShowAlert(true);
    dismissAlertAfterDelay();
  };

  useEffect(() => {
    setCharacterCount(text.length);
  }, [text]);

  useEffect(() => {
    const newText = text.trim();
    setWordCount(newText.split(/\s+/).filter(Boolean).length);
    setTimeTaken(newText.split(/\s+/).filter(Boolean).length / 200);
  }, [text]);

  const handelonchange = (event) => {
    const newText = event.target.value;
    setText(newText);
  };

  const dismissAlertAfterDelay = () => {
    setTimeout(() => {
      setShowAlert(false);
      setAlertText("");
    }, 2500);
  };

  const [dstyles, setDStyles] = useState({
    color: "#272841",
    backgroundColor: "#F0F0F0",
  });
  const [wstyles, setWStyles] = useState({
    color: "#F0F0F0 ",
    backgroundColor: "#272841",
  });
  const [ftext, setFText] = useState();
  const [rtext, setRText] = useState();
  const [noOfmatch, setNoOfmatch] = useState();

  const fhandle = (event) => {
    const newText = event.target.value;
    setFText(newText);
  };

  const rhandle = (event) => {
    const newText = event.target.value;
    setRText(newText);
  };

  const qhandle = (event) => {
    const q = event.target.value;
    setQuestion(q);
  };

  const rclick = () => {
    setAlertText("string replaced");
    setShowAlert(true);
    dismissAlertAfterDelay();
    try {
      const searchTerm = ftext.toLowerCase();
      const modifiedText = text.replace(new RegExp(searchTerm, "gi"), rtext);
      setText(modifiedText);
    } catch (error) {}
  };

  const fclick = () => {
    try {
      const searchTerm = ftext.toLowerCase();
      const newMatches = text.match(new RegExp(searchTerm, "gi"));
      setNoOfmatch(newMatches.length);
      setAlertText(`Found ${newMatches.length} matching strings`);
      setShowAlert(true);
      dismissAlertAfterDelay();
    } catch (error) {}
  };

   const getGrammarCorrection = async () => {
    setAlertText("Please wait for grammar correction");
    setShowAlert(true);
    dismissAlertAfterDelay();
    const url = "http://127.0.0.1:8000/api/grammar-correct/";
    try {
      const response = await axios.post(
        url,
        { text: text },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.data) {
        setCorrectedText(response.data.corrected_text);
        setAlertText("Grammar correction completed");
        setShowAlert(true);
        dismissAlertAfterDelay();
      }
    } catch (error) {
      console.error("Error:", error.message);
      setAlertText("Error in grammar correction");
      setShowAlert(true);
      dismissAlertAfterDelay();
    }
  };

  const getTranslation = async () => {
    setAlertText(`Please wait for translation to ${targetLanguage}`);
    setShowAlert(true);
    dismissAlertAfterDelay();
    const url = "http://127.0.0.1:8000/api/translate/";
    try {
      const response = await axios.post(
        url,
        { 
          text: text,
          target_language: targetLanguage 
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.data) {
        setTranslatedText(response.data.translated_text);
        setAlertText("Translation completed");
        setShowAlert(true);
        dismissAlertAfterDelay();
      }
    } catch (error) {
      console.error("Error:", error.message);
      setAlertText("Error in translation");
      setShowAlert(true);
      dismissAlertAfterDelay();
    }
  };

  const getToxicityDetection = async () => {
    setAlertText("Please wait for toxicity analysis");
    setShowAlert(true);
    dismissAlertAfterDelay();
    const url = "http://127.0.0.1:8000/api/toxicity/";
    try {
      const response = await axios.post(
        url,
        { text: text },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.data) {
        setToxicityResult(response.data);
        setAlertText("Toxicity analysis completed");
        setShowAlert(true);
        dismissAlertAfterDelay();
      }
    } catch (error) {
      console.error("Error:", error.message);
      setAlertText("Error in toxicity detection");
      setShowAlert(true);
      dismissAlertAfterDelay();
    }
  };

  const getReplyGeneration = async () => {
    setAlertText("Please wait for reply generation");
    setShowAlert(true);
    dismissAlertAfterDelay();
    const url = "http://127.0.0.1:8000/api/reply/";
    try {
      const response = await axios.post(
        url,
        { 
          text: text,
          tone: replyTone,
          context: replyContext
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.data) {
        setReplyText(response.data.reply);
        setAlertText("Reply generation completed");
        setShowAlert(true);
        dismissAlertAfterDelay();
      }
    } catch (error) {
      console.error("Error:", error.message);
      setAlertText("Error in reply generation");
      setShowAlert(true);
      dismissAlertAfterDelay();
    }
  };

  const getSentiment = async () => {
    setAlertText("Please wait for the sentiment analysis");
    setShowAlert(true);
    dismissAlertAfterDelay();
    const url = "http://127.0.0.1:8000/api/sentiment/";
    try {
      const response = await axios.post(
        url,
        { text: text },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.data) {
        setSent(response.data.sentiment || response.data.text);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const getSummary = async () => {
    setAlertText("Please wait for the summary analysis");
    setShowAlert(true);
    dismissAlertAfterDelay();
    const url = "http://127.0.0.1:8000/api/summarize/";
    try {
      const response = await axios.post(
        url,
        { text: text },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.data) {
        setSum(response.data.text);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const getAnswer = async () => {
    setAlertText("Please wait for the question analysis");
    setShowAlert(true);
    dismissAlertAfterDelay();
    const url = "http://127.0.0.1:8000/api/generate/";
    try {
      const response = await axios.post(
        url,
        { text: text, question: question },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.data) {
        setAnswer(response.data.answer || response.data.text[0]);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <>
      <div className="container a">
        {showAlert && <Alert alertText={alertText} />}
      </div>
      
      <div className="text-center">
        <div className="container c flex-grow-1 d-flex r my-1 f i">
          <textarea
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="7"
            value={text}
            onChange={handelonchange}
            style={props.mode === 0 ? dstyles : wstyles}
            placeholder="Enter your text here..."
          ></textarea>
        </div>

        <p className="mx-1 my-1" style={{color:"white"}}>
          Character Count: {characterCount} - Word Count: {wordCount}{" "}
          {recording ? (
            <button className="btn btn-danger mx-2 px-3" onClick={stopRecording}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-mic-fill me-2"
                viewBox="0 0 16 16"
              >
                <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z" />
                <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
              </svg>
              Stop Recording
            </button>
          ) : (
            <button className="btn btn-primary mx-2 px-3" onClick={startRecording}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-mic-fill me-2"
                viewBox="0 0 16 16"
              >
                <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z" />
                <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
              </svg>
              Start Recording
            </button>
          )}
        </p>

        <p className="mx-1 my-1" style={{color:"white"}}>Time to read: {timeTaken.toFixed(1)} min</p>
        
         <div className="results-section my-3">
          {answer && <p className="mx-1 my-1" style={{color:"white"}}>Answer: {answer}</p>}
          {sent && <p className="mx-1 my-1" style={{color:"white"}}>Sentiment: {sent}</p>}
          {sum && (
            <div>
              <p className="mx-1 my-1" style={{color:"white"}}>Summary:</p>
              <div className="q">
                <p className="mx-1 my-1 just f" style={{color:"white"}}>{sum}</p>
              </div>
            </div>
          )}
          {correctedText && (
            <div>
              <p className="mx-1 my-1" style={{color:"white"}}>Grammar Corrected:</p>
              <div className="q">
                <p className="mx-1 my-1 just f" style={{color:"white"}}>{correctedText}</p>
              </div>
            </div>
          )}
          {translatedText && (
            <div>
              <p className="mx-1 my-1" style={{color:"white"}}>Translation ({targetLanguage}):</p>
              <div className="q">
                <p className="mx-1 my-1 just f" style={{color:"white"}}>{translatedText}</p>
              </div>
            </div>
          )}
          {toxicityResult && (
            <div>
              <p className="mx-1 my-1" style={{color:"white"}}>
                Toxicity Analysis: {toxicityResult.is_toxic ? "⚠️ Toxic" : "✅ Safe"} 
                (Score: {toxicityResult.toxicity_score})
              </p>
            </div>
          )}
          {replyText && (
            <div>
              <p className="mx-1 my-1" style={{color:"white"}}>Generated Reply:</p>
              <div className="q">
                <p className="mx-1 my-1 just f" style={{color:"white",textAlign:"center"}}>{replyText}</p>
              </div>
            </div>
          )}
        </div>

         <div className="row mx-0 mb-2">
          <div className="col-12">
            <div className="row g-2">
              <div className="col-md-6">
                <input
                  style={props.mode === 0 ? dstyles : wstyles}
                  type="text"
                  className="form-control"
                  placeholder="Find text"
                  onChange={fhandle}
                />
              </div>
              <div className="col-md-6">
                <input
                  style={props.mode === 0 ? dstyles : wstyles}
                  type="text"
                  className="form-control"
                  placeholder="Replace with"
                  onChange={rhandle}
                />
              </div>
            </div>
          </div>
        </div>

         <div className="row mx-2 g-2">
           <div className="col-md-6">
            <div className="row g-2">
              <div className="col-6">
                <button
                  onClick={fclick}
                  type="button"
                  className="btn btn-primary w-100"
                  disabled={!text}
                >
                  Find
                </button>
              </div>
              <div className="col-6">
                <button
                  onClick={rclick}
                  type="button"
                  className="btn btn-primary w-100"
                  disabled={!text || !ftext}
                >
                  Replace
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="row g-2">
              <div className="col-6">
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={upper}
                  disabled={!text}
                >
                  Upper Case
                </button>
              </div>
              <div className="col-6">
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={lower}
                  disabled={!text}
                >
                  Lower Case
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="row g-2">
              <div className="col-6">
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={copy}
                  disabled={!text}
                >
                  Copy
                </button>
              </div>
              <div className="col-6">
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={speech}
                  disabled={!text}
                >
                  Speech
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="row g-2">
              <div className="col-6">
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={space}
                  disabled={!text}
                >
                  Trim
                </button>
              </div>
              <div className="col-6">
                <button
                  type="button"
                  className="btn btn-danger w-100"
                  onClick={clear}
                  disabled={!text}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

           <div className="col-md-6">
            <div className="row g-2">
              <div className="col-6">
                <button
                  type="button"
                  className="btn btn-success w-100"
                  onClick={getSummary}
                  disabled={!text}
                >
                  Summary
                </button>
              </div>
              <div className="col-6">
                <button
                  type="button"
                  className="btn btn-success w-100"
                  onClick={getSentiment}
                  disabled={!text}
                >
                  Sentiment
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="row g-2">
              <div className="col-6">
                <button
                  type="button"
                  className="btn btn-success w-100"
                  onClick={getGrammarCorrection}
                  disabled={!text}
                >
                  Grammar Fix
                </button>
              </div>
              <div className="col-6">
                <button
                  type="button"
                  className="btn btn-success w-100"
                  onClick={getToxicityDetection}
                  disabled={!text}
                >
                  Check Toxicity
                </button>
              </div>
            </div>
          </div>

           <div className="col-12">
            <div className="row g-2">
              <div className="col-md-8">
                <select
                  className="form-select"
                  style={props.mode === 0 ? dstyles : wstyles}
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                >
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                </select>
              </div>
              <div className="col-md-4">
                <button
                  type="button"
                  className="btn btn-success w-100"
                  onClick={getTranslation}
                  disabled={!text}
                >
                  Translate
                </button>
              </div>
            </div>
          </div>

           <div className="col-12">
            <div className="row g-2">
              <div className="col-md-8">
                <input
                  style={props.mode === 0 ? dstyles : wstyles}
                  type="text"
                  className="form-control"
                  placeholder="Ask a question"
                  onChange={qhandle}
                />
              </div>
              <div className="col-md-4">
                <button
                  type="button"
                  className="btn btn-success w-100"
                  onClick={getAnswer}
                  disabled={!text || !question}
                >
                  Ask Question
                </button>
              </div>
            </div>
          </div>

           <div className="col-12">
            <div className="row g-2">
              <div className="col-md-5">
                <input
                  style={props.mode === 0 ? dstyles : wstyles}
                  type="text"
                  className="form-control"
                  placeholder="Reply context (optional)"
                  value={replyContext}
                  onChange={(e) => setReplyContext(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  style={props.mode === 0 ? dstyles : wstyles}
                  value={replyTone}
                  onChange={(e) => setReplyTone(e.target.value)}
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="formal">Formal</option>
                </select>
              </div>
              <div className="col-md-4">
                <button
                  type="button"
                  className="btn btn-success w-100"
                  onClick={getReplyGeneration}
                  disabled={!text}
                >
                  Generate Reply
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ height: "4vh" }}></div>
      </div>
    </>
  );
}

Form.propTypes = {
  texttitle: PropTypes.string.isRequired,
  mode: PropTypes.number.isRequired,
};