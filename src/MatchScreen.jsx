import { useEffect } from "react"

function MatchScreen({ matchedUser, currentUser, onOpenChat, onClose }) {

  useEffect(() => {
    // Corazones flotantes
    const container = document.getElementById("fhearts")
    if (!container) return
    const emojis = ["❤", "💕", "💗", "💓", "💖"]
    for (let i = 0; i < 15; i++) {
      const h = document.createElement("div")
      h.textContent = emojis[Math.floor(Math.random() * emojis.length)]
      h.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        bottom: -50px;
        font-size: ${16 + Math.random() * 20}px;
        animation: floatHeart ${3 + Math.random() * 4}s linear ${Math.random() * 4}s infinite;
        opacity: 0;
        pointer-events: none;
      `
      container.appendChild(h)
    }

    // Partículas
    const pcontainer = document.getElementById("fparticles")
    if (!pcontainer) return
    const colors = ["#ff2e63", "#ff6b9d", "#ffb3c6", "#ffffff"]
    for (let i = 0; i < 30; i++) {
      const p = document.createElement("div")
      const size = 4 + Math.random() * 8
      p.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        bottom: 0;
        animation: floatUp ${4 + Math.random() * 6}s linear ${Math.random() * 5}s infinite;
        opacity: 0;
        pointer-events: none;
      `
      pcontainer.appendChild(p)
    }
  }, [])

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "radial-gradient(ellipse at 50% 50%, rgba(255,46,99,0.15) 0%, transparent 70%), #0b1020",
      overflow: "hidden"
    }}>

      {/* ESTILOS ANIMACIONES */}
      <style>{`
        @keyframes floatHeart {
          0%   { transform: translateY(0) scale(0); opacity: 0; }
          10%  { opacity: 1; transform: scale(1); }
          90%  { opacity: 0.8; }
          100% { transform: translateY(-100vh) rotate(20deg) scale(0.5); opacity: 0; }
        }
        @keyframes floatUp {
          0%   { transform: translateY(0) scale(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-100vh) scale(1); opacity: 0; }
        }
        @keyframes titlePop {
          from { transform: scale(0.3); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        @keyframes heartBeat {
          0%   { transform: scale(0); }
          60%  { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        @keyframes ringPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50%       { transform: translate(-50%, -50%) scale(1.05); opacity: 0.5; }
        }
      `}</style>

      {/* CORAZONES Y PARTICULAS */}
      <div id="fhearts" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1 }} />
      <div id="fparticles" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1 }} />

     {/* RINGS */}
{[400, 550, 700].map((size, i) => (
  <div
    key={i}
    style={{
      position: "fixed",
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      border: `1px solid rgba(255,46,99,${0.2 - i * 0.06})`,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      animation: `ringPulse 2s ease-in-out ${i * 0.4}s infinite`,
      zIndex: 1,
      pointerEvents: "none"
    }}
  />
))}
      {/* CONTENIDO */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* TITULO */}
        <div style={{
          fontFamily: "sans-serif",
          fontWeight: "900",
          fontSize: "52px",
          letterSpacing: "6px",
          color: "white",
          textAlign: "center",
          animation: "titlePop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s both",
          textShadow: "0 0 40px rgba(255,46,99,0.😎, 0 0 80px rgba(255,46,99,0.4)",
          lineHeight: 1,
          textTransform: "uppercase"
        }}>
          ES UN
          <div style={{ color: "#ff2e63", fontSize: "68px" }}>MATCH!</div>
        </div>

        <div style={{
          fontSize: "14px",
          color: "rgba(255,255,255,0.7)",
          letterSpacing: "3px",
          textTransform: "uppercase",
          marginTop: "8px",
          animation: "fadeUp 0.5s ease 0.8s both"
        }}>
          a ti también le gustas
        </div>

        {/* FOTOS */}
        <div style={{
          display: "flex",
          alignItems: "center",
          margin: "36px 0 0",
          animation: "fadeUp 0.5s ease 0.6s both"
        }}>
          {/* FOTO USUARIO ACTUAL */}
          <div style={{ transform: "translateX(20px)", zIndex: 2 }}>
            {currentUser?.photo ? (
              <img src={currentUser.photo} alt={currentUser.name} style={{
                width: "110px", height: "110px", borderRadius: "50%",
                objectFit: "cover", border: "3px solid #ff2e63",
                boxShadow: "0 0 30px rgba(255,46,99,0.6)"
              }} />
            ) : (
              <div style={{
                width: "110px", height: "110px", borderRadius: "50%",
                background: "#1f2a48", border: "3px solid #ff2e63",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "44px", boxShadow: "0 0 30px rgba(255,46,99,0.6)"
              }}>👤</div>
            )}
          </div>

          {/* CORAZON CENTRAL */}
          <div style={{
            width: "44px", height: "44px", background: "#ff2e63",
            borderRadius: "50%", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "22px", zIndex: 3,
            boxShadow: "0 0 20px rgba(255,46,99,0.😎",
            animation: "heartBeat 0.8s ease 1s both"
          }}>❤</div>

          {/* FOTO MATCH */}
          <div style={{ transform: "translateX(-20px)", zIndex: 2 }}>
            {matchedUser?.photo ? (
              <img src={matchedUser.photo} alt={matchedUser.name} style={{
                width: "110px", height: "110px", borderRadius: "50%",
                objectFit: "cover", border: "3px solid #ff2e63",
                boxShadow: "0 0 30px rgba(255,46,99,0.6)"
              }} />
            ) : (
              <div style={{
                width: "110px", height: "110px", borderRadius: "50%",
                background: "#1f2a48", border: "3px solid #ff2e63",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "44px", boxShadow: "0 0 30px rgba(255,46,99,0.6)"
              }}>👤</div>
            )}
          </div>
        </div>

        {/* NOMBRES */}
        <div style={{
          display: "flex",
          gap: "50px",
          margin: "20px 0 36px",
          animation: "fadeUp 0.5s ease 0.9s both"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "17px", fontWeight: "600", color: "white" }}>{currentUser?.name}</div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>{currentUser?.age} años</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "17px", fontWeight: "600", color: "white" }}>{matchedUser?.name}</div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>{matchedUser?.age} años</div>
          </div>
        </div>

        {/* BOTONES */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "280px",
          animation: "fadeUp 0.5s ease 1.1s both"
        }}>
          <button
            onClick={onOpenChat}
            style={{
              background: "#ff2e63",
              border: "none",
              borderRadius: "30px",
              padding: "16px",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              letterSpacing: "1px",
              boxShadow: "0 8px 30px rgba(255,46,99,0.4)"
            }}
          >
            💬 Abrir Chat
          </button>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "30px",
              padding: "14px",
              color: "rgba(255,255,255,0.6)",
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            Seguir viendo perfiles
          </button>
        </div>
      </div>
    </div>
  )
}

export default MatchScreen
