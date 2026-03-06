"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRound } from "@/hooks/useRound";
import { usePlayer } from "@/hooks/usePlayer";
import PlayerNameModal from "@/components/PlayerNameModal/PlayerNameModal";
import TypingInput from "@/components/TypingInput/TypingInput";
import {
	CircularProgress,
	Container,
	Box,
	Typography,
	Chip,
	Stack,
} from "@mui/material";
import Leaderboard from "@/components/Leaderboard/Leaderboard";
import { useGameStore } from "@/store/gameStore";
import { upsertPlayerRound, joinRound } from "@/lib/playerRounds";

export default function Home() {
	const { round, timeLeft, isLoading: roundLoading, error } = useRound();
	const { player, isLoading: playerLoading } = usePlayer();
	const player_from_store = useGameStore((state) => state.player);

	const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

	const handleProgress = useCallback(
		(progress: string, wpm: number, accuracy: number) => {
			if (!player_from_store || !round) return;

			if (debounceRef.current) clearTimeout(debounceRef.current);

			debounceRef.current = setTimeout(() => {
				upsertPlayerRound(
					player_from_store.id,
					round.id,
					progress,
					wpm,
					accuracy,
				);
			}, 500);
		},
		[player_from_store, round],
	);

	useEffect(() => {
		if (player_from_store && round) {
			joinRound(player_from_store.id, round.id);
		}
	}, [player_from_store?.id, round?.id]);

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

	const isRoundActive = timeLeft > 0;

	return (
		<Container
			maxWidth="lg"
			sx={{ py: 4 }}
		>
			{!player && <PlayerNameModal />}
			<Stack spacing={3}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Typography variant="h4">TypeRacer</Typography>
					<Stack
						direction="row"
						spacing={2}
						alignItems="center"
					>
						{player_from_store && (
							<Chip label={`${player_from_store.name}`} />
						)}
						<Chip
							label={
								isRoundActive ? `${timeLeft}s` : "Round ended"
							}
							color={isRoundActive ? "success" : "error"}
						/>
					</Stack>
				</Box>

				{round && (
					<TypingInput
						sentence={round.sentence}
						roundStartedAt={round.started_at}
						disabled={!player_from_store || !isRoundActive}
						onProgress={handleProgress}
					/>
				)}

				<Leaderboard roundId={round?.id} />
			</Stack>
		</Container>
	);
}
