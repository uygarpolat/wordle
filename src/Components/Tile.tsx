import { Language } from "../Assets/Settings/Settings";

interface TileProps {
	letter: string;
	tag: string;
	animate: boolean;
	language: Language;
}

export default function Tile({ letter, tag, animate, language }: TileProps) {
	const addAnimateClass = animate ? "animate" : "";

	return (
		<div className={`tile ${tag} ${addAnimateClass}`}>
			<p className="letter">
				{letter ? letter.toLocaleUpperCase(language) : ""}
			</p>
		</div>
	);
}
