import Phaser from 'phaser';
import { Match } from './match';
import { Node } from './node';

// Graph class represents a graph with nodes and matches (edges) based on an adjacency matrix
export class Graph extends Phaser.GameObjects.Container {
  protected matches: (Match | null)[][] = [];
  protected nodes: (Node)[] = [];
  protected background: Phaser.GameObjects.Rectangle;

  // default graph constructor with 9 nodes and 9 matches
  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, matrix: number[][] = Array(9).fill(0).map(() => Array(9).fill(0))) {
    super(scene);
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;

    scene.add.existing(this);

    this.background = scene.add.rectangle(0, 0, width, height);
    this.background.setStrokeStyle(1, 0x000000);
    this.background.setOrigin(0, 0);
    this.add(this.background);

    this.setAdjacencyMatrix(matrix);
  }
  //directed
  addAdjacency(i: number, j: number): void {
    if (i < 0 || i >= this.nodes.length || j < 0 || j >= this.nodes.length || i === j) {
      // console.warn('Invalid indices for adjacency matrix');
      // console.warn(`i: ${ i }, j: ${ j }`);
      return;
    }
    if (!this.matches[i][j]) {
      const x1 = this.nodes[i].x;
      const y1 = this.nodes[i].y;
      const x2 = this.nodes[j].x;
      const y2 = this.nodes[j].y;
      const match = new Match(this.scene, x1, y1, x2, y2);
      this.matches[i][j] = match;
      // this.matches[j][i] = match;
      this.add(match);
      match.connectNodes(this.nodes[i], this.nodes[j]);
      this.nodes[i].addMatch(match);
      this.nodes[j].addMatch(match);

      this.sendToBack(match);
      if (i < j && this.matches[j][i]) {
        this.matches[i][j].setVisible(false);
      }
      else if (this.matches[j][i]) {
        this.matches[j][i].setVisible(false);
      }

    }
  }

  setAdjacencyMatrix(matrix: number[][]): void {
    this.destroyNodes();
    const size = matrix.length;
    this.matches = Array(size).fill(null).map(() => Array(size).fill(null));
    this.nodes = Array(size).fill(null);
    const columns = Math.ceil(Math.sqrt(size));
    const rows = Math.ceil(size / columns);
    const cellWidth = this.width / columns;
    const cellHeight = this.height / rows;

    // Create nodes first 
    for (let i = 0; i < size; i++) {
      const row = Math.floor(i / columns);
      const col = i % columns;

      const nodeX = col * cellWidth + cellWidth / 2;
      const nodeY = row * cellHeight + cellHeight / 2;

      this.nodes[i] = new Node(this.scene, nodeX, nodeY);
      this.add(this.nodes[i]);
    }
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (i == j) continue;
        if (matrix[i][j] === 1) {
          this.addAdjacency(i, j);
        }
      }
    }
  }

  getAdjacency(i: number, j: number): number {
    return this.matches[i][j] ? 1 : 0;
  }
  getAdjacencyMatrix(): number[][] {
    const matrix: number[][] = [];
    for (let i = 0; i < this.nodes.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < this.nodes.length; j++) {
        matrix[i][j] = this.getAdjacency(i, j);
      }
    }
    return matrix;
  }
  // relative positioning of nodes based on the graph's position and size
  setNodePosition(i: number, x: number, y: number): void {
    if (i < 0 || i >= this.nodes.length) {
      // console.warn('Invalid node index');
      return;
    }
    if (x < 0 || x > 1 || y < 0 || y > 1) {
      // console.warn('Invalid relative position');
      return;
    }
    //this.nodes[i].setPosition(x, y);
    this.nodes[i].setPosition(this.width * x, this.height * y);
  }
  destroyNodes(): void {
    for (const node of this.nodes) {
      node.destroy();
    }
    for (const matchRow of this.matches) {
      for (const match of matchRow) {
        if (match) {
          match.destroy();
        }
      }
    }
  }
  destroy(): void {
    // Clean up objects when graph is destroyed
    this.destroyNodes();
    super.destroy();
  }
}