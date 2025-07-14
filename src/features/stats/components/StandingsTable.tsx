'use client';

import { FC } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface StandingsTableProps {
  standings: Array<{
    position: number;
    team: { team_id: number; team_name: string };
    matches_played: number;
    wins: number;
    draws: number;
    losses: number;
    goals_for: number;
    goals_against: number;
    goal_difference: number;
    points: number;
  }>;
  className?: string;
}

function getRankEmoji(position: number) {
  switch (position) {
    case 1:
      return '🥇 1';
    case 2:
      return '🥈 2';
    case 3:
      return '🥉 3';
    default:
      return position;
  }
}

const StandingsTable: FC<StandingsTableProps> = ({ standings, className }) => {
  if (!standings || standings.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        순위표 데이터가 없습니다.
      </div>
    );
  }
  return (
    <div className={className}>
      <h3 className="text-lg font-bold mb-2">순위표</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>순위</TableHead>
            <TableHead>팀명</TableHead>
            <TableHead>경기</TableHead>
            <TableHead>승</TableHead>
            <TableHead>패</TableHead>
            <TableHead>득점</TableHead>
            <TableHead>실점</TableHead>
            <TableHead>득실차</TableHead>
            <TableHead>승점</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((row) => (
            <TableRow key={row.team.team_id}>
              <TableCell>{getRankEmoji(row.position)}</TableCell>
              <TableCell>{row.team.team_name}</TableCell>
              <TableCell>{row.matches_played}</TableCell>
              <TableCell>{row.wins}</TableCell>
              <TableCell>{row.losses}</TableCell>
              <TableCell>{row.goals_for}</TableCell>
              <TableCell>{row.goals_against}</TableCell>
              <TableCell>{row.goal_difference}</TableCell>
              <TableCell>{row.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StandingsTable;
