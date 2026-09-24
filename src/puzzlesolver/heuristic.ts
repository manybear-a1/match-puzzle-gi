import { PuzzleSolver, SolverResult } from './puzzlesolver.ts';
// heuristic solver to find a solution by rules based on vertex degrees and adjacency relationships
// Not guaranteed to find a solution nor the shortest path, but fast for large graphs (size > 9).
export class HeuristicSolver extends PuzzleSolver {
  private static getDegree(matrix: number[][], vertex: number): number {
    return matrix[vertex].reduce((degree, connection) => degree + connection, 0);
  }

  private static getNeighborDegreeKey(matrix: number[][], vertex: number): string {
    return matrix[vertex]
      .map((connection, neighbor) => connection === 1 ? this.getDegree(matrix, neighbor) : -1)
      .filter((degree) => degree >= 0)
      .sort((first, second) => first - second)
      .join(',');
  }

  private static getFixedNeighborKey(matrix: number[][], vertex: number, fixedPositions: boolean[], fixedVertices: number[], useVertexMapping: boolean): string {
    return fixedPositions
      .map((isFixed, position) => {
        const neighbor = useVertexMapping ? fixedVertices[position] : position;
        return isFixed && matrix[vertex][neighbor] === 1 ? position : -1;
      })
      .filter((position) => position >= 0)
      .join(',');
  }

  private static findUniquePairByKey(
    current: number[],
    fixedPositions: boolean[],
    getSourceKey: (vertex: number) => string,
    getTargetKey: (position: number) => string,
  ): { sourceVertex: number; targetPosition: number; } | null {
    const sourceVertices = current.filter((_, position) => !fixedPositions[position]);
    const targetPositions = fixedPositions
      .map((isFixed, position) => isFixed ? -1 : position)
      .filter((position) => position >= 0);
    const sourceCounts = new Map<string, number>();
    const targetCounts = new Map<string, number>();
    for (const vertex of sourceVertices) {
      const key = getSourceKey(vertex);
      sourceCounts.set(key, (sourceCounts.get(key) ?? 0) + 1);
    }
    for (const position of targetPositions) {
      const key = getTargetKey(position);
      targetCounts.set(key, (targetCounts.get(key) ?? 0) + 1);
    }
    for (const sourceVertex of sourceVertices) {
      const key = getSourceKey(sourceVertex);
      if (sourceCounts.get(key) === 1 && targetCounts.get(key) === 1) {
        const targetPosition = targetPositions.find((position) => getTargetKey(position) === key);
        if (targetPosition !== undefined) {
          return { sourceVertex, targetPosition };
        }
      }
    }
    return null;
  }
  // if 確定していない頂点の中で、次数がユニークな頂点がある。
  //   //もし存在すれば、その頂点の位置は一意に定まるので、
  //   その頂点を確定させる。(定理2,4)
  private static getUniqueDegreePair(startMatrix: number[][], targetMatrix: number[][], current: number[], fixedPositions: boolean[]): { sourceVertex: number; targetPosition: number; } | null {
    return this.findUniquePairByKey(
      current,
      fixedPositions,
      (vertex) => `${ this.getDegree(startMatrix, vertex) }`,
      (position) => `${ this.getDegree(targetMatrix, position) }`,
    );
  }
  //  if 他の確定していないかつ同じ次数の頂点の中に、隣接する頂点の次数の多重集合が一致するものがない:
  //    //次数が同じでも、隣接する頂点の次数の多重集合がユニークな頂点がある。
  //    //もし存在すれば、その頂点の位置は一意に定まるので、
  //    その頂点を確定させる。(定理7)
  //    break
  private static getUniqueNeighborDegreePair(startMatrix: number[][], targetMatrix: number[][], current: number[], fixedPositions: boolean[]): { sourceVertex: number; targetPosition: number; } | null {
    return this.findUniquePairByKey(
      current,
      fixedPositions,
      (vertex) => `${ this.getDegree(startMatrix, vertex) }:${ this.getNeighborDegreeKey(startMatrix, vertex) }`,
      (position) => `${ this.getDegree(targetMatrix, position) }:${ this.getNeighborDegreeKey(targetMatrix, position) }`,
    );
  }
  // if 他の確定していないかつ同じ次数の頂点の中に、隣接する確定した頂点のidの集合が一致するものがない:
  //   //次数が同じでも、隣接する確定した頂点のidの集合がユニークな頂点がある。
  //   //もし存在すれば、その頂点の位置は一意に定まるので、
  //   その頂点を確定させる。(定理8)
  //   break
  private static getUniqueFixedNeighborPair(startMatrix: number[][], targetMatrix: number[][], current: number[], fixedPositions: boolean[]): { sourceVertex: number; targetPosition: number; } | null {
    return this.findUniquePairByKey(
      current,
      fixedPositions,
      (vertex) => `${ this.getDegree(startMatrix, vertex) }:${ this.getFixedNeighborKey(startMatrix, vertex, fixedPositions, current, true) }`,
      (position) => `${ this.getDegree(targetMatrix, position) }:${ this.getFixedNeighborKey(targetMatrix, position, fixedPositions, current, false) }`,
    );
  }
  
