import { PlayerMatchStatsModel, PlayerMatchStatsCreateInput } from "./player-match-stats";
import { MatchModel, MatchCreateInput } from "./match";
import { PlayerModel, PlayerCreateInput } from "./player";

export interface GoalModel {
  goal_id: number;
  match_id: number;
  player_id: number;
  goal_time: number | null;
  goal_type: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  player_match_stats?: PlayerMatchStatsModel;
  match?: MatchModel;
  player?: PlayerModel;
}

export interface GoalCreateInput {
  goal_id?: number;
  match_id?: number;
  player_id?: number;
  goal_time?: number | null;
  goal_type?: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  player_match_stats?: PlayerMatchStatsCreateInput;
  match?: MatchCreateInput;
  player?: PlayerCreateInput;
}

export type GoalUpdateInput = Partial<GoalCreateInput>;

