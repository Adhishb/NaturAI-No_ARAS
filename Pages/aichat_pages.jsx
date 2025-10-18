const { useState, useRef, useEffect } = React;

function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI botanist 🌿. Ask me anything about plants, upload a photo for plant identification or health check, or get personalized care advice!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && !uploadedImage) return;

    const userMessage = {
      role: "user",
      content: input || "What plant is this?",
      image: uploadedImage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Simulated AI response (you can replace this with API call)
    setTimeout(() => {
      const aiResponse = uploadedImage
        ? "That looks like a healthy Monstera! 🌱 Make sure it gets bright indirect light and water weekly."
        : "Most houseplants prefer moderate light and consistent moisture.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);
      setUploadedImage(null);
      setLoading(false);
    }, 2000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>🌿 AI Botanist</h1>
        <p>Your personal plant expert</p>
      </header>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            <div className="message-card">
              {m.image && (
                <img src={m.image} alt="Plant" className="image-preview" />
              )}
              <p>{m.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-card">
              <p className="loading">🌿 Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        {uploadedImage && (
          <div>
            <img
              src={uploadedImage}
              alt="Preview"
              className="image-preview"
              onClick={() => setUploadedImage(null)}
            />
          </div>
        )}
        <div className="chat-input-container">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          <button
            className="image"
            onClick={() => fileInputRef.current?.click()}
          >
            📷
          </button>
          <textarea
            placeholder="Ask about plants, care tips, or upload a photo..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            className="send"
            disabled={loading}
            onClick={handleSend}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("app")).render(<AIChat />);
