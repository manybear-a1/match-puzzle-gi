import { Scene } from 'phaser';
import { Graph } from '../objects/graph.ts';
import { InteractiveGraph } from '../objects/interactivegraph.ts';
import { Slider } from '../objects/slider.ts';

interface SolutionSceneData {
  startMatrix: number[][];
  targetMatrix: number[][];
  solutionPath: number[][];
}

export class SolutionScene extends Scene {
  constructor() {
    super('solution');
  }

  create(data: SolutionSceneData): void {
    const startMatrix = data.startMatrix;
    const targetMatrix = data.targetMatrix;
    const solutionPath = data.solutionPath;

    new Graph(this, 640, 0, 640, 720, targetMatrix);
    const interactiveGraph = new InteractiveGraph(this, 0, 0, 640, 720, startMatrix);
    this.add.text(20, 20, 'Solution Viewer', { fontSize: '24px', color: '#ffffff' });
    const stepText = this.add.text(20, 50, 'Step 0', { fontSize: '20px', color: '#ffffff' });
    this.add.text(640, 20, 'End Replay', { fontSize: '24px', color: '#00ff00' }).setInteractive({ useHandCursor: true }).on('pointerdown', () => {
      this.scene.stop();
      this.scene.launch('game');
    }).setOrigin(0.5, 0);

    const minimumMoves = solutionPath.length;
    this.add.text(20, 75, `Minimum Moves: ${ minimumMoves }`, { fontSize: '24px', color: '#ffffff' });
    let currentStep = 0;

    const setStep = (step: number, updategraph: boolean = true): void => {
      const selectedStep = Math.max(0, Math.min(minimumMoves, Math.round(step)));
      if (selectedStep === currentStep) {
        return;
      }
      sliderValue.setText(`Selected step: ${ selectedStep }/${ minimumMoves }`);
      const [v1, v2] = solutionPath[selectedStep - 1] ?? [];
      stepText.setText(selectedStep === 0 ? 'Step 0: Starting position' : `Step ${ selectedStep }: ${ v1 } <-> ${ v2 }`);
      if (updategraph) {
        if (Math.abs(selectedStep - currentStep) === 1) {
          const pathIndex = Math.max(selectedStep, currentStep) - 1;
          const [swapV1, swapV2] = solutionPath[pathIndex];
          interactiveGraph.swapByIndex(swapV1 - 1, swapV2 - 1);
        }
        else {
          interactiveGraph.reset(startMatrix);
          for (let index = 0; index < selectedStep; index++) {
            const [stepV1, stepV2] = solutionPath[index];
            interactiveGraph.swapByIndex(stepV1 - 1, stepV2 - 1, false);
          }
        }
      }
      currentStep = selectedStep;
    };

    const slider = new Slider(this, 1280 - 560 - 20, 70, 560, 0, minimumMoves, 0, setStep);
    const sliderValue = this.add.text(1280 - 20, 90, 'Selected step: 0', { fontSize: '20px', color: '#ffffff' }).setOrigin(1, 0);
    const replayButton = this.add.text(1280 - 20, 20, 'Replay From Start', {
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#2d6cdf',
      padding: { x: 10, y: 8 },
    }).setInteractive({ useHandCursor: true }).setOrigin(1, 0);
    replayButton.on('pointerdown', () => {
      replayButton.disableInteractive();
      interactiveGraph.reset(startMatrix);

      slider.setValue(0, false);
      solutionPath.forEach((step, index) => {
        this.time.delayedCall(index * 350, () => {
          const [v1, v2] = step;
          setStep(index + 1, false);
          slider.setValue(index + 1, false);
          interactiveGraph.swapByIndex(v1 - 1, v2 - 1);
        });
      });
      this.time.delayedCall(Math.max(1, solutionPath.length) * 350, () => {
        replayButton.setInteractive({ useHandCursor: true });
      });
    });
  }
}