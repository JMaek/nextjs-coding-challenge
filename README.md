# Next.js Coding Challenge

A real-time multiplayer typing competition platform built with Next.js and Supabase.

## Tech Stack

| Role                | Tool                                |
| ------------------- | ----------------------------------- |
| Framework           | Next.js 14 (App Router, TypeScript) |
| Database + Realtime | Supabase                            |
| UI Components       | Material UI + MUI X DataGrid        |
| Client State        | Zustand                             |
| URL State           | nuqs                                |

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account

### Installation

1. Clone the repository

2. Install dependencies

3. Create a \`.env.local\` file in the root directory

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

4. Set up the database by running this SQL in Supabase SQL Editor:

create table players (
id uuid primary key default gen_random_uuid(),
name text not null unique,
created_at timestamptz default now(),
best_wpm integer default 0,
avg_accuracy numeric default 0
);

create table rounds (
id uuid primary key default gen_random_uuid(),
sentence text not null,
started_at timestamptz default now(),
ends_at timestamptz not null,
status text default 'active'
);

create table player_rounds (
id uuid primary key default gen_random_uuid(),
player_id uuid references players(id) on delete cascade,
round_id uuid references rounds(id) on delete cascade,
progress text default '',
wpm integer default 0,
accuracy numeric default 0,
finished_at timestamptz,
created_at timestamptz default now()
);

alter publication supabase_realtime add table player_rounds;

ALTER TABLE player_rounds
ADD CONSTRAINT player_rounds_player_round_unique
UNIQUE (player_id, round_id);

5. Run the development server

6. Open [http://localhost:3000](http://localhost:3000)

## Features

- Real-time multiplayer typing competition
- Fixed-time rounds with auto-advance
- Live leaderboard with WPM and accuracy tracking
- Player identity persistence via localStorage
- URL-synced table sorting
- Responsive design

## AI Usage

AI was primarily used to consult on architecture and data structure. It suggested tools and supported me with tips during the implementation of elements.
