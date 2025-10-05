import Phaser from 'phaser';
import { Match } from './match';
import { Node } from './node';

export class Graph extends Phaser.GameObjects.Container {
  protected matches: (Match | null)[][];
  protected nodes: (Node)[];
  protected background: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number,) {
    super(scene);
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.matches = Array(9).fill(null).map(() => Array(9).fill(null));
    this.nodes = Array(9);

    scene.add.existing(this);


    this.background = scene.add.rectangle(0, 0, width, height);
    this.background.setStrokeStyle(1, 0x000000);
    this.background.setOrigin(0, 0);
    this.add(this.background);
    const cellWidth = this.width / 3;
    const cellHeight = this.height / 3;

    // Create nodes first 
    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;

      const nodeX = col * cellWidth + cellWidth / 2;
      const nodeY = row * cellHeight + cellHeight / 2;

      this.nodes[i] = new Node(this.scene, nodeX, nodeY);
      this.add(this.nodes[i]);
    }
  }
  updateDegree(i: number): void {
    let degree = 0;
    for (let j = 0; j < 9; j++) {
      if (this.matches[i][j]) {
        degree++;
      }
    }
    this.nodes[i].setDegree(degree);
  }

  setAdjacency(i: number, j: number, value: number): void {
    if (i < 0 || i >= 9 || j < 0 || j >= 9 || i === j) {
      console.warn('Invalid indices for adjacency matrix');
      console.warn(`i: ${ i }, j: ${ j }`);
      return;
    }
    if (value === 1 && !this.matches[i][j]) {
      const x1 = this.nodes[i].x;
      const y1 = this.nodes[i].y;
      const x2 = this.nodes[j].x;
      const y2 = this.nodes[j].y;
      const match = new Match(this.scene, x1, y1, x2, y2);
      this.matches[i][j] = match;
      // this.matches[j][i] = match;
      this.add(match);
      this.sendToBack(match);
      if (i < j && this.matches[j][i]) {
        this.matches[i][j].setVisible(false);
      } else if (this.matches[j][i]) {
        this.matches[j][i].setVisible(false);
      }

    } else if (value === 0 && this.matches[i][j]) {
      this.matches[i][j]?.destroy();
      this.matches[i][j] = null;
      //this.matches[j][i] = null;
      if (this.matches[j][i]) {
        this.matches[j][i].setVisible(true);
      }
    }
    this.updateDegree(i);
    this.updateDegree(j);
  }

  getAdjacency(i: number, j: number): number {
    return this.matches[i][j] ? 1 : 0;
  }
  getAdjacencyMatrix(): number[][] {
    const matrix: number[][] = [];
    for (let i = 0; i < 9; i++) {
      matrix[i] = [];
      for (let j = 0; j < 9; j++) {
        matrix[i][j] = this.getAdjacency(i, j);
      }
    }
    return matrix;
  }

  destroy(): void {
    // Clean up objects when graph is destroyed
    this.nodes.forEach(node => node.destroy());
    this.matches.forEach(match => match.forEach(m => m?.destroy()));
    super.destroy();
  }
}