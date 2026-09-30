import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  BookOpen,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Globe,
  CheckCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LocationPin from '../components/LocationPin';

export default function AskArchive({ isEmbedded = false }) {
  const { language } = useLanguage();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text:
        language === 'hi'
          ? 'नमस्ते! मैं राष्ट्रीय ध्रुवीय डेटा संग्रह का आधिकारिक एआई सहायक हूँ। आप भारतीय अंटार्कटिक, आर्कटिक (हिमाद्रि, IndARC) या दक्षिणी महासागर अभियानों के बारे में कुछ भी पूछ सकते हैं। मैं केवल अभिलेख में मौजूद सत्यापित दस्तावेजों से उद्धृत उत्तर प्रदान करता हूँ।'
          : 'Welcome to the National Polar Data Archive Assistant. I answer questions grounded strictly in verified expedition reports, publications, and datasets from Maitri, Bharati, Himadri, and IndARC with verified citations.',
      sources: [],
      refused: false,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sampleQuestions = [
    {
      label: 'IndARC Arctic Mooring',
      q: 'What is IndARC and where is it deployed?',
      lang: 'en',
    },
    {
      label: 'मैत्री स्टेशन मौसम (Hindi)',
      q: 'मैत्री स्टेशन पर किस प्रकार के मौसम संबंधी अध्ययन किए जाते हैं?',
      lang: 'hi',
    },
    {
      label: '40th Expedition Glaciology',
      q: 'What glaciological observations were conducted in the 40th Indian Scientific Expedition?',
      lang: 'en',
    },
    {
      label: 'Off-Topic Refusal Demo',
      q: 'How do I bake a chocolate cake?',
      lang: 'en',
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (questionText = input) => {
    const q = questionText.trim();
    if (!q || loading) return;

    // Detect Hindi query or use UI language
    const isHindiQuery = /[\u0900-\u097F]/.test(q) || language === 'hi';
    const queryLang = isHindiQuery ? 'hi' : 'en';

    // Append user message
    const userMsg = { role: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, language: queryLang }),
      });
      const data = await res.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: data.answer,
            sources: data.sources || [],
            refused: data.refused || false,
            durationMs: data.durationMs,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'An error occurred while querying the polar archive.',
            sources: [],
            refused: true,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Unable to connect to archive assistant: ' + err.message,
          sources: [],
          refused: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        text: 'Chat history reset. How can I assist your polar research exploration today?',
        sources: [],
        refused: false,
      },
    ]);
  };

  const ContainerTag = isEmbedded ? 'section' : 'div';

  return (
    <ContainerTag
      id={isEmbedded ? 'ask' : undefined}
      className={
        isEmbedded
          ? 'py-20 px-4 sm:px-6 lg:px-8 bg-transparent border-t border-slate-200/40 scroll-mt-16 text-slate-900 flex flex-col justify-between'
          : 'min-h-screen bg-transparent py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-between text-slate-900'
      }
    >
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        {/* Section Header Banner */}
        <div className="card-glacier p-6 sm:p-7 rounded-2xl mb-6 flex items-center justify-between gap-4 border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                  {isEmbedded ? 'Ask the Grounded Polar Assistant' : 'Ask the Polar Archive'}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold shadow-xs">
                  Grounded RAG
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                100% cited source backing • Verifies claims against the Indian Polar Science Repository
              </p>
            </div>
          </div>

          <button
            onClick={handleClear}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 shadow-xs shrink-0 transition-colors"
            title="Clear Chat"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Suggestion Starter Chips */}
        <div className="card-glacier p-4 sm:p-5 rounded-2xl mb-6 border border-slate-200 shadow-sm">
          <div className="text-xs uppercase text-slate-800 font-bold mb-3 tracking-wide">
            <span>Suggested Verification Prompts:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((sq, i) => (
              <button
                key={i}
                onClick={() => handleSend(sq.q)}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 text-xs font-semibold transition-all flex items-center space-x-1.5 shadow-xs"
              >
                <span className="text-blue-600 font-bold">✦</span>
                <span>{sq.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Stream Box */}
        <div className="flex-1 card-glacier rounded-2xl p-4 sm:p-6 overflow-y-auto space-y-6 max-h-[600px] mb-4">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start space-x-3 ${
                  isUser ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-blue-700 border border-slate-200 shadow-xs'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-blue-600" />}
                </div>

                {/* Message Body */}
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'btn-glacier-primary text-white shadow-sm'
                      : msg.refused
                      ? 'bg-rose-50 text-rose-950 border border-rose-200 font-medium'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-xs'
                  }`}
                >
                  {/* Refusal notification header if applicable */}
                  {msg.refused && (
                    <div className="flex items-center space-x-1.5 text-rose-700 font-semibold text-[11px] mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Archive Boundary Rule Enforced</span>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap font-sans leading-relaxed">{msg.text}</div>

                  {/* Grounded Source Cards */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                      <div className="text-[10px] text-blue-700 font-bold uppercase tracking-wider flex items-center space-x-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified Citations ({msg.sources.length} Chunks Retrieved):</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {msg.sources.map((src, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all text-left shadow-xs"
                          >
                            <div className="flex items-center justify-between text-[10px] text-blue-700 font-bold mb-1">
                              <span>Source #{src.sourceIndex || i + 1}</span>
                              <span className="text-slate-600 inline-flex items-center gap-1 font-semibold">
                                <LocationPin className="w-3 h-3 text-blue-600" />
                                <span>{src.station} ({src.year})</span>
                              </span>
                            </div>
                            <div className="text-xs font-bold text-slate-900 truncate mb-1">
                              {src.title}
                            </div>
                            <div className="text-[10px] text-slate-600 line-clamp-2 italic font-sans">
                              "{src.snippet}"
                            </div>
                            <div className="mt-2.5 pt-1.5 border-t border-slate-200 flex justify-end">
                              <Link
                                to={`/library?q=${encodeURIComponent(src.title)}`}
                                className="text-[10px] text-blue-600 font-semibold hover:text-blue-800 hover:underline flex items-center space-x-0.5"
                              >
                                <span>Inspect Source</span>
                                <ExternalLink className="w-2.5 h-2.5 ml-1" />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.durationMs && (
                    <div className="mt-2 text-[10px] text-slate-400 text-right font-medium">
                      Response synthesized in {msg.durationMs}ms
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-blue-700 border border-slate-200 flex items-center justify-center flex-shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 text-slate-700 rounded-2xl p-4 text-xs flex items-center space-x-2.5 shadow-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                <span>Searching vector chunks & validating grounding citations...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about Maitri, Bharati, Himadri, IndARC, or ice cores (EN/HI)..."
            className="flex-1 bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none shadow-xs transition-all font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="btn-glacier-primary px-7 py-3 rounded-xl text-xs font-semibold flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </ContainerTag>
  );
}
