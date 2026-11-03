import { useState } from 'react';
import { aiService } from '../../services/api';
import {
  Sparkles,
  MessageSquare,
  Compass,
  Send,
  BookOpen,
  CheckCircle2,
  BookmarkCheck,
  Bot,
  User,
  Lightbulb,
} from 'lucide-react';

export default function AiAdvisorPage({ onSelectBook, onNotify }) {
  const [activeSubTab, setActiveSubTab] = useState('recommend'); // 'recommend' or 'chat'

  // Recommendation State
  const [prompt, setPrompt] = useState('');
  const [recomLoading, setRecomLoading] = useState(false);
  const [recomResult, setRecomResult] = useState(null);

  // Chatbot State
  const [chatMessage, setChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'assistant',
      content:
        'Halo! Saya Libraria, asisten virtual perpustakaan digital Anda. Ada yang bisa saya bantu hari ini? Anda dapat bertanya tentang rekomendasi buku, ringkasan karya sastra, atau topik belajar yang Anda minati.',
    },
  ]);

  const quickPrompts = [
    'Saya ingin buku tentang pemrograman Python untuk pemula',
    'Rekomendasikan buku untuk mengatasi overthinking dan menata kebiasaan hidup',
    'Buku fiksi dan sastra klasik Indonesia yang inspiratif',
    'Buku pengantar sains dan misteri alam semesta',
  ];

  // Submit Recommendation
  const handleGetRecommendation = async (textToSubmit) => {
    const query = textToSubmit || prompt;
    if (!query.trim()) return;

    setRecomLoading(true);
    setRecomResult(null);

    try {
      const res = await aiService.getRecommendations(query);
      if (res.data?.success) {
        setRecomResult(res.data.data);
      } else {
        onNotify({ type: 'error', message: res.data?.message || 'Gagal memproses rekomendasi AI.' });
      }
    } catch (err) {
      onNotify({
        type: 'error',
        message: err.response?.data?.message || 'Gagal menghubungi server Groq AI.',
      });
    } finally {
      setRecomLoading(false);
    }
  };

  // Submit Chat
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim() || chatLoading) return;

    const userText = chatMessage;
    const newHistory = [...chatHistory, { role: 'user', content: userText }];
    setChatHistory(newHistory);
    setChatMessage('');
    setChatLoading(true);

    try {
      const res = await aiService.chat(userText, newHistory);
      if (res.data?.success) {
        setChatHistory([
          ...newHistory,
          { role: 'assistant', content: res.data.data.reply },
        ]);
      } else {
        onNotify({ type: 'error', message: res.data?.message || 'Gagal menerima balasan AI.' });
      }
    } catch (err) {
      onNotify({
        type: 'error',
        message: err.response?.data?.message || 'Gagal berkomunikasi dengan AI.',
      });
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-950 to-neutral-900 p-8 sm:p-10 rounded-3xl text-white shadow-2xl relative overflow-hidden border border-primary-800/40">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-semibold backdrop-blur-md border border-primary-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Didukung oleh Groq Llama-3.3-70b High-Speed Inference</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              AI Book Advisor & Assistant
            </h2>
            <p className="text-xs sm:text-sm text-primary-200 max-w-xl">
              Konsultasikan minat membaca Anda dan dapatkan rekomendasi cerdas yang langsung terhubung dengan katalog perpustakaan kami.
            </p>
          </div>

          {/* Subtabs Switcher */}
          <div className="flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 self-start md:self-auto">
            <button
              onClick={() => setActiveSubTab('recommend')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeSubTab === 'recommend'
                  ? 'bg-white text-neutral-900 shadow-md'
                  : 'text-primary-200 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" /> Rekomendasi Buku
            </button>
            <button
              onClick={() => setActiveSubTab('chat')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeSubTab === 'chat'
                  ? 'bg-white text-neutral-900 shadow-md'
                  : 'text-primary-200 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Asisten Libraria
            </button>
          </div>
        </div>
      </div>

      {/* SUBTAB 1: AI RECOMMENDATION */}
      {activeSubTab === 'recommend' && (
        <div className="space-y-8 animate-fade-in">
          {/* Prompt Input Box */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
            <label className="block text-sm font-bold text-neutral-800 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Ceritakan Buku Apa yang Ingin Anda Baca:
            </label>

            <div className="relative">
              <textarea
                rows={3}
                placeholder="Contoh: Saya sedang ingin mempelajari dasar-dasar machine learning dan pemrograman data dengan bahasa Python untuk pemula..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-4 rounded-2xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition resize-none"
              />
            </div>

            {/* Quick Inspiration Chips */}
            <div>
              <p className="text-xs font-semibold text-neutral-400 mb-2">Inspirasi pencarian:</p>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPrompt(qp);
                      handleGetRecommendation(qp);
                    }}
                    className="text-xs py-1.5 px-3 rounded-full bg-neutral-100 hover:bg-primary-50 hover:text-primary-700 text-neutral-600 transition border border-neutral-200/60"
                  >
                    {qp}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => handleGetRecommendation()}
                disabled={recomLoading || !prompt.trim()}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-lg shadow-primary-200 transition flex items-center gap-2"
              >
                {recomLoading ? (
                  <>
                    <span className="animate-spin">⏳</span> AI Sedang Menganalisis...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Dapatkan Rekomendasi Cerdas
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI RESULT DISPLAY */}
          {recomResult && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-primary-100 shadow-sm space-y-6 animate-fade-in">
              {/* Summary Header */}
              <div className="p-5 rounded-2xl bg-primary-50/60 border border-primary-100 space-y-3">
                <div className="flex items-center gap-2 text-primary-800 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-primary-600" /> Analisis Pustakawan AI
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {recomResult.summary}
                </p>

                {/* Topics tags */}
                {recomResult.topics && recomResult.topics.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    <span className="text-xs font-semibold text-neutral-500">Topik Terkait:</span>
                    {recomResult.topics.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-0.5 rounded-full bg-white text-primary-700 font-semibold border border-primary-200 shadow-2xs"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommendations Cards List */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-neutral-900">
                  Daftar Buku Rekomendasi ({recomResult.recommendations?.length || 0} buku)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recomResult.recommendations?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-neutral-200 bg-white hover:border-primary-300 transition shadow-2xs flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-primary-600">
                            Pilihan #{idx + 1}
                          </span>
                          {item.is_in_library && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Ada di Perpustakaan
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-neutral-900 text-base leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-xs font-medium text-neutral-500">Oleh: {item.author}</p>

                        <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                          {item.reason}
                        </p>
                      </div>

                      {/* Action to view book if present locally */}
                      {item.local_book ? (
                        <button
                          type="button"
                          onClick={() => onSelectBook(item.local_book)}
                          className="w-full py-2 px-3 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                        >
                          <BookOpen className="w-3.5 h-3.5" /> Lihat Detail di Koleksi Kami
                        </button>
                      ) : (
                        <div className="text-[11px] text-neutral-400 italic">
                          (Rekomendasi buku literatur global)
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: AI ASSISTANT CHATBOT */}
      {activeSubTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs flex flex-col h-[650px] overflow-hidden animate-fade-in">
          {/* Chat Messages Scrollable Box */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-neutral-50/50">
            {chatHistory.map((msg, idx) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}
                >
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-xs ${
                      isAssistant
                        ? 'bg-gradient-to-tr from-primary-600 to-primary-600'
                        : 'bg-neutral-900'
                    }`}
                  >
                    {isAssistant ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>

                  <div
                    className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-line shadow-2xs ${
                      isAssistant
                        ? 'bg-white text-neutral-800 border border-neutral-200/80'
                        : 'bg-primary-600 text-white'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {chatLoading && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-600 text-white flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-white border border-neutral-200 rounded-2xl p-4 text-xs text-neutral-500 flex items-center gap-2">
                  <span className="animate-spin text-base">⏳</span> Libraria sedang berpikir...
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Field */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-200 bg-white flex gap-2">
            <input
              type="text"
              placeholder="Tanyakan rekomendasi buku, ringkasan, atau tips membaca ke Libraria..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              disabled={chatLoading}
              className="flex-1 px-4 py-3 rounded-2xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
            />
            <button
              type="submit"
              disabled={chatLoading || !chatMessage.trim()}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white font-bold text-sm rounded-2xl shadow-md transition flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Kirim
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

