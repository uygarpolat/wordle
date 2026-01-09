import Tile from "./Tile";

export default function Line({ word }) {
	const LINE_LENGTH = 5;

	return (
		<div className="line">
			{Array.from({ length: LINE_LENGTH }).map((_, index) => (
				<Tile key={index} letter={word[index]} />
			))}
		</div>
	);
}