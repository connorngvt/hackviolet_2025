import { Route, Routes } from "react-router-dom"
import Footer from "./components/Footer"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"

function App() {

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <div className="relative z-50 flex flex-col">
        <Header />
          <div className="pt-20">
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </div>
        <Footer />
      </div>
    </div>
  )
}

export default App
