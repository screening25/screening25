export const chapter9Concepts = [
  {
    id: "concept-9-1-1",
    chapter: "Chapter 9: java.lang",
    title: "### 1.1 Object 클래스",
    content: "Object 클래스는 자바의 모든 클래스의 최상위 조상 클래스이다. Object 클래스의 equals() 메서드는 기본적으로 두 참조 변수가 동일한 객체를 가리키고 있는지(주소값 비교, '==' 연산과 동일)를 검사한다. 하지만 두 객체의 내용이 같은지를 비교하고 싶을 때는 반드시 equals() 메서드를 오버라이딩하여 논리적 동등성(logical equality)을 비교하도록 재정의해야 한다. String이나 Integer와 같은 래퍼 클래스들은 이미 내용 비교를 하도록 equals()가 재정의되어 있다. equals()를 재정의할 때는 반드시 hashCode()도 함께 재정의해야 한다."
  },
  {
    id: "concept-9-2-1",
    chapter: "Chapter 9: java.lang",
    title: "### 2.1 String 클래스의 불변성",
    content: "String 객체는 한 번 생성되면 그 값을 변경할 수 없는 '불변(immutable)' 객체이다. 문자열을 결합하는 '+' 연산이나 substring() 같은 메서드는 기존 String 객체를 변경하는 것이 아니라, 새로운 String 객체를 생성하여 반환한다. 이러한 특징은 멀티쓰레드 환경에서 동기화 없이도 안전하게 값을 공유할 수 있다는 장점을 제공한다. 하지만 문자열 연산이 빈번하게 일어나는 경우, 계속해서 새로운 객체가 생성되어 힙 메모리 공간을 차지하고 가비지 컬렉션의 부담을 주므로 성능 저하의 원인이 될 수 있다."
  },
  {
    id: "concept-9-3-1",
    chapter: "Chapter 9: java.lang",
    title: "### 3.1 StringBuffer와 StringBuilder",
    content: "StringBuffer와 StringBuilder는 String 클래스의 불변성으로 인한 성능 저하를 해결하기 위해 제공되는 '가변(mutable)' 문자열 클래스이다. 내부적으로 문자열을 저장할 버퍼(char 배열)를 가지고 있으며, 문자열을 추가, 수정, 삭제하더라도 새로운 객체를 생성하지 않고 내부 버퍼의 내용을 변경한다. StringBuffer는 각 메서드가 synchronized로 동기화되어 있어 멀티쓰레드 환경에서 안전(thread-safe)하지만 성능이 다소 느리다. 반면 StringBuilder는 동기화를 지원하지 않아 싱글쓰레드 환경에서 더 빠른 성능을 보인다."
  }
];