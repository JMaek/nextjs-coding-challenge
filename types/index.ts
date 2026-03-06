export type Player = {
	id: string;
	name: string;
	created_at: string;
	best_wpm: number;
	avg_accuracy: number;
};

export type Round = {
	id: string;
	sentence: string;
	started_at: string;
	ends_at: string;
	status: "active" | "completed";
};

export type PlayerRound = {
	id: string;
	player_id: string;
	round_id: string;
	progress: string;
	wpm: number;
	accuracy: number;
	finished_at: string | null;
	created_at: string;
};

export type LeaderboardEntry = PlayerRound & {
	player_name: string;
};
