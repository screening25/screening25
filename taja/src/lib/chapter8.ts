export const chapter8Concepts = [
  {
    id: "concept-8-1-1",
    chapter: "Chapter 8: 예외처리",
    title: "### 1.1 예외처리와 try-catch",
    content: "예외(Exception)는 프로그램 실행 중 발생하는 예상치 못한 문제 상황을 의미한다. 예외처리는 이러한 예외가 발생했을 때 프로그램이 비정상적으로 종료되는 것을 막고, 예외 상황에 대처하여 정상적인 실행 흐름을 이어가도록 하는 메커니즘이다. 자바에서는 'try-catch'문을 사용하여 예외처리를 수행한다. 예외 발생이 예상되는 코드를 'try' 블록에 넣고, 해당 예외를 처리할 코드를 'catch' 블록에 작성한다. 예외 발생 시 JVM은 해당 예외 객체를 생성하여 catch 블록에 전달한다."
  },
  {
    id: "concept-8-1-2",
    chapter: "Chapter 8: 예외처리",
    title: "### 1.2 예외의 계층 구조",
    content: "자바의 모든 예외 클래스는 Throwable 클래스를 상속받으며, 이는 다시 Error와 Exception으로 나뉜다. Error는 시스템 레벨에서 발생하는 심각한 오류로 프로그래머가 처리할 수 없다. Exception은 프로그래머가 처리 가능한 예외로, 다시 'Checked Exception'과 'Unchecked Exception(RuntimeException)'으로 구분된다. Checked Exception은 컴파일 시점에서 예외 처리 여부를 강제하는 예외(예: IOException)이며, Unchecked Exception은 주로 프로그래머의 실수로 발생하는 런타임 예외(예: NullPointerException)로 컴파일러가 강제하지 않는다."
  },
  {
    id: "concept-8-1-5",
    chapter: "Chapter 8: 예외처리",
    title: "### 1.5 예외 발생시키기 (throw)",
    content: "프로그래머가 'throw' 키워드를 사용하여 의도적으로 예외를 발생시킬 수 있다. 'throw new 예외클래스();'와 같은 형태로 사용하며, 특정 비즈니스 로직에 맞지 않는 상황이 발생했을 때 이를 예외 상황으로 처리하기 위해 사용된다. 예를 들어, 은행 출금 메서드에서 잔액이 부족할 경우, 직접 정의한 'InsufficientFundsException'을 발생시켜 호출한 쪽에서 이 상황을 인지하고 처리하도록 만들 수 있다."
  },
  {
    id: "concept-8-1-6",
    chapter: "Chapter 8: 예외처리",
    title: "### 1.6 메서드에 예외 선언하기 (throws)",
    content: "메서드 내에서 발생할 수 있는 Checked Exception을 직접 처리하지 않고, 메서드를 호출한 곳으로 예외 처리의 책임을 떠넘기고 싶을 때 'throws' 키워드를 사용한다. 메서드 선언부 끝에 'throws 예외클래스명'을 명시하면, 이 메서드를 호출하는 쪽에서는 반드시 해당 예외를 try-catch로 처리하거나 다시 throws로 선언해야 한다. 이는 호출자에게 메서드 사용 시 발생할 수 있는 위험을 알려주는 중요한 역할을 한다."
  },
  {
    id: "concept-8-1-7",
    chapter: "Chapter 8: 예외처리",
    title: "### 1.7 finally 블록",
    content: "finally 블록은 try-catch문의 선택적 블록으로, 예외 발생 여부나 catch 블록의 실행 여부와 관계없이 항상 실행되는 코드 영역이다. 주로 파일 스트림이나 데이터베이스 연결과 같이 사용 후 반드시 닫아주어야 하는 자원을 해제하는 코드를 넣는 데 사용된다. 이를 통해 예외가 발생하더라도 자원 누수(resource leak)를 방지하고 프로그램의 안정성을 높일 수 있다. try 블록이나 catch 블록에서 return 문을 만나더라도 finally 블록은 그보다 먼저 실행된다."
  }
];