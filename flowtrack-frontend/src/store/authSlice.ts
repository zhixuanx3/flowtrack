import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  name: string;
}

export interface OrgState {
  id: string;
  name: string;
  role: string;
  createdAt?: string;
  memberCount?: number;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  org: OrgState | null;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  org: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ accessToken: string; user: User; org: OrgState | null }>) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.org = action.payload.org;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    clearCredentials(state) {
      state.accessToken = null;
      state.user = null;
      state.org = null;
    },
    setOrg(state, action: PayloadAction<OrgState>) {
      state.org = action.payload;
    },
  },
});

export const { setCredentials, setAccessToken, clearCredentials, setOrg } = authSlice.actions;
export default authSlice.reducer;
