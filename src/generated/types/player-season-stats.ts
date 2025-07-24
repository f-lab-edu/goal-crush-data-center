import { PlayerModel, PlayerCreateInput } from "./player";
import { SeasonModel, SeasonCreateInput } from "./season";
import { TeamModel, TeamCreateInput } from "./team";

export interface PlayerSeasonStatsModel {
  stat_id: number;
  player_id: number | null;
  season_id: number | null;
  team_id: number | null;
  matches_played: number;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  minutes_played: number;
  saves: number;
  created_at: string;
  updated_at: string;
  player?: PlayerModel;
  season?: SeasonModel;
  team?: TeamModel;
}

export interface PlayerSeasonStatsCreateInput {
  stat_id?: number;
  player_id?: number | null;
  season_id?: number | null;
  team_id?: number | null;
  matches_played?: number;
  goals?: number;
  assists?: number;
  yellow_cards?: number;
  red_cards?: number;
  minutes_played?: number;
  saves?: number;
  created_at?: string;
  updated_at?: string;
  player?: PlayerCreateInput;
  season?: SeasonCreateInput;
  team?: TeamCreateInput;
}

export type PlayerSeasonStatsUpdateInput = Partial<PlayerSeasonStatsCreateInput>;

