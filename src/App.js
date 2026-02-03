import { useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput("");
    setMessages(prev => [...prev, { text: userText, type: "user" }]);
    setLoading(true);

    try {
      const res = await fetch("https://testrailway-production-680f.up.railway.app/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ message: userText, history })
      });

      const data = await res.json();

      setMessages(prev => [...prev, { text: data.reply, type: "ai" }]);

      setHistory(prev => [
        ...prev,
        { role: "USER", message: userText },
        { role: "CHATBOT", message: data.reply }
      ]);

    } catch {
      setMessages(prev => [...prev, { text: "Server error", type: "ai" }]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-900 text-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.type === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-lg px-4 py-2 rounded-xl ${
              m.type === "user" ? "bg-blue-600" : "bg-neutral-700"
            }`}>
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-neutral-700 px-4 py-2 rounded-xl animate-pulse">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-neutral-800 flex gap-2">
        <input
          className="flex-1 p-3 rounded-lg bg-neutral-700 outline-none"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Send a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
