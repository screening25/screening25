package basics;

/*
### 연산자
이 코드는 Java의 주요 연산자를 실습하는 예제임.
산술, 관계, 논리 연산자의 기본적인 활용법을 익히는 데 중점을 둠.
*/
public class Operators {
    public static void main(String[] args) {
        int a = 10;
        int b = 3;

        // 산술 연산자
        System.out.println("덧셈: " + (a + b));
        System.out.println("뺄셈: " + (a - b));
        System.out.println("곱셈: " + (a * b));
        System.out.println("나눗셈: " + (a / b));
        System.out.println("나머지: " + (a % b));

        // 관계 연산자
        System.out.println("a > b: " + (a > b));
        System.out.println("a == b: " + (a == b));

        // 논리 연산자
        boolean condition1 = true;
        boolean condition2 = false;
        System.out.println("AND: " + (condition1 && condition2));
        System.out.println("OR: " + (condition1 || condition2));
        System.out.println("NOT: " + !condition1);
    }
}
