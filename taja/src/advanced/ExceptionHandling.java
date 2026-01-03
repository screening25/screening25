package advanced;

/*
### 예외 처리 (Try-Catch)
이 코드는 예외 처리의 기본인 try-catch-finally 구조를 보여줌.
잘못된 연산으로 발생하는 'ArithmeticException'을 처리하여 프로그램의 비정상 종료를 방지하는 방법을 연습함.
*/
public class ExceptionHandling {
    public static void main(String[] args) {
        try {
            int result = 10 / 0; // 예외 발생 지점
            System.out.println("결과: " + result);
        } catch (ArithmeticException e) {
            System.out.println("오류 발생: 0으로 나눌 수 없습니다.");
            // e.printStackTrace();
        } finally {
            System.out.println("예외 처리 후 항상 실행되는 부분입니다.");
        }
        System.out.println("프로그램이 정상적으로 종료되었습니다.");
    }
}
