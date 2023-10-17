import React from "react";
import { hydrateRoot } from "react-dom/client";

export const hydrateClient = ({ AppEntry }: { AppEntry: React.ReactNode }) => {
  if (typeof window !== "undefined") {
    const root =
      typeof document !== "undefined" && document.getElementById("root");

    if (!root) {
      console.error("Root node not found");
      throw new Error("Root node not found");
    }

    hydrateRoot(root, <React.StrictMode>{AppEntry}</React.StrictMode>);
  }
};
