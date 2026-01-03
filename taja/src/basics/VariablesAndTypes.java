package basics;

/*
### 변수와 자료형
이 코드는 Java의 기본 변수 선언과 다양한 자료형을 보여주는 예제임.
정수, 실수, 문자, 불리언 등 핵심 자료형의 사용법을 연습하기에 적합하도록 구성함.
*/
public class VariablesAndTypes {
    public static void main(String[] args) {
        // 숫자형 변수
        int score = 100;
        long population = 10_000_000_000L;
        float average = 85.5f;
        double pi = 3.1415926535;

        // 문자형 및 논리형 변수
        char grade = 'A';
        String message = "Hello, Java World!";
        boolean isPassed = true;

        System.out.println("점수: " + score);
        System.out.println("세계 인구: " + population);
        System.out.println("평균: " + average);
        System.out.println("원주율: " + pi);
        System.out.println("등급: " + grade);
        System.out.println("메시지: " + message);
        System.out.println("합격 여부: " + isPassed);
    }
}
