class Button {
  int x, y;
  int width, height;
  String label;
  color buttonColor;
  color textColor;
  color hoverColor;
  boolean isVisible;

  Button(int x, int y, int width, int height, String label) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.label = label;
    this.buttonColor = color(0, 150, 0);
    this.textColor = color(255);
    this.hoverColor = color(0, 180, 0);
    this.isVisible = false;
  }

  void draw() {
    if (!isVisible) return;

    // Check if mouse is over button
    boolean hover = isMouseOver();

    // Draw button with appropriate color
    noStroke();
    fill(hover ? hoverColor : buttonColor);
    rect(x, y, width, height, 10); // Rounded rectangle

    // Draw label
    fill(textColor);
    textAlign(CENTER, CENTER);
    textSize(24);
    text(label, x + width/2, y + height/2);
  }

  boolean isMouseOver() {
    return isVisible &&
      mouseX >= x && mouseX <= x + width &&
      mouseY >= y && mouseY <= y + height;
  }

  boolean isClicked() {
    return isMouseOver() && mousePressed;
  }

  void setVisible(boolean visible) {
    this.isVisible = visible;
  }
}

