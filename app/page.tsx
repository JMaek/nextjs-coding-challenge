"use client";

import { useRound } from "@/hooks/useRound";
import { usePlayer } from "@/hooks/usePlayer";
import PlayerNameModal from "@/components/PlayerNameModal/PlayerNameModal";
import TypingInput from "@/components/TypingInput/TypingInput";
import { CircularProgress, Container, Box, Typography } from "@mui/material";

export default function Home() {
	const { round, timeLeft, isLoading: roundLoading, error } = useRound();
	const { player, isLoading: playerLoading } = usePlayer();

	if (roundLoading || playerLoading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
				<Typography color="error">{error}</Typography>
			</Box>
		);
	}

	return (
		<Container
			maxWidth="lg"
			sx={{ py: 4 }}
		>
			{!player && <PlayerNameModal />}

			{round && (
				<Box>
					<Typography variant="h6">Time left: {timeLeft}s</Typography>
					<TypingInput
						sentence={round.sentence}
						roundStartedAt={round.started_at}
						disabled={!player || timeLeft === 0}
						onProgress={(progress, wpm, accuracy) => {
							console.log({ progress, wpm, accuracy });
						}}
					/>
				</Box>
			)}
		</Container>
	);
}
