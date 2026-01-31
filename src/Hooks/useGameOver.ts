import { Dispatch, SetStateAction, useCallback } from "react";
import { SettingsPayload } from "../Assets/Settings/Settings";

export default function useGameOver(
	settings: SettingsPayload,
	setGuesses: Dispatch<SetStateAction<string[]>>,
	setTileTags: Dispatch<SetStateAction<string[][]>>,
	setCurrentGuessIndex: Dispatch<SetStateAction<number>>,
	setIsOver: Dispatch<SetStateAction<string>>,
	resetKeyboardColors: () => void,
	setTargetWord: Dispatch<SetStateAction<string>>
) {
	const handleGameOverReset = useCallback(() => {
		setGuesses(Array.from({ length: settings.total_lines }, () => ""));
		setTileTags(
			Array.from({ length: settings.total_lines }, () =>
				Array.from({ length: settings.word_length }, () => "")
			)
		);
		setCurrentGuessIndex(0);
		setIsOver("ongoing");
		resetKeyboardColors();

		const wordList = settings.small_file;
		const idx = Math.floor(Math.random() * wordList.length);
		console.log("Target word:", wordList[idx]);
		setTargetWord(wordList[idx]);
	}, [
		resetKeyboardColors,
		setCurrentGuessIndex,
		setGuesses,
		setIsOver,
		setTargetWord,
		setTileTags,
		settings.small_file,
		settings.total_lines,
		settings.word_length,
	]);

	return { handleGameOverReset };
}
