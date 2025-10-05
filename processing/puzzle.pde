class Puzzle {
  Graph graph;
  InteractiveGraph igraph;
  int[] permutation; // Store the permutation for reference
  Button nextPuzzleButton;
  boolean buttonPressed = false;
  int minstep = -1;
  PuzzleSolver solver = new PuzzleSolver();
  Puzzle() {
    graph = new Graph(640, 0, 720, 640);
    igraph = new InteractiveGraph(0, 0, 720, 640);

    reset();

    // Create the "Next Puzzle" button
    nextPuzzleButton = new Button(width/2 - 100, height/2 + 100, 200, 60, "Next Puzzle");
    nextPuzzleButton.setVisible(false);
  }


  void generateRandomGraph() {
    // Reset the adjacency matrix
    for (int i = 0; i < 9; i++) {
      for (int j = 0; j < 9; j++) {
        graph.adjMatrix[i][j] = 0;
      }
    }

    // Add edges with 1/3 probability
    for (int i = 0; i < 9; i++) {
      for (int j = i+1; j < 9; j++) { // Only consider upper triangle to avoid duplicates
        if (random(1) < 0.3) {
          // Add an undirected edge (both directions)
          graph.adjMatrix[i][j] = 1;
          graph.adjMatrix[j][i] = 1;
        }
      }
    }
  }

  void applyRandomPermutation() {
    // Create a random permutation
    permutation = new int[9];
    for (int i = 0; i < 9; i++) {
      permutation[i] = i;
    }

    // Shuffle the permutation (Fisher-Yates algorithm)
    for (int i = 8; i > 0; i--) {
      int j = (int)random(i + 1);
      int temp = permutation[i];
      permutation[i] = permutation[j];
      permutation[j] = temp;
    }
    println("Permutation applied to create the puzzle:");
    for (int i = 0; i < 9; i++) {
      print(permutation[i] + " ");
    }
    // Apply the permutation to create the interactive graph
    for (int i = 0; i < 9; i++) {
      for (int j = 0; j < 9; j++) {
        igraph.adjMatrix[permutation[i]][permutation[j]] = graph.adjMatrix[i][j];
      }
    }
    igraph.moved_count = 0;
  }

  void reset() {

    // Generate a random graph with 1/3 probability for edges
    generateRandomGraph();

    // Apply a random permutation to create the interactive graph
    applyRandomPermutation();

    // Calculate minimum steps to solve the puzzle
    minstep = solver.solve(graph.adjMatrix, igraph.adjMatrix);
    println("Minimum steps to solve the puzzle: " + minstep);
  }

  // Method to check if the interactive graph matches the original graph
  boolean isPuzzleSolved() {
    for (int i = 0; i < 9; i++) {
      for (int j = 0; j < 9; j++) {
        if (graph.adjMatrix[i][j] != igraph.adjMatrix[i][j]) {
          return false;
        }
      }
    }
    return true;
  }
  void draw() {
    graph.drawGraph();
    igraph.drawGraph();

    // Display minimum steps
    fill(0);
    textSize(24);
    textAlign(LEFT, TOP);
    text("Minimum steps to solve: " + minstep, 10, 10);
    text("Your moves: " + igraph.moved_count, 10, 40);
    text("Your score: " + (igraph.moved_count == 0 ? 100 : (minstep/(float)igraph.moved_count * 100)), 10, 70);

    // Show success message if puzzle is solved
    if (isPuzzleSolved()) {
      fill(0, 150, 0);
      textSize(100);
      textAlign(CENTER, CENTER);
      text("Puzzle Solved!", width/2, height/2 - 50);
      textSize(24);
      text("Your score:" +(igraph.moved_count == 0 ? 100 : (minstep/(float)igraph.moved_count * 100)), width/2, height/2);


      // Show the "Next Puzzle" button
      nextPuzzleButton.setVisible(true);
      nextPuzzleButton.draw();
    } else {
      // Hide the button if puzzle isn't solved
      nextPuzzleButton.setVisible(false);
    }
  }

  void mousePressed() {
    // Handle button click for next puzzle
    if (nextPuzzleButton.isMouseOver()) {
      buttonPressed = true;
    } else {
      igraph.handleMousePressed();
    }
  }

  void mouseDragged() {
    // Don't drag nodes if we're pressing the button
    if (!buttonPressed) {
      igraph.handleMouseDragged();
    }
  }

  void mouseReleased() {
    // Check if button was pressed and is still under mouse
    if (buttonPressed && nextPuzzleButton.isMouseOver()) {
      reset();
    } else {
      igraph.handleMouseReleased();
      println("Current adjacency matrices of graph:");
      for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
          print(graph.adjMatrix[i][j] + " ");
        }
        print("\n");
      }
      println("Interactive graph adjacency matrix:");
      for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
          print(igraph.adjMatrix[i][j] + " ");
        }
        print("\n");
      }
    }

    // Reset button state
    buttonPressed = false;
  }
}
