import Phaser from 'phaser';
import { Graph } from './graph';
import { Node } from './node';
import { Arrow } from './arraw';

// InteractiveGraph extends Graph to add interactivity for swapping vertices
export class InteractiveGraph extends Graph {
  private selectedVertex: Node | null = null;
  private moved_count: number = 0;
  private swapTween: Phaser.Tweens.Tween | null = null;
  private readonly arrow: Arrow;

  constructor(scene: Phaser.Scene, x: number, y: number, height: number, width: number, matrix: number[][] = Array(9).fill(0).map(() => Array(9).fill(0))) {
    super(scene, x, y, height, width, matrix);

    this.arrow = new Arrow(scene);
    scene.input.on('pointermove', this.updateArrow, this);
    this.setupNodeInteractions();
  }

  private setupNodeInteractions(): void {

    for (const node of this.nodes) {
      node.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        if (!pointer.rightButtonDown()) {
          this.selectVertex(node, pointer);
        }
      });
    }
  }

  private selectVertex(node: Node, pointer: Phaser.Input.Pointer): void {
    if (node.isFixed()) return;
    if (this.selectedVertex && this.selectedVertex.isFixed()) {
      this.selectedVertex.setSelected(false);
      this.selectedVertex = null;
    }
    if (this.selectedVertex === null) {
      this.selectedVertex = node;
      node.setSelected(true);
      this.updateArrow(pointer);
      return;
    }

    if (this.selectedVertex === node) {
      node.setSelected(false);
      this.selectedVertex = null;
      this.arrow.hide();
      return;
    }


    const firstVertex = this.selectedVertex;
    firstVertex.setSelected(false);
    this.selectedVertex = null;
    this.arrow.hide();

    const firstIndex = this.nodes.indexOf(firstVertex);
    const secondIndex = this.nodes.indexOf(node);
    this.swapVertices(firstIndex, secondIndex);
  }

  private updateArrow(pointer: Phaser.Input.Pointer): void {
    if (this.selectedVertex === null) return;

    this.arrow.pointTo(
      this.x + this.selectedVertex.x,
      this.y + this.selectedVertex.y,
      pointer.x,
      pointer.y,
    );
  }

  reset(matrix: number[][]): void {
    this.selectedVertex = null;
    this.arrow.hide();
    this.setAdjacencyMatrix(matrix);
    this.moved_count = 0;
    this.setupNodeInteractions();
  }

  swapByIndex(v1: number, v2: number, animate = true): void {
    this.swapVertices(v1, v2, animate, false);
  }

  private swapVertices(v1: number, v2: number, animate = true, respectFixed = true): void {
    if (v1 === v2 || (respectFixed && (this.nodes[v1].isFixed() || this.nodes[v2].isFixed()))) return;
    if (this.swapTween) {
      this.swapTween.stop();
    }
    this.swapTween = null;
    // Swap the connections in the adjacency matrix
    for (let i = 0; i < this.nodes.length; i++) {
      if (i === v1 || i === v2) continue;

      // Swap connections to other vertices
      const temp1 = this.matches[v1][i];
      this.matches[v1][i] = this.matches[v2][i];
      this.matches[v2][i] = temp1;

      const temp2 = this.matches[i][v1];
      this.matches[i][v1] = this.matches[i][v2];
      this.matches[i][v2] = temp2;

    }
    // Swap the nodes in the nodes array
    const tempNode = this.nodes[v1];
    this.nodes[v1] = this.nodes[v2];
    this.nodes[v2] = tempNode;

    // Update the positions of the nodes
    const x1 = this.nodes[v1].x;
    const y1 = this.nodes[v1].y;
    const x2 = this.nodes[v2].x;
    const y2 = this.nodes[v2].y;
    this.moved_count++;
    this.emit('swap', { v1, v2 });
    if (!animate) {
      this.nodes[v1].setPosition(x2, y2);
      this.nodes[v2].setPosition(x1, y1);
      this.emit('swapComplete', { v1, v2 });
      return;
    }

    // this.nodes[v1].setPosition(this.nodes[v2].x, this.nodes[v2].y);
    // this.nodes[v2].setPosition(x, y);
    // Tween the nodes to their new positions
    this.swapTween = this.scene.tweens.add({
      targets: [this.nodes[v1], this.nodes[v2]],
      onUpdate: (tween, target) => {
        const progress = Phaser.Math.Easing.Expo.InOut(tween.progress);
        if (target === this.nodes[v1]) {
          target.setPosition(Phaser.Math.Interpolation.Linear([x1, x2], progress), Phaser.Math.Interpolation.Linear([y1, y2], progress));
        }
        else if (target === this.nodes[v2]) {
          target.setPosition(Phaser.Math.Interpolation.Linear([x2, x1], progress), Phaser.Math.Interpolation.Linear([y2, y1], progress));
        }
      },
      onComplete: () => {
        this.nodes[v1].setPosition(x2, y2);
        this.nodes[v2].setPosition(x1, y1);

        this.emit('swapComplete', { v1, v2 });
      },
      onStop: () => {
        this.nodes[v1].setPosition(x2, y2);
        this.nodes[v2].setPosition(x1, y1);
      },
      props: {
        x: { value: 0 },
        y: { value: 0 }
      },
      duration: 250,
    });
  }

  getMovedCount(): number {
    return this.moved_count;
  }
}