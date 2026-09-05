import { useState, useEffect, useRef } from "react"
import { getUsers, sendLike, createUser, uploadPhoto } from "./api"
import Chat from "./Chat"
import stars from "./assets/stars.png"
import logo from "./assets/logo.png"
import welcomeLogo from "./assets/imagendebienvenida.jpg"
import "./App.css"
import { FaUser, FaCamera } from "react-icons/fa"
import { FiCalendar } from "react-icons/fi"
import { io } from "socket.io-client"
import MatchScreen from "./MatchScreen"

const socket = io("http://localhost:5000")

function Welcome({ goToCreate }) {
  return (
    <div className="welcome-container">
      <div className="welcome-glow" />
      <div className="welcome-card">
        <h1 className="welcome-title">
          ALPRIVA<span>2</span>
        </h1>
        <div style={{ position: "relative" }}>
          <img src={welcomeLogo} alt="logo" className="welcome-logo" />
          <button className="create-button" onClick={goToCreate}>
            Crear Perfil
          </button>
        </div>
      </div>
    </div>
  )
}

function CreateProfile({ goToEvent }) {
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [image, setImage] = useState(null)
  const [file, setFile] = useState(null)
  const [error, setError] = useState("")

  const handleImage = (e) => {
    const f = e.target.files[0]
    if (f) {
      setFile(f)
      setImage(URL.createObjectURL(f))
    }
  }

  const handleSubmit = async () => {
    if (!name || !age) {
      setError("Completa todos los campos")
      return
    }
    if (Number(age) < 18) {
      setError("Debes ser mayor de 18")
      return
    }
    let photoUrl = ""
    if (file) {
      photoUrl = await uploadPhoto(file)
    }
    const params = new URLSearchParams(window.location.search)
    const eventId = params.get("eventId") || "demo123"
    const res = await createUser({
      name,
      age: Number(age),
      photo: photoUrl,
      eventId
    })
    if (res.error) {
      setError(res.error)
      return
    }
    goToEvent(res.user)
  }

  return (
    <div className="create-profile-screen" style={{ backgroundImage: `url(${stars})` }}>
      <div className="profile-card">
        <h2 className="create-title">Crear Perfil</h2>
        <div className="avatar-placeholder" style={{ backgroundImage: image ? `url(${image})` : "none" }}>
          {!image && <FaUser />}
        </div>
        <label className="upload-btn">
          <FaCamera /> Subir Foto
          <input type="file" hidden onChange={handleImage} />
        </label>
        <div className="input-field">
          <FaUser />
          <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="input-field">
          <FiCalendar />
          <input type="number" placeholder="Edad" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        {error && <div className="error">{error}</div>}
        <button className="enter-event-btn" onClick={handleSubmit}>Entrar al evento</button>
      </div>
    </div>
  )
}

