import { GoalModel, GoalCreateInput } from "./goal";
import { MatchModel, MatchCreateInput } from "./match";
import { PlayerModel, PlayerCreateInput } from "./player";
import { TeamModel, TeamCreateInput } from "./team";

export interface PlayerMatchStatsModel {
  stat_id: number;
  match_id: number | null;
  player_id: number | null;
  team_id: number | null;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  minutes_played: number;
  saves: number;
  created_at: string;
  position: string | null;
  updated_at: string;
  Goal?: GoalModel[];
  match?: MatchModel;
  player?: PlayerModel;
  team?: TeamModel;
}

export interface PlayerMatchStatsCreateInput {
  stat_id?: number;
  match_id?: number | null;
  player_id?: number | null;
  team_id?: number | null;
  goals?: number;
  assists?: number;
  yellow_cards?: number;
  red_cards?: number;
  minutes_played?: number;
  saves?: number;
  created_at?: string;
  position?: string | null;
  updated_at?: string;
  Goal?: GoalCreateInput[];
  match?: MatchCreateInput;
  player?: PlayerCreateInput;
  team?: TeamCreateInput;
}

export type PlayerMatchStatsUpdateInput = Partial<PlayerMatchStatsCreateInput>;

