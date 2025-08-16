import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './Home'
import About from './About'

function App() {
  useEffect(() => {
    // Handle GitHub Pages SPA redirect
    const query = window.location.search
    if (query.includes('/?/')) {
      const route = query.replace('/?/', '').replace(/&/g, '/')
      window.history.replaceState(null, '', `/${route}`)
    }
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  )
}

export default App
