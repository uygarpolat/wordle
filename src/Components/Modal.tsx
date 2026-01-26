import { createPortal } from "react-dom";
import { SettingsPayload } from "../Assets/Settings/Settings";

interface ModalProps {
	settings: SettingsPayload;
	isOver: string;
	targetWord: string;
	onPlayAgain: () => void;
	tileTags: string[][];
}

export default function Modal({
	settings,
	isOver,
	targetWord,
	onPlayAgain,
	tileTags,
}: ModalProps) {
	let modalContent = null;

	if (isOver !== "ongoing") {
		const history = JSON.parse(localStorage.getItem("history") || "[]");
		modalContent = settings.resultScreen(
			settings.language,
			isOver,
			targetWord,
			history,
			onPlayAgain,
			tileTags
		);
	}

	const container = document.querySelector(".board-container");
	if (!container) return null;

	return createPortal(modalContent, container);
}
