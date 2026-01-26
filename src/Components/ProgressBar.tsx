import { useEffect, useState } from "react";

interface ProgressBarProps {
	isOver: string;
	duration: number;
	onTimeout: () => void;
}

export default function ProgressBar({
	isOver,
	duration,
	onTimeout,
}: ProgressBarProps) {
	const [remainingTime, setRemainingTime] = useState<number>(duration);

	useEffect(() => {
		if (isOver !== "ongoing") return;

		const timer = setTimeout(onTimeout, duration);
		return () => clearTimeout(timer);
	}, [duration, onTimeout, isOver]);

	useEffect(() => {
		if (isOver !== "ongoing") return;

		const interval = setInterval(() => {
			setRemainingTime((prev) => Math.max(0, prev - 50));
		}, 50);
		return () => clearInterval(interval);
	}, [isOver]);

	return (
		<progress
			className={`progress-bar ${remainingTime < duration / 3 ? "urgent" : ""}`}
			value={isOver === "ongoing" ? remainingTime : "0"}
			max={duration}
		/>
	);
}
