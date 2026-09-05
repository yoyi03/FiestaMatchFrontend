import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"

const API = "http://localhost:5000"

function AdminPanel() {
  const [eventName, setEventName] = useState("")
  const [event, setEvent] = useState(null)
  const [error, setError] = useState("")

  const createEvent = async () => {
    if (!eventName.trim()) {
      setError("Escribe un nombre para el evento")
      return
    }

    const res = await fetch(`${API}/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: eventName })
    })

    const data = await res.json()

    if (data.error) {
      setError(data.error)
      return
    }

    setEvent(data.event)
  }

  const eventUrl = event
    ? `${window.location.origin}/evento/${event.id}`
    : ""

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050b18",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px"
    }}>
      <div style={{
        width: "360px",
        background: "rgba(10,20,50,0.6)",
        borderRadius: "24px",
        padding: "35px 25px",
        border: "1px solid rgba(120,170,255,0.2)",
        boxShadow: "0 0 60px rgba(80,140,255,0.2)",
        textAlign: "center",
        color: "white"
      }}>
        <h2 style={{ marginBottom: "25px", letterSpacing: "2px" }}>
          🎉 Crear Evento
        </h2>

        {!event ? (
          <>
            <input
              placeholder="Nombre del evento"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 15px",
                borderRadius: "30px",
                border: "1px solid rgba(120,170,255,0.3)",
                background: "rgba(255,255,255,0.05)",
                color: "white",
                outline: "none",
                marginBottom: "15px",
                boxSizing: "border-box"
              }}
            />

            {error && (
              <p style={{ color: "#ff4d8d", fontSize: "13px" }}>{error}</p>
            )}

            <button
              onClick={createEvent}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "30px",
                border: "none",
                background: "linear-gradient(90deg, #ff2e63, #ff4d8d)",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 0 25px rgba(255,46,99,0.6)"
              }}
            >
              Crear Evento
            </button>
          </>
        ) : (
          <>
            <p style={{ color: "#aaa", marginBottom: "5px" }}>Evento creado:</p>
            <h3 style={{ color: "#ff2e63", marginBottom: "20px" }}>
              {event.name}
            </h3>

            <div style={{
              background: "white",
              padding: "15px",
              borderRadius: "16px",
              display: "inline-block",
              marginBottom: "20px"
            }}>
              <QRCodeSVG value={eventUrl} size={200} />
            </div>

            <p style={{ fontSize: "12px", color: "#aaa", wordBreak: "break-all" }}>
              {eventUrl}
            </p>

            <button
              onClick={() => {
                setEvent(null)
                setEventName("")
              }}
              style={{
                marginTop: "20px",
                padding: "10px 25px",
                borderRadius: "30px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "transparent",
                color: "white",
                cursor: "pointer"
              }}
            >
              Crear otro evento
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminPanel