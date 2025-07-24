import { MatchModel, MatchCreateInput } from "./match";
import { player_positionsModel, player_positionsCreateInput } from "./player_positions";
import { PlayerSeasonStatsModel, PlayerSeasonStatsCreateInput } from "./player-season-stats";
import { PlayerTeamHistoryModel, PlayerTeamHistoryCreateInput } from "./player-team-history";
import { StandingModel, StandingCreateInput } from "./standing";
import { TeamSeasonStatsModel, TeamSeasonStatsCreateInput } from "./team-season-stats";
import { TeamSeasonModel, TeamSeasonCreateInput } from "./team-season";

export interface SeasonModel {
  season_id: number;
  season_name: string;
  year: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  matches?: MatchModel[];
  player_positions?: player_positionsModel[];
  player_season_stats?: PlayerSeasonStatsModel[];
  player_team_history?: PlayerTeamHistoryModel[];
  standings?: StandingModel[];
  team_season_stats?: TeamSeasonStatsModel[];
  team_seasons?: TeamSeasonModel[];
}

export interface SeasonCreateInput {
  season_id?: number;
  season_name: string;
  year: number;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string;
  updated_at?: string;
  matches?: MatchCreateInput[];
  player_positions?: player_positionsCreateInput[];
  player_season_stats?: PlayerSeasonStatsCreateInput[];
  player_team_history?: PlayerTeamHistoryCreateInput[];
  standings?: StandingCreateInput[];
  team_season_stats?: TeamSeasonStatsCreateInput[];
  team_seasons?: TeamSeasonCreateInput[];
}

export type SeasonUpdateInput = Partial<SeasonCreateInput>;

