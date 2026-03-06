import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getRandomSentence } from "@/lib/sentences";

const ROUND_DURATION_SECONDS = 60;

export async function GET() {
	try {
		const { data: activeRound, error } = await supabase
			.from("rounds")
			.select("*")
			.eq("status", "active")
			.single();

		if (error && error.code !== "PGRST116") {
			throw error;
		}

		if (activeRound && new Date(activeRound.ends_at) > new Date()) {
			return NextResponse.json(activeRound);
		}

		if (activeRound) {
			await supabase
				.from("rounds")
				.update({ status: "completed" })
				.eq("id", activeRound.id);
		}

		const now = new Date();
		const endsAt = new Date(now.getTime() + ROUND_DURATION_SECONDS * 1000);

		const { data: newRound, error: createError } = await supabase
			.from("rounds")
			.insert({
				sentence: getRandomSentence(),
				started_at: now.toISOString(),
				ends_at: endsAt.toISOString(),
				status: "active",
			})
			.select()
			.single();

		if (createError) throw createError;

		return NextResponse.json(newRound);
	} catch (error) {
		console.error("Round API error:", error);
		return NextResponse.json(
			{ error: "Failed to create round" },
			{ status: 500 },
		);
	}
}
