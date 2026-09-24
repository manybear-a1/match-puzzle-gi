export interface SolverResult {
  isSolved: boolean;
  path: number[][];
  minimumMoves: number;
  description?: string[];
  fixedVertices?: number[];
}

export abstract class PuzzleSolver {
  //abstract static solve_path(startMatrix: number[][], targetMatrix: number[][]): number[][];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // static solvePath(startMatrix: number[][], targetMatrix: number[][]): number[][] {
  //   throw new Error('Method not implemented.');
  // }
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

}