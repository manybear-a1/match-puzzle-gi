import Phaser from 'phaser';
import { Match } from './match';
export class Node extends Phaser.GameObjects.Container {
  private circle: Phaser.GameObjects.Arc;
  private degreeText: Phaser.GameObjects.Text;
  private _radius: number;
  private matches: Match[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number, radius: number = 15) {
    super(scene, x, y);

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
    this.setSize(radius * 2, radius * 2);
    //this.setInteractive(this.circle?.input?.hitArea);
    this.setInteractive({
      hitArea: this.circle.input?.hitArea,
      draggable: true,
    });
    this.on('pointerover', () => {
      this.setScale(1.2);
      for (let i = 0; i < this.matches.length; i++) {

        this.matches[i].setHighlighted(true);
        this.matches[i].getStartNode()?.highlight(0x00ffff);
        this.matches[i].getEndNode()?.highlight(0x00ffff);
      }
      this.highlight();
    });
    this.on('pointerout', () => {
      this.setScale(1.0);
      for (let i = 0; i < this.matches.length; i++) {

        this.matches[i].setHighlighted(false);
        this.matches[i].getStartNode()?.unhighlight();
        this.matches[i].getEndNode()?.unhighlight();
      }
      this.unhighlight();
    });
  }
  // add a match to the node
  addMatch(match: Match): void {
    this.matches.push(match);
    this.degreeText.setText(this.getDegree().toString());
  }
  getDegree(): number {
    return this.matches.length / 2;
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

  setPosition(x: number, y: number): this {
    super.setPosition(x, y);
    this.emit('positionChanged');
    return this;
  }
}