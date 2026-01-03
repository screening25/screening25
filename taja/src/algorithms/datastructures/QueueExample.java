package algorithms.datastructures;

import java.util.LinkedList;
import java.util.Queue;

/*
### 큐 (Queue) 활용
이 코드는 큐(Queue) 자료구조의 선입선출(FIFO: First-In-First-Out) 특성을 활용한 작업 대기열 시뮬레이션입니다.
먼저 들어온 작업이 먼저 처리되는 프로세스 스케줄링이나 프린터 대기열 등의 원리를 이해할 수 있습니다.

**주요 메서드:**
- **offer()**: 큐의 맨 뒤에 데이터를 추가합니다. (성공 시 true 반환)
- **poll()**: 큐의 맨 앞에 있는 데이터를 꺼내고 제거합니다. (비어있으면 null 반환)
- **peek()**: 큐의 맨 앞에 있는 데이터를 제거하지 않고 확인만 합니다.
*/

// 작업을 표현하는 클래스
class Task {
    String name;
    int estimatedTime; // 예상 소요 시간

    public Task(String name, int estimatedTime) {
        this.name = name;
        this.estimatedTime = estimatedTime;
    }

    @Override
    public String toString() {
        return name + "(" + estimatedTime + "분)";
    }
}

public class QueueExample {
    public static void main(String[] args) {
        // Task 객체를 저장하는 큐 생성 (LinkedList는 Queue 인터페이스를 구현함)
        Queue<Task> taskQueue = new LinkedList<>();

        // 1. 큐에 작업 추가 (Enqueue)
        System.out.println("=== 작업 등록 시작 ===");
        taskQueue.offer(new Task("보고서 작성", 30));
        taskQueue.offer(new Task("이메일 회신", 10));
        taskQueue.offer(new Task("코드 리뷰", 45));

        System.out.println("현재 대기열 상태: " + taskQueue);
        System.out.println("총 대기 작업 수: " + taskQueue.size());
        System.out.println();

        // 2. 큐에서 작업을 하나씩 꺼내어 처리 (Dequeue)
        System.out.println("=== 작업 처리 시작 ===");
        while (!taskQueue.isEmpty()) {
            // peek()로 다음에 처리할 작업 확인
            Task nextTask = taskQueue.peek();
            System.out.println(">> 다음 처리 예정: " + nextTask.name);

            // poll()로 실제 작업을 꺼내옴
            Task currentTask = taskQueue.poll();
            System.out.println("   [처리 중] " + currentTask.name + " 완료까지 " + currentTask.estimatedTime + "분 소요...");
            
            // 실제 처리가 끝난 후 대기열 상태
            System.out.println("   (남은 대기열: " + taskQueue + ")");
        }

        System.out.println("\n모든 작업이 완료되었습니다.");
    }
}
