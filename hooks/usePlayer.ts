"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useGameStore } from "@/store/gameStore";

export function usePlayer() {
	const [isLoading, setIsLoading] = useState(true);
	const setPlayer = useGameStore((state) => state.setPlayer);
	const player = useGameStore((state) => state.player);

	useEffect(() => {
		const loadPlayer = async () => {
			const playerId = localStorage.getItem("playerId");

			if (!playerId) {
				setIsLoading(false);
				return;
			}

			const { data, error } = await supabase
				.from("players")
				.select("*")
				.eq("id", playerId)
				.single();

			if (error || !data) {
				localStorage.removeItem("playerId");
				localStorage.removeItem("playerName");
			} else {
				setPlayer(data);
			}

			setIsLoading(false);
		};

		loadPlayer();
	}, []);

	return { player, isLoading };
}
