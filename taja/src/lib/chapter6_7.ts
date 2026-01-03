export const chapter6_7 = [
  // Chapter 6: 객체지향 프로그래밍 I
  {
    id: "6-1-1",
    title: "1.1 클래스와 객체",
    concept: "클래스는 객체를 정의해 놓은 설계도이며, 객체는 클래스에 정의된 대로 메모리에 생성된 실체임. 인스턴스화는 클래스로부터 객체를 만드는 과정임.",
    code: `class Tv { // Tv 클래스 정의 (설계도)
    // 속성 (멤버 변수)
    String color; // 색상
    boolean power; // 전원 상태
    int channel; // 채널

    // 기능 (메서드)
    void power() { power = !power; } // 전원 켜기/끄기
    void channelUp() { ++channel; } // 채널 높이기
    void channelDown() { --channel; } // 채널 낮추기
}

public class TvTest {
    public static void main(String[] args) {
        Tv t; // Tv 인스턴스를 참조하기 위한 변수 t 선언 (Stack 영역)
        t = new Tv(); // Tv 인스턴스를 생성하고 그 주소를 t에 저장함 (Heap 영역에 객체 생성)
        
        t.channel = 7; // 인스턴스 t의 멤버변수 channel에 7을 저장함
        t.channelDown(); // 인스턴스 t의 메서드 channelDown()을 호출함
        
        System.out.println("현재 채널은 " + t.channel + " 입니다."); // 6 출력됨
    } // main 메서드 끝
}`
  },
  {
    id: "6-2-1",
    title: "2.1 변수의 종류",
    concept: "변수는 선언 위치에 따라 클래스 변수(static), 인스턴스 변수, 지역 변수로 나뉨. 클래스 변수는 모든 인스턴스가 공유하는 공통된 값을 가짐.",
    code: `class Card {
    String kind; // 인스턴스 변수: 객체 생성 시 Heap에 생성됨. 각 카드마다 고유한 값 가짐
    int number; // 인스턴스 변수
    static int width = 100; // 클래스 변수: 클래스 로딩 시 Method Area에 생성됨. 모든 객체가 공유함
    static int height = 250; // 클래스 변수
}

public class CardTest {
    public static void main(String[] args) {
        System.out.println("Card.width = " + Card.width); // 객체 생성 없이 클래스 이름으로 접근 가능함
        System.out.println("Card.height = " + Card.height); // 클래스 변수는 언제나 접근 가능함

        Card c1 = new Card(); // c1 인스턴스 생성 (Heap)
        c1.kind = "Heart"; // 인스턴스 변수 설정
        c1.number = 7; // 인스턴스 변수 설정

        Card c2 = new Card(); // c2 인스턴스 생성 (Heap)
        c2.kind = "Spade"; // 인스턴스 변수 설정
        c2.number = 4; // 인스턴스 변수 설정

        // c1의 width를 변경하면 static 변수이므로 c2의 width도 변경됨 (공유 메모리)
        c1.width = 50; 
        c1.height = 80;

        System.out.println("c1 width: " + c1.width + ", c2 width: " + c2.width); // 둘 다 50 출력됨
    } // main 메서드 끝
}`
  },
  {
    id: "6-3-1",
    title: "3.1 JVM 메모리 구조와 메서드",
    concept: "메서드 호출 시 호출 스택(Call Stack)에 메모리가 할당되며, 메서드가 종료되면 해제됨. 기본형 매개변수는 값이 복사되고, 참조형은 주소가 복사됨.",
    code: `class Data { int x; } // 데이터를 저장할 클래스

public class PrimitiveParamEx {
    public static void main(String[] args) {
        Data d = new Data(); // 객체 생성 (Heap)
        d.x = 10; // 멤버 변수 초기화
        System.out.println("main() : x = " + d.x); // 10 출력

        change(d.x); // 기본형 매개변수 전달 (값 10만 복사됨)
        System.out.println("After change(d.x)");
        System.out.println("main() : x = " + d.x); // 여전히 10 (변경되지 않음)
        
        changeObj(d); // 참조형 매개변수 전달 (객체의 주소가 복사됨)
        System.out.println("After changeObj(d)");
        System.out.println("main() : x = " + d.x); // 1000 (변경됨)
    } // main 메서드 끝

    static void change(int x) { // 기본형 매개변수 x는 스택에 생성됨
        x = 1000; // 지역변수 x의 값만 변경됨. 원본 d.x에는 영향 없음
        System.out.println("change() : x = " + x); // 1000 출력
    } // change 메서드 종료 시 스택에서 x 사라짐
    
    static void changeObj(Data d) { // 참조형 매개변수 d는 원본과 같은 객체를 가리킴
        d.x = 1000; // 주소를 통해 Heap에 있는 객체의 실제 값을 변경함
        System.out.println("changeObj() : x = " + d.x); // 1000 출력
    } // changeObj 메서드 종료
}`
  },
  {
    id: "6-4-1",
    title: "4.1 오버로딩(Overloading)",
    concept: "한 클래스 내에 같은 이름의 메서드를 여러 개 정의하는 것을 오버로딩이라 함. 매개변수의 개수나 타입이 달라야 성립함.",
    code: `public class OverloadingTest {
    public static void main(String[] args) {
        MyMath3 mm = new MyMath3(); // 객체 생성
        
        System.out.println("mm.add(3, 3) 결과:" + mm.add(3, 3)); // int, int 호출
        System.out.println("mm.add(3L, 3) 결과:" + mm.add(3L, 3)); // long, int 호출
        System.out.println("mm.add(3, 3L) 결과:" + mm.add(3, 3L)); // int, long 호출
        System.out.println("mm.add(3L, 3L) 결과:" + mm.add(3L, 3L)); // long, long 호출
        
        int[] a = {100, 200, 300};
        System.out.println("mm.add(a) 결과: " + mm.add(a)); // 배열 매개변수 호출
    } // main 메서드 끝
}

class MyMath3 {
    int add(int a, int b) { // 기본 메서드
        System.out.print("int add(int a, int b) - ");
        return a + b;
    }
    
    long add(long a, int b) { // 매개변수 타입이 다름 (오버로딩 성립)
        System.out.print("long add(long a, int b) - ");
        return a + b;
    }
    
    long add(int a, long b) { // 매개변수 순서가 다름 (오버로딩 성립)
        System.out.print("long add(int a, long b) - ");
        return a + b;
    }
    
    long add(long a, long b) { // 매개변수 타입이 다름 (오버로딩 성립)
        System.out.print("long add(long a, long b) - ");
        return a + b;
    }
    
    int add(int[] a) { // 배열을 매개변수로 받음 (오버로딩 성립)
        System.out.print("int add(int[] a) - ");
        int result = 0;
        for(int i=0; i < a.length; i++) result += a[i];
        return result;
    }
}`
  },
  {
    id: "6-5-1",
    title: "5.1 생성자(Constructor)와 this",
    concept: "생성자는 인스턴스 초기화 메서드임. this()는 같은 클래스의 다른 생성자를 호출할 때, this는 인스턴스 자신을 가리킬 때 사용함.",
    code: `class Car {
    String color; // 색상
    String gearType; // 변속기 종류
    int door; // 문의 개수

    Car() { // 기본 생성자
        this("white", "auto", 4); // 다른 생성자 호출 (초기화 위임). 반드시 첫 줄이어야 함
    }

    Car(String color) { // 매개변수가 하나인 생성자
        this(color, "auto", 4); // 다른 생성자 호출
    }

    Car(String color, String gearType, int door) { // 매개변수가 있는 생성자
        this.color = color; // this.color는 인스턴스 변수, color는 매개변수(지역변수)
        this.gearType = gearType; // 이름이 같을 때 구분을 위해 this 사용
        this.door = door;
    }
}

public class CarTest {
    public static void main(String[] args) {
        Car c1 = new Car(); // 기본 생성자 호출 -> "white", "auto", 4 로 초기화됨
        Car c2 = new Car("blue"); // "blue", "auto", 4 로 초기화됨

        System.out.println("c1: " + c1.color + ", " + c1.gearType + ", " + c1.door);
        System.out.println("c2: " + c2.color + ", " + c2.gearType + ", " + c2.door);
    } // main 메서드 끝
}`
  },
  // Chapter 7: 객체지향 프로그래밍 II
  {
    id: "7-1-1",
    title: "1.1 상속(Inheritance)",
    concept: "상속은 기존 클래스를 재사용하여 새로운 클래스를 작성하는 것임. 자손 클래스는 조상 클래스의 모든 멤버를 상속받음 (생성자, 초기화 블록 제외).",
    code: `class Tv { // 조상 클래스
    boolean power; // 전원 상태
    int channel; // 채널

    void power() { power = !power; }
    void channelUp() { ++channel; }
    void channelDown() { --channel; }
}

class CaptionTv extends Tv { // Tv 클래스를 상속받은 자손 클래스
    boolean caption; // 캡션 상태 (자손 클래스에만 있는 속성)

    void displayCaption(String text) {
        if (caption) { // 캡션 상태가 true일 때만 텍스트를 보여줌
            System.out.println(text);
        }
    }
}

public class CaptionTvTest {
    public static void main(String[] args) {
        CaptionTv ctv = new CaptionTv(); // 자손 클래스 인스턴스 생성
        ctv.channel = 10; // 조상 클래스로부터 상속받은 멤버 사용 가능
        ctv.channelUp(); // 조상 클래스의 메서드 사용 가능
        
        System.out.println(ctv.channel); // 11 출력
        
        ctv.displayCaption("Hello, World"); // 캡션이 꺼져있어서 출력 안됨
        ctv.caption = true; // 캡션 켜기
        ctv.displayCaption("Hello, World"); // 출력됨
    } // main 메서드 끝
}`
  },
  {
    id: "7-2-1",
    title: "2.1 오버라이딩(Overriding)",
    concept: "조상 클래스로부터 상속받은 메서드의 내용을 변경하는 것을 오버라이딩이라고 함. 이름, 매개변수, 리턴타입이 같아야 함.",
    code: `class Point {
    int x;
    int y;

    String getLocation() { // 좌표를 문자열로 반환하는 메서드
        return "x:" + x + ", y:" + y;
    }
}

class Point3D extends Point { // Point 상속
    int z; // z축 좌표 추가

    // 오버라이딩: 조상의 getLocation()을 재정의함
    String getLocation() { 
        return "x:" + x + ", y:" + y + ", z:" + z; // z좌표까지 포함하도록 변경
    }
}

public class OverrideTest {
    public static void main(String[] args) {
        Point3D p = new Point3D();
        p.x = 3;
        p.y = 5;
        p.z = 7;
        
        System.out.println(p.getLocation()); // 오버라이딩된 메서드가 호출됨
    } // main 메서드 끝
}`
  },
  {
    id: "7-3-1",
    title: "3.1 다형성(Polymorphism)",
    concept: "다형성은 조상 타입의 참조변수로 자손 타입의 객체를 다루는 것임. 이를 통해 여러 종류의 객체를 하나의 배열로 다루거나 매개변수로 받을 수 있음.",
    code: `class Product {
    int price; // 제품 가격
    int bonusPoint; // 보너스 점수

    Product(int price) {
        this.price = price;
        bonusPoint = (int)(price / 10.0); // 보너스 점수는 가격의 10%
    }
}

class Tv extends Product {
    Tv() { super(100); } // 조상 생성자 호출, 가격 100
    public String toString() { return "Tv"; }
}

class Computer extends Product {
    Computer() { super(200); } // 가격 200
    public String toString() { return "Computer"; }
}

class Buyer { // 물건을 사는 사람
    int money = 1000; // 소유 금액
    int bonusPoint = 0; // 보너스 점수

    void buy(Product p) { // 다형성 적용: Product의 자손들은 모두 매개변수로 올 수 있음
        if(money < p.price) {
            System.out.println("잔액이 부족합니다.");
            return;
        }
        money -= p.price; // 가진 돈에서 제품 가격을 뺌
        bonusPoint += p.bonusPoint; // 보너스 점수 추가
        System.out.println(p + "을/를 구입하셨습니다.");
    }
}

public class PolyArgumentTest {
    public static void main(String[] args) {
        Buyer b = new Buyer();
        
        b.buy(new Tv()); // Product p = new Tv(); 와 같음 (업캐스팅)
        b.buy(new Computer()); // Product p = new Computer(); 와 같음

        System.out.println("현재 남은 돈은 " + b.money + "만원입니다.");
        System.out.println("현재 보너스점수는 " + b.bonusPoint + "점입니다.");
    } // main 메서드 끝
}`
  },
  {
    id: "7-4-1",
    title: "4.1 추상 클래스(Abstract Class)",
    concept: "미완성 메서드(추상 메서드)를 포함하고 있는 클래스임. 인스턴스를 생성할 수 없으며, 상속을 통해 자손 클래스에서 완성되어야 함.",
    code: `abstract class Player { // 추상 클래스
    boolean pause; // 일시정지 상태
    int currentPos; // 현재 위치

    Player() { // 생성자
        pause = false;
        currentPos = 0;
    }
    
    // 추상 메서드: 몸통({})이 없음. 자손에서 반드시 구현해야 함
    abstract void play(int pos); 
    abstract void stop();

    void play() { // 일반 메서드
        play(currentPos); // 추상 메서드 호출 가능 (나중에 구현될 것이므로)
    }
}

class CDPlayer extends Player { // 추상 클래스 상속
    // 추상 메서드 구현 (오버라이딩)
    void play(int pos) {
        System.out.println("CDPlayer plays from " + pos);
    }

    void stop() {
        System.out.println("CDPlayer stops");
    }
}

public class AbstractTest {
    public static void main(String[] args) {
        // Player p = new Player(); // 에러. 추상 클래스는 인스턴스 생성 불가
        Player p = new CDPlayer(); // 다형성 이용: 조상 타입 참조변수로 자손 객체 참조
        p.play(100); // 실제 구현된 CDPlayer의 play()가 실행됨
        p.stop();
    } // main 메서드 끝
}`
  },
  {
    id: "7-5-1",
    title: "5.1 인터페이스(Interface)",
    concept: "일종의 추상 클래스이지만 추상 메서드와 상수만을 멤버로 가질 수 있음. 구현 강제와 다중 상속의 효과를 낼 수 있음.",
    code: `interface Fightable { // 인터페이스 정의
    void move(int x, int y); // public abstract가 생략됨
    void attack(Fightable f); // public abstract가 생략됨
}

class Fighter implements Fightable { // 인터페이스 구현
    public void move(int x, int y) { // 오버라이딩 시 조상보다 접근제어자가 좁으면 안되므로 public 필수
        System.out.println("이동: " + x + ", " + y);
    }
    
    public void attack(Fightable f) {
        System.out.println(f + "를 공격");
    }
}

public class InterfaceTest {
    public static void main(String[] args) {
        Fighter f = new Fighter();

        if (f instanceof Fightable) { // 인터페이스 타입으로 형변환 가능 확인
            System.out.println("f는 Fightable 인터페이스를 구현했습니다.");
        }
        
        f.move(100, 200);
        f.attack(new Fighter());
    } // main 메서드 끝
}`
  },
  {
    id: "7-6-1",
    title: "6.1 익명 클래스(Anonymous Class)",
    concept: "이름이 없는 일회용 클래스로, 클래스의 선언과 객체의 생성을 동시에 함. 주로 이벤트 처리나 일회성 객체가 필요할 때 사용함.",
    code: `import java.awt.*;
import java.awt.event.*;

public class AnonymousClassEx {
    public static void main(String[] args) {
        Button b = new Button("Start");
        
        // 익명 클래스 사용 예
        // ActionListener 인터페이스를 구현한 클래스를 즉석에서 정의하고 객체 생성
        b.addActionListener(new ActionListener() { 
            public void actionPerformed(ActionEvent e) {
                System.out.println("ActionEvent occurred!!!");
            }
        });
        
        // 비교: 일반적인 클래스 정의 및 사용
        // class MyHandler implements ActionListener { ... }
        // b.addActionListener(new MyHandler());
    } // main 메서드 끝
}
// *참고: 자바 8부터는 람다식으로 더 간결하게 표현 가능함
// b.addActionListener(e -> System.out.println("ActionEvent occurred!!!"));`
  }
];