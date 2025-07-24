import { SeasonModel, SeasonCreateInput } from "./season";
import { TeamModel, TeamCreateInput } from "./team";

export interface TeamSeasonStatsModel {
  stat_id: number;
  team_id: number | null;
  season_id: number | null;
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  points: number;
  created_at: string;
  updated_at: string;
  season?: SeasonModel;
  team?: TeamModel;
}

export interface TeamSeasonStatsCreateInput {
  stat_id?: number;
  team_id?: number | null;
  season_id?: number | null;
  matches_played?: number;
  wins?: number;
  draws?: number;
  losses?: number;
  goals_for?: number;
  goals_against?: number;
  points?: number;
  created_at?: string;
  updated_at?: string;
  season?: SeasonCreateInput;
  team?: TeamCreateInput;
}

export type TeamSeasonStatsUpdateInput = Partial<TeamSeasonStatsCreateInput>;

