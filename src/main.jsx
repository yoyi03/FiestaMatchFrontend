import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from "./App"
import AdminPanel from "./AdminPanel"
import EventEntry from "./EventEntry"

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/admin" element={<AdminPanel />} />
      <Route
        path="/evento/:eventId"
        element={
          <EventEntry
            onEventValid={(id) => {
              window.location.href = `/?eventId=${id}`
            }}
          />
        }
      />
      <Route path="/" element={<App />} />
    </Routes>
  </BrowserRouter>
)