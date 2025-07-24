import { SeasonModel, SeasonCreateInput } from "./season";
import { TeamModel, TeamCreateInput } from "./team";

export interface StandingModel {
  standing_id: number;
  season_id: number | null;
  team_id: number | null;
  position: number;
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  form: string | null;
  created_at: string;
  updated_at: string;
  season?: SeasonModel;
  team?: TeamModel;
}

export interface StandingCreateInput {
  standing_id?: number;
  season_id?: number | null;
  team_id?: number | null;
  position: number;
  matches_played?: number;
  wins?: number;
  draws?: number;
  losses?: number;
  goals_for?: number;
  goals_against?: number;
  goal_difference?: number;
  points?: number;
  form?: string | null;
  created_at?: string;
  updated_at?: string;
  season?: SeasonCreateInput;
  team?: TeamCreateInput;
}

export type StandingUpdateInput = Partial<StandingCreateInput>;

