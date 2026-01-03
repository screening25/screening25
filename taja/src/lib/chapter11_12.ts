export const chapter11_12 = [
  // Chapter 11: 컬렉션 프레임웍
  {
    id: "11-1-1",
    title: "1.1 ArrayList",
    concept: "ArrayList는 기존의 Vector를 개선한 것으로, Object 배열을 이용하여 데이터를 순차적으로 저장함. 배열의 크기가 부족하면 자동으로 늘어남.",
    code: `import java.util.*;

public class ArrayListEx {
    public static void main(String[] args) {
        ArrayList<Integer> list = new ArrayList<>(10); // 초기 용량 10인 ArrayList 생성
        
        list.add(5); // 값 5 추가. 시간복잡도 O(1) (재할당 없을 시)
        list.add(4);
        list.add(2);
        list.add(0);
        list.add(1);
        list.add(3);

        List<Integer> sub = list.subList(1, 4); // 인덱스 1부터 3까지의 부분 리스트 (뷰) 반환
        Collections.sort(sub); // 부분 리스트 정렬 (원본 list에도 영향 미침)
        
        System.out.println(list); // [5, 0, 2, 4, 1, 3] 출력됨
        
        // 데이터 삭제 시 뒤의 요소들을 앞으로 이동시켜야 하므로 시간복잡도 O(n) 발생
        list.remove(2); // 인덱스 2의 요소 삭제
    }
}`
  },
  {
    id: "11-1-2",
    title: "1.2 LinkedList",
    concept: "LinkedList는 불연속적으로 존재하는 데이터를 서로 연결(link)한 형태로 구성됨. 데이터의 삭제와 추가가 빠르지만, 접근 속도는 느림.",
    code: `import java.util.*;

public class LinkedListEx {
    public static void main(String[] args) {
        LinkedList<String> list = new LinkedList<>(); // 이중 연결 리스트 생성
        
        list.add("A"); // 리스트의 끝에 추가
        list.add("B");
        list.addFirst("C"); // 리스트의 맨 앞에 추가. O(1)
        
        System.out.println(list); // [C, A, B]
        
        list.removeLast(); // 맨 끝 요소 삭제. O(1)
        list.remove(1); // 인덱스 1의 요소 삭제. 해당 노드까지 이동해야 하므로 O(n)
        
        // 순차적 접근은 Iterator 사용 권장
        Iterator<String> it = list.iterator();
        while(it.hasNext()) {
            System.out.println(it.next());
        }
    }
}`
  },
  {
    id: "11-1-3",
    title: "1.3 Stack과 Queue",
    concept: "Stack은 LIFO(Last In First Out) 구조이며, Queue는 FIFO(First In First Out) 구조임. 자바에서 Stack은 클래스, Queue는 인터페이스로 제공됨.",
    code: `import java.util.*;

public class StackQueueEx {
    public static void main(String[] args) {
        Stack<String> st = new Stack<>(); // 스택 생성
        Queue<String> q = new LinkedList<>(); // 큐의 구현체로 LinkedList 사용
        
        st.push("0"); // 스택에 저장
        st.push("1");
        st.push("2");
        
        q.offer("0"); // 큐에 저장
        q.offer("1");
        q.offer("2");
        
        System.out.println("= Stack =");
        while(!st.empty()) {
            System.out.println(st.pop()); // 2, 1, 0 순서로 꺼냄 (LIFO)
        }
        
        System.out.println("= Queue =");
        while(!q.isEmpty()) {
            System.out.println(q.poll()); // 0, 1, 2 순서로 꺼냄 (FIFO)
        }
    }
}`
  },
  {
    id: "11-1-5",
    title: "1.5 HashSet",
    concept: "HashSet은 Set 인터페이스를 구현한 것으로, 중복된 요소를 저장하지 않으며 저장 순서를 유지하지 않음. 내부적으로 HashMap을 사용함.",
    code: `import java.util.*;

public class HashSetEx {
    public static void main(String[] args) {
        Set<Object> set = new HashSet<>();
        
        set.add("abc");
        set.add("abc"); // 중복이므로 저장되지 않음. add()는 false 반환
        set.add(new Person("David", 10));
        set.add(new Person("David", 10)); // equals()와 hashCode()를 오버라이딩해야 중복 제거됨
        
        System.out.println(set);
    }
}

class Person {
    String name;
    int age;
    
    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public boolean equals(Object obj) { // 내용 비교를 위해 오버라이딩
        if(obj instanceof Person) {
            Person tmp = (Person)obj;
            return name.equals(tmp.name) && age == tmp.age;
        }
        return false;
    }
    
    public int hashCode() { // 해시 기반 컬렉션에서 올바르게 동작하기 위해 오버라이딩 필수
        return Objects.hash(name, age);
    }
}`
  },
  {
    id: "11-1-6",
    title: "1.6 HashMap",
    concept: "HashMap은 Map 인터페이스를 구현한 것으로, 키(Key)와 값(Value)을 쌍으로 저장함. 키는 중복 허용 안 함, 값은 허용함. 해싱(Hashing)을 사용하여 검색 속도가 매우 빠름.",
    code: `import java.util.*;

public class HashMapEx {
    public static void main(String[] args) {
        HashMap<String, Integer> map = new HashMap<>();
        
        map.put("김자바", 90); // 키와 값 저장
        map.put("이자바", 100);
        map.put("강자바", 80);
        map.put("김자바", 100); // 기존 키 "김자바"의 값을 100으로 덮어씀
        
        System.out.println("총 Entry 수: " + map.size()); // 3
        
        if(map.containsKey("이자바")) { // 키 포함 여부 확인. O(1)
            System.out.println("이자바의 점수: " + map.get("이자바")); // 값 읽기
        }
        
        // 모든 키와 값 순회
        for(Map.Entry<String, Integer> e : map.entrySet()) {
            System.out.println("이름: " + e.getKey() + ", 점수: " + e.getValue());
        }
    }
}`
  },
  // Chapter 12: 지네릭스, 열거형, 애너테이션
  {
    id: "12-1-1",
    title: "1.1 지네릭스(Generics)",
    concept: "지네릭스는 컴파일 시 타입을 체크해 주는 기능으로, 객체의 타입 안정성을 높이고 형변환의 번거로움을 줄여줌.",
    code: `import java.util.*;

class Box<T> { // 지네릭 클래스 선언. T는 타입 변수
    T item;
    void setItem(T item) { this.item = item; }
    T getItem() { return item; }
}

public class GenericEx {
    public static void main(String[] args) {
        Box<String> b = new Box<String>(); // T를 String으로 지정
        b.setItem("ABC"); // String만 저장 가능. 컴파일러가 체크함
        // b.setItem(123); // 에러. Integer는 저장 불가
        
        String item = b.getItem(); // 형변환 필요 없음
        System.out.println(item);
    }
}`
  },
  {
    id: "12-1-5",
    title: "1.5 와일드카드",
    concept: "와일드카드(?)는 지네릭 타입에 유연성을 제공함. <? extends T>는 T와 그 자손만 가능, <? super T>는 T와 그 조상만 가능함을 의미함.",
    code: `import java.util.*;

class Fruit { public String toString() { return "Fruit"; } }
class Apple extends Fruit { public String toString() { return "Apple"; } }
class Grape extends Fruit { public String toString() { return "Grape"; } }

class Juice { }
class Juicer {
    // FruitBox<? extends Fruit>은 FruitBox<Fruit>, FruitBox<Apple>, FruitBox<Grape> 등을 매개변수로 받을 수 있음
    static Juice makeJuice(FruitBox<? extends Fruit> box) {
        String tmp = "";
        for(Fruit f : box.getList()) tmp += f + " ";
        return new Juice();
    }
}

class FruitBox<T extends Fruit> extends Box<T> { 
    ArrayList<T> list = new ArrayList<>();
    void add(T item) { list.add(item); }
    ArrayList<T> getList() { return list; }
}

public class WildCardEx {
    public static void main(String[] args) {
        FruitBox<Apple> appleBox = new FruitBox<>();
        appleBox.add(new Apple());
        
        Juicer.makeJuice(appleBox); // OK. Apple은 Fruit의 자손이므로 가능
    }
}`
  },
  {
    id: "12-2-1",
    title: "2.1 열거형(Enums)",
    concept: "열거형은 서로 관련된 상수를 편리하게 선언하기 위한 것으로, 타입에 안전한 열거형(typesafe enum)을 제공함.",
    code: `enum Direction { 
    EAST(1, ">"), SOUTH(2, "V"), WEST(3, "<"), NORTH(4, "^"); // 상수 정의
    
    private final int value; // 인스턴스 변수
    private final String symbol;
    
    Direction(int value, String symbol) { // 생성자 (private)
        this.value = value;
        this.symbol = symbol;
    }
    
    public int getValue() { return value; }
    public String getSymbol() { return symbol; }
}

public class EnumEx {
    public static void main(String[] args) {
        Direction d1 = Direction.EAST;
        Direction d2 = Direction.valueOf("WEST");
        
        System.out.println("d1=" + d1);
        System.out.println("d1.getValue()=" + d1.getValue());
        System.out.println("d1.getSymbol()=" + d1.getSymbol());
        
        for(Direction d : Direction.values()) { // 모든 상수 순회
            System.out.printf("%s=%d%n", d.name(), d.getValue());
        }
    }
}`
  },
  {
    id: "12-3-1",
    title: "3.1 애너테이션(Annotation)",
    concept: "애너테이션은 프로그램의 소스코드 안에 다른 프로그램을 위한 정보를 미리 약속된 형식으로 포함시킨 것임.",
    code: `import java.lang.annotation.*;

@Deprecated // 앞으로 사용하지 않을 것을 권장하는 대상에 붙임
class OldClass {
    @Override // 컴파일러에게 오버라이딩하는 메서드임을 알림 (오타 방지)
    public String toString() {
        return "OldClass";
    }
}

// 사용자 정의 애너테이션
@Retention(RetentionPolicy.RUNTIME) // 실행 시까지 유지
@Target(ElementType.METHOD) // 메서드에만 적용 가능
@interface MyAnnotation {
    String value() default "default value"; // 기본값 지정
    int count() default 1;
}

public class AnnotationEx {
    @MyAnnotation(value="test", count=5) // 애너테이션 적용
    public void testMethod() {
        System.out.println("Test Method");
    }
}`
  }
];