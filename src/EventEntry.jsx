import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const API = "http://localhost:5000"

function EventEntry({ onEventValid }) {
  const { eventId } = useParams()
  const [status, setStatus] = useState("loading")

  useEffect(() => {
    const validate = async () => {
      const res = await fetch(`${API}/event/${eventId}`)
      const data = await res.json()

      if (data.error) {
        setStatus("invalid")
      } else {
        setStatus("valid")
        onEventValid(eventId)
      }
    }

    validate()
  }, [eventId])

  if (status === "loading") return (
    <div style={{ color: "white", textAlign: "center", marginTop: "40vh" }}>
      Validando evento...
    </div>
  )

  if (status === "invalid") return (
    <div style={{ color: "#ff4d8d", textAlign: "center", marginTop: "40vh" }}>
      ❌ Evento no válido o terminado
    </div>
  )

  return null
}

export default EventEntry