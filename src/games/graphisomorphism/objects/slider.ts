import Phaser from 'phaser';

export class Slider extends Phaser.GameObjects.Container {
  private readonly widthValue: number;
  private readonly minimum: number;
  private readonly maximum: number;
  private currentValue: number;
  private readonly handle: Phaser.GameObjects.Arc;
  private dragging = false;
  private readonly onChange: (value: number) => void;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    minimum: number,
    maximum: number,
    value: number,
    onChange: (value: number) => void,
  ) {
    super(scene, x, y);
    this.widthValue = width;
    this.minimum = minimum;
    this.maximum = maximum;
    this.currentValue = value;
    this.onChange = onChange;
    scene.add.existing(this);

    const track = scene.add.rectangle(0, 0, width, 8, 0xffffff).setOrigin(0, 0.5).setInteractive();
    this.handle = scene.add.circle(0, 0, 12, 0x2d6cdf).setInteractive({ useHandCursor: true });
    this.add([track, this.handle]);

    track.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.setValueFromPointer(pointer);
    });
    this.handle.on('pointerdown', () => {
      this.dragging = true;
    });
    scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.dragging && pointer.isDown) {
        this.setValueFromPointer(pointer);
      }
    });
    scene.input.on('pointerup', () => {
      this.dragging = false;
    });

    this.setValue(value, false);
  }

  setValue(value: number, notify = true): void {
    this.currentValue = Math.max(this.minimum, Math.min(this.maximum, Math.round(value)));
    const ratio = this.maximum === this.minimum ? 0 : (this.currentValue - this.minimum) / (this.maximum - this.minimum);
    this.handle.x = ratio * this.widthValue;
    if (notify) {
      this.onChange(this.currentValue);
    }
  }

  getValue(): number {
    return this.currentValue;
  }

  private setValueFromPointer(pointer: Phaser.Input.Pointer): void {
    const localX = Math.max(0, Math.min(this.widthValue, pointer.x - this.x));
    const ratio = this.widthValue === 0 ? 0 : localX / this.widthValue;
    this.setValue(this.minimum + ratio * (this.maximum - this.minimum));
  }
}