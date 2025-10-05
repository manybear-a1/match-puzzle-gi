import { Scene } from 'phaser';
import { Graph } from '../objects/graph.ts';
import { InteractiveGraph } from '../objects/interactivegraph.ts';
import { PuzzleSolver } from '../puzzlesolver/puzzlesolver.ts';
export class GameScene extends Scene {
  constructor() {
    super('game');
  }

  create(): void {
    const generatedMatrix: number[][] = PuzzleSolver.generateRandomMatrix();
    const graph = new Graph(this, 640, 0, 640, 720);
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (i == j) continue;
        graph.setAdjacency(i, j, generatedMatrix[i][j]);
      }
    }

    //console.log('Generated Matrix:', generatedMatrix);
    const shuffledMatrix = PuzzleSolver.shuffleMatrix(generatedMatrix);
    const interactiveGraph = new InteractiveGraph(this, 0, 0, 640, 720);
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (i == j) continue;
        interactiveGraph.setAdjacency(i, j, shuffledMatrix[i][j]);
      }
    }
    //console.log('Shuffled Matrix:', shuffledMatrix);
    interactiveGraph.on('swap', () => {
      if (PuzzleSolver.isSolved(interactiveGraph.getAdjacencyMatrix(), generatedMatrix)) {
        //console.log('Puzzle Solved!');
        this.scene.pause();
        this.scene.launch('clear');
      }
      //console.log('Current Matrix:', interactiveGraph.getAdjacencyMatrix());
      //console.log('Target Matrix:', generatedMatrix);
    });
    let minimum_moves = PuzzleSolver.solve(shuffledMatrix, generatedMatrix);
    this.add.text(20, 20, `Minimum Moves: ${ minimum_moves }`, { fontSize: '24px', color: '#ffffff' });
    const movesText = this.add.text(20, 50, 'Moves Made: 0', { fontSize: '24px', color: '#ffffff' });
    interactiveGraph.on('swap', (data: { v1: number; v2: number; }) => {
      movesText.setText(`Moves Made: ${ interactiveGraph.getMovedCount() }`);
    });
    const scoreText = this.add.text(20, 80, `Score: 100`, { fontSize: '24px', color: '#ffffff' });
    interactiveGraph.on('swap', (data: { v1: number; v2: number; }) => {
      scoreText.setText(`Score: ${ minimum_moves / interactiveGraph.getMovedCount() * 100 }`);
    });
  }
}