export const chapter13_14 = [
  // Chapter 13: 쓰레드
  {
    id: "13-1-1",
    title: "1.1 프로세스와 쓰레드",
    concept: "프로세스는 실행 중인 프로그램이며, 쓰레드는 프로세스 내에서 작업을 수행하는 실제 단위임. 하나의 프로세스는 여러 쓰레드를 가질 수 있음.",
    code: `public class ThreadEx1 { // 클래스 선언
    public static void main(String args[]) { // 메인 메서드(기본 쓰레드) 시작
        ThreadEx1_1 t1 = new ThreadEx1_1(); // Thread 자손 클래스의 인스턴스 생성

        Runnable r = new ThreadEx1_2(); // Runnable 구현 클래스의 인스턴스 생성
        Thread t2 = new Thread(r); // 생성자 Thread(Runnable target) 사용

        t1.start(); // 쓰레드 t1 실행. 새로운 호출스택에서 run() 호출
        t2.start(); // 쓰레드 t2 실행. 새로운 호출스택에서 run() 호출
    } // 메인 메서드 종료
}

class ThreadEx1_1 extends Thread { // Thread 클래스를 상속받아 쓰레드 구현
    public void run() { // 쓰레드가 수행할 작업
        for(int i=0; i < 5; i++) {
            System.out.println(getName()); // 조상인 Thread의 getName() 호출
        }
    }
}

class ThreadEx1_2 implements Runnable { // Runnable 인터페이스를 구현하여 쓰레드 구현
    public void run() { // 쓰레드가 수행할 작업
        for(int i=0; i < 5; i++) {
            // Thread.currentThread() - 현재 실행중인 쓰레드의 참조 반환
            System.out.println(Thread.currentThread().getName());
        }
    }
}`
  },
  {
    id: "13-5-1",
    title: "5.1 동기화 (synchronized)",
    concept: "synchronized는 여러 쓰레드가 한 객체에 동시에 접근하는 것을 막는 임계 영역(critical section)을 설정함. 획득한 lock은 블록을 벗어나면 자동 해제됨.",
    code: `class Account { // 은행 계좌 클래스
    private int balance = 1000; // 잔고

    public int getBalance() { return balance; }

    public synchronized void withdraw(int money) { // synchronized로 메서드 동기화
        // 현재 쓰레드가 이 객체(Account)의 lock을 획득함
        if(balance >= money) { // 잔고가 충분하면
            try { Thread.sleep(1000); } catch(InterruptedException e) {} // 고의로 지연
            balance -= money; // 출금 수행
        }
    } // 메서드 종료 시 lock 자동 반납
}

class RunnableEx implements Runnable {
    Account acc = new Account(); // 공유 객체

    public void run() {
        while(acc.getBalance() > 0) { // 잔고가 남아있는 동안
            int money = (int)(Math.random() * 3 + 1) * 100; // 100, 200, 300 중 하나
            acc.withdraw(money); // 출금 시도 (동기화된 메서드 호출)
            System.out.println("balance:" + acc.getBalance());
        }
    }
}

public class SyncEx {
    public static void main(String[] args) {
        Runnable r = new RunnableEx();
        new Thread(r).start(); // 쓰레드 1 실행
        new Thread(r).start(); // 쓰레드 2 실행 (같은 Account 객체 공유)
    }
}`
  },
  {
    id: "13-6-1",
    title: "6.1 wait()과 notify()",
    concept: "wait()은 쓰레드를 특정 조건이 만족될 때까지 대기시키고, notify()는 대기 중인 쓰레드 중 하나를 깨움. 반드시 동기화 블록 내에서 사용해야 함.",
    code: `import java.util.ArrayList;

class Customer implements Runnable {
    private Table table;
    Customer(Table table) { this.table = table; }
    public void run() {
        while(true) {
            table.remove(); // 음식을 소비함
            try { Thread.sleep(100); } catch(InterruptedException e) {}
        }
    }
}

class Cook implements Runnable {
    private Table table;
    Cook(Table table) { this.table = table; }
    public void run() {
        while(true) {
            table.add(); // 음식을 추가함
            try { Thread.sleep(10); } catch(InterruptedException e) {}
        }
    }
}

class Table {
    ArrayList<String> dishes = new ArrayList<>();
    final int MAX_FOOD = 6;

    public synchronized void add() { // 요리사가 호출하는 동기화 메서드
        while(dishes.size() >= MAX_FOOD) { // 테이블이 가득 찼으면
            try { wait(); } catch(InterruptedException e) {} // Cook 쓰레드를 대기시킴 (WAITING 상태)
        }
        dishes.add("dish"); // 음식을 추가함
        notify(); // 기다리는 Customer 쓰레드를 깨움 (RUNNABLE 상태로 전환)
        System.out.println("Dishes:" + dishes.toString());
    }

    public synchronized void remove() { // 고객이 호출하는 동기화 메서드
        while(dishes.size() == 0) { // 음식이 없으면
            try { wait(); } catch(InterruptedException e) {} // Customer 쓰레드를 대기시킴
        }
        dishes.remove(0); // 첫 번째 음식을 소비함
        notify(); // 기다리는 Cook 쓰레드를 깨움
    }
}

public class WaitNotifyEx {
    public static void main(String[] args) throws Exception {
        Table table = new Table(); // 공유 객체
        new Thread(new Cook(table)).start(); // Cook 쓰레드 시작
        new Thread(new Customer(table)).start(); // Customer 쓰레드 시작
    }
}`
  },
  // Chapter 14: 람다와 스트림
  {
    id: "14-1-1",
    title: "1.1 람다식(Lambda Expression)",
    concept: "람다식은 메서드를 하나의 '식(expression)'으로 표현한 것으로, 함수형 인터페이스의 익명 객체를 대체할 수 있음.",
    code: `interface MyFunction { // 함수형 인터페이스 (단 하나의 추상 메서드만 가짐)
    int max(int a, int b);
}

public class LambdaEx {
    public static void main(String[] args) {
        // 익명 클래스로 구현
        MyFunction f1 = new MyFunction() {
            public int max(int a, int b) { return a > b ? a : b; }
        };
        
        // 람다식으로 구현 (매개변수) -> { 실행문 }
        MyFunction f2 = (a, b) -> a > b ? a : b;
        
        System.out.println(f1.max(3, 5)); // 5 출력
        System.out.println(f2.max(3, 5)); // 5 출력
    }
}`
  },
  {
    id: "14-2-1",
    title: "2.1 스트림(Stream)의 파이프라인과 지연된 연산",
    concept: "스트림은 데이터 소스를 추상화하고 데이터를 다루는 데 자주 사용되는 메서드들을 정의함. 중간 연산은 지연(lazy)되며, 최종 연산이 수행될 때 비로소 모든 연산이 실행됨.",
    code: `import java.util.stream.Stream;

public class StreamEx {
    public static void main(String[] args) {
        Stream<Integer> stream = Stream.of(1, 2, 3, 4, 5); // 스트림 생성

        Stream<Integer> filteredStream = stream.filter(i -> { // 중간 연산: 짝수만 필터링
            System.out.println("filter: " + i); // 이 라인은 최종 연산 전까지 실행되지 않음 (지연 연산)
            return i % 2 == 0;
        });

        Stream<Integer> mappedStream = filteredStream.map(i -> { // 중간 연산: 각 요소에 10을 곱함
            System.out.println("map: " + i); // 이 라인도 최종 연산 전까지 실행되지 않음
            return i * 10;
        });

        System.out.println("최종 연산 시작");
        mappedStream.forEach(System.out::println); // 최종 연산: 각 요소를 출력. 이때 파이프라인 전체가 동작함
    }
}`
  }
];