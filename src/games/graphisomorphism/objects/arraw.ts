import Phaser from 'phaser';

export class Arrow extends Phaser.GameObjects.Graphics {
  private readonly arrowColor = 0xffd166;
  private readonly arrowSize = 12;
  private readonly arrowSpacing = 30;
  private readonly startOffset = 22;

  constructor(scene: Phaser.Scene) {
    super(scene);
    scene.add.existing(this);
    this.setDepth(10);
    this.setVisible(false);
  }

  pointTo(startX: number, startY: number, endX: number, endY: number): void {
    const directionX = endX - startX;
    const directionY = endY - startY;
    const length = Math.sqrt(directionX * directionX + directionY * directionY);
    if (length <= this.startOffset) {
      this.setVisible(false);
      return;
    }

    const unitX = directionX / length;
    const unitY = directionY / length;
    const lineStartX = startX + unitX * this.startOffset;
    const lineStartY = startY + unitY * this.startOffset;
    const lineEndX = endX - unitX * this.arrowSize;
    const lineEndY = endY - unitY * this.arrowSize;

    this.clear();
    this.lineStyle(4, this.arrowColor, 1);
    this.lineBetween(lineStartX, lineStartY, lineEndX, lineEndY);
    this.drawArrowheads(lineStartX, lineStartY, unitX, unitY, length);
    this.drawArrowheads(lineEndX, lineEndY, -unitX, -unitY, length);
    this.setVisible(true);
  }

  hide(): void {
    this.setVisible(false);
  }

  private drawArrowheads(x: number, y: number, directionX: number, directionY: number, length: number): void {
    for (const offset of [0, this.arrowSpacing, 2 * this.arrowSpacing]) {
      if (offset * 2 + this.arrowSize * 4 > length) {
        break;
      }
      this.drawArrowhead(
        x + directionX * offset,
        y + directionY * offset,
        -directionX,
        -directionY,
      );
    }
  }

  private drawArrowhead(x: number, y: number, directionX: number, directionY: number): void {
    const perpendicularX = -directionY;
    const perpendicularY = directionX;
    const pointX = x + directionX * this.arrowSize;
    const pointY = y + directionY * this.arrowSize;
    const sideX = x - directionX * this.arrowSize * 0.6;
    const sideY = y - directionY * this.arrowSize * 0.6;
    const leftX = sideX + perpendicularX * this.arrowSize * 0.6;
    const leftY = sideY + perpendicularY * this.arrowSize * 0.6;
    const rightX = sideX - perpendicularX * this.arrowSize * 0.6;
    const rightY = sideY - perpendicularY * this.arrowSize * 0.6;
    this.lineBetween(pointX, pointY, leftX, leftY);
    this.lineBetween(pointX, pointY, rightX, rightY);
  }
}