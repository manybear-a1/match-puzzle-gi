export type ClosedTrail = number[];

export function canDecomposeIntoClosedTrails(matrix: number[][]): boolean {
  return decomposeIntoClosedTrails(matrix) !== null;
}

export function decomposeIntoClosedTrails(matrix: number[][]): ClosedTrail[] | null {
  if (!isSquareSymmetricMatrix(matrix)) return null;

  const remaining = matrix.map((row) => row.map((connected) => connected === 1 ? 1 : 0));
  for (let vertex = 0; vertex < remaining.length; vertex++) {
    let degree = 0;
    for (const connected of remaining[vertex]) degree += connected;
    if (degree % 2 !== 0) return null;
  }

  const trails: ClosedTrail[] = [];
  let start = findVertexWithRemainingEdge(remaining);
  while (start !== -1) {

    const trail: ClosedTrail = [start];
    let current = start;
    do {
      const next = findNeighbor(current, remaining);
      if (next === -1) return null;

      remaining[current][next] = 0;
      remaining[next][current] = 0;
      current = next;
      trail.push(current);
    } while (current !== start);
    trails.push(trail);
    start = findVertexWithRemainingEdge(remaining);
  }

  return trails;
}

function isSquareSymmetricMatrix(matrix: number[][]): boolean {
  for (let row = 0; row < matrix.length; row++) {
    if (matrix[row].length !== matrix.length || matrix[row][row] !== 0) return false;
    for (let column = row + 1; column < matrix.length; column++) {
      if (matrix[row][column] !== matrix[column][row]) return false;
    }
  }
  return true;
}

function findVertexWithRemainingEdge(matrix: number[][]): number {
  for (let vertex = 0; vertex < matrix.length; vertex++) {
    if (findNeighbor(vertex, matrix) !== -1) return vertex;
  }
  return -1;
}

function findNeighbor(vertex: number, matrix: number[][]): number {
  return matrix[vertex].findIndex((connected) => connected === 1);
}