package oop;

/*
### 인터페이스
이 코드는 인터페이스의 개념과 구현을 보여주는 예제임.
'Playable' 인터페이스를 'Musician' 클래스가 구현하여 특정 동작을 강제하는 방법을 연습함.
*/
interface Playable {
    void play(); // 추상 메서드
}

class Musician implements Playable {
    private String instrument;

    public Musician(String instrument) {
        this.instrument = instrument;
    }

    @Override
    public void play() {
        System.out.println(instrument + "을(를) 연주합니다.");
    }
}

public class Interface {
    public static void main(String[] args) {
        Playable guitarist = new Musician("기타");
        guitarist.play();
    }
}
