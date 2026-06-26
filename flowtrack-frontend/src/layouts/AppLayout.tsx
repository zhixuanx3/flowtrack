import { House, Building2, LogOut } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { logout } from "../api/auth";
import { clearCredentials } from "../store/authSlice";

export default function AppLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(clearCredentials());
      navigate("/");
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="bg-secondary flex w-60 flex-col px-3 py-6 text-white">
        <div className="mb-8 px-1 text-xl font-bold">FlowTrack</div>

        <nav className="flex flex-1 flex-col gap-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-3 transition ${isActive ? "bg-secondary-light font-medium" : ""}`
            }
          >
            <House size={20} /> Dashboard
          </NavLink>

          <NavLink
            to="/organization"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-3 transition ${isActive ? "bg-secondary-light font-medium" : ""}`
            }
          >
            <Building2 size={20} /> Organization
          </NavLink>
        </nav>

        <button
          onClick={handleLogout}
          className="flex cursor-pointer items-center gap-3 rounded-lg px-1"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main className="flex flex-1 flex-col overflow-hidden p-6">
        <Outlet />
      </main>
    </div>
  );
}
