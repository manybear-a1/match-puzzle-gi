/* eslint-disable no-console */
import { BruteForceSolver } from './bruteforce.ts';
import { SmartBruteForceSolver } from './smart-bruteforce.ts';
import { PuzzleSolver } from './puzzlesolver.ts';
//npm run verify:solvers で実行
const casesPerSize = 25;
const sizes = [3, 4, 5, 6, 7, 8, 9];

function createRandomMatrix(size: number): number[][] {
  const matrix = Array.from({ length: size }, () => Array(size).fill(0));
  for (let i = 0; i < size; i++) {
    for (let j = i + 1; j < size; j++) {
      const connection = Math.random() < 0.3 ? 1 : 0;
      matrix[i][j] = connection;
      matrix[j][i] = connection;
    }
  }
  return matrix;
}

function shuffleMatrix(matrix: number[][]): number[][] {
  const permutation = Array.from({ length: matrix.length }, (_, index) => index);
  for (let index = permutation.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [permutation[index], permutation[randomIndex]] = [permutation[randomIndex], permutation[index]];
  }

  return matrix.map((_, row) => permutation.map((_, column) => matrix[permutation[row]][permutation[column]]));
}

function applyPath(matrix: number[][], path: number[][]): number[][] {
  const result = matrix.map((row) => [...row]);
  for (const [first, second] of path) {
    const firstIndex = first - 1;
    const secondIndex = second - 1;
    [result[firstIndex], result[secondIndex]] = [result[secondIndex], result[firstIndex]];
    for (const row of result) {
      [row[firstIndex], row[secondIndex]] = [row[secondIndex], row[firstIndex]];
    }
  }
  return result;
}

function assertPathIsSolution(startMatrix: number[][], targetMatrix: number[][], path: number[][], solverName: string, caseName: string): void {
  const result = applyPath(startMatrix, path);
  if (!PuzzleSolver.isSolved(result, targetMatrix)) {
    throw new Error(`${ solverName } returned an invalid path in ${ caseName }.`);
  }
}

function verifyCase(size: number, caseNumber: number): void {
  const targetMatrix = createRandomMatrix(size);
  const startMatrix = shuffleMatrix(targetMatrix);
  const caseName = `size=${ size }, case=${ caseNumber }`;
  const bruteResult = BruteForceSolver.solvePath(startMatrix, targetMatrix);
  const smartResult = SmartBruteForceSolver.solvePath(startMatrix, targetMatrix);

  assertPathIsSolution(startMatrix, targetMatrix, bruteResult.path, 'BruteForceSolver', caseName);
  assertPathIsSolution(startMatrix, targetMatrix, smartResult.path, 'SmartBruteForceSolver', caseName);
  if (bruteResult.path.length !== smartResult.path.length) {
    throw new Error(`${ caseName }: shortest path mismatch, brute=${ bruteResult.path.length }, smart=${ smartResult.path.length }.`);
  }
}

for (const size of sizes) {
  for (let caseNumber = 1; caseNumber <= casesPerSize; caseNumber++) {
    verifyCase(size, caseNumber);
  }
  console.log(`Verified ${ casesPerSize } random cases for size ${ size }.`);
}

console.log('All solver checks passed.');