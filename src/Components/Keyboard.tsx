import { memo } from "react";
import Button from "./Button.tsx";
import { SettingsPayload } from "../Assets/Settings/Settings.tsx";

interface KeyboardProps {
	onKeyPress: (key: string) => void;
	keyboardLayout: string[][];
	settings: SettingsPayload;
}

function Keyboard({ onKeyPress, keyboardLayout, settings }: KeyboardProps) {
	const longestRowLength = Math.max(...keyboardLayout.map((row) => row.length));
	const buttonWidthNumeric = 100 / longestRowLength;
	//   const buttonWidthNumeric = 50 / longestRowLength;

	const normalizeKey = (label: string) => {
		if (label === "⏎") return "enter";
		if (label === "⌫") return "backspace";
		return label;
	};

	const displayKey = (label: string) => {
		if (label === "⏎") return "ENTER";
		if (label === "⌫") return "⌫";
		return label;
	};

	const current_keyboard = keyboardLayout;

	return (
		<div className="keyboard">
			{current_keyboard.map((row, rowIndex) => (
				<div className="keyboard-row" key={rowIndex}>
					{row.map((ltr, keyIndex) => (
						<Button
							key={`${rowIndex}-${keyIndex}`}
							onClick={() => onKeyPress?.(normalizeKey(ltr))}
							ariaLabel={
								ltr === "⏎"
									? "Enter key"
									: ltr === "⌫"
										? "Backspace key"
										: `${ltr} key`
							}
							settings={settings}
							widthStyle={`${buttonWidthNumeric * 1}vw`}
						>
							{displayKey(ltr)}
						</Button>
					))}
				</div>
			))}
		</div>
	);
}

export default memo(Keyboard);
