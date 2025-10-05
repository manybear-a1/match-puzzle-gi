import Phaser from 'phaser';

export class Node extends Phaser.GameObjects.Container {
  private circle: Phaser.GameObjects.Arc;
  private degreeText: Phaser.GameObjects.Text;
  private _degree: number;
  private _radius: number;

  constructor(scene: Phaser.Scene, x: number, y: number, radius: number = 15) {
    super(scene, x, y);

    this._degree = 0;
    this._radius = radius;

    // Create the circle graphic
    this.circle = new Phaser.GameObjects.Arc(scene, 0, 0, radius, 0, 360);
    this.circle.setOrigin(0.5, 0.5);
    this.circle.setFillStyle(0xFFFFFF, 0.75);
    this.circle.setStrokeStyle(1, 0x000000);

    // Create the text for the degree
    this.degreeText = new Phaser.GameObjects.Text(scene, 0, 0, '0', {
      fontSize: '16px',
      color: '#000000'
    });
    this.degreeText.setOrigin(0.5, 0.5);

    // Add both to the container
    this.add([this.circle, this.degreeText]);

    // Add container to the scene
    scene.add.existing(this);
  }
  setDegree(degree: number): void {
    this._degree = degree;
    this.degreeText.setText(degree.toString());
  }

  getDegree(): number {
    return this._degree;
  }

  incrementDegree(): void {
    this.setDegree(this._degree + 1);
  }

  decrementDegree(): void {
    if (this._degree > 0) {
      this.setDegree(this._degree - 1);
    }
  }

  setRadius(radius: number): void {
    this._radius = radius;
    this.circle.setRadius(radius);
  }

  getRadius(): number {
    return this._radius;
  }
  highlight(color: number = 0xff0000): void {
    this.circle.setStrokeStyle(3, color);
  }
  unhighlight(): void {
    this.circle.setStrokeStyle(1, 0x000000);
  }
}
