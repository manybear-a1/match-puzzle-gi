import { Queue } from './queue.ts';
export class PuzzleSolver {

  static solvePath(startMatrix: number[][], targetMatrix: number[][]): number[][] {
    const size = startMatrix.length;
    if (size > 9) {
      return [];
    }

    const queue: Queue<string> = new Queue<string>();
    const steps = new Map<string, number>();
    const parents = new Map<string, { state: string; swap: number[]; }>();
    const initialPermutation = Array.from({ length: size }, (_, i) => i).join('');
    queue.push(initialPermutation);
    steps.set(initialPermutation, 0);

    while (!queue.isEmpty()) {
      const current = queue.pop()!;
      const step = steps.get(current)!;
      const currentMatrix = Array(size).fill(null).map(() => Array(size).fill(0));
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          currentMatrix[i][j] = startMatrix[parseInt(current[i])][parseInt(current[j])];
        }
      }

      if (this.isSolved(currentMatrix, targetMatrix)) {
        const path: number[][] = [];
        let state = current;
        while (state !== initialPermutation) {
          const parent = parents.get(state)!;
          path.unshift(parent.swap);
          state = parent.state;
        }
        return path;
      }

      for (let i = 0; i < size; i++) {
        for (let j = i + 1; j < size; j++) {
          const chars = current.split('');
          const temp = chars[i];
          chars[i] = chars[j];
          chars[j] = temp;
          const next = chars.join('');

          if (!steps.has(next)) {
            steps.set(next, step + 1);
            parents.set(next, { state: current, swap: [i + 1, j + 1] });
            queue.push(next);
          }
        }
      }
    }

    return [];
  }

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
    const path = this.solvePath(startMatrix, targetMatrix);
    return path.length > 0 || this.isSolved(startMatrix, targetMatrix) ? path.length : -1;
  }
}