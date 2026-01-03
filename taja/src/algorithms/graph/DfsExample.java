package algorithms.graph;

import java.util.ArrayList;
import java.util.List;

/*
### 깊이 우선 탐색 (DFS) 기초 구조
이 코드는 그래프 순회 방식인 DFS의 기본 구조를 보여주는 예제임.
재귀 호출을 이용해 한 분기를 끝까지 탐색하고 돌아오는 과정을 연습할 수 있음.
*/
public class DfsExample {
    static List<List<Integer>> adj;
    static boolean[] visited;

    public static void search(int v) {
        visited[v] = true;
        System.out.print(v + " ");

        for (int neighbor : adj.get(v)) {
            if (!visited[neighbor]) {
                search(neighbor);
            }
        }
    }

    public static void main(String[] args) {
        int n = 7; // 정점의 수
        adj = new ArrayList<>();
        visited = new boolean[n];
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());

        // 간선 연결 (0-based)
        adj.get(0).add(1); adj.get(1).add(0);
        adj.get(0).add(2); adj.get(2).add(0);
        adj.get(1).add(3); adj.get(3).add(1);
        adj.get(1).add(4); adj.get(4).add(1);

        System.out.print("DFS 순회 결과: ");
        search(0); // 0번 노드부터 탐색 시작
    }
}
