'use client';

import React from 'react';

import { getStandingsWithTeam } from '@/features/stats/api';
import StandingsTable from '@/features/stats/components/StandingsTable';
import { useGoalQuery } from '@/hooks/useGoalQuery';
import { MatchWithTeams } from '@/lib/types';

import { getMatchesBySeasonId } from '../api';
import MatchCard from './MatchCard/MatchCard';
import SeasonSummary from './SeasonSummary';

interface Season1ResultsProps {
  className?: string;
}

const Season1Results: React.FC<Season1ResultsProps> = ({ className }) => {
  // 매치 목록만 가져오기 - 나머지는 MatchCard 처리
  const {
    data: matches = [],
    isLoading: matchesLoading,
    error: matchesError,
  } = useGoalQuery(getMatchesBySeasonId, [4]); // 시즌 1은 season_id = 4

  // standings 데이터 fetch
  const {
    data: standings = [],
    isLoading: standingsLoading,
    error: standingsError,
  } = useGoalQuery(getStandingsWithTeam, [4]);

  const getMatchGroup = (match: MatchWithTeams) => {
    const description = match.description || '';

    // description에서 그룹 정보 추출
    if (description.includes('조별리그 A조')) {
      return '조별리그 A조';
    } else if (description.includes('조별리그 B조')) {
      return '조별리그 B조';
    } else if (description.includes('토너먼트 4강 1경기')) {
      return '4강 1경기';
    } else if (description.includes('토너먼트 4강 2경기')) {
      return '4강 2경기';
    } else if (description.includes('토너먼트 3·4위전')) {
      return '3·4위전';
    } else if (description.includes('토너먼트 결승전')) {
      return '결승전';
    } else if (description.includes('토너먼트')) {
      return '토너먼트';
    } else if (description.includes('조별리그')) {
      return '조별리그';
    }

    // fallback: description이 없거나 패턴이 맞지 않는 경우 기본값
    return '기타 경기';
  };

  if (matchesLoading) {
    return (
      <div className={`p-6 ${className || ''}`}>
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">경기 결과를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (matchesError) {
    return (
      <div className={`p-6 ${className || ''}`}>
        <div className="flex items-center justify-center h-32">
          <div className="text-red-500">
            오류 발생:{' '}
            {matchesError instanceof Error
              ? matchesError.message
              : 'Failed to fetch data'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className || ''}`}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          골때리는 그녀들 시즌 1
        </h1>
        <p className="text-gray-600">2021년</p>
      </div>

      {/* 경기가 없는 경우 안내 메시지 */}
      {matches.length === 0 ? (
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
            시즌 1 경기 데이터가 아직 없습니다
          </h3>
          <p className="text-gray-500">
            시즌 1 경기 데이터가 입력되면 여기에 표시됩니다.
          </p>
        </div>
      ) : (
        <>
          {/* 경기 목록을 그룹별로 정렬하여 표시 */}
          <div className="space-y-8">
            {/* 그룹별로 경기를 분류 */}
            {Object.entries(
              matches.reduce(
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
                // 정렬 순서: 조별리그 A조 → 조별리그 B조 → 4강 1경기 → 4강 2경기 → 3·4위전 → 결승전 → 토너먼트 → 기타 경기
                const order = [
                  '조별리그 A조',
                  '조별리그 B조',
                  '4강 1경기',
                  '4강 2경기',
                  '3·4위전',
                  '결승전',
                  '토너먼트',
                  '조별리그',
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
          <SeasonSummary seasonId={4} seasonName="시즌 1" className="mt-8" />
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

export default Season1Results;
