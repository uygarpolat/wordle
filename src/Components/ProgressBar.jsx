import { useEffect, useState } from "react";

export default function ProgressBar({ isOver, duration, onTimeout }) {
	const [remainingTime, setRemainingTime] = useState(duration);
	console.log("isOver inside of ProgressBar: ", isOver);

	useEffect(() => {
		if (isOver !== "ongoing") return;

		const timer = setTimeout(onTimeout, duration);
		return () => clearTimeout(timer);
	}, [duration, onTimeout, isOver]);

	useEffect(() => {
		if (isOver !== "ongoing") return;

		const interval = setInterval(() => {
			setRemainingTime((prev) => Math.max(0, prev - 10));
		}, 10);
		return () => clearInterval(interval);
	}, [isOver]);

	return <progress id="progress-bar" value={isOver === "ongoing" ? remainingTime : "0"} max={duration} />;
}
