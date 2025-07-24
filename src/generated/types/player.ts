import { GoalModel, GoalCreateInput } from "./goal";
import { PenaltyShootoutDetailModel, PenaltyShootoutDetailCreateInput } from "./penalty-shootout-detail";
import { PlayerMatchStatsModel, PlayerMatchStatsCreateInput } from "./player-match-stats";
import { player_positionsModel, player_positionsCreateInput } from "./player_positions";
import { PlayerSeasonStatsModel, PlayerSeasonStatsCreateInput } from "./player-season-stats";
import { PlayerTeamHistoryModel, PlayerTeamHistoryCreateInput } from "./player-team-history";
import { SubstitutionModel, SubstitutionCreateInput } from "./substitution";

export interface PlayerModel {
  player_id: number;
  name: string;
  birth_date: string | null;
  nationality: string | null;
  height_cm: number | null;
  profile_image_url: string | null;
  created_at: string;
  updated_at: string;
  jersey_number: number | null;
  goals?: GoalModel[];
  penalty_goalkeeping?: PenaltyShootoutDetailModel[];
  penalty_kicks?: PenaltyShootoutDetailModel[];
  player_match_stats?: PlayerMatchStatsModel[];
  player_positions?: player_positionsModel[];
  player_season_stats?: PlayerSeasonStatsModel[];
  player_team_history?: PlayerTeamHistoryModel[];
  substitutions_in?: SubstitutionModel[];
  substitutions_out?: SubstitutionModel[];
}

export interface PlayerCreateInput {
  player_id?: number;
  name: string;
  birth_date?: string | null;
  nationality?: string | null;
  height_cm?: number | null;
  profile_image_url?: string | null;
  created_at?: string;
  updated_at?: string;
  jersey_number?: number | null;
  goals?: GoalCreateInput[];
  penalty_goalkeeping?: PenaltyShootoutDetailCreateInput[];
  penalty_kicks?: PenaltyShootoutDetailCreateInput[];
  player_match_stats?: PlayerMatchStatsCreateInput[];
  player_positions?: player_positionsCreateInput[];
  player_season_stats?: PlayerSeasonStatsCreateInput[];
  player_team_history?: PlayerTeamHistoryCreateInput[];
  substitutions_in?: SubstitutionCreateInput[];
  substitutions_out?: SubstitutionCreateInput[];
}

export type PlayerUpdateInput = Partial<PlayerCreateInput>;

