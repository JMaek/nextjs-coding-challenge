"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const theme = createTheme({
	palette: {
		mode: "light",
	},
});

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<NuqsAdapter>{children}</NuqsAdapter>
		</ThemeProvider>
	);
}
