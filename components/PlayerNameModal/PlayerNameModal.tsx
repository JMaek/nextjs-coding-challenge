"use client";

import { useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Typography,
} from "@mui/material";
import { supabase } from "@/lib/supabase";
import { useGameStore } from "@/store/gameStore";

export default function PlayerNameModal() {
	const [name, setName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const setPlayer = useGameStore((state) => state.setPlayer);

	const handleSubmit = async () => {
		if (!name.trim()) return;
		setIsLoading(true);
		setError(null);

		try {
			const { data, error } = await supabase
				.from("players")
				.upsert({ name: name.trim() }, { onConflict: "name" })
				.select()
				.single();

			if (error) throw error;

			setPlayer(data);
			localStorage.setItem("playerId", data.id);
			localStorage.setItem("playerName", data.name);
		} catch (err) {
			setError(
				"Name already taken or something went wrong, try different name.",
			);
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog
			open={true}
			maxWidth="sm"
			fullWidth
		>
			<DialogTitle>Welcome to Typing Challenge!</DialogTitle>
			<DialogContent>
				<Typography
					variant="body2"
					sx={{ mb: 2 }}
				>
					Enter your name
				</Typography>
				<TextField
					fullWidth
					label="Your name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
					error={!!error}
					helperText={error}
					autoFocus
				/>
			</DialogContent>
			<DialogActions>
				<Button
					variant="contained"
					onClick={handleSubmit}
					disabled={!name.trim() || isLoading}
				>
					{isLoading ? "Joining..." : "Join Game"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
