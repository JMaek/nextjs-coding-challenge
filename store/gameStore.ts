import { create } from "zustand";
import { Round } from "@/types";

type GameStore = {
	round: Round | null;
	wpm: number;
	accuracy: number;
	progress: string;
	correctKeystrokes: number;
	totalKeystrokes: number;

	setRound: (round: Round) => void;
	updateTypingStats: (
		progress: string,
		correctKeystrokes: number,
		totalKeystrokes: number,
		wpm: number,
		accuracy: number,
	) => void;
	resetTyping: () => void;
};

export const useGameStore = create<GameStore>((set) => ({
	round: null,
	wpm: 0,
	accuracy: 1,
	progress: "",
	correctKeystrokes: 0,
	totalKeystrokes: 0,

	setRound: (round) => set({ round }),
	updateTypingStats: (
		progress,
		correctKeystrokes,
		totalKeystrokes,
		wpm,
		accuracy,
	) => set({ progress, correctKeystrokes, totalKeystrokes, wpm, accuracy }),
	resetTyping: () =>
		set({
			progress: "",
			correctKeystrokes: 0,
			totalKeystrokes: 0,
			wpm: 0,
			accuracy: 1,
		}),
}));
