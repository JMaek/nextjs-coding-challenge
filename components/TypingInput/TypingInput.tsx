"use client";

import { useState, useEffect, useCallback } from "react";
import { Box, TextField } from "@mui/material";
import {
	getCharacterStates,
	calculateWPM,
	calculateAccuracy,
} from "@/utils/gameMetrics";
import { useGameStore } from "@/store/gameStore";

type Props = {
	sentence: string;
	roundStartedAt: string;
	disabled?: boolean;
	onProgress: (progress: string, wpm: number, accuracy: number) => void;
};

export default function TypingInput({
	sentence,
	roundStartedAt,
	disabled,
	onProgress,
}: Props) {
	const [typed, setTyped] = useState("");
	const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
	const [totalKeystrokes, setTotalKeystrokes] = useState(0);
	const updateTypingStats = useGameStore((state) => state.updateTypingStats);

	useEffect(() => {
		setTyped("");
		setCorrectKeystrokes(0);
		setTotalKeystrokes(0);
	}, [sentence]);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			if (value.length > sentence.length) return;

			const newTotal = totalKeystrokes + 1;
			const newCorrect =
				value[value.length - 1] === sentence[value.length - 1]
					? correctKeystrokes + 1
					: correctKeystrokes;

			const elapsedSeconds =
				(Date.now() - new Date(roundStartedAt).getTime()) / 1000;
			const wpm = calculateWPM(value, sentence, elapsedSeconds);
			const accuracy = calculateAccuracy(newCorrect, newTotal);

			setTyped(value);
			setCorrectKeystrokes(newCorrect);
			setTotalKeystrokes(newTotal);
			updateTypingStats(value, newCorrect, newTotal, wpm, accuracy);
			onProgress(value, wpm, accuracy);
		},
		[typed, correctKeystrokes, totalKeystrokes, sentence, roundStartedAt],
	);

	const charStates = getCharacterStates(typed, sentence);

	return (
		<Box sx={{ width: "100%", my: 2 }}>
			<Box
				sx={{
					mb: 2,
					p: 2,
					borderRadius: 1,
					bgcolor: "background.paper",
					fontFamily: "monospace",
					fontSize: "1.2rem",
					letterSpacing: "0.05em",
				}}
			>
				{sentence.split("").map((char, index) => (
					<span
						key={index}
						style={{
							color:
								charStates[index] === "correct"
									? "#4caf50"
									: charStates[index] === "incorrect"
										? "#f44336"
										: "inherit",
						}}
					>
						{char}
					</span>
				))}
			</Box>

			<TextField
				fullWidth
				variant="outlined"
				value={typed}
				onChange={handleChange}
				disabled={disabled}
				placeholder={
					disabled ? "Waiting for next round..." : "Start typing..."
				}
				autoComplete="off"
				autoCorrect="off"
				autoCapitalize="off"
				spellCheck={false}
			/>
		</Box>
	);
}
