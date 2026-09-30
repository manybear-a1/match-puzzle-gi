import * as Phaser from 'phaser';

import { canDecomposeIntoCycles, decomposeIntoCycles } from '../algorithm/cycledecomposition';
import { InteractiveGraph } from '../objects/interactivegraph';

const cycleColors = [0xff6b6b, 0x4dabf7, 0x51cf66, 0xf06595, 0xcc5de8, 0xffa94d, 0x20c997, 0x845ef7];

export class GameScene extends Phaser.Scene {
  private graph?: InteractiveGraph;
  private currentPlayer = 1;
  private statusText?: Phaser.GameObjects.Text;
  private turnText?: Phaser.GameObjects.Text;
  private decompositionText?: Phaser.GameObjects.Text;
  private cycleButtons: Phaser.GameObjects.Text[] = [];
  private selectedCycle: number | null = null;
  private degreeVisible = false;

  constructor() {
    super('euler-circuit');
  }

  create(): void {
    this.add.rectangle(640, 360, 1280, 720, 0x21213b);
    this.add.text(54, 34, 'ループを避けろ', { color: '#ffffff', fontSize: '34px', fontStyle: 'bold' });
    this.add.text(56, 82, '毎ターン、異なる2つの頂点を選んで辺を1本追加します。', { color: '#b9c4e4', fontSize: '18px' });
    this.add.text(56, 110, '全ての辺が閉じたループに分解できる形になったら、その手を打った人の負けです。', { color: '#b9c4e4', fontSize: '18px' });

    this.graph = new InteractiveGraph(this, 110, 155, 860, 500);
    this.setCircularNodePositions();
    const degreeButton = this.add.text(1030, 60, '次数表示: OFF', {
      color: '#ffffff', backgroundColor: '#3b4775', fontSize: '16px',
      padding: { left: 12, right: 12, top: 9, bottom: 9 },
    }).setInteractive({ useHandCursor: true });
    degreeButton.on('pointerdown', () => {
      this.degreeVisible = !this.degreeVisible;
      this.graph?.setDegreeVisible(this.degreeVisible);
      degreeButton.setText(`次数表示: ${ this.degreeVisible ? 'ON' : 'OFF' }`);
    });

    this.turnText = this.add.text(750, 60, '', { color: '#ffffff', fontSize: '26px' });
    this.statusText = this.add.text(750, 110, '', { color: '#b9c4e4', fontSize: '18px', wordWrap: { width: 190 } });
    this.decompositionText = this.add.text(1020, 175, '', {
      color: '#d8e1ff',
      fontSize: '16px',
      lineSpacing: 6,
      wordWrap: { width: 210 },
    });
    const resetButton = this.add.text(54, 660, '最初から', {
      color: '#ffffff', backgroundColor: '#3b4775', fontSize: '20px',
      padding: { left: 18, right: 18, top: 12, bottom: 12 },
    }).setInteractive({ useHandCursor: true });
    resetButton.on('pointerdown', () => this.resetGame());
    const backButton = this.add.text(200, 660, 'メニューに戻る', {
      color: '#ffffff', backgroundColor: '#3b4775', fontSize: '20px',
      padding: { left: 18, right: 18, top: 12, bottom: 12 },
    }).setInteractive({ useHandCursor: true });
    backButton.on('pointerdown', () => {
      this.scene.start('main-menu');
      this.scene.stop();
    });
    this.graph.on('nodeSelected', () => {
      this.statusText?.setText(`プレイヤー${ this.currentPlayer }: もう1つ選んでください`);
    });
    this.graph.on('selectionCleared', () => {
      this.statusText?.setText('頂点を2つ選んでください');
    });
    this.graph.on('invalidEdge', () => {
      this.statusText?.setText('その2頂点はすでに繋がっています');
    });
    this.graph.on('edgeAdded', () => this.handleAddedEdge());
    this.resetTurnText();
  }

  private resetGame(): void {
    if (!this.graph) return;
    this.graph.setInteractionEnabled(true);
    this.graph.reset(Array(9).fill(0).map(() => Array(9).fill(0)));
    this.graph.setDegreeVisible(this.degreeVisible);
    this.setCircularNodePositions();
    this.currentPlayer = 1;
    this.clearCycleButtons();
    this.decompositionText?.setText('');
    this.resetTurnText();
  }

  private setCircularNodePositions(): void {
    const positions = Array.from({ length: 9 }, (_, index): [number, number] => {
      const angle = -Math.PI / 2 + (index * Math.PI * 2) / 9;
      return [0.5 + 0.38 * Math.cos(angle), 0.5 + 0.4 * Math.sin(angle)];
    });
    positions.forEach(([x, y], index) => this.graph?.setNodePosition(index, x, y));
  }

  private handleAddedEdge(): void {
    if (!this.graph) return;
    this.updateDecomposition();
    if (canDecomposeIntoCycles(this.graph.getAdjacencyMatrix())) {
      this.graph.setInteractionEnabled(false);
      this.turnText?.setText(`プレイヤー${ this.currentPlayer }の負け`);
      this.turnText?.setColor('#ff7b72');
      this.statusText?.setText('全ての辺がループになりました。最初から遊び直せます。');
      return;
    }

    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    this.resetTurnText();
  }

  private updateDecomposition(): void {
    if (!this.graph || !this.decompositionText) return;
    const cycles = decomposeIntoCycles(this.graph.getAdjacencyMatrix());
    if (cycles === null) {
      this.clearCycleButtons();
      this.decompositionText.setText('現在は閉路に分解できません');
      return;
    }

    const formattedCycles = cycles.map((cycle) => cycle.map((vertex) => vertex + 1).join(' -> '));
    this.clearCycleButtons();
    this.decompositionText.setText('閉路を選択してください');
    formattedCycles.forEach((cycle, index) => {
      const color = cycleColors[index % cycleColors.length];
      const button = this.add.text(1020, 210 + index * 48, `閉路${ index + 1 }: ${ cycle }`, {
        color: '#111827',
        backgroundColor: this.colorToHex(color),
        fontSize: '14px',
        padding: { left: 8, right: 8, top: 7, bottom: 7 },
        wordWrap: { width: 210 },
      }).setInteractive({ useHandCursor: true });
      button.on('pointerdown', () => this.toggleCycle(index, cycles[index], color));
      this.cycleButtons.push(button);
    });
  }

  private toggleCycle(index: number, cycle: number[], color: number): void {
    if (!this.graph) return;
    if (this.selectedCycle === index) {
      this.graph.clearTrailHighlight();
      this.selectedCycle = null;
      return;
    }

    this.graph.highlightTrail(cycle, color);
    this.selectedCycle = index;
  }

  private clearCycleButtons(): void {
    for (const button of this.cycleButtons) button.destroy();
    this.cycleButtons = [];
    this.selectedCycle = null;
    this.graph?.clearTrailHighlight();
  }

  private colorToHex(color: number): string {
    return `#${ color.toString(16).padStart(6, '0') }`;
  }

  private resetTurnText(): void {
    this.turnText?.setText(`プレイヤー${ this.currentPlayer }の番`);
    this.turnText?.setColor(this.currentPlayer === 1 ? '#ffd166' : '#72ddf7');
    this.statusText?.setText('頂点を2つ選んでください');
  }

}