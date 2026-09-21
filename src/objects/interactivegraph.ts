import Phaser from 'phaser';
import { Graph } from './graph';
import { Node } from './node';

// InteractiveGraph extends Graph to add interactivity for swapping vertices
export class InteractiveGraph extends Graph {
  private selectedVertex: Node | null = null;
  private previousPosition: { x: number; y: number; } | null = null;
  private moved_count: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, height: number, width: number, matrix: number[][] = Array(9).fill(0).map(() => Array(9).fill(0))) {
    super(scene, x, y, height, width, matrix);

    // Add pointer event listeners

    for (const node of this.nodes) {
      node.on('dragstart', () => {
        this.selectedVertex = node;
        this.previousPosition = { x: node.x, y: node.y };
        this.bringToTop(node);
      });
      node.on('drag', (pointer: Phaser.Input.Pointer) => {
        if (this.selectedVertex === node) {
          node.setPosition(pointer.x, pointer.y);
        }
      });
      node.on('dragend', () => {
        if (this.selectedVertex === node) {
          let isOverlapping = false;
          // Check if the node is dropped on another node
          for (const targetNode of this.nodes) {
            if (targetNode !== node && Phaser.Geom.Intersects.RectangleToRectangle(node.getBounds(), targetNode.getBounds())) {
              node.setPosition(this.previousPosition?.x ?? node.x, this.previousPosition?.y ?? node.y);
              // Swap the two nodes
              const v1Index = this.nodes.indexOf(this.selectedVertex);
              const v2Index = this.nodes.indexOf(targetNode);
              this.swapVertices(v1Index, v2Index);
              isOverlapping = true;
              break;
            }
          }
          if (!isOverlapping) {
            node.setPosition(this.previousPosition?.x ?? node.x, this.previousPosition?.y ?? node.y);
          }

          this.selectedVertex = null;
          this.previousPosition = null;

        }
      });

    }
  }
  private swapVertices(v1: number, v2: number): void {
    if (v1 === v2) return;
    // Swap the connections in the adjacency matrix
    for (let i = 0; i < 9; i++) {
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
    const x = this.nodes[v1].x;
    const y = this.nodes[v1].y;
    this.nodes[v1].setPosition(this.nodes[v2].x, this.nodes[v2].y);
    this.nodes[v2].setPosition(x, y);

    this.moved_count++;
    this.emit('swap', { v1, v2 });
  }

  getMovedCount(): number {
    return this.moved_count;
  }
}