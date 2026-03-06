"use client";

import { useLeaderboard } from "@/hooks/useLeaderboard";
import { Box, Typography, Alert, Skeleton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useQueryState } from "nuqs";
import { GridSortModel } from "@mui/x-data-grid";

type Props = {
	roundId: string | undefined;
};

const columns: GridColDef[] = [
	{
		field: "player_name",
		headerName: "Player",
		flex: 1,
	},
	{
		field: "progress",
		headerName: "Live Progress",
		flex: 2,
		renderCell: (params) => (
			<Typography
				variant="body2"
				sx={{ fontFamily: "monospace" }}
			>
				{params.value || "..."}
			</Typography>
		),
	},
	{
		field: "wpm",
		headerName: "WPM",
		width: 100,
		type: "number",
	},
	{
		field: "accuracy",
		headerName: "Accuracy",
		width: 120,
		type: "number",
		valueFormatter: (value) => {
			return `${Math.round(value * 100)}%`;
		},
	},
];

export default function Leaderboard({ roundId }: Props) {
	const { leaderboard, isLoading, error } = useLeaderboard(roundId);
	const [sortField, setSortField] = useQueryState("sort");
	const [sortDir, setSortDir] = useQueryState("dir");

	const handleSortChange = (model: GridSortModel) => {
		if (model.length > 0) {
			setSortField(model[0].field);
			setSortDir(model[0].sort ?? "asc");
		} else {
			setSortField(null);
			setSortDir(null);
		}
	};

	const sortModel: GridSortModel = sortField
		? [{ field: sortField, sort: sortDir as "asc" | "desc" }]
		: [];

	if (isLoading) {
		return (
			<Box sx={{ mt: 2 }}>
				<Skeleton
					variant="rectangular"
					height={400}
				/>
			</Box>
		);
	}

	if (error) {
		return <Alert severity="error">{error}</Alert>;
	}

	return (
		<Box sx={{ mt: 4 }}>
			<Typography
				variant="h6"
				sx={{ mb: 2 }}
			>
				Leaderboard
			</Typography>
			<DataGrid
				rows={leaderboard}
				columns={columns}
				sortModel={sortModel}
				onSortModelChange={handleSortChange}
				initialState={{
					pagination: {
						paginationModel: { pageSize: 10 },
					},
				}}
				pageSizeOptions={[5, 10, 25]}
				disableRowSelectionOnClick
				autoHeight
			/>
		</Box>
	);
}
