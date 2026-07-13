import {
  House,
  Building2,
  LogOut,
  PanelLeft,
  Menu,
  X,
  Bell,
  ChevronDown,
  Folder,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../api/auth";
import { clearCredentials } from "../store/authSlice";
import type { RootState } from "../store";
import logo from "../assets/logo.svg";
import { isMobile } from "../utils/breakpoints";
import { hasPermission, type MemberRole } from "../utils/permissions";

export default function AppLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const org = useSelector((state: RootState) => state.auth.org);
  const user = useSelector((state: RootState) => state.auth.user);
  const canViewOrg = hasPermission(
    org?.role as MemberRole | undefined,
    "org:view",
  );
  const [collapsed, setCollapsed] = useState(isMobile);
  const [skipTransition, setSkipTransition] = useState(false);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isProfileOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const mobileProfileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobileProfileOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileProfileRef.current &&
        !mobileProfileRef.current.contains(e.target as Node)
      ) {
        setIsMobileProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileProfileOpen]);

  useEffect(() => {
    const handleResize = () => {
      setSkipTransition(true);
      if (isMobile()) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (skipTransition) {
      // schedules a callback to run just before the browser paints the next frame
      const id = requestAnimationFrame(() => setSkipTransition(false));

      // useEffect cleanup if component unmounts before the next frame fires
      return () => cancelAnimationFrame(id);
    }
  }, [skipTransition]);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      dispatch(clearCredentials());
      navigate("/");
    },
  });

  const handleLogout = () => logoutMutation.mutate();

  const handleNavClick = () => {
    if (isMobile()) setCollapsed(true);
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
          <div className="relative" ref={mobileProfileRef}>
            <button
              onClick={() => setIsMobileProfileOpen((v) => !v)}
              className="bg-primary flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-sm font-semibold"
            >
              {user?.name.charAt(0).toUpperCase()}
            </button>

            {isMobileProfileOpen && (
              <div className="border-line shadow-card text-foreground absolute top-full right-0 z-30 mt-2 w-40 rounded-lg border bg-white py-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hover:bg-surface-secondary flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
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
        className={`bg-secondary fixed inset-y-0 left-0 z-20 flex w-60 flex-col px-3 py-6 text-white md:static md:inset-auto ${skipTransition ? "" : "transition-all duration-300"} ${collapsed ? "-translate-x-full md:w-16 md:translate-x-0 md:px-2" : "translate-x-0 md:w-60 md:px-3"}`}
      >
        {/* Desktop header section */}
        <div className="relative mb-8 hidden h-10 items-center px-2 md:flex">
          <div
            className={`flex w-full items-center justify-between transition-opacity duration-300 ${collapsed ? "pointer-events-none absolute opacity-0" : "opacity-100"}`}
          >
            <div className="text-xl font-bold">FlowTrack</div>
            <PanelLeft
              className="shrink-0 cursor-pointer"
              size={20}
              onClick={() => setCollapsed(true)}
            />
          </div>
          <div
            className={
              collapsed
                ? "opacity-100"
                : "pointer-events-none absolute opacity-0"
            }
          >
            <div className="group relative">
              <img
                src={logo}
                alt="FlowTrack"
                className="w-8 transition-opacity duration-200 group-hover:opacity-0"
              />
              <PanelLeft
                className="absolute inset-0 m-auto cursor-pointer opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                size={20}
                onClick={() => setCollapsed(false)}
              />
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
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-3 transition ${isActive ? "bg-secondary-light font-medium" : ""}`
            }
          >
            <House size={20} className="shrink-0" />
            <span
              className={`overflow-hidden transition-all duration-300 ${collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100"}`}
            >
              Dashboard
            </span>
          </NavLink>

          {canViewOrg && (
            <NavLink
              to="/organization"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 transition ${isActive ? "bg-secondary-light font-medium" : ""}`
              }
            >
              <Building2 size={20} className="shrink-0" />
              <span
                className={`overflow-hidden transition-all duration-300 ${collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100"}`}
              >
                Organization
              </span>
            </NavLink>
          )}

          <NavLink
            to="/project"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-3 transition ${isActive ? "bg-secondary-light font-medium" : ""}`
            }
          >
            <Folder size={20} className="shrink-0" />
            <span
              className={`overflow-hidden transition-all duration-300 ${collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100"}`}
            >
              Project
            </span>
          </NavLink>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Desktop topbar */}
        <div className="border-line bg-surface hidden shrink-0 items-center justify-end gap-5 border-b px-5 py-3 md:flex sm:px-6">
          <button className="text-muted hover:text-foreground relative cursor-pointer">
            <Bell size={20} />
            <span className="bg-error absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium text-white">
              3
            </span>
          </button>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen((v) => !v)}
              className="flex cursor-pointer items-center gap-2"
            >
              <div className="bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium">{user?.name}</span>
              <ChevronDown size={16} className="text-muted" />
            </button>

            {isProfileOpen && (
              <div className="border-line shadow-card absolute top-full right-0 z-10 mt-2 w-40 rounded-lg border bg-white py-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hover:bg-surface-secondary flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <main className="bg-surface flex flex-1 flex-col overflow-hidden px-5 py-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
