import { House, Building2, LogOut, PanelLeft, Menu, X, Bell } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { logout } from "../api/auth";
import { clearCredentials } from "../store/authSlice";
import logo from "../assets/logo.svg";

export default function AppLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 768);

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
    <div className="flex h-screen flex-col overflow-hidden md:flex-row">
      {/* Mobile-only top header */}
      <header className="bg-secondary flex shrink-0 items-center justify-between px-4 py-4 text-white md:hidden">
        <button onClick={() => setCollapsed(false)} className="cursor-pointer">
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-5">
          <button className="relative cursor-pointer">
            <Bell size={22} />
            <span className="bg-error absolute -top-1 -right-1 h-2 w-2 rounded-full" />
          </button>
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">
            U
          </div>
        </div>

      </header>

      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-10 bg-black/50 transition-opacity duration-300 md:hidden ${collapsed ? "pointer-events-none opacity-0" : "opacity-100"}`}
        onClick={() => setCollapsed(true)}
      />

      {/* Sidebar */}
      <aside
        className={`bg-secondary z-20 flex flex-col py-6 text-white transition-all duration-300
          fixed inset-y-0 left-0 w-60 px-3
          md:static md:inset-auto
          ${collapsed ? "-translate-x-full md:translate-x-0 md:w-16 md:px-2" : "translate-x-0 md:w-60 md:px-3"}`}
      >
        {/* Desktop header section */}
        <div className="relative mb-8 hidden h-10 items-center px-2 md:flex">
          <div className={`flex w-full items-center justify-between transition-opacity duration-300 ${collapsed ? "pointer-events-none absolute opacity-0" : "opacity-100"}`}>
            <div className="text-xl font-bold">FlowTrack</div>
            <PanelLeft className="shrink-0 cursor-pointer" size={20} onClick={() => setCollapsed(true)} />
          </div>
          <div className={collapsed ? "opacity-100" : "pointer-events-none absolute opacity-0"}>
            <div className="group relative">
              <img src={logo} alt="FlowTrack" className="w-8 transition-opacity duration-200 group-hover:opacity-0" />
              <PanelLeft className="absolute inset-0 m-auto cursor-pointer opacity-0 transition-opacity duration-200 group-hover:opacity-100" size={20} onClick={() => setCollapsed(false)} />
            </div>
          </div>
        </div>

        {/* Mobile sidebar header: logo + title + close */}
        <div className="mb-8 flex items-center justify-between px-2 md:hidden">
          <div className="flex items-center gap-3">
            <img src={logo} alt="FlowTrack" className="w-8" />
            <span className="text-xl font-bold">FlowTrack</span>
          </div>
          <button onClick={() => setCollapsed(true)} className="cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-3 transition ${isActive ? "bg-secondary-light font-medium" : ""}`
            }
          >
            <House size={20} className="shrink-0" />
            <span className={`overflow-hidden transition-all duration-300 ${collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100"}`}>
              Dashboard
            </span>
          </NavLink>

          <NavLink
            to="/organization"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-3 transition ${isActive ? "bg-secondary-light font-medium" : ""}`
            }
          >
            <Building2 size={20} className="shrink-0" />
            <span className={`overflow-hidden transition-all duration-300 ${collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100"}`}>
              Organization
            </span>
          </NavLink>
        </nav>

        <button
          onClick={handleLogout}
          className="flex cursor-pointer items-center gap-3 rounded-lg px-1"
        >
          <LogOut size={20} className="shrink-0" />
          <span className={`overflow-hidden transition-all duration-300 ${collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100"}`}>
            Logout
          </span>
        </button>
      </aside>

      <main className="bg-surface flex flex-1 flex-col overflow-hidden p-6">
        <Outlet />
      </main>
    </div>
  );
}
