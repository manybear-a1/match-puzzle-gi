export type BotMove = {
	firstNode: number;
	secondNode: number;
};

export function getRandomMove(matrix: number[][], random = Math.random): BotMove | null {
  const moves: BotMove[] = [];
  for (let firstNode = 0; firstNode < matrix.length; firstNode++) {
    for (let secondNode = firstNode + 1; secondNode < matrix.length; secondNode++) {
      if (matrix[firstNode]?.[secondNode] === 0) {
        moves.push({ firstNode, secondNode });
      }
    }
  }

  if (moves.length === 0) return null;
  const moveIndex = Math.min(moves.length - 1, Math.floor(random() * moves.length));
  return moves[moveIndex];
}