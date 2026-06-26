import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store/index";
import type { ApiResponse } from "./types/api";
import { setAccessToken } from "./store/authSlice";
import api from "./api/axios";
import AppLayout from "./layouts/AppLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import OrganizationPage from "./pages/organization/OrganizationPage";

function SilentRefresh({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  // changing ready triggers a re-render (any setState causes React to re-render)
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // on page load, try to get a new access token using the httpOnly cookie
    api
      .post<ApiResponse<{ accessToken: string }>>("/auth/refresh")
      .then(({ data }) => dispatch(setAccessToken(data.data.accessToken)))
      .catch(() => {}) // not logged in — that's fine
      .finally(() => setReady(true)); // setReady(true) triggers re-render → children render
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
