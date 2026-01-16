export default function Modal({ settings, isOver, targetWord, onPlayAgain }) {
	let modalContent = null;

	if (isOver !== "ongoing") {
		const history = JSON.parse(localStorage.getItem("history"));
		modalContent = settings.resultScreen(settings.language, isOver, targetWord, history, onPlayAgain);
	}

	return modalContent;
}
