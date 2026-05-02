import { Link, useLocation } from "react-router-dom";
import styles from "./NavBar.module.css";

export default function NavBar() {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo}>
          <LeafIcon />
          <span className={styles.logoText}>Herbário</span>
        </Link>

        <nav className={styles.nav}>
          <Link
            to="/"
            className={`${styles.navLink} ${location.pathname === "/" ? styles.active : ""}`}
          >
            Catálogo
          </Link>
          <Link
            to="/nova"
            className={`${styles.addBtn} ${location.pathname === "/nova" ? styles.addBtnActive : ""}`}
          >
            <span className={styles.plus}>+</span>
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
