package advanced;

import java.util.function.BinaryOperator;

/*
### 람다식 (Lambda)
이 코드는 람다식을 사용하여 코드를 간결하게 만드는 방법을 보여줌.
함수형 인터페이스 'BinaryOperator'와 람다식을 활용해, 두 숫자의 합을 구하는 로직을 간단히 표현하는 방법을 연습함.
*/
public class Lambda {
    public static void main(String[] args) {
        // (두 개의 매개변수) -> { 실행문 }
        BinaryOperator<Integer> adder = (a, b) -> a + b;

        int result = adder.apply(5, 3);
        System.out.println("람다식을 이용한 덧셈: " + result);
    }
}
