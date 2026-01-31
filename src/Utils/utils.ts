import { SettingsPayload } from "../Assets/Settings/Settings";

export default function generateGuessWord(
	keyboardColors: string[],
	settings: SettingsPayload,
	poolArray: string[],
	wordLength: number
) {
	const poolArrayLength = poolArray.length;
	let guessWordIndex = Math.floor(Math.random() * poolArrayLength);

	let returnableWord = "";

	while (!returnableWord) {
		let testWord = poolArray[guessWordIndex % poolArrayLength];
		returnableWord = testWord;
		for (let i = 0; i < wordLength; i++) {
			const character = returnableWord[i].toLocaleUpperCase(settings.language);
			const index = settings.alphabetArray.indexOf(character);
			if (keyboardColors[index] === "dark-gray") {
				returnableWord = "";
				break;
			}
		}
		guessWordIndex++;
	}
	return returnableWord;
}