package algorithms.datastructures;

import java.util.Stack;

/*
### 스택 (Stack) 활용
이 코드는 스택(Stack) 자료구조를 활용하는 기본 예제임.
후입선출(LIFO) 특성을 이용해 문자열을 뒤집는 간단한 로직을 연습함.
*/
public class StackExample {
    public static void main(String[] args) {
        String original = "Hello World";
        Stack<Character> stack = new Stack<>();

        for (char c : original.toCharArray()) {
            stack.push(c);
        }

        StringBuilder reversed = new StringBuilder();
        while (!stack.isEmpty()) {
            reversed.append(stack.pop());
        }

        System.out.println("원본 문자열: " + original);
        System.out.println("뒤집은 문자열: " + reversed);
    }
}
