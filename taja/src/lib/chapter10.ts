export const chapter10Concepts = [
  {
    id: "concept-10-1-1",
    chapter: "Chapter 10: 날짜와 시간",
    title: "### 1.1 Calendar와 Date",
    content: "Date 클래스는 JDK 1.0부터 제공된 날짜와 시간 클래스이지만, 대부분의 메서드가 deprecated(사용 비권장) 되었다. Calendar 클래스는 JDK 1.1에서 Date의 단점을 보완하기 위해 등장한 추상 클래스로, 'Calendar.getInstance()'를 통해 시스템의 지역과 시간대에 맞는 구현 객체를 얻어 사용한다. 하지만 Calendar 역시 월(Month)을 0부터 시작하는 등 직관적이지 않은 문제와 가변(mutable) 객체라는 단점을 가지고 있어, 현재는 java.time 패키지 사용이 권장된다."
  },
  {
    id: "concept-10-2-1",
    chapter: "Chapter 10: 날짜와 시간",
    title: "### 2.1 java.time 패키지",
    content: "JDK 1.8에서 추가된 java.time 패키지는 기존 날짜/시간 API의 문제점을 해결하기 위해 등장했다. JSR-310 표준 명세를 기반으로 하며, 날짜(LocalDate), 시간(LocalTime), 날짜와 시간(LocalDateTime)을 명확히 구분하는 클래스를 제공한다. 모든 핵심 클래스는 불변(immutable) 객체로 설계되어, 날짜/시간을 변경하는 메서드는 항상 새로운 객체를 반환한다. 이는 멀티쓰레드 환경에서의 안정성을 보장하고 예측 가능한 코드를 작성하게 해준다."
  },
  {
    id: "concept-10-3-1",
    chapter: "Chapter 10: 날짜와 시간",
    title: "### 3.1 파싱과 포맷 (DateTimeFormatter)",
    content: "DateTimeFormatter 클래스는 java.time 패키지의 날짜/시간 객체를 특정 형식의 문자열로 변환(포맷팅)하거나, 문자열을 날짜/시간 객체로 변환(파싱)하는 데 사용된다. 'ofPattern()' 메서드를 통해 'yyyy-MM-dd'와 같은 패턴을 지정하여 포맷터를 생성할 수 있다. 포맷팅은 'format()' 메서드를, 파싱은 'parse()' 메서드를 사용한다. 미리 정의된 ISO 표준 포맷들도 상수로 제공되어 편리하게 사용할 수 있다."
  }
];