import { PlayerModel, PlayerCreateInput } from "./player";
import { SeasonModel, SeasonCreateInput } from "./season";

export interface player_positionsModel {
  player_position_id: number;
  player_id: number;
  position: string;
  season_id: number | null;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  players?: PlayerModel;
  seasons?: SeasonModel;
}

export interface player_positionsCreateInput {
  player_position_id?: number;
  player_id?: number;
  position: string;
  season_id?: number | null;
  start_date: string;
  end_date?: string | null;
  created_at?: string;
  updated_at?: string;
  players?: PlayerCreateInput;
  seasons?: SeasonCreateInput;
}

export type player_positionsUpdateInput = Partial<player_positionsCreateInput>;

