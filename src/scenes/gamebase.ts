import { Scene } from 'phaser';
import { Graph } from '../objects/graph.ts';
import { InteractiveGraph } from '../objects/interactivegraph.ts';
import { PuzzleSolver } from '../puzzlesolver/puzzlesolver.ts';
import { SmartBruteForceSolver } from '../puzzlesolver/smart-bruteforce.ts';
import { PuzzleGenerator } from '../puzzlegenerator/puzzlegenerator.ts';
export class GameBase extends Scene {
  private nodeCount: number;
  constructor(name: string, nodeCount: number) {
    super(name);
    this.nodeCount = nodeCount;
  }

  create(): void {
    const generatedMatrix: number[][] = PuzzleGenerator.generateRandomMatrix(this.nodeCount);
    const targetGraph = new Graph(this, 640, 0, 640, 720, generatedMatrix);

    //console.log('Generated Matrix:', generatedMatrix);
    const shuffledMatrix = PuzzleGenerator.shuffleMatrix(generatedMatrix);
    const interactiveGraph = new InteractiveGraph(this, 0, 0, 640, 720, shuffledMatrix);
    this.input.mouse?.disableContextMenu();
    //console.log('Shuffled Matrix:', shuffledMatrix);
    interactiveGraph.on('swapComplete', () => {
      if (PuzzleSolver.isSolved(interactiveGraph.getAdjacencyMatrix(), generatedMatrix)) {
        interactiveGraph.playBurningEffect();
        targetGraph.playBurningEffect();
        this.add.text(640, 20, 'End Game', { fontSize: '24px', color: '#00ff00' }).setInteractive({ useHandCursor: true }).on('pointerdown', () => {
          this.scene.stop();
          this.scene.launch('game');
        }).setOrigin(0.5, 0);
      }

    });
    const movesText = this.add.text(20, 20, 'Moves Made: 0', { fontSize: '24px', color: '#ffffff' });
    interactiveGraph.on('swap', () => {
      movesText.setText(`Moves Made: ${ interactiveGraph.getMovedCount() }`);
    });


    // Calculate the minimum moves after a short delay to ensure the graph is fully initialized
    if (this.nodeCount <= 9) {
      this.time.delayedCall(100, () => {
        const solutionPath = SmartBruteForceSolver.solvePath(shuffledMatrix, generatedMatrix);
        const minimum_moves = solutionPath.length;
        this.add.text(20, 50, `Minimum Moves: ${ minimum_moves }`, { fontSize: '24px', color: '#ffffff' });
        const scoreText = this.add.text(20, 80, 'Score: 100', { fontSize: '24px', color: '#ffffff' });
        interactiveGraph.on('swap', () => {
          scoreText.setText(`Score: ${ minimum_moves / interactiveGraph.getMovedCount() * 100 }`);
        });

        const solutionButton = this.add.text(1260, 20, 'Show Shortest Solution', {
          fontSize: '20px',
          color: '#ffffff',
          backgroundColor: '#2d6cdf',
          padding: { x: 10, y: 8 },
        }).setInteractive({ useHandCursor: true }).setOrigin(1, 0);
        const nextStepButton = this.add.text(1260, 65, 'Next Shortest Step', {
          fontSize: '20px',
          color: '#ffffff',
          backgroundColor: '#2d6cdf',
          padding: { x: 10, y: 8 },
        }).setInteractive({ useHandCursor: true }).setOrigin(1, 0);
        const solutionText = this.add.text(1260, 120, '', {
          fontSize: '18px',
          color: '#ffffff',
          wordWrap: { width: 300 },
        }).setOrigin(1, 0);
        solutionButton.on('pointerdown', () => {
          if (solutionPath.length === 0) {
            solutionText.setText('Already solved.');
            return;
          }

          this.scene.start('solution', {
            startMatrix: shuffledMatrix,
            targetMatrix: generatedMatrix,
            solutionPath,
          });
        });
        nextStepButton.on('pointerdown', () => {
          const currentPath = SmartBruteForceSolver.solvePath(interactiveGraph.getAdjacencyMatrix(), generatedMatrix);
          if (currentPath.length === 0) {
            solutionText.setText('Already solved.');
            return;
          }

          nextStepButton.disableInteractive();
          const [v1, v2] = currentPath[0];
          solutionText.setText(`Next: ${ v1 } <-> ${ v2 }`);
          interactiveGraph.swapByIndex(v1 - 1, v2 - 1);
          this.time.delayedCall(350, () => {
            nextStepButton.setInteractive({ useHandCursor: true });
          });
        });
      });
    }
  }
}