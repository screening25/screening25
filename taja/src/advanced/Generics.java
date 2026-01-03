package advanced;

/*
### 제네릭 (Generics)
이 코드는 제네릭을 사용하여 타입 안정성을 높이는 방법을 보여줌.
어떤 타입의 객체든 저장할 수 있는 'Box' 클래스를 통해, 컴파일 시 타입 오류를 잡는 제네릭의 장점을 실습함.
*/
class Box<T> {
    private T content;

    public void setContent(T content) {
        this.content = content;
    }

    public T getContent() {
        return content;
    }
}

public class Generics {
    public static void main(String[] args) {
        Box<String> stringBox = new Box<>();
        stringBox.setContent("문자열");
        System.out.println("문자열 박스: " + stringBox.getContent());

        Box<Integer> integerBox = new Box<>();
        integerBox.setContent(123);
        System.out.println("정수 박스: " + integerBox.getContent());
    }
}
