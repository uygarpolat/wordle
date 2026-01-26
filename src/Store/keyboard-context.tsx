import { createContext, useState, ReactNode } from "react";
import { ALPHABET_ARRAYS, Language } from "../Assets/Settings/Settings.tsx";

interface KeyboardContextType {
	keyboardColors: string[];
	updateKeyboardColors: (
		word: string,
		colorTags: string[],
		language: Language
	) => void;
	resetKeyboardColors: () => void;
	setKeyboardLength: (newLength: number) => void;
	handleAlphabetArray: (lang: Language) => void;
}

export const KeyboardContext = createContext<KeyboardContextType>({
	keyboardColors: [],
	updateKeyboardColors: () => { },
	resetKeyboardColors: () => { },
	setKeyboardLength: () => { },
	handleAlphabetArray: () => { },
});

export const KeyboardContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [keyboardColors, setKeyboardColors] = useState<string[]>(
		Array(26).fill("gray")
	);
	const [length, setLength] = useState<number>(26);
	const [alphabetArray, setAlphabetArray] = useState<string[]>(
		ALPHABET_ARRAYS["en"]
	);

	function setKeyboardLength(newLength: number) {
		if (newLength !== length) {
			setLength(newLength);
			setKeyboardColors(Array(newLength).fill("gray"));
		}
	}

	function handleAlphabetArray(lang: Language) {
		setAlphabetArray(ALPHABET_ARRAYS[lang]);
	}

	function updateKeyboardColors(
		word: string,
		colorTags: string[],
		language: Language
	) {
		setKeyboardColors((prev) => {
			const next = [...prev];

			for (let i = 0; i < word.length; i++) {
				const character = word[i].toLocaleUpperCase(language);
				const index = alphabetArray.indexOf(character);

				if (colorTags[i] === "green") {
					next[index] = "green";
				} else if (colorTags[i] === "yellow" && next[index] !== "green") {
					next[index] = "yellow";
				} else if (colorTags[i] === "gray" && next[index] === "gray") {
					next[index] = "dark-gray";
				}
			}
			return next;
		});
	}

	function resetKeyboardColors() {
		setKeyboardColors((prev) => Array(prev.length).fill("gray"));
	}

	const payload: KeyboardContextType = {
		keyboardColors,
		updateKeyboardColors,
		resetKeyboardColors,
		setKeyboardLength,
		handleAlphabetArray,
	};

	return (
		<KeyboardContext.Provider value={payload}>
			{children}
		</KeyboardContext.Provider>
	);
};
