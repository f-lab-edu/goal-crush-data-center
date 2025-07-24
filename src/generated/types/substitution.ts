import { MatchModel, MatchCreateInput } from "./match";
import { PlayerModel, PlayerCreateInput } from "./player";
import { TeamModel, TeamCreateInput } from "./team";

export interface SubstitutionModel {
  substitution_id: number;
  match_id: number;
  player_in_id: number;
  team_id: number;
  created_at: string;
  updated_at: string;
  player_out_id: number | null;
  substitution_time: number | null;
  substitution_reason: string | null;
  match?: MatchModel;
  player_in?: PlayerModel;
  player_out?: PlayerModel;
  team?: TeamModel;
}

export interface SubstitutionCreateInput {
  substitution_id?: number;
  match_id?: number;
  player_in_id?: number;
  team_id?: number;
  created_at?: string;
  updated_at?: string;
  player_out_id?: number | null;
  substitution_time?: number | null;
  substitution_reason?: string | null;
  match?: MatchCreateInput;
  player_in?: PlayerCreateInput;
  player_out?: PlayerCreateInput;
  team?: TeamCreateInput;
}

export type SubstitutionUpdateInput = Partial<SubstitutionCreateInput>;

