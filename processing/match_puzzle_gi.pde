int width = 1280;
int height = 720;
Puzzle puzzle;

void settings() {
  size(width, height);
}

void setup() {
  // Initialize the graphs

  puzzle = new Puzzle();
  textSize(24);
}

void draw() {
  background(220);
  puzzle.draw();
}


void mousePressed() {
  puzzle.mousePressed();
}

void mouseDragged() {
  puzzle.mouseDragged();
}

void mouseReleased() {
  puzzle.mouseReleased();
}
