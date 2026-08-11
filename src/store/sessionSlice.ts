import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type SessionState = {
  hydrated: boolean;
  isAuthenticated: boolean;
  email: string | null;
  profileImage: string | null;
};

const initialState: SessionState = { hydrated: false, isAuthenticated: false, email: null, profileImage: null };

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    hydrateSession(_state, action: PayloadAction<Omit<SessionState, "hydrated">>) {
      return { ...action.payload, hydrated: true };
    },
    sessionAuthenticated(state, action: PayloadAction<{ email: string; profileImage?: string | null }>) {
      state.hydrated = true;
      state.isAuthenticated = true;
      state.email = action.payload.email;
      state.profileImage = action.payload.profileImage ?? state.profileImage;
    },
    sessionCleared: () => ({ ...initialState, hydrated: true }),
  },
});

export const { hydrateSession, sessionAuthenticated, sessionCleared } = sessionSlice.actions;
export default sessionSlice.reducer;
