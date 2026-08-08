import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl font-semibold text-ink tracking-tight">
          Tally<span className="text-rust">.</span>
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <span className="font-mono text-sm text-ink-light hidden sm:inline">{user.name}</span>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="text-sm font-medium text-ink-light hover:text-rust transition-colors"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;