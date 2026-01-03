package algorithms.graph;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

/*
### 너비 우선 탐색 (BFS) 기초 구조
이 코드는 그래프 순회 방식인 BFS의 기본 구조를 보여주는 예제임.
큐(Queue)를 사용하여 시작 정점에서 가까운 순서대로 노드를 탐색하는 과정을 연습함.
*/
public class BfsExample {
    public static void search(int start, List<List<Integer>> adj, boolean[] visited) {
        Queue<Integer> queue = new LinkedList<>();
        queue.offer(start);
        visited[start] = true;

        while (!queue.isEmpty()) {
            int v = queue.poll();
            System.out.print(v + " ");

            for (int neighbor : adj.get(v)) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.offer(neighbor);
                }
            }
        }
    }

    public static void main(String[] args) {
        int n = 7; // 정점의 수
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        boolean[] visited = new boolean[n];

        adj.get(0).add(1); adj.get(1).add(0);
        adj.get(0).add(2); adj.get(2).add(0);
        adj.get(1).add(3); adj.get(3).add(1);

        System.out.print("BFS 순회 결과: ");
        search(0, adj, visited); // 0번 노드부터 탐색 시작
    }
}
