export const dummyMatches = [
  {
    id: 1,
    teamHome: "West Ham United",
    teamAway: "Manchester United",
    homeLogo: "/WHU-Logo.png", // Ensure these exist in /public
    awayLogo: "/MUN-Logo.png",
    homeAbbr: "WHU",
    awayAbbr: "MUN",
    mainPlayerImg: "/KB-Real.png",
    odds: { home: "46%", draw: "32%", away: "22%" },
    tips: 384,
    time: "15:12:21"
  },
  {
    id: 2,
    teamHome: "Manchester United",
    teamAway: "Barcelona",
    homeLogo: "/MUN-Logo.png",
    awayLogo: "/BAR-Logo.png",
    homeAbbr: "MUN",
    awayAbbr: "BAR",
    mainPlayerImg: "/OS-Paris.png",
    odds: { home: "52%", draw: "21%", away: "27%" },
    tips: 180,
    time: "22:12:21"
  },
  // Add 2 more objects to reach your 4 images
];

export const dashboardMatches = [
  {
    id: "m1",
    sport: "Football",
    league: "Premier League",
    homeTeam: "Arsenal",
    awayTeam: "Liverpool",
    homeLogo: "/logos/ars.png",
    awayLogo: "/logos/liv.png",
    time: "20:45",
    date: "03 Mar",
    status: "live", // Options: live, finished, scheduled
    isLive: true,
    score: { home: 2, away: 1 },
    isPinned: false
  },
  {
    id: "m2",
    sport: "Basketball",
    league: "NBA",
    homeTeam: "Lakers",
    awayTeam: "Warriors",
    homeLogo: "/logos/lal.png",
    awayLogo: "/logos/gsw.png",
    time: "02:00",
    date: "04 Mar",
    status: "scheduled",
    isLive: false,
    score: { home: 0, away: 0 },
    isPinned: true
  }
];