'use client';

import Link from 'next/link';
import React from 'react';

import { GoalWrapper } from '@/common/GoalWrapper';
import { Badge } from '@/components/ui/badge';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';
import type { Assist, Goal } from '@/lib/types';
import { MatchWithTeams } from '@/lib/types/database';

import {
  getLastMatchLineupsPrisma,
  getMatchAssistsPrisma,
  getMatchGoalsPrisma,
  getMatchLineupsPrisma,
  getPredictedMatchLineupsPrisma,
  getSeasonPlayersPrisma,
} from '../../api-prisma';
import { getPositionColor, getPositionText } from '../../lib/matchUtils';
import LineupsEmpty from './LineupsEmpty';
import LineupsSkeleton from './LineupsSkeleton';

// Lineup player type definition
interface LineupPlayer {
  player_id: number;
  player_name: string;
  jersey_number: number | null;
  position: string;
  participation_status: string;
  goals: number;
  yellow_cards: number;
  red_cards: number;
  card_type: 'none' | 'yellow' | 'red_direct' | 'red_accumulated';
  assists?: number;
  own_goals?: number;
  regular_goals?: number;
  // Optional fields for different data sources
  stat_id?: number;
  match_id?: number;
  team_id?: number;
}

interface TeamLineupsSectionProps {
  match: MatchWithTeams;
  className?: string;
}

