import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Index from './components/IndexComponent'
import LandingPage from './components/LandingPage'
import './App.css'

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-secondary to-black/90">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<Index />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App