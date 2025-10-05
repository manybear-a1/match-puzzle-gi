class Graph {
  int[][] adjMatrix;
  int x, y;
  int height, width;
  Graph(int x, int y, int height, int width) {
    adjMatrix = new int[9][9];
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
  }
  void drawGraph() {
    stroke(0);
    fill(255);
    rect(x, y, width, height);

    // Define spacing between nodes
    int cellWidth = width / 3;
    int cellHeight = height / 3;
    // Draw nodes in 3x3 grid
    for (int i = 0; i < 9; i++) {
      int row = i / 3;
      int col = i % 3;

      // Calculate center position for this node
      int nodeX = x + col * cellWidth + cellWidth/2;
      int nodeY = y + row * cellHeight + cellHeight/2;

      // Draw node
      fill(255);
      stroke(0);
      strokeWeight(1);
      ellipse(nodeX, nodeY, 30, 30);
    }
    // Draw connections based on adjacency matrix - now as matchsticks
    for (int i = 0; i < 9; i++) {
      for (int j = 0; j < i; j++) {
        if (adjMatrix[i][j] == 1) {
          // Calculate positions for nodes i and j
          int row_i = i / 3;
          int col_i = i % 3;
          int row_j = j / 3;
          int col_j = j % 3;

          // Calculate the center positions of the nodes
          int x1 = x + col_i * cellWidth + cellWidth/2;
          int y1 = y + row_i * cellHeight + cellHeight/2;
          int x2 = x + col_j * cellWidth + cellWidth/2;
          int y2 = y + row_j * cellHeight + cellHeight/2;

          // Draw a match instead of a line
          drawMatch(x1, y1, x2, y2);
        }
      }
    }
    for (int i = 0; i < 9; i++) {
      int row = i / 3;
      int col = i % 3;

      // Calculate center position for this node
      int nodeX = x + col * cellWidth + cellWidth/2;
      int nodeY = y + row * cellHeight + cellHeight/2;


      // Draw node degree
      int degree = 0;
      for (int j = 0; j < 9; j++) {
        if (adjMatrix[i][j] == 1) {
          degree++;
        }
      }
      fill(0);
      textAlign(CENTER, CENTER);
      text(degree, nodeX, nodeY);
    }
  }

  // Method to draw a match between two points
  void drawMatch(float x1, float y1, float x2, float y2) {
    // Calculate angle of the match
    float angle = atan2(y2 - y1, x2 - x1);

    // Calculate the length of the match
    float length = dist(x1, y1, x2, y2);

    // Make matches a bit shorter to not overlap with nodes
    float shortenBy = 20; // Adjust based on node size
    float adjustedLength = length - shortenBy;

    // Calculate new endpoints to shorten the match
    float midX = (x1 + x2) / 2;
    float midY = (y1 + y2) / 2;

    // Calculate adjusted start and end points
    float startX = midX - cos(angle) * (adjustedLength / 2);
    float startY = midY - sin(angle) * (adjustedLength / 2);
    float endX = midX + cos(angle) * (adjustedLength / 2);
    float endY = midY + sin(angle) * (adjustedLength / 2);

    pushMatrix();

    // Move to the start position
    translate(startX, startY);
    // Rotate to match angle
    rotate(angle);

    // Draw match stick (tan/beige color)
    noStroke();
    fill(230, 220, 185); // Beige color for the stick
    rectMode(CORNER);
    rect(0, -2, adjustedLength, 4); // Match stick body

    // Draw match head (orange/red color)
    fill(240, 80, 20); // Orange-red for match head
    ellipse(adjustedLength, 0, 10, 8); // Match head

    popMatrix();
  }
}
