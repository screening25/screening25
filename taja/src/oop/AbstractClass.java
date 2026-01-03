package oop;

/*
### 추상 클래스
이 코드는 추상 클래스의 개념을 설명하는 예제임.
'GameObject' 추상 클래스를 만들어, 자식 클래스에서 반드시 구현해야 할 메서드를 정의하는 방법을 연습함.
*/
abstract class GameObject {
    abstract void draw(); // 추상 메서드

    void showStatus() {
        System.out.println("게임 오브젝트 상태를 표시합니다.");
    }
}

class Player extends GameObject {
    @Override
    void draw() {
        System.out.println("플레이어를 화면에 그립니다.");
    }
}

public class AbstractClass {
    public static void main(String[] args) {
        GameObject player = new Player();
        player.draw(); // 오버라이드된 메서드
        player.showStatus(); // 부모 클래스의 메서드
    }
}
