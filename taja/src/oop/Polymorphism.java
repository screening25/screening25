package oop;

/*
### 다형성
이 코드는 다형성의 핵심 원리를 보여주는 예제임.
부모 클래스 타입의 참조 변수로 자식 클래스 객체를 다루며, 다양한 형태의 객체를 일관되게 처리하는 방법을 실습함.
*/
class Shape {
    void draw() {
        System.out.println("도형을 그립니다.");
    }
}

class Circle extends Shape {
    @Override
    void draw() {
        System.out.println("원을 그립니다.");
    }
}

class Rectangle extends Shape {
    @Override
    void draw() {
        System.out.println("사각형을 그립니다.");
    }
}

public class Polymorphism {
    public static void main(String[] args) {
        Shape[] shapes = {new Circle(), new Rectangle()};

        for (Shape s : shapes) {
            s.draw(); // 같은 메서드 호출, 다른 결과 출력
        }
    }
}