  // 既に位置が確定している頂点を次数順にソート//次数が少ないほうが次数がユニークである可能性が高いので、優先度が高いとする
  // for すでに位置が確定している頂点v in すべての頂点:
  //   if 隣接する位置が確定していない頂点の中で、次数がユニークな頂点がある:
  //     //その頂点vに隣接する頂点の中で、次数がユニークな頂点がある。
  //     //もし存在すれば、その頂点の位置は一意に定まるので、
  //     その頂点を確定させる。(定理5)
  //     break
  // if 上のfor文で頂点が確定した
  //   continue
  private static getUniqueAdjacentDegreePair(startMatrix: number[][], targetMatrix: number[][], current: number[], fixedPositions: boolean[]): { sourceVertex: number; targetPosition: number; } | null {
    const sortedFixedPositions = fixedPositions
      .map((isFixed, position) => isFixed ? position : -1)
      .filter((position) => position >= 0)
      .sort((first, second) => this.getDegree(targetMatrix, first) - this.getDegree(targetMatrix, second));

    for (const fixedPosition of sortedFixedPositions) {
      const sourceFixedVertex = current[fixedPosition];
      const sourceCandidates = current.filter((vertex, position) =>
        !fixedPositions[position] && startMatrix[sourceFixedVertex][vertex] === 1,
      );
      const targetCandidates = fixedPositions
        .map((isFixed, position) => !isFixed && targetMatrix[fixedPosition][position] === 1 ? position : -1)
        .filter((position) => position >= 0);
      const sourceDegreeCounts = new Map<number, number>();
      const targetDegreeCounts = new Map<number, number>();

      for (const vertex of sourceCandidates) {
        const degree = this.getDegree(startMatrix, vertex);
        sourceDegreeCounts.set(degree, (sourceDegreeCounts.get(degree) ?? 0) + 1);
      }
      for (const position of targetCandidates) {
        const degree = this.getDegree(targetMatrix, position);
        targetDegreeCounts.set(degree, (targetDegreeCounts.get(degree) ?? 0) + 1);
      }

      for (const sourceVertex of sourceCandidates) {
        const degree = this.getDegree(startMatrix, sourceVertex);
        if (sourceDegreeCounts.get(degree) !== 1 || targetDegreeCounts.get(degree) !== 1) {
          continue;
        }
        const targetPosition = targetCandidates.find((position) => this.getDegree(targetMatrix, position) === degree);
        if (targetPosition !== undefined) {
          return { sourceVertex, targetPosition };
        }
      }
    }
    return null;
  }

  private static applyFix(current: number[], fixedPositions: boolean[], sourceVertex: number, targetPosition: number, path: number[][], descriptions: string[], fixedVertices: number[], minimumMoves: number[], description: string): void {
    const sourcePosition = current.indexOf(sourceVertex);
    if (sourcePosition !== targetPosition) {
      [current[sourcePosition], current[targetPosition]] = [current[targetPosition], current[sourcePosition]];
      minimumMoves[0]++;
    }
    path.push([sourcePosition + 1, targetPosition + 1]);
    descriptions.push(description);
    fixedVertices.push(targetPosition + 1);
    fixedPositions[targetPosition] = true;
  }

  static solvePath(startMatrix: number[][], targetMatrix: number[][]): SolverResult {
    const size = startMatrix.length;
    const current = Array.from({ length: size }, (_, index) => index);
    const fixedPositions = Array(size).fill(false);
    const path: number[][] = [];
    const descriptions: string[] = [];
    const fixedVertices: number[] = [];
    const minimumMoves = [0];
    while (fixedPositions.some((isFixed) => !isFixed)) {
      const currentMatrix = Array.from({ length: size }, (_, row) =>
        Array.from({ length: size }, (_, column) => startMatrix[current[row]][current[column]]),
      );
      if (this.isSolved(currentMatrix, targetMatrix)) {
        return {
          isSolved: true,
          path,
          minimumMoves: minimumMoves[0],
          description: descriptions,
          fixedVertices,
        };
      }
      let pair =
        this.getUniqueDegreePair(startMatrix, targetMatrix, current, fixedPositions);
      if (pair) {
        this.applyFix(current, fixedPositions, pair.sourceVertex, pair.targetPosition, path, descriptions, fixedVertices, minimumMoves, '次数が一意な頂点を確定');
        continue;
      }

      pair = this.getUniqueAdjacentDegreePair(startMatrix, targetMatrix, current, fixedPositions);
      if (pair) {
        this.applyFix(current, fixedPositions, pair.sourceVertex, pair.targetPosition, path, descriptions, fixedVertices, minimumMoves, '確定頂点に隣接する次数が一意な頂点を確定');
        continue;
      }

      pair = this.getUniqueNeighborDegreePair(startMatrix, targetMatrix, current, fixedPositions);
      if (pair) {
        this.applyFix(current, fixedPositions, pair.sourceVertex, pair.targetPosition, path, descriptions, fixedVertices, minimumMoves, '隣接頂点の次数多重集合が一意な頂点を確定');
        continue;
      }
      pair = this.getUniqueFixedNeighborPair(startMatrix, targetMatrix, current, fixedPositions);
      if (pair) {
        this.applyFix(current, fixedPositions, pair.sourceVertex, pair.targetPosition, path, descriptions, fixedVertices, minimumMoves, '確定済み頂点への隣接関係が一意な頂点を確定');
        continue;
      }

      const zeroSource = current.find((vertex, position) => !fixedPositions[position] && this.getDegree(startMatrix, vertex) === 0);
      const zeroTarget = fixedPositions.findIndex((isFixed, position) => !isFixed && this.getDegree(targetMatrix, position) === 0);
      if (zeroSource !== undefined && zeroTarget >= 0) {
        this.applyFix(current, fixedPositions, zeroSource, zeroTarget, path, descriptions, fixedVertices, minimumMoves, '次数0の頂点を確定');
        continue;
      }

      break;
    }

    const resultMatrix = Array.from({ length: size }, (_, row) =>
      Array.from({ length: size }, (_, column) => startMatrix[current[row]][current[column]]),
    );
    return {
      isSolved: this.isSolved(resultMatrix, targetMatrix),
      path,
      minimumMoves: minimumMoves[0],
      description: descriptions,
      fixedVertices,
    };
  }
}