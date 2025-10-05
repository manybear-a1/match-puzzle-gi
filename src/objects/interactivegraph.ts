import Phaser from 'phaser';
import { Graph } from './graph';

export class InteractiveGraph extends Graph {
  private selectedVertex: number = -1;
  private isDragging: boolean = false;
  private moved_count: number = 0;
  private dragLine: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number, height: number, width: number) {
    super(scene, x, y, height, width);

    // Create graphics object for drag line
    this.dragLine = scene.add.graphics();
    this.dragLine.setDepth(3); // Above nodes

    // Add pointer event listeners
    scene.input.on('pointerdown', this.handlePointerDown, this);
    scene.input.on('pointermove', this.handlePointerMove, this);
    scene.input.on('pointerup', this.handlePointerUp, this);
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer): void {
    const vertex = this.getVertexUnderPointer(pointer);
    if (vertex !== -1) {
      this.selectedVertex = vertex;
      this.isDragging = true;

      // Highlight the selected node
      if (this.nodes[vertex]) {
        this.nodes[vertex].highlight();
      }
    }
  }

  private handlePointerMove(pointer: Phaser.Input.Pointer): void {
    // Update cursor style
    if (!this.isDragging) {
      const vertex = this.getVertexUnderPointer(pointer);
      if (vertex !== -1) {
        this.scene.input.setDefaultCursor('pointer');
      }
      else {
        this.scene.input.setDefaultCursor('default');
      }
    }
    else {
      // Draw drag line
      this.updateDragLine(pointer);

      // Highlight potential target vertex
      const targetVertex = this.getVertexUnderPointer(pointer);
      for (let i = 0; i < this.nodes.length; i++) {
        if (i === this.selectedVertex) continue;

        if (i === targetVertex && targetVertex !== -1) {
          this.nodes[i].highlight(0xff0000);
        }
        else {
          this.nodes[i].unhighlight();
        }
      }
    }
  }

  private handlePointerUp(pointer: Phaser.Input.Pointer): void {
    if (this.isDragging) {
      const targetVertex = this.getVertexUnderPointer(pointer);
      if (targetVertex !== -1 && targetVertex !== this.selectedVertex) {
        // Swap vertices
        this.swapVertices(this.selectedVertex, targetVertex);
      }

      // Reset state
      this.isDragging = false;
      this.dragLine.clear();

      // Unhighlight all nodes
      for (const node of this.nodes) {
        node.unhighlight();
      }

      this.selectedVertex = -1;
      this.scene.input.setDefaultCursor('default');
    }
  }

  private getVertexUnderPointer(pointer: Phaser.Input.Pointer): number {
    // Check if pointer is within the graph area
    if (
      pointer.x < this.x ||
      pointer.x > this.x + this.width ||
      pointer.y < this.y ||
      pointer.y > this.y + this.height
    ) {
      return -1;
    }

    const cellWidth = this.width / 3;
    const cellHeight = this.height / 3;

    // Calculate which cell the pointer is in
    const col = Math.floor((pointer.x - this.x) / cellWidth);
    const row = Math.floor((pointer.y - this.y) / cellHeight);

    // Calculate the center of the cell
    const centerX = this.x + col * cellWidth + cellWidth / 2;
    const centerY = this.y + row * cellHeight + cellHeight / 2;

    // Check if the pointer is near enough to the center
    const distance = Phaser.Math.Distance.Between(pointer.x, pointer.y, centerX, centerY);
    if (distance <= 15) { // Using 15 as radius
      return row * 3 + col;
    }

    return -1; // Not on any vertex
  }

  private swapVertices(v1: number, v2: number): void {
    if (v1 === v2) return;
    // Swap the connections in the adjacency matrix
    for (let i = 0; i < 9; i++) {
      if (i === v1 || i === v2) continue;

      // Swap connections to other vertices
      const temp1 = this.getAdjacency(v1, i);
      this.setAdjacency(v1, i, this.getAdjacency(v2, i));
      this.setAdjacency(v2, i, temp1);
      const temp2 = this.getAdjacency(i, v1);
      this.setAdjacency(i, v1, this.getAdjacency(i, v2));
      this.setAdjacency(i, v2, temp2);

    }

    this.moved_count++;
    this.emit('swap', { v1, v2 });
  }

  private updateDragLine(pointer: Phaser.Input.Pointer): void {
    if (this.selectedVertex !== -1) {
      this.dragLine.clear();

      const row = Math.floor(this.selectedVertex / 3);
      const col = this.selectedVertex % 3;
      const cellWidth = this.width / 3;
      const cellHeight = this.height / 3;

      const startX = this.x + col * cellWidth + cellWidth / 2;
      const startY = this.y + row * cellHeight + cellHeight / 2;

      // Draw line from selected vertex to pointer
      this.dragLine.lineStyle(2, 0xff0000);
      this.dragLine.beginPath();
      this.dragLine.moveTo(startX, startY);
      this.dragLine.lineTo(pointer.x, pointer.y);
      this.dragLine.strokePath();
    }
  }

  getMovedCount(): number {
    return this.moved_count;
  }

  destroy(): void {
    // Clean up event listeners
    this.scene.input.off('pointerdown', this.handlePointerDown, this);
    this.scene.input.off('pointermove', this.handlePointerMove, this);
    this.scene.input.off('pointerup', this.handlePointerUp, this);

    // Clean up drag line
    if (this.dragLine) {
      this.dragLine.destroy();
    }

    // Call parent destroy method
    super.destroy();
  }
}