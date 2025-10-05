class InteractiveGraph extends Graph {
  int selectedVertex = -1;
  boolean isDragging = false;
  int moved_count = 0;
  InteractiveGraph(int x, int y, int height, int width) {
    super(x, y, height, width);
  }

  void handleMousePressed() {
    int vertex = getVertexUnderMouse();
    if (vertex != -1) {
      selectedVertex = vertex;
      isDragging = true;
    }
  }

  void handleMouseDragged() {
    // Visual feedback handled in drawGraph
  }

  void handleMouseReleased() {
    if (isDragging) {
      int targetVertex = getVertexUnderMouse();
      if (targetVertex != -1 && targetVertex != selectedVertex) {
        // Swap vertices
        swapVertices(selectedVertex, targetVertex);
      }
      isDragging = false;
      selectedVertex = -1;
    }
  }

  int getVertexUnderMouse() {
    int cellWidth = width / 3;
    int cellHeight = height / 3;

    // Check if mouse is within the graph area
    if (mouseX < x || mouseX > x + width || mouseY < y || mouseY > y + height) {
      return -1;
    }

    // Calculate which cell the mouse is in
    int col = (mouseX - x) / cellWidth;
    int row = (mouseY - y) / cellHeight;

    // Calculate the center of the cell
    int centerX = x + col * cellWidth + cellWidth/2;
    int centerY = y + row * cellHeight + cellHeight/2;

    // Check if the mouse is near enough to the center (within the node radius)
    if (dist(mouseX, mouseY, centerX, centerY) <= 15) { // Using 15 as radius (half of 30)
      return row * 3 + col; // Convert row and column to vertex index
    }

    return -1; // Not on any vertex
  }

  void swapVertices(int v1, int v2) {
    // Swap the connections in the adjacency matrix
    for (int i = 0; i < 9; i++) {
      if (i == v1 || i == v2) continue;
      // Swap connections to other vertices
      int temp = adjMatrix[v1][i];
      adjMatrix[v1][i] = adjMatrix[v2][i];
      adjMatrix[v2][i] = temp;

      // Swap connections from other vertices
      temp = adjMatrix[i][v1];
      adjMatrix[i][v1] = adjMatrix[i][v2];
      adjMatrix[i][v2] = temp;
    }

    moved_count++;
  }

  @Override
    void drawGraph() {
    super.drawGraph();

    // Add visual feedback for dragging
    if (isDragging && selectedVertex != -1) {
      int row = selectedVertex / 3;
      int col = selectedVertex % 3;
      int cellWidth = width / 3;
      int cellHeight = height / 3;

      // Draw a highlighted circle around the selected vertex
      stroke(255, 0, 0);
      strokeWeight(2);
      noFill();
      ellipse(
        x + col * cellWidth + cellWidth/2,
        y + row * cellHeight + cellHeight/2,
        35, 35
        );

      // Draw a line from the selected vertex to the mouse position
      line(
        x + col * cellWidth + cellWidth/2,
        y + row * cellHeight + cellHeight/2,
        mouseX, mouseY
        );

      strokeWeight(1);
    }
    if (getVertexUnderMouse() != -1 && !isDragging) {
      cursor(HAND);
    } else {
      cursor(ARROW);
    }

    if (getVertexUnderMouse() != selectedVertex && getVertexUnderMouse() != -1 && isDragging) {

      int row = getVertexUnderMouse() / 3;
      int col = getVertexUnderMouse() % 3;
      int cellWidth = width / 3;
      int cellHeight = height / 3;

      // Draw a highlighted circle around the selected vertex
      stroke(255, 0, 0);
      strokeWeight(2);
      noFill();
      ellipse(
        x + col * cellWidth + cellWidth/2,
        y + row * cellHeight + cellHeight/2,
        35, 35
        );
      strokeWeight(1);
    }
  }
}
