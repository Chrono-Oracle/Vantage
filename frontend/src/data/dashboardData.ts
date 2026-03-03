// src/data/dashboardData.ts

export interface Match {
  id: string;
  sport: string;
  league: string;
  leagueLogo: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  time: string;
  date: string;
  status: 'live' | 'finished' | 'scheduled';
  score: { home: number; away: number };
  isPinned: boolean;
}

export const dashboardMatches: Match[] = [
  {
    id: "fb-1",
    sport: "Football",
    league: "Premier League",
    leagueLogo: "/logos/pl.png",
    homeTeam: "Arsenal",
    awayTeam: "Liverpool",
    homeLogo: "/logos/ars.png",
    awayLogo: "/logos/liv.png",
    time: "65'",
    date: "Today",
    status: "live",
    score: { home: 2, away: 1 },
    isPinned: false
  },
  {
    id: "fb-2",
    sport: "Football",
    league: "Premier League",
    leagueLogo: "/logos/pl.png",
    homeTeam: "Man City",
    awayTeam: "Chelsea",
    homeLogo: "/logos/mci.png",
    awayLogo: "/logos/che.png",
    time: "21:00",
    date: "Today",
    status: "scheduled",
    score: { home: 0, away: 0 },
    isPinned: true
  },
  // Add more matches to test the "Top 5" limit per league...
];