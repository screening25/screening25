package oop;

/*
### 클래스와 객체
이 코드는 클래스와 객체의 기본 개념을 설명하는 예제임.
'Car' 클래스를 정의하고, 그 객체를 생성하여 속성과 동작을 사용하는 방법을 연습함.
*/
class Car {
    String model;
    int year;

    void drive() {
        System.out.println(model + "이(가) 주행합니다.");
    }
}

public class ClassAndObject {
    public static void main(String[] args) {
        Car myCar = new Car();
        myCar.model = "제네시스 G80";
        myCar.year = 2023;

        System.out.println("내 차 모델: " + myCar.model);
        System.out.println("연식: " + myCar.year);
        myCar.drive();
    }
}
