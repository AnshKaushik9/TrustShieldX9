import React from "react";
import { createRoot } from "react-dom/client";
import { Overlay } from "../components/Overlay";
import "../style.css"; // Ensure Tailwind injects here

// Create container for overlay
const container = document.createElement("div");
container.id = "trustshield-overlay-root";
document.body.appendChild(container);

const root = createRoot(container);
root.render(<Overlay />);

