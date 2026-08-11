import { configureStore } from "@reduxjs/toolkit";
import flightBookingReducer from "./flightBookingSlice";
import { websiteApi } from "./websiteApi";
import sessionReducer from "./sessionSlice";

export const makeStore = () => configureStore({
  reducer: {
    flightBooking: flightBookingReducer,
    session: sessionReducer,
    [websiteApi.reducerPath]: websiteApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(websiteApi.middleware),
});

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
