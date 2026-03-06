"use client";
import { useRound } from "../hooks/useRound";

export default function Home() {
	const { round, timeLeft, isLoading, error } = useRound();

	if (isLoading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;

	return (
		<div>
			<p>Sentence: {round?.sentence}</p>
			<p>Time left: {timeLeft}s</p>
		</div>
	);
}
