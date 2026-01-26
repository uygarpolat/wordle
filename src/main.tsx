import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import App from "./App.tsx";
import { KeyboardContextProvider } from "./Store/keyboard-context";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<KeyboardContextProvider>
		<App />
		<Analytics />
	</KeyboardContextProvider>
);
