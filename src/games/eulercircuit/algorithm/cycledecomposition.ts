export type Cycle = number[];

export function canDecomposeIntoCycles(matrix: number[][]): boolean {
  return decomposeIntoCycles(matrix) !== null;
}

export function decomposeIntoCycles(matrix: number[][]): Cycle[] | null {
  if (!isSimpleUndirectedMatrix(matrix)) return null;

  const remaining = matrix.map((row) => [...row]);
  for (let vertex = 0; vertex < remaining.length; vertex++) {
    let degree = 0;
    for (const connected of remaining[vertex]) degree += connected;
    if (degree % 2 !== 0) return null;
  }

  const cycles: Cycle[] = [];
  let cycle = findCycle(remaining);
  while (cycle !== null) {
    for (let index = 0; index < cycle.length - 1; index++) {
      const start = cycle[index];
      const end = cycle[index + 1];
      remaining[start][end] = 0;
      remaining[end][start] = 0;
    }
    cycles.push(cycle);
    cycle = findCycle(remaining);
  }

  return hasRemainingEdge(remaining) ? null : cycles;
}

function isSimpleUndirectedMatrix(matrix: number[][]): boolean {
  for (let row = 0; row < matrix.length; row++) {
    if (matrix[row].length !== matrix.length || matrix[row][row] !== 0) return false;
    for (let column = row + 1; column < matrix.length; column++) {
      const value = matrix[row][column];
      if ((value !== 0 && value !== 1) || value !== matrix[column][row]) return false;
    }
  }
  return true;
}

function findCycle(matrix: number[][]): Cycle | null {
  for (let start = 0; start < matrix.length; start++) {
    if (findNeighbor(start, matrix) === -1) continue;
    const path = [start];
    const pathIndices = new Map<number, number>([[start, 0]]);
    const cycle = depthFirstCycleSearch(start, matrix, path, pathIndices);
    if (cycle !== null) return cycle;
  }
  return null;
}

function depthFirstCycleSearch(vertex: number, matrix: number[][], path: number[], pathIndices: Map<number, number>): Cycle | null {
  for (let neighbor = 0; neighbor < matrix.length; neighbor++) {
    if (matrix[vertex][neighbor] !== 1) continue;
    const pathIndex = pathIndices.get(neighbor);
    if (pathIndex !== undefined) {
      if (path.length - pathIndex >= 3) return [...path.slice(pathIndex), neighbor];
      continue;
    }

    pathIndices.set(neighbor, path.length);
    path.push(neighbor);
    const cycle = depthFirstCycleSearch(neighbor, matrix, path, pathIndices);
    if (cycle !== null) return cycle;
    path.pop();
    pathIndices.delete(neighbor);
  }
  return null;
}

function findNeighbor(vertex: number, matrix: number[][]): number {
  return matrix[vertex].findIndex((connected) => connected === 1);
}

function hasRemainingEdge(matrix: number[][]): boolean {
  return matrix.some((row) => row.some((connected) => connected === 1));
}