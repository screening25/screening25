export const chapter15Concepts = [
  {
    id: "concept-15-1-1",
    chapter: "Chapter 15: 입출력",
    title: "### 1.1 입출력(I/O)과 스트림",
    content: "입출력(I/O)은 프로그램이 외부(파일, 네트워크 등)로부터 데이터를 읽어오거나 외부로 데이터를 보내는 모든 과정을 의미한다. 자바에서는 데이터를 운반하는 단방향 통로인 '스트림(Stream)'을 통해 입출력을 처리한다. 데이터의 흐름 방향에 따라 입력 스트림과 출력 스트림으로 나뉘며, 처리하는 데이터 단위에 따라 1바이트 단위로 처리하는 '바이트 스트림'(InputStream, OutputStream)과 2바이트 문자 단위로 처리하는 '문자 스트림'(Reader, Writer)으로 구분된다."
  },
  {
    id: "concept-15-3-1",
    chapter: "Chapter 15: 입출력",
    title: "### 3.1 보조 스트림 (BufferedInputStream)",
    content: "보조 스트림은 실제 데이터를 주고받는 기능은 없지만, 다른 스트림(기반 스트림)에 연결되어 부가적인 기능을 제공하여 입출력 성능을 향상시키는 역할을 한다. 이는 객체에 추가적인 기능을 동적으로 더해주는 데코레이터 패턴(Decorator Pattern)의 한 예이다. 예를 들어, BufferedInputStream/BufferedOutputStream은 내부에 버퍼(buffer)를 두어 데이터를 한 번에 모아서 읽고 쓰는 방식으로 입출력 횟수를 줄여 성능을 크게 향상시킨다."
  },
  {
    id: "concept-15-7-1",
    chapter: "Chapter 15: 입출력",
    title: "### 7.1 직렬화(Serialization)",
    content: "직렬화는 객체를 파일에 저장하거나 네트워크를 통해 전송할 수 있도록, 객체를 연속적인 바이트 스트림으로 변환하는 과정을 의미한다. 반대로, 바이트 스트림을 다시 객체로 복원하는 과정을 역직렬화라고 한다. 자바에서는 'Serializable' 인터페이스를 구현한 클래스의 객체만 직렬화할 수 있으며, ObjectOutputStream과 ObjectInputStream을 사용하여 직렬화/역직렬화를 수행한다. 객체뿐만 아니라 객체가 참조하는 다른 객체들까지 모두 직렬화 대상에 포함된다."
  },
  {
    id: "concept-15-7-4",
    chapter: "Chapter 15: 입출력",
    title: "### 7.4 직렬화 버전관리 (serialVersionUID)",
    content: "직렬화된 객체를 역직렬화할 때, JVM은 저장된 객체의 serialVersionUID와 현재 클래스의 serialVersionUID를 비교하여 두 클래스가 호환되는지 확인한다. 만약 이 ID를 명시적으로 선언하지 않으면 컴파일러가 클래스의 구조를 기반으로 자동으로 생성하는데, 이 경우 클래스 내용이 조금만 변경되어도 ID값이 달라져 역직렬화에 실패할 수 있다. 따라서 클래스의 변경에도 호환성을 유지하고 싶다면 'private static final long serialVersionUID'를 명시적으로 선언하여 버전을 관리해야 한다. 보안상 민감한 정보는 'transient' 키워드를 붙여 직렬화 대상에서 제외해야 한다."
  }
];