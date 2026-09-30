import Phaser from 'phaser';

import { Graph } from './graph';

export class InteractiveGraph extends Graph {
  private selectedNode: number | null = null;
  private interactionEnabled = true;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, matrix: number[][] = Array(9).fill(0).map(() => Array(9).fill(0))) {
    super(scene, x, y, width, height, matrix);
    this.bindNodeInteractions();
  }

  private bindNodeInteractions(): void {
    for (let index = 0; index < this.nodes.length; index++) {
      this.nodes[index].on('pointerdown', () => this.selectNode(index));
    }
  }

  private selectNode(index: number): void {
    if (!this.interactionEnabled) return;

    if (this.selectedNode === null) {
      this.selectedNode = index;
      this.nodes[index].setSelected(true);
      this.emit('nodeSelected', index);
      return;
    }

    if (this.selectedNode === index) {
      this.nodes[index].setSelected(false);
      this.selectedNode = null;
      this.emit('selectionCleared');
      return;
    }

    const firstNode = this.selectedNode;
    this.nodes[firstNode].setSelected(false);
    this.selectedNode = null;
    if (!this.addEdge(firstNode, index)) {
      this.emit('invalidEdge');
      return;
    }
    this.emit('edgeAdded', { firstNode, secondNode: index });
  }

  reset(matrix: number[][]): void {
    this.clearSelection();
    this.setAdjacencyMatrix(matrix);
    this.bindNodeInteractions();
  }

  clearSelection(): void {
    if (this.selectedNode !== null) {
      this.nodes[this.selectedNode]?.setSelected(false);
      this.selectedNode = null;
    }
  }

  setInteractionEnabled(enabled: boolean): void {
    this.interactionEnabled = enabled;
    if (!enabled) this.clearSelection();
  }
}