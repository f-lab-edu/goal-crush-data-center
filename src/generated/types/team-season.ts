import { SeasonModel, SeasonCreateInput } from "./season";
import { TeamModel, TeamCreateInput } from "./team";

export interface TeamSeasonModel {
  team_season_id: number;
  team_id: number | null;
  season_id: number | null;
  is_active: boolean;
  created_at: string;
  season?: SeasonModel;
  team?: TeamModel;
}

export interface TeamSeasonCreateInput {
  team_season_id?: number;
  team_id?: number | null;
  season_id?: number | null;
  is_active?: boolean;
  created_at?: string;
  season?: SeasonCreateInput;
  team?: TeamCreateInput;
}

export type TeamSeasonUpdateInput = Partial<TeamSeasonCreateInput>;

