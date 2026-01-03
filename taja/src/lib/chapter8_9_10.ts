export const chapter8_9_10 = [
  // Chapter 8: 예외처리
  {
    id: "8-1-1",
    title: "1.1 예외처리와 try-catch",
    concept: "프로그램 실행 중 발생할 수 있는 에러를 예외(Exception)라고 하며, try-catch문을 통해 비정상 종료를 막고 정상 실행 상태를 유지함.",
    code: `public class ExceptionEx1 { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        int number = 100; // 피제수
        int result = 0; // 연산 결과 저장 변수

        for(int i=0; i < 10; i++) { // 10회 반복
            try { // 예외 발생 가능 영역
                result = number / (int)(Math.random() * 10); // 0으로 나눌 경우 ArithmeticException 발생
                System.out.println(result); // 결과 출력
            } catch (ArithmeticException e) { // 0으로 나누는 예외 포착
                System.out.println("0으로 나눌 수 없습니다."); // 예외 처리 코드
            } // try-catch 끝
        } // for문 끝
    } // main 끝
}`
  },
  {
    id: "8-1-2",
    title: "1.2 예외의 계층 구조",
    concept: "모든 예외의 최고 조상은 Exception 클래스이며, RuntimeException(프로그래머 실수)과 그 외의 예외(사용자 실수/외적 요인)로 구분됨.",
    code: `public class ExceptionHierarchyEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        try { // 예외 감시 시작
            throw new RuntimeException("런타임 에러"); // RuntimeException 강제 발생
        } catch (RuntimeException e) { // RuntimeException 및 그 자손 포착
            System.out.println("RuntimeException 처리: " + e.getMessage()); // 메시지 출력
        } catch (Exception e) { // 상위 클래스인 Exception은 마지막에 위치해야 함
            System.out.println("Exception 처리"); // 다형성에 의해 모든 예외 포착 가능
        } // try-catch 끝
        
        // 컴파일러가 체크하지 않는 Unchecked Exception (RuntimeException)
        // 컴파일러가 체크하는 Checked Exception (Exception)
    } // main 끝
}`
  },
  {
    id: "8-1-5",
    title: "1.5 예외 발생시키기 (throw)",
    concept: "throw 키워드를 사용하여 고의로 예외를 발생시킬 수 있음. 이는 비즈니스 로직상의 오류를 알리거나 테스트 목적으로 사용됨.",
    code: `public class ThrowEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        try { // 예외 감시
            Exception e = new Exception("고의로 발생시켰음"); // 예외 객체 생성
            throw e; // 예외를 발생시킴
        } catch (Exception e) { // 예외 포착
            System.out.println("에러 메시지 : " + e.getMessage()); // 에러 메시지 출력
            e.printStackTrace(); // 예외 발생 당시의 호출 스택(Call Stack) 출력
        } // try-catch 끝
        System.out.println("프로그램이 정상 종료되었음."); // 정상 종료 확인
    } // main 끝
}`
  },
  {
    id: "8-1-6",
    title: "1.6 메서드에 예외 선언하기 (throws)",
    concept: "메서드 선언부에 throws를 사용하여 해당 메서드 내에서 발생할 수 있는 예외를 호출한 메서드에게 떠넘길 수 있음.",
    code: `public class ThrowsEx { // 클래스 선언
    public static void main(String[] args) throws Exception { // main에서도 예외를 던질 수 있음 (JVM이 처리)
        method1(); // method1 호출
    } // main 끝

    static void method1() throws Exception { // 예외를 호출한 곳으로 전달
        method2(); // method2 호출
    } // method1 끝

    static void method2() throws Exception { // 예외를 호출한 곳으로 전달
        throw new Exception("method2에서 발생"); // 예외 발생
    } // method2 끝
}`
  },
  {
    id: "8-1-7",
    title: "1.7 finally 블록",
    concept: "finally 블록은 예외 발생 여부와 상관없이 실행되어야 할 코드를 포함하며, I/O 스트림이나 DB 연결 종료 등에 사용됨.",
    code: `public class FinallyEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        try { // 예외 감시
            System.out.println("start"); // 시작 메시지
            return; // 메서드 종료 시도
        } catch (Exception e) { // 예외 발생 시
            e.printStackTrace(); // 에러 출력
        } finally { // return문이 실행되더라도 finally 블록은 실행됨
            System.out.println("finally 블록은 항상 실행됨"); // 실행 확인
        } // try-catch-finally 끝
    } // main 끝
}`
  },
  // Chapter 9: java.lang 패키지
  {
    id: "9-1-1",
    title: "1.1 Object 클래스 - equals()",
    concept: "Object 클래스는 모든 클래스의 최고 조상임. equals()는 기본적으로 주소값을 비교하지만, 오버라이딩하여 내용 비교(Value Comparison)로 변경할 수 있음.",
    code: `class Person { // Person 클래스
    long id; // 주민번호

    public boolean equals(Object obj) { // equals 오버라이딩
        if(obj instanceof Person) { // 타입 확인
            return id == ((Person)obj).id; // id가 같으면 true 반환
        } else {
            return false; // 타입이 다르면 false
        }
    }
    Person(long id) { this.id = id; } // 생성자
}

public class EqualsEx { // 테스트 클래스
    public static void main(String[] args) { // 메인 메서드
        Person p1 = new Person(8011081111222L); // 객체 1
        Person p2 = new Person(8011081111222L); // 객체 2 (내용은 같음)

        if(p1.equals(p2)) // 오버라이딩된 equals 호출
            System.out.println("p1과 p2는 같은 사람입니다."); // 출력됨
        else
            System.out.println("p1과 p2는 다른 사람입니다.");
    } // main 끝
}`
  },
  {
    id: "9-2-1",
    title: "2.1 String 클래스의 불변성",
    concept: "String 클래스는 인스턴스 생성 후 값을 변경할 수 없는 불변(Immutable) 클래스임. 문자열 결합 시 새로운 객체가 생성됨.",
    code: `public class StringEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        String str1 = "abc"; // 문자열 리터럴 (String Pool에 저장)
        String str2 = "abc"; // 이미 존재하는 리터럴 재사용
        String str3 = new String("abc"); // 힙 메모리에 새로운 객체 생성

        System.out.println("str1 == str2 ? " + (str1 == str2)); // true (주소 같음)
        System.out.println("str1 == str3 ? " + (str1 == str3)); // false (주소 다름)
        System.out.println("str1.equals(str3) ? " + str1.equals(str3)); // true (내용 같음)
        
        String a = "a"; // "a" 객체 생성
        String b = "b"; // "b" 객체 생성
        a = a + b; // "ab" 새로운 객체 생성 후 a가 참조함. 기존 "a"는 GC 대상
        System.out.println(a); // "ab" 출력
    } // main 끝
}`
  },
  {
    id: "9-3-1",
    title: "3.1 StringBuffer와 StringBuilder",
    concept: "String의 불변성으로 인한 메모리 낭비를 막기 위해 사용됨. 내부 버퍼를 통해 문자열을 변경할 수 있으며, StringBuffer는 동기화를 지원함.",
    code: `public class StringBufferEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        StringBuffer sb = new StringBuffer("abc"); // 가변 문자열 객체 생성
        
        sb.append("123"); // 문자열 뒤에 추가. sb 자체의 내용이 변경됨 ("abc123")
        sb.deleteCharAt(0); // 첫 번째 문자 삭제 ("bc123")
        sb.insert(1, "."); // 인덱스 1에 문자열 삽입 ("b.c123")
        
        System.out.println(sb); // "b.c123" 출력
    } // main 끝
}`
  },
  // Chapter 10: 날짜와 시간
  {
    id: "10-1-1",
    title: "1.1 Calendar와 Date",
    concept: "JDK 1.0/1.1부터 사용된 날짜/시간 클래스임. Calendar는 추상 클래스이므로 getInstance()를 통해 구현된 객체를 얻어야 함.",
    code: `import java.util.*; // 유틸 패키지

public class CalendarEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        Calendar today = Calendar.getInstance(); // 현재 날짜/시간 객체 획득
        
        System.out.println("년도: " + today.get(Calendar.YEAR)); // 년도
        System.out.println("월: " + (today.get(Calendar.MONTH) + 1)); // 월 (0~11이므로 +1)
        System.out.println("일: " + today.get(Calendar.DATE)); // 일
        
        today.set(2025, 11, 25); // 2025년 12월 25일로 설정 (월은 11)
        System.out.println(new Date(today.getTimeInMillis())); // Date 객체로 변환하여 출력
    } // main 끝
}`
  },
  {
    id: "10-2-1",
    title: "2.1 java.time 패키지 (LocalDate, LocalTime)",
    concept: "JDK 1.8에 추가된 불변(Immutable) 날짜/시간 API임. 멀티스레드 환경에서 안전하며, 날짜와 시간을 명확히 분리하여 다룸.",
    code: `import java.time.*; // java.time 패키지

public class NewTimeEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        LocalDate date = LocalDate.now(); // 현재 날짜
        LocalTime time = LocalTime.now(); // 현재 시간
        
        System.out.println(date); // 202X-XX-XX 형식 출력
        System.out.println(time); // XX:XX:XX.XXX 형식 출력
        
        LocalDate birth = LocalDate.of(2000, 1, 1); // 특정 날짜 생성
        LocalDate nextDay = birth.plusDays(1); // 하루 뒤 날짜 생성 (새로운 객체 반환)
        
        System.out.println("birth: " + birth); // 원본은 변하지 않음
        System.out.println("nextDay: " + nextDay); // 변경된 날짜
    } // main 끝
}`
  },
  {
    id: "10-3-1",
    title: "3.1 파싱과 포맷 (DateTimeFormatter)",
    concept: "DateTimeFormatter를 사용하여 날짜/시간 객체를 원하는 문자열 형식으로 변환하거나, 문자열을 날짜/시간 객체로 파싱함.",
    code: `import java.time.*; // java.time 패키지
import java.time.format.*; // format 패키지

public class FormattingEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        LocalDateTime now = LocalDateTime.now(); // 현재 날짜와 시간
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm"); // 포맷 정의
        String formatted = now.format(formatter); // 문자열로 변환
        
        System.out.println(formatted); // "202X/XX/XX XX:XX" 출력
        
        LocalDateTime parsed = LocalDateTime.parse(formatted, formatter); // 문자열을 다시 객체로 파싱
        System.out.println(parsed); // ISO 형식으로 출력됨
    } // main 끝
}`
  }
];