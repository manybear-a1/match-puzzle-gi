import Phaser from 'phaser';
import { Node } from './node';
export class Match extends Phaser.GameObjects.Graphics {
  private startX: number;
  private startY: number;
  private endX: number;
  private endY: number;
  private stickColor: number = 0xe6dcb9; // Beige color
  private headColor: number = 0xf05014; // Orange-red color
  private stickWidth: number = 4;
  private headRadius: number = 5;
  private shortenBy: number = 30; // Amount to shorten match to not overlap with nodes

  private highlighted: boolean = false;
  private highlightColor: number = 0x00ffff; // Blue color for highlight
  private startNode: Node | null = null;
  private endNode: Node | null = null;
  private readonly hitArea = new Phaser.Geom.Rectangle();
  constructor(scene: Phaser.Scene, startX: number, startY: number, endX: number, endY: number) {
    super(scene);

    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;

    scene.add.existing(this);
    this.on('pointerover', () => {
      this.setHighlighted(true);
      this.startNode?.highlight(this.highlightColor);
      this.endNode?.highlight(this.highlightColor);
    });
    this.on('pointerout', () => {
      this.setHighlighted(false);
      this.startNode?.unhighlight();
      this.endNode?.unhighlight();
    });
    this.draw();
    this.setInteractive(this.hitArea, this.isPointOnCurrentStick.bind(this));
  }
  connectNodes(startNode: Node, endNode: Node): void {
    this.startNode = startNode;
    this.endNode = endNode;
    this.startX = startNode.x;
    this.startY = startNode.y;
    this.endX = endNode.x;
    this.endY = endNode.y;
    startNode.addListener('positionChanged', () => {
      this.startX = startNode.x;
      this.startY = startNode.y;
      this.draw();
    }, this);
    endNode.addListener('positionChanged', () => {
      this.endX = endNode.x;
      this.endY = endNode.y;
      this.draw();
    }, this);
    this.draw();
  }

  draw(): void {
    this.clear();

    const { adjStartX, adjStartY, adjEndX, adjEndY } = this.getAdjustedEndpoints();
    const hitPadding = 8;
    const hitX = Math.min(adjStartX, adjEndX) - hitPadding;
    const hitY = Math.min(adjStartY, adjEndY) - hitPadding;
    const hitWidth = Math.abs(adjEndX - adjStartX) + hitPadding * 2;
    const hitHeight = Math.abs(adjEndY - adjStartY) + hitPadding * 2;
    this.hitArea.setTo(hitX, hitY, hitWidth, hitHeight);
    if (this.highlighted) {
      this.lineStyle(this.stickWidth + 5, this.highlightColor);
      this.lineBetween(adjStartX, adjStartY, adjEndX, adjEndY);
    }
    if (this.highlighted) {
      this.fillStyle(this.highlightColor);
      this.fillCircle(adjEndX, adjEndY, this.headRadius + 5);
    }
    // Draw match stick body

    this.lineStyle(this.stickWidth, this.stickColor);
    this.lineBetween(adjStartX, adjStartY, adjEndX, adjEndY);


    // Draw match head at the end

    this.fillStyle(this.headColor);
    this.fillCircle(adjEndX, adjEndY, this.headRadius);

  }

  private getAdjustedEndpoints(): { adjStartX: number; adjStartY: number; adjEndX: number; adjEndY: number; } {
    const angle = Math.atan2(this.endY - this.startY, this.endX - this.startX);
    const length = Phaser.Math.Distance.Between(this.startX, this.startY, this.endX, this.endY);
    const adjustedLength = length - this.shortenBy;
    const midX = (this.startX + this.endX) / 2;
    const midY = (this.startY + this.endY) / 2;
    return {
      adjStartX: midX - Math.cos(angle) * (adjustedLength / 2),
      adjStartY: midY - Math.sin(angle) * (adjustedLength / 2),
      adjEndX: midX + Math.cos(angle) * (adjustedLength / 2),
      adjEndY: midY + Math.sin(angle) * (adjustedLength / 2),
    };
  }

  private isPointOnCurrentStick(_hitArea: Phaser.Geom.Rectangle, x: number, y: number): boolean {
    const { adjStartX, adjStartY, adjEndX, adjEndY } = this.getAdjustedEndpoints();
    const segmentX = adjEndX - adjStartX;
    const segmentY = adjEndY - adjStartY;
    const segmentLengthSquared = segmentX * segmentX + segmentY * segmentY;
    if (segmentLengthSquared === 0) return false;
    // Project point onto the line segment, clamping to the segment
    // a dot b / |a|^2 = |b| cos (theta) / |a| ( a is the segment vector, b is the vector from start to point)
    // cos (theta) is not negative if and only if theta is between -90 and 90 degrees (inclusive), which means the projection is on the segment.
    const projection = Math.max(0, Math.min(1, ((x - adjStartX) * segmentX + (y - adjStartY) * segmentY) / segmentLengthSquared));
    // Find the nearest point on the segment
    // (|b| cos (theta) / |a|) * a = |b| cos (theta) * e (e is the unit vector of a)
    const nearestX = adjStartX + projection * segmentX;
    const nearestY = adjStartY + projection * segmentY;
    const distanceX = x - nearestX;
    const distanceY = y - nearestY;
    return distanceX * distanceX + distanceY * distanceY <= 10 * 10;
  }

  setStartPoint(x: number, y: number): void {
    this.startX = x;
    this.startY = y;
    this.draw();
  }

  setEndPoint(x: number, y: number): void {
    this.endX = x;
    this.endY = y;
    this.draw();
  }

  setStickColor(color: number): void {
    this.stickColor = color;
    this.draw();
  }

  setHeadColor(color: number): void {
    this.headColor = color;
    this.draw();
  }

  setStickWidth(width: number): void {
    this.stickWidth = width;
    this.draw();
  }

  setHeadRadius(radius: number): void {
    this.headRadius = radius;
    this.draw();
  }
  setHighlighted(highlighted: boolean): void {
    this.highlighted = highlighted;
    this.draw();
  }

  getStartNode(): Node | null {
    return this.startNode;
  }
  getEndNode(): Node | null {
    return this.endNode;
  }
}