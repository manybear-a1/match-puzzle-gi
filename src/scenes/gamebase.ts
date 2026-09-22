import { Scene } from 'phaser';
import { Graph } from '../objects/graph.ts';
import { InteractiveGraph } from '../objects/interactivegraph.ts';
import { PuzzleSolver } from '../puzzlesolver/puzzlesolver.ts';
import { PuzzleGenerator } from '../puzzlegenerator/puzzlegenerator.ts';
export class GameBase extends Scene {
  private nodeCount: number;
  constructor(name: string, nodeCount: number) {
    super(name);
    this.nodeCount = nodeCount;
  }

  create(): void {
    const generatedMatrix: number[][] = PuzzleGenerator.generateRandomMatrix(this.nodeCount);
    new Graph(this, 640, 0, 640, 720, generatedMatrix);

    //console.log('Generated Matrix:', generatedMatrix);
    const shuffledMatrix = PuzzleGenerator.shuffleMatrix(generatedMatrix);
    const interactiveGraph = new InteractiveGraph(this, 0, 0, 640, 720, shuffledMatrix);
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
    const movesText = this.add.text(20, 20, 'Moves Made: 0', { fontSize: '24px', color: '#ffffff' });
    interactiveGraph.on('swap', () => {
      movesText.setText(`Moves Made: ${ interactiveGraph.getMovedCount() }`);
    });


    // Calculate the minimum moves after a short delay to ensure the graph is fully initialized
    if (this.nodeCount <= 9) {
      this.time.delayedCall(100, () => {
        const minimum_moves = PuzzleSolver.solve(shuffledMatrix, generatedMatrix);
        // const minimum_moves = 10; // Placeholder until solver is optimized
        this.add.text(20, 50, `Minimum Moves: ${ minimum_moves }`, { fontSize: '24px', color: '#ffffff' });
        const scoreText = this.add.text(20, 80, 'Score: 100', { fontSize: '24px', color: '#ffffff' });
        interactiveGraph.on('swap', () => {
          scoreText.setText(`Score: ${ minimum_moves / interactiveGraph.getMovedCount() * 100 }`);
        });
      });
    }
  }
}