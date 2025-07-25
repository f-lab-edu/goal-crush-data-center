import { Player, PlayerWithTeam } from '@/lib/types';

// Prisma 기반 Players API 클라이언트 함수들
// 기존 Supabase API와 동일한 인터페이스를 제공하지만 Next.js API Routes를 사용

// ============== Basic Player CRUD Operations ==============

// Get all players
export const getPlayersPrisma = async (): Promise<Player[]> => {
  const response = await fetch('/api/players');
  if (!response.ok) {
    throw new Error(`Failed to fetch players: ${response.statusText}`);
  }
  return response.json();
};

// Get player by ID
export const getPlayerByIdPrisma = async (
  playerId: number
): Promise<Player | null> => {
  const response = await fetch(`/api/players/${playerId}`);
  if (!response.ok) {
    if (response.status === 404) {
      return null; // Player not found
    }
    throw new Error(`Failed to fetch player: ${response.statusText}`);
  }
  return response.json();
};

// Get player with current team information
export const getPlayerWithCurrentTeamPrisma = async (
  playerId: number
): Promise<PlayerWithTeam | null> => {
  const response = await fetch(`/api/players/${playerId}/team`);
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch player with team: ${response.statusText}`);
  }
  return response.json();
};

// Search players by name
export const searchPlayersByNamePrisma = async (
  name: string
): Promise<Player[]> => {
  const response = await fetch(`/api/players?name=${encodeURIComponent(name)}`);
  if (!response.ok) {
    throw new Error(`Failed to search players: ${response.statusText}`);
  }
  return response.json();
};

// Get players by position
export const getPlayersByPositionPrisma = async (
  position: string
): Promise<Player[]> => {
  const response = await fetch(
    `/api/players?position=${encodeURIComponent(position)}`
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch players by position: ${response.statusText}`
    );
  }
  return response.json();
};
