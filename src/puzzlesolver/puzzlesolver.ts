export class PuzzleSolver {
  static generateRandomMatrix(): number[][] {
    const matrix: number[][] = Array(9).fill(0).map(() => Array(9).fill(0));
    for (let i = 0; i < 9; i++) {
      for (let j = i + 1; j < 9; j++) {
        matrix[i][j] = Math.random() < 0.3 ? 1 : 0;
        matrix[j][i] = matrix[i][j]; // Ensure symmetry
      }
    }
    return matrix;
  }
  static shuffleMatrix(matrix: number[][]): number[][] {
    let permutation: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    permutation = Phaser.Utils.Array.Shuffle(permutation);
    const shuffledMatrix: number[][] = Array(9).fill(0).map(() => Array(9).fill(0));
    // console.log('Permutation:', permutation);
    // console.log('Original Matrix:', matrix);
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        shuffledMatrix[permutation[i]][permutation[j]] = matrix[i][j];
      }
    }
    return shuffledMatrix;
  }
  /**
   * Checks if two adjacency matrices are identical
   */
  static isSolved(adjMatrix1: number[][], adjMatrix2: number[][]): boolean {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (adjMatrix1[i][j] !== adjMatrix2[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Solves the puzzle using BFS to find the minimum number of steps
   * to transform startMatrix into targetMatrix through permutations
   */
  static solve(startMatrix: number[][], targetMatrix: number[][]): number {
    // Queue for BFS - using array as queue with shift/push operations
    const queue: string[] = [];

    // Map to track visited states and their steps
    const map = new Map<string, number>();

    // Initial state - identity permutation
    queue.push('012345678');
    map.set('012345678', 0);

    while (queue.length > 0) {
      const current = queue.shift()!;
      const step = map.get(current)!;

      // Generate adjacency matrix based on the current permutation
      const currentMatrix = Array(9).fill(null).map(() => Array(9).fill(0));
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          currentMatrix[i][j] = startMatrix[parseInt(current[i])][parseInt(current[j])];
        }
      }

      // Check if current matrix matches the target
      if (this.isSolved(currentMatrix, targetMatrix)) {
        return step;
      }

      // Try all adjacent swaps in the permutation
      for (let i = 0; i < 9; i++) {
        for (let j = i + 1; j < 9; j++) {
          // Convert string to array for swapping
          const chars = current.split('');

          // Swap elements i and j
          const temp = chars[i];
          chars[i] = chars[j];
          chars[j] = temp;

          // Convert back to string
          const next = chars.join('');

          // If this permutation hasn't been seen yet, add to queue
          if (!map.has(next)) {
            map.set(next, step + 1);
            queue.push(next);
          }
        }
      }
    }

    return -1; // No solution found (shouldn't happen with valid inputs)
  }
}