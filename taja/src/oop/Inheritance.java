package oop;

/*
### 상속
이 코드는 클래스 상속의 기본 구조를 보여주는 예제임.
'Animal' 부모 클래스를 'Dog' 자식 클래스가 확장하며, 메서드 재정의(overriding)를 실습함.
*/
class Animal {
    void makeSound() {
        System.out.println("동물이 소리를 냅니다.");
    }
}

class Dog extends Animal {
    @Override
    void makeSound() {
        System.out.println("멍멍!");
    }

    void fetch() {
        System.out.println("강아지가 공을 가져옵니다.");
    }
}

public class Inheritance {
    public static void main(String[] args) {
        Dog myDog = new Dog();
        myDog.makeSound(); // 재정의된 메서드 호출
        myDog.fetch();
    }
}
