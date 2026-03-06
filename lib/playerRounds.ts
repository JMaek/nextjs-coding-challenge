import { supabase } from "@/lib/supabase";

export async function upsertPlayerRound(
	playerId: string,
	roundId: string,
	progress: string,
	wpm: number,
	accuracy: number,
) {
	const { error } = await supabase.from("player_rounds").upsert(
		{
			player_id: playerId,
			round_id: roundId,
			progress,
			wpm,
			accuracy,
		},
		{ onConflict: "player_id, round_id" },
	);

	if (error) console.error("Failed to update player round", error);
}

export async function joinRound(playerId: string, roundId: string) {
	const { error } = await supabase.from("player_rounds").upsert(
		{
			player_id: playerId,
			round_id: roundId,
			progress: "",
			wpm: 0,
			accuracy: 0,
		},
		{ onConflict: "player_id, round_id" },
	);

	if (error) console.error("Failed to join round:", error);
}
