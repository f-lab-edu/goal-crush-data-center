import { GoalModel, GoalCreateInput } from "./goal";
import { TeamModel, TeamCreateInput } from "./team";
import { SeasonModel, SeasonCreateInput } from "./season";
import { PenaltyShootoutDetailModel, PenaltyShootoutDetailCreateInput } from "./penalty-shootout-detail";
import { PlayerMatchStatsModel, PlayerMatchStatsCreateInput } from "./player-match-stats";
import { SubstitutionModel, SubstitutionCreateInput } from "./substitution";
import { MatchWithTeams } from "@/lib/types";

export interface MatchModel {
  match_id: number;
  season_id: number | null;
  home_team_id: number | null;
  away_team_id: number | null;
  match_date: string;
  location: string | null;
  home_score: number | null;
  away_score: number | null;
  status: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  penalty_home_score: number | null;
  penalty_away_score: number | null;
  goals?: GoalModel[];
  away_team?: TeamModel;
  home_team?: TeamModel;
  season?: SeasonModel;
  penalty_shootout_details?: PenaltyShootoutDetailModel[];
  player_match_stats?: PlayerMatchStatsModel[];
  substitutions?: SubstitutionModel[];
}

export interface MatchCreateInput {
  match_id?: number;
  season_id?: number | null;
  home_team_id?: number | null;
  away_team_id?: number | null;
  match_date: string;
  location?: string | null;
  home_score?: number | null;
  away_score?: number | null;
  status?: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  penalty_home_score?: number | null;
  penalty_away_score?: number | null;
  goals?: GoalCreateInput[];
  away_team?: TeamCreateInput;
  home_team?: TeamCreateInput;
  season?: SeasonCreateInput;
  penalty_shootout_details?: PenaltyShootoutDetailCreateInput[];
  player_match_stats?: PlayerMatchStatsCreateInput[];
  substitutions?: SubstitutionCreateInput[];
}

export type MatchUpdateInput = Partial<MatchCreateInput>;


// export function toDTO(match: MatchWithTeams): MatchModel {
//   return {
//     ...match,
//     match_date: new Date(match.match_date),


//   };
// }