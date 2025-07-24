import { MatchModel } from '@/generated/types';
import {
  Goal,
  MatchWithTeams,
  PenaltyShootoutDetailWithPlayers,
  Substitution,
  SubstitutionInput,
} from '@/lib/types';

// 추가 타입 정의
interface GoalWithTeam extends Goal {
  team: { team_id: number; team_name: string };
  player: { name: string };
}

interface LineupPlayer {
  stat_id: number;
  match_id: number;
  player_id: number;
  team_id: number;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  minutes_played: number;
  saves: number;
  position: string;
  player_name: string;
  jersey_number: number | null;
  team_name: string;
  participation_status: 'starting' | 'substitute' | 'bench';
}

interface SeasonSummary {
  season_id: number;
  season_name: string;
  year: number;
  total_matches: number;
  participating_teams: number;
  completed_matches: number;
  penalty_matches: number;
  completion_rate: number;
}

// Prisma 기반 API 클라이언트 함수들
// 기존 Supabase API와 동일한 인터페이스를 제공하지만 Next.js API Routes를 사용

// ============== Basic Match CRUD Operations ==============

// Get all matches
export const getMatchesPrisma = async (): Promise<MatchWithTeams[]> => {
  const response = await fetch('/api/matches');
  if (!response.ok) {
    throw new Error(`Failed to fetch matches: ${response.statusText}`);
  }
  return response.json();
};

// Get match by ID
export const getMatchByIdPrisma = async (
  matchId: number
): Promise<MatchWithTeams | null> => {
  const response = await fetch(`/api/matches/${matchId}`);
  if (!response.ok) {
    if (response.status === 404) {
      return null; // Match not found
    }
    throw new Error(`Failed to fetch match: ${response.statusText}`);
  }
  return response.json();
};

// Get matches by season ID
export const getMatchesBySeasonIdPrisma = async (
  seasonId: number
): Promise<MatchModel[]> => {
  const response = await fetch(`/api/matches/season/${seasonId}`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch matches by season: ${response.statusText}`
    );
  }
  return response.json();
};

// ============== Match Details ==============

// Get match goals
export const getMatchGoalsPrisma = async (
  matchId: number
): Promise<GoalWithTeam[]> => {
  const response = await fetch(`/api/matches/${matchId}/goals`);
  if (!response.ok) {
    throw new Error(`Failed to fetch match goals: ${response.statusText}`);
  }
  return response.json();
};

// Get match lineups
export const getMatchLineupsPrisma = async (
  matchId: number
): Promise<Record<string, LineupPlayer[]>> => {
  const response = await fetch(`/api/matches/${matchId}/lineups`);
  if (!response.ok) {
    throw new Error(`Failed to fetch match lineups: ${response.statusText}`);
  }
  return response.json();
};

// Get penalty shootout details
export const getPenaltyShootoutDetailsPrisma = async (
  matchId: number
): Promise<PenaltyShootoutDetailWithPlayers[]> => {
  const response = await fetch(`/api/matches/${matchId}/penalties`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch penalty shootout details: ${response.statusText}`
    );
  }
  return response.json();
};

// ============== Substitution Management ==============

// Create substitution
export const createSubstitutionPrisma = async (
  matchId: number,
  substitution: SubstitutionInput
): Promise<Substitution> => {
  const response = await fetch(`/api/matches/${matchId}/substitutions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(substitution),
  });

  if (!response.ok) {
    throw new Error(`Failed to create substitution: ${response.statusText}`);
  }
  return response.json();
};

// Get substitutions for a match
export const getSubstitutionsPrisma = async (
  matchId: number
): Promise<Substitution[]> => {
  const response = await fetch(`/api/matches/${matchId}/substitutions`);
  if (!response.ok) {
    throw new Error(`Failed to fetch substitutions: ${response.statusText}`);
  }
  return response.json();
};

// ============== Season Management ==============

// Get all season summaries
export const getSeasonSummariesPrisma = async (): Promise<SeasonSummary[]> => {
  const response = await fetch('/api/seasons/summary');
  if (!response.ok) {
    throw new Error(`Failed to fetch season summaries: ${response.statusText}`);
  }
  return response.json();
};

// Get season summary by season ID
export const getSeasonSummaryBySeasonIdPrisma = async (
  seasonId: number
): Promise<SeasonSummary[]> => {
  const response = await fetch(`/api/seasons/${seasonId}/summary`);
  if (!response.ok) {
    throw new Error(`Failed to fetch season summary: ${response.statusText}`);
  }
  return response.json();
};

// ============== Legacy Functions for Backward Compatibility ==============

// Pilot Season Matches
export const getPilotSeasonMatchesPrisma = async () => {
  return getMatchesBySeasonIdPrisma(3);
};

// Season 1 Matches
export const getSeason1MatchesPrisma = async () => {
  return getMatchesBySeasonIdPrisma(4);
};

// Season 2 Matches
export const getSeason2MatchesPrisma = async () => {
  return getMatchesBySeasonIdPrisma(5);
};
