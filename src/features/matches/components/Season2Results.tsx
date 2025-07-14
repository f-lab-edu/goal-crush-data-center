'use client';

import React from 'react';

import { getMatchesBySeasonId } from '@/features/matches/api';
import { MatchCard } from '@/features/matches/components/MatchCard';
import SeasonSummary from '@/features/matches/components/SeasonSummary';
import { getStandingsWithTeam } from '@/features/stats/api';
import StandingsTable from '@/features/stats/components/StandingsTable';
import { useGoalQuery } from '@/hooks/useGoalQuery';
import { MatchWithTeams } from '@/lib/types';

interface Season2ResultsProps {
  className?: string;
}

const Season2Results: React.FC<Season2ResultsProps> = ({ className }) => {
  const {
    data: matches,
    isLoading,
    error,
  } = useGoalQuery(
    getMatchesBySeasonId,
    [5] // 시즌 2는 season_id = 5
  );

  // standings 데이터 fetch
  const {
    data: standings = [],
    isLoading: standingsLoading,
    error: standingsError,
  } = useGoalQuery(getStandingsWithTeam, [5]);

  const getMatchGroup = (match: MatchWithTeams) => {
    const description = match.description || '';

    // description에서 그룹 정보 추출
    if (description.includes('1라운드')) {
      return '1라운드';
    } else if (description.includes('2라운드')) {
      return '2라운드';
    } else if (description.includes('3라운드')) {
      return '3라운드';
    } else if (description.includes('4라운드')) {
      return '4라운드';
    } else if (description.includes('5라운드')) {
      return '5라운드 (최종)';
    } else if (description.includes('리그')) {
      return '리그전';
    }

    // fallback: description이 없거나 패턴이 맞지 않는 경우 기본값
    return '기타 경기';
  };

  if (isLoading) {
    return (
      <div className={`p-6 ${className || ''}`}>
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">경기 결과를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${className || ''}`}>
        <div className="flex items-center justify-center h-32">
          <div className="text-red-500">
            오류 발생:{' '}
            {error instanceof Error ? error.message : 'Failed to fetch data'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className || ''}`}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          골때리는 그녀들 시즌 2
        </h1>
        <p className="text-gray-600">2021년 10월 13일 ~ 2022년 9월 14일</p>
      </div>

      {/* 경기가 없는 경우 안내 메시지 */}
      {!matches || matches.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            시즌 2 경기 데이터가 아직 없습니다
          </h3>
          <p className="text-gray-500">
            시즌 2 경기 데이터가 입력되면 여기에 표시됩니다.
          </p>
        </div>
      ) : (
        <>
          {/* 경기 목록을 그룹별로 정렬하여 표시 */}
          <div className="space-y-8">
            {/* 그룹별로 경기를 분류 */}
            {Object.entries(
              (matches || []).reduce(
                (groups, match) => {
                  const group = getMatchGroup(match);
                  if (!groups[group]) {
                    groups[group] = [];
                  }
                  groups[group].push(match);
                  return groups;
                },
                {} as Record<string, MatchWithTeams[]>
              )
            )
              .sort(([a], [b]) => {
                // 정렬 순서: 1라운드 → 2라운드 → 3라운드 → 4라운드 → 5라운드 (최종) → 리그전 → 기타 경기
                const order = [
                  '1라운드',
                  '2라운드',
                  '3라운드',
                  '4라운드',
                  '5라운드 (최종)',
                  '리그전',
                  '기타 경기',
                ];
                const indexA = order.indexOf(a);
                const indexB = order.indexOf(b);
                // 순서에 없는 항목은 맨 뒤로
                return (
                  (indexA === -1 ? 999 : indexA) -
                  (indexB === -1 ? 999 : indexB)
                );
              })
              .map(([groupName, groupMatches]) => (
                <div key={groupName}>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {groupName}
                    </h2>
                    <div className="h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                    {groupMatches
                      .sort(
                        (a, b) =>
                          new Date(a.match_date).getTime() -
                          new Date(b.match_date).getTime()
                      )
                      .map((match) => (
                        <MatchCard
                          key={match.match_id}
                          matchId={match.match_id}
                        />
                      ))}
                  </div>
                </div>
              ))}
          </div>

          {/* Season Summary */}
          <SeasonSummary seasonId={5} seasonName="시즌 2" className="mt-8" />
          {/* standings 테이블 노출 */}
          <div className="mt-8">
            {standingsLoading ? (
              <div className="text-center text-gray-500">
                순위표를 불러오는 중...
              </div>
            ) : standingsError ? (
              <div className="text-center text-red-500">
                순위표를 불러오지 못했습니다.
              </div>
            ) : (
              <StandingsTable standings={standings} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Season2Results;
