import { useCallback, useEffect, useRef, useState } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { useSpeechSynthesis } from 'react-speech-kit';

import Notify from '../assets/notify.mp3';
import Brain from '../assets/brain.png';
import './home.css';
import axios from 'axios';
import ClassProb from '../components/chart';
var voices = window.speechSynthesis.getVoices();

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
const classes = [
  'identity hate',
  'insult',
  'neutral',
  'obscene',
  'threat',
  'toxic',
];
let BaseURL = 'http://127.0.0.1:5000';
if (process.env.REACT_APP_STAGE === 'production') {
  BaseURL = `${window.location.protocol}//${window.location.hostname}`;
}
const Home = () => {
  const { speak } = useSpeechSynthesis();
  const [jarvistrigged, setjarvistrigged] = useState(false);
  const [startlistening, setstartlistening] = useState(false);
  const [clssifyData, setclssifyData] = useState(null);
  const [speaking, setspeaking] = useState(false);
  const [chartData, setchartData] = useState(null);
  const indicator = useRef(null);
  const {
    transcript,
    listening,
    finalTranscript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({ interimResults: false });

  useEffect(() => {
    // if (speaking) {
    indicator.current.classList.toggle('speaking', speaking);
    // } else {
    // }

    return () => {};
  }, [speaking]);

  const speakHelper = useCallback(
    (msg) => {
      setTimeout(() => {
        setspeaking(true);
        speak({
          text: msg,
          voice: window.speechSynthesis.getVoices()[10],
        });
      }, 500);

      setTimeout(() => {
        setspeaking(false);
      }, 2500);
    },
    [speak]
  );

  useEffect(() => {
    setTimeout(() => {
      SpeechRecognition.startListening({ interimResults: false });
    }, 2000);

    return () => {
      //   resetTranscript();
    };
  }, []);

  useEffect(() => {
    // console.log(listening);
    if (!listening) {
      setTimeout(() => {
        SpeechRecognition.startListening({ interimResults: false });
      }, 1500);
    }
    if (clssifyData) {
      setstartlistening(false);
      console.log(clssifyData);
      axios
        .get(`${BaseURL}/api/v1/getprediction`, {
          params: {
            sentence: clssifyData,
          },
        })
        .then((data) => {
          const prediction = data.data.data;
          setchartData(prediction);
          const maxPercent = Math.max(...prediction);
          const labelIndex = prediction.indexOf(maxPercent);
          console.log(classes[labelIndex]);

          const prob = Math.round(maxPercent * 10000) / 100;

          speak({
            text: `What you said is, ${prob}% ${classes[labelIndex]}`,
            voice: window.speechSynthesis.getVoices()[10],
          });
        });
      setclssifyData(null);
    }

    return () => {};
  }, [listening]);
  const responses = [
    "I'm here.",
    'How can I help you?',
    'Hello Master',
    'Hi There',
    'umm hmm',
  ];
  const whatCanIdo = [
    'I can classify a sentence, if its hateful or not.',
    'I can let you know, the tone of a sentence.',
    'Speak to me, I can tell you, how your tone is.',
  ];
  const startGettingSentence = ['Go ahead', 'I am all ears', 'start speaking'];
  useEffect(() => {
    // console.log(finalTranscript);
    if (startlistening) {
      setclssifyData(finalTranscript);
    }
    if (
      [
        'hey jarvis',
        'hello jarvis',
        'hi jarvis',
        'yo jarvis',
        'jarvis',
        'javis',
      ].includes(finalTranscript.toLocaleLowerCase())
    ) {
      setjarvistrigged(true);
      setTimeout(() => {
        setjarvistrigged(false);
      }, 10000);
      var audio = new Audio(Notify);
      audio.play();
      speakHelper(responses[getRandomInt(3)]);
      // setTimeout(() => {
      //   speak({
      //     text: responses[getRandomInt(3)],
      //     voice: window.speechSynthesis.getVoices()[10],
      //   });
      // }, 500);
    }
    if (
      jarvistrigged &&
      [
        'what can you do',
        'what are you capable of',
        'tell me what can you do',
        'why are you here',
        "what's your purpose",
      ].includes(finalTranscript.toLocaleLowerCase())
    ) {
      //   setjarvistrigged(true);
      //   setTimeout(() => {
      //     setjarvistrigged(false);
      //   }, 10000);
      speakHelper(whatCanIdo[getRandomInt(3)]);
      // setTimeout(() => {
      //   speak({
      //     text: whatCanIdo[getRandomInt(3)],
      //     voice: window.speechSynthesis.getVoices()[10],
      //   });
      // }, 500);
    }

    if (
      // jarvistrigged &&
      [
        'classify',
        'detect tone',
        'ok listen',
        'are my words toxic',
        'am speaking bad',
      ].includes(finalTranscript.toLocaleLowerCase())
    ) {
      speakHelper(startGettingSentence[getRandomInt(3)]);

      // setTimeout(() => {
      //   speak({
      //     text: startGettingSentence[getRandomInt(3)],
      //     voice: window.speechSynthesis.getVoices()[10],
      //   });
      // }, 500);
      setstartlistening(true);
    }
    // var msg = new SpeechSynthesisUtterance();
    // var voices = window.speechSynthesis.getVoices();
    // msg.voice = voices[10];
    // msg.volume = 1; // From 0 to 1
    // msg.rate = 1; // From 0.1 to 10
    // msg.pitch = 2; // From 0 to 2
    // msg.lang = 'en';
    return () => {};
  }, [finalTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  return (
    <>
      <div className='heading'> Speech Classification</div>
      {/* <audio src={Notify} autoPlay={true}></audio> */}
      {/* <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={SpeechRecognition.startListening}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button> */}
      <div className='botContainer'>
        <div ref={indicator} className='bot'>
          <img width={100} src={Brain} alt='' />
        </div>
      </div>
      {chartData ? (
        <div className='chartCont'>
          <ClassProb probs={chartData} />
        </div>
      ) : null}
      <p>{transcript}</p>
    </>
  );
};

export default Home;
