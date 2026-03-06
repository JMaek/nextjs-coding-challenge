import Button from "@mui/material/Button";
import { supabase } from "../lib/supabase";

export default async function Home() {
	const { data, error } = await supabase.from("players").select("*");
	console.log("data:", data, "error:", error);
	return (
		<div>
			<main>
				<Button variant="contained">Hello MUI</Button>
			</main>
		</div>
	);
}
