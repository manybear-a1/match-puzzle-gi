import { Queue } from './queue.ts';
export class PuzzleSolver {

  /**
   * Checks if two adjacency matrices are identical
   */
  static isSolved(adjMatrix1: number[][], adjMatrix2: number[][]): boolean {
    const size = adjMatrix1.length;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
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
    const size = startMatrix.length;
    if (size > 9) {
      return -1; // Not supported for sizes greater than 9 because of the factorial growth in permutations
    }

    // Queue for BFS - using array as queue with shift/push operations
    const queue: Queue<string> = new Queue<string>();

    // Map to track visited states and their steps
    const map = new Map<string, number>();

    // Initial state - identity permutation
    const initialPermutation = Array.from({ length: size }, (_, i) => i).join('');
    queue.push(initialPermutation);
    map.set(initialPermutation, 0);

    while (!queue.isEmpty()) {
      const current = queue.pop()!;
      const step = map.get(current)!;

      // Generate adjacency matrix based on the current permutation
      const currentMatrix = Array(size).fill(null).map(() => Array(size).fill(0));
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          currentMatrix[i][j] = startMatrix[parseInt(current[i])][parseInt(current[j])];
        }
      }

      // Check if current matrix matches the target
      if (this.isSolved(currentMatrix, targetMatrix)) {
        return step;
      }

      // If not, continue with the next permutation
      // Try all adjacent swaps in the permutation
      for (let i = 0; i < size; i++) {
        for (let j = i + 1; j < size; j++) {
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