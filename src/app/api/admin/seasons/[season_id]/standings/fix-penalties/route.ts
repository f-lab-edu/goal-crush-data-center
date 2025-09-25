import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/admin/seasons/[season_id]/standings/fix-penalties - Fix standings by removing draws and using penalty results
export async function POST(
  _request: NextRequest,
  { params }: { params: { season_id?: string } }
) {
  try {
    const seasonIdParam = params?.season_id;
    const seasonId = seasonIdParam ? parseInt(seasonIdParam, 10) : NaN;

    if (!seasonIdParam || Number.isNaN(seasonId)) {
      return NextResponse.json({ error: 'Invalid season ID' }, { status: 400 });
    }

    // season_id=23에 대한 승부차기 결과 반영 업데이트
    if (seasonId !== 23) {
      return NextResponse.json({ error: 'This fix is only for season 23' }, { status: 400 });
    }

    const updates = [
      { team_id: 20, wins: 5, draws: 0, losses: 2, points: 15 },
      { team_id: 19, wins: 4, draws: 0, losses: 1, points: 12 },
      { team_id: 30, wins: 4, draws: 0, losses: 2, points: 12 },
      { team_id: 37, wins: 4, draws: 0, losses: 2, points: 12 },
      { team_id: 29, wins: 3, draws: 0, losses: 3, points: 9 },
      { team_id: 38, wins: 2, draws: 0, losses: 3, points: 6 },
      { team_id: 39, wins: 2, draws: 0, losses: 3, points: 6 },
      { team_id: 17, wins: 2, draws: 0, losses: 3, points: 6 },
      { team_id: 18, wins: 1, draws: 0, losses: 5, points: 3 },
      { team_id: 35, wins: 1, draws: 0, losses: 4, points: 3 },
    ];

    const results = [];

    for (const update of updates) {
      const result = await prisma.standing.updateMany({
        where: {
          season_id: seasonId,
          team_id: update.team_id,
        },
        data: {
          wins: update.wins,
          draws: update.draws,
          losses: update.losses,
          points: update.points,
          updated_at: new Date(),
        },
      });

      results.push({
        team_id: update.team_id,
        updated_count: result.count,
        new_values: {
          wins: update.wins,
          draws: update.draws,
          losses: update.losses,
          points: update.points,
        },
      });
    }

    return NextResponse.json({
      message: 'Successfully fixed standings with penalty shootout results',
      season_id: seasonId,
      updated_teams: results.length,
      results,
    });
  } catch (error) {
    console.error('Error fixing standings with penalties:', error);
    return NextResponse.json(
      {
        error: 'Failed to fix standings',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}