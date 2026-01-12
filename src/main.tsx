import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize the React app
const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<App />);
}
