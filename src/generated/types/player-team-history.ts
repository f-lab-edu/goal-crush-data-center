import { PlayerModel, PlayerCreateInput } from "./player";
import { SeasonModel, SeasonCreateInput } from "./season";
import { TeamModel, TeamCreateInput } from "./team";

export interface PlayerTeamHistoryModel {
  history_id: number;
  player_id: number | null;
  team_id: number | null;
  season_id: number | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  player?: PlayerModel;
  seasons?: SeasonModel;
  team?: TeamModel;
}

export interface PlayerTeamHistoryCreateInput {
  history_id?: number;
  player_id?: number | null;
  team_id?: number | null;
  season_id?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  is_active?: boolean;
  created_at?: string;
  player?: PlayerCreateInput;
  seasons?: SeasonCreateInput;
  team?: TeamCreateInput;
}

export type PlayerTeamHistoryUpdateInput = Partial<PlayerTeamHistoryCreateInput>;

