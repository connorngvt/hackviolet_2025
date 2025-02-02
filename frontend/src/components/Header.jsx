import { useState } from "react";
import { IoMdMenu, IoMdClose } from "react-icons/io";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuOpen = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <header className="bg-white p-5 flex justify-between items-center w-full z-1 h-20">
        <div className="text-3xl font-bold text-green-700">Project Name</div>
        <button className="cursor-pointer text-white z-10" type="button" onClick={handleMenuOpen}>
          <IoMdMenu size={50} color="black"/>
        </button>
      </header>
      <nav
        className={`bg-red-300 fixed top-0 right-0 w-64 h-screen flex flex-col shadow-lg transition-transform duration-300 z-5 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button className="cursor-pointer text-white z-10" type="button" onClick={handleMenuOpen}>
          <IoMdClose size={50} />
        </button>
        <ul className="p-5 space-y-5">
          <li>
            <button className="text-2xl w-full text-left cursor-pointer">Home</button>
          </li>
          <li>
            <button className="text-2xl w-full text-left cursor-pointer">My Recipes</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
