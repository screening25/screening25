package basics;

/*
### 제어문
이 코드는 Java의 핵심 제어문인 if, switch, for, while을 보여줌.
조건에 따른 흐름 제어와 반복 실행의 기본 구조를 연습할 수 있도록 구성함.
*/
public class ControlFlow {
    public static void main(String[] args) {
        // if-else if-else 문
        int score = 85;
        if (score >= 90) {
            System.out.println("A 등급");
        } else if (score >= 80) {
            System.out.println("B 등급");
        } else {
            System.out.println("C 등급");
        }

        // switch 문
        int dayOfWeek = 3;
        switch (dayOfWeek) {
            case 1 -> System.out.println("월요일");
            case 2 -> System.out.println("화요일");
            case 3 -> System.out.println("수요일");
            default -> System.out.println("주말");
        }

        // for 문
        int sum = 0;
        for (int i = 1; i <= 10; i++) {
            sum += i;
        }
        System.out.println("1부터 10까지의 합: " + sum);

        // while 문
        int count = 5;
        while (count > 0) {
            System.out.println("카운트다운: " + count);
            count--;
        }
    }
}
