"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LeaderboardEntry } from "@/types";

export function useLeaderboard(roundId: string | undefined) {
	const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!roundId) return;

		const fetchLeaderboard = async () => {
			const { data, error } = await supabase
				.from("player_rounds")
				.select(`*, players (name)`)
				.eq("round_id", roundId);

			if (error) {
				setError("Failed to load leaderboard");
				console.error(error);
			} else {
				setLeaderboard(
					data.map((entry) => ({
						...entry,
						player_name: entry.players.name,
					})),
				);
			}
			setIsLoading(false);
		};

		fetchLeaderboard();
	}, [roundId]);

	useEffect(() => {
		if (!roundId) return;

		const channel = supabase
			.channel("leaderboard")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "player_rounds",
					filter: `round_id=eq.${roundId}`,
				},
				async (payload) => {
					const newRow = payload.new as { id: string };

					const { data } = await supabase
						.from("player_rounds")
						.select(`*, players (name)`)
						.eq("id", newRow.id)
						.single();

					if (!data) return;

					const entry: LeaderboardEntry = {
						...data,
						player_name: data.players.name,
					};

					setLeaderboard((prev) => {
						const exists = prev.find((e) => e.id === entry.id);
						if (exists) {
							return prev.map((e) =>
								e.id === entry.id ? entry : e,
							);
						}
						return [...prev, entry];
					});
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [roundId]);

	return { leaderboard, isLoading, error };
}
