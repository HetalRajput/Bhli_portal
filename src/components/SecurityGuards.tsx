"use client";

import { useEffect } from "react";

export default function SecurityGuards() {
  useEffect(() => {
    const blockContextMenu = (event: Event) => event.preventDefault();
    const blockImageDrag = (event: Event) => {
      if (event.target instanceof HTMLImageElement) event.preventDefault();
    };
    const blockSaveShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
      }
    };

    document.querySelectorAll("img").forEach((image) => { image.draggable = false; });
    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("dragstart", blockImageDrag);
    document.addEventListener("keydown", blockSaveShortcut);

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("dragstart", blockImageDrag);
      document.removeEventListener("keydown", blockSaveShortcut);
    };
  }, []);

  return null;
}
