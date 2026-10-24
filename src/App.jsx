
import { useRef, useState, useEffect } from "react";
import Mascot from "./components/Mascot";
import { getAIResponse } from "./services/groqService";
import "./App.css";

const starterMessage = {
  role: "assistant",
  content:
    "Hi! I'm StepMate, your coding buddy. Let's learn programming logic together! Can you tell me what pseudocode means?",
};

function App() {
  const [messages, setMessages] = useState([starterMessage]);
  const [input, setInput] = useState("");
  const [mood, setMood] = useState("thinking");
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mentorStarted, setMentorStarted] = useState(false);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const speak = (text) => {
    if (!voiceEnabled || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setMood("speaking");
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setMood("happy");
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setMood("thinking");
    };

    window.speechSynthesis.speak(utterance);
  };

  const startMentor = () => {
    setMentorStarted(true);

    const introduction =
      "Hi there! I'm StepMate, your coding buddy. " +
      "Today, we're going to learn programming logic together. " +
      "Let's start with a question. Can you tell me what pseudocode means?";

    speak(introduction);
  };

  const sendMessage = async (event) => {
    event?.preventDefault();

    const userMessage = input.trim();

    if (!userMessage || loading) return;

    const updatedMessages = [
      ...messages,
      { role: "user", content: userMessage },
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setMood("thinking");

    try {
      const history = updatedMessages
        .slice(-11)
        .map((message) => ({
          role: message.role,
          content: message.content,
        }));

      const result = await getAIResponse(
        userMessage,
        history.slice(0, -1)
      );

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: result.message,
        },
      ]);

      setScore(result.score);
      setMood(result.mood);

      speak(result.message);
    } catch (error) {
      console.error("StepMate AI error:", error);

      const errorMessage =
        "Oops! I couldn't connect to my AI brain. Please check your API configuration and try again.";

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: errorMessage,
        },
      ]);

      setMood("sad");
      speak(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in this browser. Try a supported browser."
      );
      return;
    }

    if (loading) return;

    window.speechSynthesis?.cancel();
    setIsSpeaking(false);

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setMood("listening");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      setInput(transcript);
      setMood("happy");
    };

    recognition.onerror = () => {
      setMood("sad");
    };

    recognition.onend = () => {
      setMood((current) =>
        current === "listening" ? "thinking" : current
      );
    };

    recognition.start();
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    recognitionRef.current?.stop();

    setIsSpeaking(false);
    setMood("thinking");
  };

  const clearChat = () => {
    window.speechSynthesis?.cancel();
    recognitionRef.current?.stop();

    setMessages([starterMessage]);
    setScore(0);
    setInput("");
    setMood("thinking");
    setIsSpeaking(false);
    setMentorStarted(false);
    setLoading(false);
  };

  return (
    <div className="stepmate-app">
      <header className="app-header">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="brand">
            <span className="brand-mark">S</span>

            <div>
              <h1>StepMate AI</h1>
              <p>Your friendly coding companion</p>
            </div>
          </div>

          <button
            className="btn reset-button"
            onClick={clearChat}
            type="button"
          >
            New Session
          </button>
        </div>
      </header>

      <main className="container py-4">
        <div className="row g-4">
          <aside className="col-lg-4">
            <section className="mentor-card">
              <span className="section-label">
                YOUR AI MENTOR
              </span>

              <Mascot
                mood={mood}
                isSpeaking={isSpeaking}
              />

              <div className="mentor-divider"></div>

              <h2>Learn one step at a time</h2>

              <p className="mentor-description">
                Think, explain, and solve. I'll help you
                understand the logic instead of giving you
                ready-made answers.
              </p>

              <div className="score-card">
                <div>
                  <span className="score-label">
                    Learning score
                  </span>
                  <p>Keep practising!</p>
                </div>

                <div className="score-circle">
                  <span>{score}</span>
                  <small>/10</small>
                </div>
              </div>

              <div className="progress mt-3">
                <div
                  className="progress-bar"
                  style={{ width: `${score * 10}%` }}
                ></div>
              </div>

              <button
                className="voice-toggle"
                type="button"
                onClick={() => {
                  if (voiceEnabled) {
                    window.speechSynthesis?.cancel();
                    setIsSpeaking(false);
                    setMood("thinking");
                  }

                  setVoiceEnabled((previous) => !previous);
                }}
              >
                {voiceEnabled
                  ? "Turn voice off"
                  : "Turn voice on"}
              </button>
            </section>
          </aside>

          <section className="col-lg-8">
            <div className="chat-card">
              <div className="chat-header">
                <div>
                  <h2>Learning Space</h2>

                  <p>
                    Ask questions, share ideas, and practise logic.
                  </p>

                  {!mentorStarted && (
                    <button
                      className="send-button mt-3"
                      onClick={startMentor}
                      type="button"
                    >
                      Start Learning with StepMate
                    </button>
                  )}
                </div>

                <span className="online-status">
                  <span></span>
                  AI Mentor
                </span>
              </div>

              <div
                className="chat-messages"
                aria-live="polite"
              >
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message-row ${
                      message.role === "user"
                        ? "user-row"
                        : "assistant-row"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="message-avatar">S</div>
                    )}

                    <div
                      className={`message-bubble ${
                        message.role === "user"
                          ? "user-bubble"
                          : "assistant-bubble"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="message-row assistant-row">
                    <div className="message-avatar">S</div>

                    <div className="message-bubble assistant-bubble">
                      <span className="typing-dots">
                        StepMate is thinking
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <form
                className="chat-input-area"
                onSubmit={sendMessage}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(event) =>
                    setInput(event.target.value)
                  }
                  placeholder="Explain your thinking..."
                  aria-label="Your message"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="voice-button"
                  onClick={startListening}
                  disabled={loading}
                  aria-label="Speak your answer"
                  title="Speak your answer"
                >
                  Voice
                </button>

                <button
                  type="submit"
                  className="send-button"
                  disabled={loading || !input.trim()}
                >
                  Send
                </button>
              </form>

              <div className="chat-footer">
                <span>
                  Small steps lead to big progress.
                </span>

                <button
                  className="stop-button"
                  onClick={stopSpeaking}
                  type="button"
                >
                  Stop voice
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
