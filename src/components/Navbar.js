import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-indigo-600 text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">CampusKart</span>
          <span className="hidden text-sm text-indigo-100 sm:inline">— buy & sell on campus</span>
        </div>

        <nav className="flex flex-wrap items-center gap-3">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive ? "bg-white/20 text-white" : "text-indigo-100 hover:bg-white/10"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/create"
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive ? "bg-white/20 text-white" : "text-indigo-100 hover:bg-white/10"
              }`
            }
          >
            Sell Item
          </NavLink>
          <NavLink
            to="/my-listings"
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive ? "bg-white/20 text-white" : "text-indigo-100 hover:bg-white/10"
              }`
            }
          >
            My Listings
          </NavLink>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="rounded-md border border-white/30 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive ? "bg-white/20 text-white" : "text-indigo-100 hover:bg-white/10"
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive ? "bg-white/20 text-white" : "text-indigo-100 hover:bg-white/10"
                  }`
                }
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
