"use client";

import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";
import SessionBootstrap from "./SessionBootstrap";

export default function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore);
  return <Provider store={store}><SessionBootstrap />{children}</Provider>;
}
