import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// 타입 정의
type GoalWithPlayer = {
  goal_id: number;
  match_id: number;
  player_id: number;
  goal_time: number | null;
  goal_type: string | null;
  description: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  player: {
    player_id: number;
    name: string;
    jersey_number: number | null;
  };
};

type GoalWithTeam = GoalWithPlayer & {
  team: {
    team_id: number;
    team_name: string;
  } | null;
};

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const matchId = parseInt(params.id);

    if (isNaN(matchId)) {
      return NextResponse.json({ error: 'Invalid match ID' }, { status: 400 });
    }

    // Get goals with player and team information
    const goals = (await prisma.goal.findMany({
      where: {
        match_id: matchId,
      },
      include: {
        player: {
          select: {
            player_id: true,
            name: true,
            jersey_number: true,
          },
        },
      },
      orderBy: {
        goal_time: 'asc',
      },
    }))

    // Get team information for each goal
    const goalsWithTeam = await Promise.all(
      goals.map(async (goal: GoalWithPlayer) => {
        const playerStats = await prisma.playerMatchStats.findFirst({
          where: {
            match_id: matchId,
            player_id: goal.player_id,
          },
          include: {
            team: {
              select: {
                team_id: true,
                team_name: true,
              },
            },
          },
        });

        return {
          ...goal,
          team: playerStats?.team || null,
        };
      })
    );

    return NextResponse.json(goalsWithTeam);
  } catch (error) {
    console.error('Error fetching match goals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match goals' },
      { status: 500 }
    );
  }
}
