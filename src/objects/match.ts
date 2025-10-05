import Phaser from 'phaser';

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

  constructor(scene: Phaser.Scene, startX: number, startY: number, endX: number, endY: number) {
    super(scene);

    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;

    scene.add.existing(this);
    this.draw();
  }

  draw(): void {
    this.clear();

    // Calculate angle of the match
    const angle = Math.atan2(this.endY - this.startY, this.endX - this.startX);

    // Calculate length and adjusted length of the match
    const length = Phaser.Math.Distance.Between(this.startX, this.startY, this.endX, this.endY);
    const adjustedLength = length - this.shortenBy;

    // Calculate midpoint
    const midX = (this.startX + this.endX) / 2;
    const midY = (this.startY + this.endY) / 2;

    // Calculate adjusted start and end points
    const adjStartX = midX - Math.cos(angle) * (adjustedLength / 2);
    const adjStartY = midY - Math.sin(angle) * (adjustedLength / 2);
    const adjEndX = midX + Math.cos(angle) * (adjustedLength / 2);
    const adjEndY = midY + Math.sin(angle) * (adjustedLength / 2);

    // Draw match stick body
    this.lineStyle(this.stickWidth, this.stickColor);
    this.lineBetween(adjStartX, adjStartY, adjEndX, adjEndY);

    // Draw match head at the end
    this.fillStyle(this.headColor);
    this.fillCircle(adjEndX, adjEndY, this.headRadius);
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
}