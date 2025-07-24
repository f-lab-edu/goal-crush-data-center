import { MatchModel, MatchCreateInput } from "./match";
import { PenaltyShootoutDetailModel, PenaltyShootoutDetailCreateInput } from "./penalty-shootout-detail";
import { PlayerMatchStatsModel, PlayerMatchStatsCreateInput } from "./player-match-stats";
import { PlayerSeasonStatsModel, PlayerSeasonStatsCreateInput } from "./player-season-stats";
import { PlayerTeamHistoryModel, PlayerTeamHistoryCreateInput } from "./player-team-history";
import { StandingModel, StandingCreateInput } from "./standing";
import { SubstitutionModel, SubstitutionCreateInput } from "./substitution";
import { TeamSeasonStatsModel, TeamSeasonStatsCreateInput } from "./team-season-stats";
import { TeamSeasonModel, TeamSeasonCreateInput } from "./team-season";

export interface TeamModel {
  team_id: number;
  team_name: string;
  team_logo_url: string | null;
  founded_year: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  away_matches?: MatchModel[];
  home_matches?: MatchModel[];
  penalty_shootout_details?: PenaltyShootoutDetailModel[];
  player_match_stats?: PlayerMatchStatsModel[];
  player_season_stats?: PlayerSeasonStatsModel[];
  player_team_history?: PlayerTeamHistoryModel[];
  standings?: StandingModel[];
  substitutions?: SubstitutionModel[];
  team_season_stats?: TeamSeasonStatsModel[];
  team_seasons?: TeamSeasonModel[];
}

export interface TeamCreateInput {
  team_id?: number;
  team_name: string;
  team_logo_url?: string | null;
  founded_year?: number | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  away_matches?: MatchCreateInput[];
  home_matches?: MatchCreateInput[];
  penalty_shootout_details?: PenaltyShootoutDetailCreateInput[];
  player_match_stats?: PlayerMatchStatsCreateInput[];
  player_season_stats?: PlayerSeasonStatsCreateInput[];
  player_team_history?: PlayerTeamHistoryCreateInput[];
  standings?: StandingCreateInput[];
  substitutions?: SubstitutionCreateInput[];
  team_season_stats?: TeamSeasonStatsCreateInput[];
  team_seasons?: TeamSeasonCreateInput[];
}

export type TeamUpdateInput = Partial<TeamCreateInput>;

