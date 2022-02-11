import logo from "./logo.svg";
import "./App.css";
import * as SIP from "sip.js";
import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

function App() {
  // For Speech Recognition

  // Dasha Integration
  const api = "http://localhost:8000";
  const getAccount = async () => {
    const response = await fetch(`${api}/sip`);
    const { aor, endpoint } = await response.json();
    return { aor, endpoint };
  };

  const createUser = async (aor, server) => {
    const user = new SIP.Web.SimpleUser(server, { aor });
    await user.connect();
    await user.register();
    return user;
  };

  const runCall = async (aor, name) => {
    const data = { aor, name };
    await fetch(`${api}/call`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  const [aor, setAor] = useState();
  const [endpoint, setEndpoint] = useState();

  useEffect(() => {
    const start = async () => {
      const { aor, endpoint } = await getAccount();
      setAor(aor);
      setEndpoint(endpoint);
      const user = await createUser(aor, endpoint);

      const audio = new Audio();
      user.delegate = {
        onCallReceived: async () => {
          await user.answer();
          // runButton.hidden = true;
          // hangupButton.hidden = false;
          // hangupButton.disabled = false;
          audio.srcObject = user.remoteMediaStream;
          audio.play();
        },
        onCallHangup: () => {
          audio.srcObject = null;
          // runButton.hidden = false;
          // runButton.disabled = false;
          // hangupButton.hidden = true;
        },
      };
    };
    start();
  }, []);
  var speechRecognition = window.webkitSpeechRecognition;
    var recognition = new speechRecognition();
    recognition.continuous = false;
    recognition.onstart = function () {
      console.log("Voice Recognition is On");
      //  translator.voiceToText(function (transcript) {
      //     console.log(transcript);
      //   }, 'en-US');
    };

    recognition.onspeechend = function () {
      console.log("No Activity");
    };

    recognition.onerror = function () {
      console.log("Try Again");
    };
    // TODO: recognition speed too slow 
    
    recognition.onresult = function (event) {
      var current = event.resultIndex;
      var transcript = event.results[current][0].transcript;
      console.log(transcript);
      console.log(current);
      setDialogues(oldArray => [...oldArray,{word:transcript,user:current}]);
      recognition.start()
      // setDialogues((prev)=>prev.push({word:transcript,user:current}))
    };
    recognition.onend = function () {
      recognition.start();
   }
  const run = () => {
    recognition.start();
    // SpeechRecognition.startListening({ continuous: true })
    runCall(aor, "Peter").catch(() => {
      // console.log("error")
    });
  };
  const show = () =>{
    console.log(dialogues);
  }
  const [dialogues,setDialogues] = useState([]);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  return (
    <div className="App">
      <button class="button" id="runButton" onClick={run}>
        Run <div class="button-bg"></div>
      </button>
      {/* <button onClick={show}>Show</button> */}
      { dialogues && dialogues.map((d)=>(
        <>
         {/* <button>{d.user}</button> */}
         <p>{d.word}</p>
        </>
      ))}
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={()=>SpeechRecognition.startListening()}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>{transcript}</p>
    </div>
  );
}

export default App;