function TeamLineupsSectionInner({
  match,
  className = '',
}: TeamLineupsSectionProps) {
  const { data: actualLineups = {} } = useGoalSuspenseQuery(
    getMatchLineupsPrisma,
    [match.match_id]
  );
  const actualEmpty =
    Object.keys(actualLineups).length === 0 ||
    Object.values(actualLineups).every(
      (arr: unknown) => !Array.isArray(arr) || arr.length === 0
    );

  const seasonName = match.season?.season_name;
  const isSeasonFirstMatch = seasonName && seasonName.includes('시즌');

  const { data: predictedLineups = {} } = useGoalSuspenseQuery(
    getPredictedMatchLineupsPrisma,
    [match.match_id]
  );

  const { data: seasonPlayers = [] } = useGoalSuspenseQuery(
    getSeasonPlayersPrisma,
    [match.season?.season_id || 0, match.home_team_id || 0]
  );

  const { data: awaySeasonPlayers = [] } = useGoalSuspenseQuery(
    getSeasonPlayersPrisma,
    [match.season?.season_id || 0, match.away_team_id || 0]
  );

  const { data: lastMatchLineups = [] } = useGoalSuspenseQuery(
    getLastMatchLineupsPrisma,
    [match.home_team_id || 0, match.match_date]
  );

  const { data: awayLastMatchLineups = [] } = useGoalSuspenseQuery(
    getLastMatchLineupsPrisma,
    [match.away_team_id || 0, match.match_date]
  );

  let lineups: Record<string, LineupPlayer[]> = actualLineups;
  let isPredicted = false;

  if (actualEmpty) {
    if (
      isSeasonFirstMatch &&
      (lastMatchLineups.length > 0 || awayLastMatchLineups.length > 0)
    ) {
      const homeTeamKey = `${match.match_id}_${match.home_team_id}`;
      const awayTeamKey = `${match.match_id}_${match.away_team_id}`;

      lineups = {
        [homeTeamKey]: lastMatchLineups.map((p) => ({
          ...p,
          participation_status: 'starting' as const,
          goals: 0,
          yellow_cards: 0,
          red_cards: 0,
          card_type: 'none' as const,
          assists: 0,
        })) as LineupPlayer[],
        [awayTeamKey]: awayLastMatchLineups.map((p) => ({
          ...p,
          participation_status: 'starting' as const,
          goals: 0,
          yellow_cards: 0,
          red_cards: 0,
          card_type: 'none' as const,
          assists: 0,
        })) as LineupPlayer[],
      };
      isPredicted = true;
    } else if (seasonPlayers.length > 0 || awaySeasonPlayers.length > 0) {
      const homeTeamKey = `${match.match_id}_${match.home_team_id}`;
      const awayTeamKey = `${match.match_id}_${match.away_team_id}`;

      lineups = {
        [homeTeamKey]: seasonPlayers.map((p) => ({
          ...p,
          participation_status: 'starting' as const,
          goals: 0,
          yellow_cards: 0,
          red_cards: 0,
          card_type: 'none' as const,
          assists: 0,
        })) as LineupPlayer[],
        [awayTeamKey]: awaySeasonPlayers.map((p) => ({
          ...p,
          participation_status: 'starting' as const,
          goals: 0,
          yellow_cards: 0,
          red_cards: 0,
          card_type: 'none' as const,
          assists: 0,
        })) as LineupPlayer[],
      };
      isPredicted = true;
    } else {
      lineups = predictedLineups as Record<string, LineupPlayer[]>;
      isPredicted = true;
    }
  }

  // Fetch assist data via Suspense Query
  const { data: assists = [] as Assist[] } = useGoalSuspenseQuery(
    getMatchAssistsPrisma,
    [match.match_id]
  );

  // Fetch goal data via Suspense Query
  const { data: goals = [] } = useGoalSuspenseQuery(getMatchGoalsPrisma, [
    match.match_id,
  ]);

  const homeTeamKey = `${match.match_id}_${match.home_team_id}`;
  const awayTeamKey = `${match.match_id}_${match.away_team_id}`;
  const homeLineups = lineups[homeTeamKey] || [];
  const awayLineups = lineups[awayTeamKey] || [];

  // Calculate number of assists per player
  const assistsByPlayer = assists.reduce(
    (acc, assist) => {
      const playerId = assist.player_id;
      acc[playerId] = (acc[playerId] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  // Calculate own goals per player
  const ownGoalsByPlayer = goals.reduce(
    (acc: Record<number, number>, goal: Goal) => {
      if (goal.goal_type === 'own_goal') {
        const playerId = goal.player_id;
        acc[playerId] = (acc[playerId] || 0) + 1;
      }
      return acc;
    },
    {} as Record<number, number>
  );

  // Add assist and goal info to lineup
  const addStatsToLineup = (lineup: LineupPlayer[]): LineupPlayer[] => {
    return lineup.map((player) => {
      const assists = assistsByPlayer[player.player_id] || 0;
      const own_goals = ownGoalsByPlayer[player.player_id] || 0;
      // 일반 골 = 전체 골 - 자책골
      const regular_goals = Math.max(0, (player.goals || 0) - own_goals);
      return {
        ...player,
        assists,
        own_goals,
        regular_goals,
      };
    });
  };

  const homeLineupWithStats = addStatsToLineup(homeLineups);
  const awayLineupWithStats = addStatsToLineup(awayLineups);

  // Resolve team colors (with defaults)
  const homeTeamPrimaryColor = match.home_team?.primary_color || '#000000';
  const awayTeamPrimaryColor = match.away_team?.primary_color || '#6B7280';
  const homeTeamSecondaryColor = match.home_team?.secondary_color || '#6B7280';
  const awayTeamSecondaryColor = match.away_team?.secondary_color || '#6B7280';

  // Sort players by position
  const sortByPosition = (players: LineupPlayer[]) => {
    const positionOrder = { FW: 1, MF: 2, DF: 3, GK: 4 };
    return players.sort((a, b) => {
      const aOrder =
        positionOrder[a.position as keyof typeof positionOrder] || 5;
      const bOrder =
        positionOrder[b.position as keyof typeof positionOrder] || 5;
      return aOrder - bOrder;
    });
  };

  return (
    <div className={`mt-4 pt-3 border-t border-gray-200 ${className}`}>
      <div className="mb-3 sm:mb-4 flex items-center justify-between">
        <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <span>👥 출전 선수</span>
          {isPredicted && (
            <Badge
              variant="emphasisOutline"
              className="text-[10px] px-2 py-0.5"
            >
              예상
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {homeLineups.length === 0 && awayLineups.length === 0 && (
          <LineupsEmpty className={className} />
        )}

        {(homeLineups.length > 0 || awayLineups.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
            {/* Home Team Players */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="text-sm font-semibold text-gray-800 mb-1 flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{
                    backgroundColor: homeTeamPrimaryColor,
                    border: `1px solid ${homeTeamSecondaryColor}`,
                  }}
                ></div>
                {match.home_team?.team_name}
              </div>
              {match.home_coach?.name && (
                <div className="text-[11px] text-gray-600 mb-2">
                  감독:{' '}
                  {typeof match.home_coach.coach_id === 'number' ? (
                    <Link
                      href={`/coaches/${match.home_coach.coach_id}`}
                      className="hover:underline"
                    >
                      {match.home_coach.name}
                    </Link>
                  ) : (
                    match.home_coach.name
                  )}
                </div>
              )}

              {/* Starters */}
              <div className="mb-3">
                <div className="text-xs text-gray-700 mb-2 font-medium">
                  ⭐ 선발
                </div>
                <div className="space-y-1">
                  {sortByPosition(
                    homeLineupWithStats.filter(
                      (player) => player.participation_status === 'starting'
                    )
                  ).map((player, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <Badge
                          variant="outline"
                          className={`${getPositionColor(player.position)} text-xs px-1 py-0 flex-shrink-0`}
                        >
                          {getPositionText(player.position)}
                        </Badge>
                        <div className="flex min-w-0 flex-1">
                          {typeof player.jersey_number === 'number' && (
                            <span
                              className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold rounded mr-1 flex-shrink-0 border"
                              style={{
                                backgroundColor: homeTeamPrimaryColor,
                                color: homeTeamSecondaryColor,
                                borderColor: homeTeamSecondaryColor,
                              }}
                            >
                              {player.jersey_number}
                            </span>
                          )}
                          <Link
                            href={`/players/${player.player_id}`}
                            className="font-medium text-gray-900 break-words hover:underline"
                          >
                            {player.player_name}
                          </Link>
                          <div className="flex ml-2">
                            {!!player.regular_goals &&
                              player.regular_goals > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-800"
                                >
                                  ⚽ {player.regular_goals}
                                </Badge>
                              )}
                            {!!player.own_goals && player.own_goals > 0 && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-800"
                              >
                                🤦‍♀️ {player.own_goals}
                              </Badge>
                            )}
                            {!!player.assists && player.assists > 0 && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800"
                              >
                                🎯 {player.assists}
                              </Badge>
                            )}
                            {player.yellow_cards > 0 && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800"
                              >
                                🟨 {player.yellow_cards}
                              </Badge>
                            )}
                            {player.card_type === 'red_direct' && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-1.5 py-0.5 bg-[#ffefeb] text-[#ff4800] border-[#ff4800]"
                              >
                                🟥 다이렉트
                              </Badge>
                            )}
                            {player.card_type === 'red_accumulated' && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-1.5 py-0.5 bg-[#ffefeb] text-[#ff4800] border-[#ff4800]"
                              >
                                🟥 누적
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Substitutes */}
              {homeLineupWithStats.filter(
                (player) => player.participation_status === 'substitute'
              ).length > 0 && (
                <div className="mb-3 sm:mb-4">
                  <div className="text-xs text-gray-700 mb-2 font-medium">
                    🔄 교체 출전
                  </div>
                  <div className="space-y-1">
                    {sortByPosition(
                      homeLineupWithStats.filter(
                        (player) => player.participation_status === 'substitute'
                      )
                    ).map((player, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <Badge
                            variant="outline"
                            className={`${getPositionColor(player.position)} text-xs px-1 py-0 opacity-80 flex-shrink-0`}
                          >
                            {getPositionText(player.position)}
                          </Badge>
                          <div className="flex min-w-0 flex-1">
                            {typeof player.jersey_number === 'number' && (
                              <span
                                className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold rounded mr-1 flex-shrink-0 border"
                                style={{
                                  backgroundColor: homeTeamPrimaryColor,
                                  color: homeTeamSecondaryColor,
                                  borderColor: homeTeamSecondaryColor,
                                }}
                              >
                                {player.jersey_number}
                              </span>
                            )}
                            <Link
                              href={`/players/${player.player_id}`}
                              className="font-medium text-gray-800 break-words hover:underline"
                            >
                              {player.player_name}
                            </Link>
                            <div className="flex ml-2">
                              {!!player.regular_goals &&
                                player.regular_goals > 0 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-800"
                                  >
                                    ⚽ {player.regular_goals}
                                  </Badge>
                                )}
                              {!!player.own_goals && player.own_goals > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-800"
                                >
                                  🤦‍♀️ {player.own_goals}
                                </Badge>
                              )}
                              {!!player.assists && player.assists > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800"
                                >
                                  🎯 {player.assists}
                                </Badge>
                              )}
                              {player.yellow_cards > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800"
                                >
                                  🟨 {player.yellow_cards}
                                </Badge>
                              )}
                              {player.card_type === 'red_direct' && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0.5 bg-[#ffefeb] text-[#ff4800] border-[#ff4800]"
                                >
                                  🟥 다이렉트
                                </Badge>
                              )}
                              {player.card_type === 'red_accumulated' && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0.5 bg-[#ffefeb] text-[#ff4800] border-[#ff4800]"
                                >
                                  🟥 누적
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bench */}
              {homeLineupWithStats.filter(
                (player) => player.participation_status === 'bench'
              ).length > 0 && (
                <div>
                  <div className="text-xs text-gray-700 mb-2 font-medium">
                    🪑 벤치
                  </div>
                  <div className="space-y-1">
                    {sortByPosition(
                      homeLineupWithStats.filter(
                        (player) => player.participation_status === 'bench'
                      )
                    ).map((player, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <Badge
                            variant="outline"
                            className={`${getPositionColor(player.position)} text-xs px-1 py-0 opacity-60 flex-shrink-0`}
                          >
                            {getPositionText(player.position)}
                          </Badge>
                          <span className="text-gray-600 text-xs break-words">
                            {typeof player.jersey_number === 'number' && (
                              <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold text-gray-600 bg-gray-300 rounded mr-1 flex-shrink-0">
                                {player.jersey_number}
                              </span>
                            )}
                            <Link
                              href={`/players/${player.player_id}`}
                              className="hover:underline"
                            >
                              {player.player_name}
                            </Link>
                          </span>
                        </div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Away Team Players */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="text-sm font-semibold text-gray-800 mb-1 flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{
                    backgroundColor: awayTeamPrimaryColor,
                    border: `1px solid ${awayTeamSecondaryColor}`,
                  }}
                ></div>
                {match.away_team?.team_name}
              </div>
              {match.away_coach?.name && (
                <div className="text-[11px] text-gray-600 mb-2">
                  감독:{' '}
                  {typeof match.away_coach.coach_id === 'number' ? (
                    <Link
                      href={`/coaches/${match.away_coach.coach_id}`}
                      className="hover:underline"
                    >
                      {match.away_coach.name}
                    </Link>
                  ) : (
                    match.away_coach.name
                  )}
                </div>
              )}

              {/* Starters */}
              <div className="mb-3">
                <div className="text-xs text-gray-700 mb-2 font-medium">
                  ⭐ 선발
                </div>
                <div className="space-y-1">
                  {sortByPosition(
                    awayLineupWithStats.filter(
                      (player) => player.participation_status === 'starting'
                    )
                  ).map((player, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <Badge
                          variant="outline"
                          className={`${getPositionColor(player.position)} text-xs px-1 py-0 flex-shrink-0`}
                        >
                          {getPositionText(player.position)}
                        </Badge>
                        <div className="flex min-w-0 flex-1">
                          {typeof player.jersey_number === 'number' && (
                            <span
                              className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold rounded mr-1 flex-shrink-0 border"
                              style={{
                                backgroundColor: awayTeamPrimaryColor,
                                color: awayTeamSecondaryColor,
                                borderColor: awayTeamSecondaryColor,
                              }}
                            >
                              {player.jersey_number}
                            </span>
                          )}
                          <Link
                            href={`/players/${player.player_id}`}
                            className="font-medium text-gray-900 break-words hover:underline"
                          >
                            {player.player_name}
                          </Link>
                          <div className="flex ml-2">
                            {!!player.regular_goals &&
                              player.regular_goals > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-800"
                                >
                                  ⚽ {player.regular_goals}
                                </Badge>
                              )}
                            {!!player.own_goals && player.own_goals > 0 && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-800"
                              >
                                🤦‍♀️ {player.own_goals}
                              </Badge>
                            )}
                            {!!player.assists && player.assists > 0 && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800"
                              >
                                🎯 {player.assists}
                              </Badge>
                            )}
                            {player.yellow_cards > 0 && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800"
                              >
                                🟨 {player.yellow_cards}
                              </Badge>
                            )}
                            {player.card_type === 'red_direct' && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-1.5 py-0.5 bg-[#ffefeb] text-[#ff4800] border-[#ff4800]"
                              >
                                🟥 다이렉트
                              </Badge>
                            )}
                            {player.card_type === 'red_accumulated' && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-1.5 py-0.5 bg-[#ffefeb] text-[#ff4800] border-[#ff4800]"
                              >
                                🟥 누적
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Substitutes */}
              {awayLineupWithStats.filter(
                (player) => player.participation_status === 'substitute'
              ).length > 0 && (
                <div className="mb-3 sm:mb-4">
                  <div className="text-xs text-gray-700 mb-2 font-medium">
                    🔄 교체 출전
                  </div>
                  <div className="space-y-1">
                    {sortByPosition(
                      awayLineupWithStats.filter(
                        (player) => player.participation_status === 'substitute'
                      )
                    ).map((player, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <Badge
                            variant="outline"
                            className={`${getPositionColor(player.position)} text-xs px-1 py-0 opacity-80 flex-shrink-0`}
                          >
                            {getPositionText(player.position)}
                          </Badge>
                          <div className="flex min-w-0 flex-1">
                            {typeof player.jersey_number === 'number' && (
                              <span
                                className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold rounded mr-1 flex-shrink-0 border"
                                style={{
                                  backgroundColor: awayTeamPrimaryColor,
                                  color: awayTeamSecondaryColor,
                                  borderColor: awayTeamSecondaryColor,
                                }}
                              >
                                {player.jersey_number}
                              </span>
                            )}
                            <Link
                              href={`/players/${player.player_id}`}
                              className="font-medium text-gray-800 break-words hover:underline"
                            >
                              {player.player_name}
                            </Link>
                            <div className="flex ml-2">
                              {!!player.regular_goals &&
                                player.regular_goals > 0 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-800"
                                  >
                                    ⚽ {player.regular_goals}
                                  </Badge>
                                )}
                              {!!player.own_goals && player.own_goals > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-800"
                                >
                                  🤦‍♀️ {player.own_goals}
                                </Badge>
                              )}
                              {!!player.assists && player.assists > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800"
                                >
                                  🎯 {player.assists}
                                </Badge>
                              )}
                              {player.yellow_cards > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800"
                                >
                                  🟨 {player.yellow_cards}
                                </Badge>
                              )}
                              {player.card_type === 'red_direct' && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0.5 bg-[#ffefeb] text-[#ff4800] border-[#ff4800]"
                                >
                                  🟥 다이렉트
                                </Badge>
                              )}
                              {player.card_type === 'red_accumulated' && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0.5 bg-[#ffefeb] text-[#ff4800] border-[#ff4800]"
                                >
                                  🟥 누적
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bench */}
              {awayLineupWithStats.filter(
                (player) => player.participation_status === 'bench'
              ).length > 0 && (
                <div>
                  <div className="text-xs text-gray-700 mb-2 font-medium">
                    🪑 벤치
                  </div>
                  <div className="space-y-1">
                    {sortByPosition(
                      awayLineupWithStats.filter(
                        (player) => player.participation_status === 'bench'
                      )
                    ).map((player, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <Badge
                            variant="outline"
                            className={`${getPositionColor(player.position)} text-xs px-1 py-0 opacity-60 flex-shrink-0`}
                          >
                            {getPositionText(player.position)}
                          </Badge>
                          <span className="text-gray-600 text-xs break-words">
                            {typeof player.jersey_number === 'number' && (
                              <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold text-gray-600 bg-gray-300 rounded mr-1 flex-shrink-0">
                                {player.jersey_number}
                              </span>
                            )}
                            <Link
                              href={`/players/${player.player_id}`}
                              className="hover:underline"
                            >
                              {player.player_name}
                            </Link>
                          </span>
                        </div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const TeamLineupsSection: React.FC<TeamLineupsSectionProps> = ({
  match,
  className = '',
}) => {
  return (
    <GoalWrapper fallback={<LineupsSkeleton className={className} />}>
      <TeamLineupsSectionInner match={match} className={className} />
    </GoalWrapper>
  );
};

export default TeamLineupsSection;
