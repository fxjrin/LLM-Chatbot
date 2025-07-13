import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { backend } from 'declarations/backend';
import botImg from '/bot.svg';
import userImg from '/user.svg';
import '/index.css';

const App = () => {
  const [chat, setChat] = useState([
    { system: { content: "Aku adalah AI tebak soal di Internet Computer. Tekan 'Buat Soal' untuk mulai!" } }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);

  // Scroll otomatis ke bawah jika chat berubah
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  // Format jam
  const formatDate = (date) => {
    const h = '0' + date.getHours();
    const m = '0' + date.getMinutes();
    return `${h.slice(-2)}:${m.slice(-2)}`;
  };

  // Fungsi untuk generate soal
  const handleGenerateQuestion = async () => {
    setIsLoading(true);
    try {
      const question = await backend.generateQuestion();
      setChat((prev) => [...prev, { system: { content: question } }]);
    } catch (e) {
      console.error(e);
      alert("Gagal membuat soal!");
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi submit jawaban user
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { user: { content: inputValue } };
    setChat((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const result = await backend.answer(inputValue);
      // result diharapkan 'BENAR' atau 'SALAH'
      setChat((prev) => [...prev, { system: { content: `Jawaban kamu: ${result}` } }]);
    } catch (e) {
      console.error(e);
      alert("Gagal memeriksa jawaban!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-white p-4">
  <div className="flex h-[80vh] w-full max-w-xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">

    {/* Header */}
    <div className="flex items-center justify-center bg-blue-600 py-4 text-white text-lg font-semibold">
      Math Quiz AI
    </div>

    {/* Chat box */}
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {chat.map((message, idx) => {
        const isUser = 'user' in message;
        const text = isUser ? message.user.content : message.system.content;
        return (
          <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3 rounded-xl shadow ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
              {text}
            </div>
          </div>
        );
      })}
    </div>

    {/* Actions */}
    <div className="p-4 space-y-2">
      <button
        onClick={handleGenerateQuestion}
        disabled={isLoading}
        className="w-full rounded-full bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition"
      >
        Buat Soal
      </button>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Masukkan jawaban kamu ..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="ml-2 rounded-full bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition"
        >
          Kirim
        </button>
      </form>
    </div>
  </div>
</div>
  );
};

export default App;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
