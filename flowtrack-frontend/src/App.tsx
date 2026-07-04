import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store/index";
import type { ApiResponse } from "./types/api";
import { setAccessToken, setCredentials } from "./store/authSlice";
import api from "./api/axios";
import { getProfile } from "./api/auth";
import AppLayout from "./layouts/AppLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import OrganizationPage from "./pages/organization/OrganizationPage";

let refreshPromise: Promise<string | null> | null = null;

function getRefreshPromise() {
  if (!refreshPromise) {
    refreshPromise = api
      .post<ApiResponse<{ accessToken: string }>>("/auth/refresh")
      .then(({ data }) => data.data.accessToken)
      .catch(() => null);
  }
  return refreshPromise;
}

function SilentRefresh({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    getRefreshPromise()
      .then(async (token) => {
        if (!token) return;
        dispatch(setAccessToken(token));
        const { data } = await getProfile();
        dispatch(setCredentials({ accessToken: token, user: data.user, org: data.org }));
      })
      .finally(() => setReady(true));
  }, [dispatch]);

  // block rendering until refresh attempt is done — prevents PrivateRoute
  // from redirecting to / before the token is restored in Redux
  if (!ready) return null;
  return <>{children}</>;
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  return accessToken ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <SilentRefresh>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/organization" element={<OrganizationPage />} />
          </Route>
        </Routes>
      </SilentRefresh>
    </BrowserRouter>
  );
}
