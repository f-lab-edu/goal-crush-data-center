import { supabase } from '@/lib/supabase/client';
import {
  PlayerMatchStats,
  PlayerSeasonStats,
  Standing,
  TeamSeasonStats,
} from '@/lib/types/database';

// ========== Player Match Statistics ==========

// Get player match statistics by match
export const getPlayerMatchStats = async (
  matchId: number
): Promise<PlayerMatchStats[]> => {
  const { data, error } = await supabase
    .from('player_match_stats')
    .select('*')
    .eq('match_id', matchId);

  if (error) {
    throw new Error(
      `Failed to fetch player match statistics: ${error.message}`
    );
  }

  return data || [];
};

// Get player match statistics by player
export const getPlayerMatchStatsByPlayer = async (
  playerId: number
): Promise<PlayerMatchStats[]> => {
  const { data, error } = await supabase
    .from('player_match_stats')
    .select('*')
    .eq('player_id', playerId)
    .order('match_id', { ascending: false });

  if (error) {
    throw new Error(
      `Failed to fetch player match statistics: ${error.message}`
    );
  }

  return data || [];
};

// ========== Player Season Statistics ==========

// Get player season statistics by season
export const getPlayerSeasonStats = async (
  seasonId: number
): Promise<PlayerSeasonStats[]> => {
  const { data, error } = await supabase
    .from('player_season_stats')
    .select('*')
    .eq('season_id', seasonId)
    .order('total_goals', { ascending: false });

  if (error) {
    throw new Error(
      `Failed to fetch player season statistics: ${error.message}`
    );
  }

  return data || [];
};

// Get player season statistics by player
export const getPlayerSeasonStatsByPlayer = async (
  playerId: number
): Promise<PlayerSeasonStats[]> => {
  const { data, error } = await supabase
    .from('player_season_stats')
    .select('*')
    .eq('player_id', playerId)
    .order('season_id', { ascending: false });

  if (error) {
    throw new Error(
      `Failed to fetch player season statistics: ${error.message}`
    );
  }

  return data || [];
};

// Get top scorers
export const getTopScorers = async (
  seasonId: number,
  limit: number = 10
): Promise<PlayerSeasonStats[]> => {
  const { data, error } = await supabase
    .from('player_season_stats')
    .select('*')
    .eq('season_id', seasonId)
    .order('total_goals', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch top scorers: ${error.message}`);
  }

  return data || [];
};

// ========== Team Season Statistics ==========

// Get team season statistics by season
export const getTeamSeasonStats = async (
  seasonId: number
): Promise<TeamSeasonStats[]> => {
  const { data, error } = await supabase
    .from('team_season_stats')
    .select('*')
    .eq('season_id', seasonId)
    .order('points', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch team season statistics: ${error.message}`);
  }

  return data || [];
};

// Get team season statistics by team
export const getTeamSeasonStatsByTeam = async (
  teamId: number
): Promise<TeamSeasonStats[]> => {
  const { data, error } = await supabase
    .from('team_season_stats')
    .select('*')
    .eq('team_id', teamId)
    .order('season_id', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch team season statistics: ${error.message}`);
  }

  return data || [];
};

// ========== Standings ==========

// Get standings by season
export const getStandings = async (seasonId: number): Promise<Standing[]> => {
  const { data, error } = await supabase
    .from('standings')
    .select('*')
    .eq('season_id', seasonId)
    .order('rank', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch standings: ${error.message}`);
  }

  return data || [];
};

// Get standings with team name by season
export const getStandingsWithTeam = async (seasonId: number) => {
  const { data, error } = await supabase
    .from('standings')
    .select(`*, team:team_id (team_id, team_name)`)
    .eq('season_id', seasonId)
    .order('position', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch standings with team: ${error.message}`);
  }

  return data || [];
};
