"use client";

import { useState, useEffect, useCallback } from "react";
import { Round } from "@/types";

const FETCH_INTERVAL_MS = 1000;

export function useRound() {
	const [round, setRound] = useState<Round | null>(null);
	const [timeLeft, setTimeLeft] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const fetchRound = useCallback(async () => {
		try {
			const response = await fetch("/api/rounds");
			if (!response.ok) throw new Error("Failed to fetch round");

			const data: Round = await response.json();

			setRound((prev) => {
				if (prev?.id !== data.id) return data;
				return prev;
			});

			setError(null);
		} catch (err) {
			setError("Failed to connect to the server");
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchRound();
	}, [fetchRound]);

	useEffect(() => {
		if (!round || !isMounted) return;

		const interval = setInterval(() => {
			const now = new Date();
			const endsAt = new Date(round.ends_at);
			const secondsLeft = Math.max(
				0,
				Math.floor((endsAt.getTime() - now.getTime()) / 1000),
			);

			setTimeLeft(secondsLeft);

			if (secondsLeft === 0) {
				fetchRound();
			}
		}, FETCH_INTERVAL_MS);

		return () => clearInterval(interval);
	}, [round, fetchRound, isMounted]);

	return { round, timeLeft, isLoading, error };
}
