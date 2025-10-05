import java.util.Queue;
import java.util.ArrayDeque;
import java.util.HashMap;
import java.util.Map;

class PuzzleSolver {
  boolean isSolved(int[][] adjMatrix1, int[][] adjMatrix2) {
    for (int i = 0; i < 9; i++) {
      for (int j = 0; j < 9; j++) {
        if (adjMatrix1[i][j] != adjMatrix2[i][j]) {
          return false;
        }
      }
    }
    return true;
  }
  //BFSを使って順列を全探索して最短手数を求め

  
  int solve(int[][] startMatrix, int[][] targetMatrix ) {
    Queue<String> queue = new ArrayDeque<>();
    Map<String, Integer> map = new HashMap<>();
    queue.add("012345678");
    map.put("012345678", 0);
    while (!queue.isEmpty()) {
      String current = queue.poll();
      int step = map.get(current);
      // 現在の順列に基づいて隣接行列を生成
      int[][] currentMatrix = new int[9][9];
      for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
          currentMatrix[i][j] = startMatrix[current.charAt(i) - '0'][current.charAt(j) - '0'];
        }
      }
      // 目標の隣接行列と一致するか確認
      if (isSolved(currentMatrix, targetMatrix)) {
        return step;
      }
      // 順列の全ての隣接交換を試みる
      for (int i = 0; i < 9; i++) {
        for (int j = i + 1; j < 9; j++) {
          char[] chars = current.toCharArray();
          // 順列のi番目とj番目を交換
          char temp = chars[i];
          chars[i] = chars[j];
          chars[j] = temp;
          String next = new String(chars);
          if (!map.containsKey(next)) {
            map.put(next, step + 1);
            queue.add(next);
          }
        }
      }
    }
    return -1; // 解が見つからなかった場合(通常はありえない)
  }
}
