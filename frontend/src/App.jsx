import { Route, Routes } from "react-router-dom"
import Footer from "./components/Footer"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import RecipePage from "./pages/RecipePage"
import { ToastContainer } from "react-toastify";


function App() {

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <div className="relative z-50 flex flex-col">
        <Header />
          <div className="pt-20">
            <ToastContainer position="bottom-right" />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/recipes" element={<RecipePage />} />
            </Routes>
          </div>
        <Footer />
      </div>
    </div>
  )
}

export default App
