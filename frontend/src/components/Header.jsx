import { useState } from "react";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuOpen = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <header className="fixed bg-white p-5 flex justify-between items-center w-full z-1 h-20">
        <div className="text-3xl font-bold text-green-700">Recipe Retriever</div>
        <button className="cursor-pointer text-white z-10" type="button" onClick={handleMenuOpen}>
          <IoMdMenu size={50} color="black"/>
        </button>
      </header>
      <nav
        className={`bg-gray-900 fixed top-0 right-0 w-64 h-screen flex flex-col shadow-lg transition-transform duration-300 z-5 p-3 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button className="cursor-pointer text-white z-10 w-10 mb-5" type="button" onClick={handleMenuOpen}>
          <IoMdClose size={50} />
        </button>
        <ul className="p-2 space-y-8">
          <li>
            <Link to="/" className="text-2xl w-full text-left cursor-pointer text-white">Home</Link>
          </li>
          <li>
            <Link to="/recipes" className="text-2xl w-full text-left cursor-pointer text-white">My Recipes</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
