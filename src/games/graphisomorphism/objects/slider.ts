import Phaser from 'phaser';

export class Slider extends Phaser.GameObjects.Container {
  private readonly widthValue: number;
  private readonly minimum: number;
  private readonly maximum: number;
  private currentValue: number;
  private readonly track: Phaser.GameObjects.Rectangle;
  private readonly handle: Phaser.GameObjects.Arc;
  private interactionEnabled = true;
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

    this.track = scene.add.rectangle(0, 0, width, 8, 0xffffff).setOrigin(0, 0.5).setInteractive();
    this.handle = scene.add.circle(0, 0, 12, 0x2d6cdf).setInteractive({ useHandCursor: true });
    this.add([this.track, this.handle]);

    this.track.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!this.interactionEnabled) return;
      this.setValueFromPointer(pointer);
    });
    this.handle.on('pointerdown', () => {
      if (!this.interactionEnabled) return;
      this.dragging = true;
    });
    scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.interactionEnabled && this.dragging && pointer.isDown) {
        this.setValueFromPointer(pointer);
      }
    });
    scene.input.on('pointerup', () => {
      this.dragging = false;
    });

    this.setValue(value, false);
  }

  setInteractionEnabled(enabled: boolean): void {
    this.interactionEnabled = enabled;
    this.dragging = false;
    if (enabled) {
      this.track.setFillStyle(0xffffff);
      this.track.setInteractive();
      this.handle.setFillStyle(0x2d6cdf);
      this.handle.setInteractive({ useHandCursor: true });
    }
    else {
      this.track.setFillStyle(0x777777);
      this.track.disableInteractive();
      this.handle.setFillStyle(0x777777);
      this.handle.disableInteractive();
    }
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