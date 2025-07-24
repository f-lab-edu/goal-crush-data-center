import { PlayerModel, PlayerCreateInput } from "./player";
import { MatchModel, MatchCreateInput } from "./match";
import { TeamModel, TeamCreateInput } from "./team";

export interface PenaltyShootoutDetailModel {
  penalty_detail_id: number;
  match_id: number;
  team_id: number;
  goalkeeper_id: number | null;
  kicker_order: number;
  kicker_id: number;
  is_successful: boolean;
  kick_description: string | null;
  created_at: string;
  goalkeeper?: PlayerModel;
  kicker?: PlayerModel;
  match?: MatchModel;
  team?: TeamModel;
}

export interface PenaltyShootoutDetailCreateInput {
  penalty_detail_id?: number;
  match_id?: number;
  team_id?: number;
  goalkeeper_id?: number | null;
  kicker_order: number;
  kicker_id?: number;
  is_successful: boolean;
  kick_description?: string | null;
  created_at?: string;
  goalkeeper?: PlayerCreateInput;
  kicker?: PlayerCreateInput;
  match?: MatchCreateInput;
  team?: TeamCreateInput;
}

export type PenaltyShootoutDetailUpdateInput = Partial<PenaltyShootoutDetailCreateInput>;

