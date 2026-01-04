import { BrowserRouter, Routes, Route } from "react-router-dom"

// page components
// import MainPage from '@pages/indexPractice'
// import AboutPage from '@pages/about'
import MainPage from '@pages/index/index'

function App() {
  return (
    // Added BrowserRouter for routing support
    <BrowserRouter> 
      <Routes>
        {/* http://localhost:5173/ */}
        <Route index path="/" element={<MainPage />} />
        {/* http://localhost:5173/about */}
        {/* <Route path="/about" element={<AboutPage />} />   */}
        {/* http://localhost:5173/about/:id */}
        {/* <Route path="/about/:id" element={<AboutPage />} />   */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
