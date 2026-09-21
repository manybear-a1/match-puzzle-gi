export class PuzzleGenerator {
  // Generates a random symmetric(undirected) adjacency matrix of size 9x9
  static generateRandomMatrix(size: number = 9): number[][] {
    const matrix: number[][] = Array(size).fill(0).map(() => Array(size).fill(0));
    for (let i = 0; i < size; i++) {
      for (let j = i + 1; j < size; j++) {
        matrix[i][j] = Math.random() < 0.3 ? 1 : 0;
        matrix[j][i] = matrix[i][j]; // Ensure symmetry
      }
    }
    return matrix;
  }
  static shuffleMatrix(matrix: number[][]): number[][] {
    const size = matrix.length;
    let permutation: number[] = [];
    for (let i = 0; i < size; i++) {
      permutation.push(i);
    }
    permutation = Phaser.Utils.Array.Shuffle(permutation);
    const shuffledMatrix: number[][] = Array(size).fill(0).map(() => Array(size).fill(0));
    // console.log('Permutation:', permutation);
    // console.log('Original Matrix:', matrix);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        shuffledMatrix[permutation[i]][permutation[j]] = matrix[i][j];
      }
    }
    return shuffledMatrix;
  }
}