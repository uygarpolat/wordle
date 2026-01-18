import { createPortal } from "react-dom";

export default function Modal({ settings, isOver, targetWord, onPlayAgain, tileTags }) {
  let modalContent = null;

  if (isOver !== "ongoing") {
    const history = JSON.parse(localStorage.getItem("history"));
    modalContent = settings.resultScreen(
      settings.language,
      isOver,
      targetWord,
      history,
      onPlayAgain,
	  tileTags,
    );
  }

  const container = document.querySelector(".board-container");
  if (!container) return null;

  return createPortal(modalContent, container);
}