function Matches({ matches, goBack, openChat, unreadMessages = {} }) {
  const nuevos = matches.filter((m, i) => i >= matches.length - 2)
  const conMensajes = matches.filter((m, i) => i < matches.length - 2)

  const MatchCard = ({ match, isNew }) => (
    <div
      onClick={() => openChat(match)}
      style={{
        background: "rgba(31, 42, 72, 0.6)",
        border: "1px solid rgba(120,170,255,0.25)",
        borderRadius: "20px",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        backdropFilter: "blur(10px)",
        cursor: "pointer",
        transition: "all 0.25s",
        marginBottom: "12px"
      }}
    >
      <div style={{ position: "relative", flexShrink: 0 }}>
        {match.photo ? (
          <img src={match.photo} alt={match.name} style={{
            width: "60px", height: "60px", borderRadius: "50%",
            objectFit: "cover", border: "2px solid rgba(255,46,99,0.5)"
          }} />
        ) : (
          <div style={{
            width: "60px", height: "60px", borderRadius: "50%",
            background: "#1f2a48", border: "2px solid rgba(255,46,99,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px"
          }}>👤</div>
        )}
        {isNew && (
          <div style={{
            position: "absolute", bottom: "2px", right: "2px",
            width: "12px", height: "12px", background: "#4ade80",
            borderRadius: "50%", border: "2px solid #0b1020"
          }} />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "16px", fontWeight: "600", color: "white", marginBottom: "3px" }}>
          {match.name}
        </div>
        <div style={{ fontSize: "13px", color: "#8899bb", fontWeight: "300" }}>
          {match.age} años
        </div>
        <div style={{
          fontSize: "12px",
          color: isNew ? "#ff2e63" : "#8899bb",
          fontWeight: isNew ? "500" : "300",
          marginTop: "4px",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
        }}>
          {isNew ? "✨ Nuevo match!" : "Toca para chatear"}
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); openChat(match) }}
        style={{
          flexShrink: 0, background: "#ff2e63", border: "none",
          borderRadius: "14px", padding: "10px 16px", color: "white",
          fontSize: "16px", cursor: "pointer", transition: "all 0.2s",
          display: "flex", alignItems: "center", gap: "6px"
        }}
      >
        💬
        {unreadMessages[match.matchId] > 0 && (
          <div style={{
            background: "white", color: "#ff2e63", borderRadius: "50%",
            width: "18px", height: "18px", fontSize: "11px", fontWeight: "700",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            {unreadMessages[match.matchId]}
          </div>
        )}
      </button>
    </div>
  )

  return (
    <div style={{
      minHeight: "100vh", background: "#0b1020",
      backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(30,60,120,0.4) 0%, transparent 60%),
                        radial-gradient(ellipse at 80% 20%, rgba(255,46,99,0.1) 0%, transparent 50%)`,
      display: "flex", flexDirection: "column"
    }}>
      <div style={{ padding: "50px 24px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={goBack} style={{
          width: "40px", height: "40px", borderRadius: "50%",
          background: "rgba(255,255,255,0.07)", border: "1px solid rgba(120,170,255,0.25)",
          color: "white", fontSize: "18px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>←</button>

        <div style={{ fontFamily: "sans-serif", fontWeight: "900", fontSize: "22px", letterSpacing: "3px", color: "white", textTransform: "uppercase" }}>
          MIS <span style={{ color: "#ff2e63" }}>MATCHES</span>
        </div>

        <div style={{
          background: "rgba(255,46,99,0.15)", border: "1px solid rgba(255,46,99,0.4)",
          borderRadius: "20px", padding: "4px 12px", fontSize: "13px", color: "#ff2e63", fontWeight: "600"
        }}>
          {matches.length} matches
        </div>
      </div>

      <div style={{ padding: "0 24px 16px", fontSize: "13px", color: "#8899bb", fontWeight: "300" }}>
        Solo tu puedes ver esta lista
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px" }}>
        {matches.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 40px", textAlign: "center", gap: "16px" }}>
            <div style={{ fontSize: "60px", opacity: 0.3 }}>💔</div>
            <div style={{ color: "#8899bb", fontSize: "15px", lineHeight: "1.5" }}>
              Aun no tienes matches.<br />Sigue dando likes!
            </div>
          </div>
        ) : (
          <>
            {conMensajes.length > 0 && (
              <>
                <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#8899bb", textTransform: "uppercase", padding: "8px 4px 12px" }}>
                  Con mensajes
                </div>
                {conMensajes.map((match, i) => <MatchCard key={match.id || i} match={match} isNew={false} />)}
              </>
            )}
            {nuevos.length > 0 && (
              <>
                <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#8899bb", textTransform: "uppercase", padding: "8px 4px 12px" }}>
                  Nuevos
                </div>
                {nuevos.map((match, i) => <MatchCard key={match.id || i} match={match} isNew={true} />)}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function Event({ personas, darLike, darDislike, goToMatches, user, likesCount }) {
  const personaActual = personas[0]

  return (
    <div className="event-container" style={{ backgroundImage: `url(${stars})` }}>
      <div className="event-overlay" />
      <img src={logo} alt="logo" className="event-logo" />

      <div style={{
        position: "absolute", top: "20px", left: "20px", zIndex: 10,
        display: "flex", alignItems: "center", gap: "8px",
        background: "rgba(10, 20, 50, 0.5)", backdropFilter: "blur(10px)",
        border: "1px solid rgba(120,170,255,0.25)", borderRadius: "30px",
        padding: "6px 14px 6px 6px", boxShadow: "0 0 15px rgba(120,180,255,0.2)"
      }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "50%", overflow: "hidden",
          border: "1px solid rgba(120,170,255,0.5)", background: "rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px"
        }}>
          {user?.photo
            ? <img src={user.photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <FaUser />
          }
        </div>
        <span style={{ fontSize: "13px", fontWeight: "600", color: "white", textShadow: "0 0 8px rgba(120,180,255,0.5)" }}>
          {user?.name}
        </span>
        {likesCount > 0 && (
          <div style={{
            display: "flex", alignItems: "center", gap: "4px",
            background: "rgba(255,46,99,0.2)", border: "1px solid rgba(255,46,99,0.5)",
            borderRadius: "20px", padding: "2px 8px", marginLeft: "4px"
          }}>
            <span style={{ fontSize: "12px" }}>❤️</span>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#ff2e63" }}>{likesCount}</span>
          </div>
        )}
      </div>

      <div className="event-card">
        <div className="event-header">
          <h2>ALPRIVA2</h2>
          <button onClick={goToMatches}>Matches</button>
        </div>
        {!personaActual ? (
          <p>No hay mas personas</p>
        ) : (
          <>
            <div className="image-container">
              <img src={personaActual.photo} alt={personaActual.name} className="profile-img" />
            </div>
            <div className="info">
              <h2>{personaActual.name}</h2>
              <p>{personaActual.age} anos</p>
            </div>
            <div className="actions">
              <button onClick={darDislike}>✕</button>
              <button className="like-btn" onClick={() => darLike(personaActual)}>❤</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}


function App() {
  const [matchScreen, setMatchScreen] = useState(null)
  const [screen, setScreen] = useState("welcome")
  const [activeMatch, setActiveMatch] = useState(null)

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user")
    return saved ? JSON.parse(saved) : null
  })

  const [matches, setMatches] = useState([])
  const [personas, setPersonas] = useState([])
  const [likesCount, setLikesCount] = useState(0)
  const [unreadMessages, setUnreadMessages] = useState({})

  const vistos = useRef([])

  const params = new URLSearchParams(window.location.search)
  const EVENT_ID = params.get("eventId") || "demo123"

  // Registro socket
  useEffect(() => {
    if (!user) return

    const registerAndListen = () => {
      socket.emit("register_user", {
        userId: user.id
      })
    }

    if (socket.connected) {
      registerAndListen()
    }

    socket.on("connect", registerAndListen)

    return () => {
      socket.off("connect", registerAndListen)
    }
  }, [user])

  // Eventos socket
  useEffect(() => {
    if (!user) return

    const handleMatch = ({ match, matchedUser }) => {

      // Mostrar pantalla match
      setMatchScreen({
        match,
        matchedUser
      })

      // Agregar a lista evitando duplicados
      setMatches(prev => {
        const yaExiste = prev.find(
          m => m.matchId === match.id
        )

        if (yaExiste) return prev

        return [
          ...prev,
          {
            ...matchedUser,
            matchId: match.id
          }
        ]
      })
    }

    const handleLike = () => {
      setLikesCount(prev => prev + 1)
    }

    socket.on("new_match", handleMatch)
    socket.on("like_received", handleLike)

    return () => {
      socket.off("new_match", handleMatch)
      socket.off("like_received", handleLike)
    }
  }, [user])

  // Cargar usuarios
  useEffect(() => {
    if (!user) return

    const loadUsers = async () => {
      const data = await getUsers(
        EVENT_ID,
        user.id
      )

      setPersonas(prev => {
        const idsActuales = prev.map(
          p => p.id
        )

        const nuevos = data.filter(
          p =>
            !idsActuales.includes(p.id) &&
            !vistos.current.includes(p.id)
        )

        return [...prev, ...nuevos]
      })
    }

    loadUsers()

    const interval = setInterval(
      loadUsers,
      10000
    )

    return () => clearInterval(interval)

  }, [user])

  const darLike = async (persona) => {
    vistos.current.push(persona.id)

    await sendLike(
      user.id,
      persona.id
    )

    setPersonas(prev =>
      prev.slice(1)
    )
  }

  const darDislike = () => {
    if (personas[0]) {
      vistos.current.push(
        personas[0].id
      )
    }

    setPersonas(prev =>
      prev.slice(1)
    )
  }

  useEffect(() => {
    localStorage.setItem(
      "user",
      JSON.stringify(user)
    )
  }, [user])

  // Pantalla bienvenida
  if (screen === "welcome") {
    return (
      <Welcome
        goToCreate={() =>
          setScreen("create")
        }
      />
    )
  }

  // Crear perfil
  if (screen === "create") {
    return (
      <CreateProfile
        goToEvent={(data) => {
          setUser(data)
          setScreen("event")
        }}
      />
    )
  }

  // Matches
  if (screen === "matches") {
    return (
      <>
        <Matches
          matches={matches}
          unreadMessages={unreadMessages}
          goBack={() =>
            setScreen("event")
          }
          openChat={(match) => {
            setActiveMatch(match)

            setUnreadMessages(prev => ({
              ...prev,
              [match.matchId]: 0
            }))
          }}
        />

        {activeMatch && (
          <Chat
            matchId={activeMatch.matchId}
            userId={user.id}
            onClose={() =>
              setActiveMatch(null)
            }
            onNewMessage={(matchId) => {

              if (
                activeMatch?.matchId !== matchId
              ) {
                setUnreadMessages(prev => ({
                  ...prev,
                  [matchId]:
                    (prev[matchId] || 0) + 1
                }))
              }

            }}
          />
        )}
      </>
    )
  }

  // Pantalla principal
  return (
    <>
      {matchScreen && (
        <MatchScreen
          matchedUser={matchScreen.matchedUser}
          currentUser={user}
          onOpenChat={() => {

            setActiveMatch({
              ...matchScreen.matchedUser,
              matchId: matchScreen.match.id
            })

            setScreen("matches")
            setMatchScreen(null)

          }}
          onClose={() =>
            setMatchScreen(null)
          }
        />
      )}

      <Event
        personas={personas}
        darLike={darLike}
        darDislike={darDislike}
        goToMatches={() =>
          setScreen("matches")
        }
        user={user}
        likesCount={likesCount}
      />
    </>
  )
}

export default App
