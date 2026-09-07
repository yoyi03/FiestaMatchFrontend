import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("https://fiestamatchbackend-production.up.railway.app/");

function Chat({ matchId, userId, onClose, onNewMessage }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    socket.emit("join_match", { matchId });

    fetch("https://fiestamatchbackend-production.up.railway.app/messages/" + matchId)
      .then(r => r.json())
      .then(data => setMessages(data))
      .catch(() => setMessages([]));

  }, [matchId]);

  useEffect(() => {
    const handleMessage = (data) => {
      setMessages(prev => [...prev, data]);
      onNewMessage(matchId);
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, [matchId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("send_message", { matchId, userId, message });
    setMessage("");
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999
    }}>
      <div style={{
        width: "350px",
        height: "500px",
        background: "#0b1020",
        borderRadius: "20px",
        padding: "15px",
        color: "white",
        display: "flex",
        flexDirection: "column"
      }}>
        <h3 style={{ textAlign: "center" }}>Chat</h3>

        <div style={{ flex: 1, overflowY: "auto", marginBottom: "10px" }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                textAlign: msg.userId === userId ? "right" : "left",
                marginBottom: "8px"
              }}
            >
              <span style={{
                display: "inline-block",
                background: msg.userId === userId ? "#ff2e63" : "#1f2a48",
                padding: "8px 12px",
                borderRadius: "15px",
                maxWidth: "80%"
              }}>
                {msg.message}
              </span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div style={{ display: "flex", gap: "5px" }}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Escribe..."
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "10px",
              border: "none",
              outline: "none"
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              background: "#ff2e63",
              border: "none",
              color: "white",
              padding: "0 15px",
              borderRadius: "10px",
              cursor: "pointer"
            }}
          >
            ➤
          </button>
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: "8px",
            background: "transparent",
            border: "none",
            color: "#aaa",
            cursor: "pointer"
          }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default Chat;