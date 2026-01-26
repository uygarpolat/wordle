import Tile from "./Tile";
import { Language } from "../Assets/Settings/Settings";

interface LineProps {
	word: string;
	tags: string[];
	isCurrentLine: boolean;
	language: Language;
}

export default function Line({
	word,
	tags,
	isCurrentLine,
	language,
}: LineProps) {
	const LINE_LENGTH = 5;

	return (
		<div className="line">
			{Array.from({ length: LINE_LENGTH }).map((_, index) => (
				<Tile
					key={index}
					letter={word[index]}
					tag={tags[index]}
					animate={isCurrentLine}
					language={language}
				/>
			))}
		</div>
	);
}
