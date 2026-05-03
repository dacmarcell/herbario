import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();

  return (
    <header className="bg-green-900 border-b border-green-700 sticky top-0 z-[100] backdrop-blur-sm">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-[10px] text-green-50 transition-opacity hover:opacity-80">
          <LeafIcon />
          <span className="font-display text-[1.4rem] font-medium tracking-wide text-cream-100">Herbário</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className={`text-[0.875rem] font-normal text-green-200 tracking-wider transition-colors lowercase hover:text-cream-100 ${
              location.pathname === "/" ? "text-cream-100 border-b border-green-300 pb-[1px]" : ""
            }`}
          >
            Catálogo
          </Link>
          <Link
            to="/nova"
            className={`flex items-center gap-1.5 text-[0.875rem] font-normal px-[18px] py-2 rounded-full transition-all hover:-translate-y-px tracking-normal ${
              location.pathname === "/nova" 
                ? "bg-green-300 text-green-900" 
                : "bg-green-500 text-cream-100 hover:bg-green-400"
            }`}
          >
            <span className="text-[1.1rem] font-light leading-none">+</span>
            Nova folha
          </Link>
        </nav>
      </div>
    </header>
  );
}

function LeafIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 22C6 22 8 10 20 6C20 6 20 18 8 22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(255,255,255,0.12)"
      />
      <path
        d="M8 22C8 22 10 16 14 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="2 2"
        opacity="0.7"
      />
    </svg>
  );
}
