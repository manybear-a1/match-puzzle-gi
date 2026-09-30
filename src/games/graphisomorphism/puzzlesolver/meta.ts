import { BruteForceSolver } from './bruteforce.ts';
import { HeuristicSolver } from './heuristic.ts';
import { PuzzleSolver, SolverResult } from './puzzlesolver.ts';
import { SmartBruteForceSolver } from './smart-bruteforce.ts';

export class MetaSolver extends PuzzleSolver {
  static solvePath(startMatrix: number[][], targetMatrix: number[][]): SolverResult {
    if (this.isSolved(startMatrix, targetMatrix)) {
      return { isSolved: true, path: [], minimumMoves: 0 };
    }
    const heuristicPath = HeuristicSolver.solvePath(startMatrix, targetMatrix);
    if (heuristicPath.isSolved) {
      return heuristicPath;
    }
    if (startMatrix.length <= 9) {
      const smartResult = SmartBruteForceSolver.solvePath(startMatrix, targetMatrix);
      if (smartResult.isSolved) return smartResult;
      const bruteResult = BruteForceSolver.solvePath(startMatrix, targetMatrix);
      if (bruteResult.isSolved) return bruteResult;
    }
    return heuristicPath;
  }

  static solve(startMatrix: number[][], targetMatrix: number[][]): number {
    const result = this.solvePath(startMatrix, targetMatrix);
    return result.isSolved ? result.path.length : -1;
  }
}