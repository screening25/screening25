export const chapter2_3 = [
  // Chapter 2: 변수
  {
    id: "2-1-1",
    title: "1.1 변수란?",
    concept: "변수(Variable)는 단 하나의 값을 저장할 수 있는 메모리 공간을 의미함. 새로운 값을 저장하면 기존의 값은 사라짐.",
    code: `public class VarEx1 { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        int year = 0; // 정수형 변수 year를 선언하고 0으로 초기화함
        int age = 14; // 정수형 변수 age를 선언하고 14로 초기화함

        System.out.println(year); // 변수 year의 값을 화면에 출력함
        System.out.println(age); // 변수 age의 값을 화면에 출력함

        year = age + 2000; // 변수 age의 값에 2000을 더해서 변수 year에 저장함
        age = age + 1; // 변수 age에 저장된 값을 1 증가시킴

        System.out.println(year); // 변경된 year의 값을 화면에 출력함
        System.out.println(age); // 변경된 age의 값을 화면에 출력함
    } // 메인 메서드 끝
}`
  },
  {
    id: "2-1-2",
    title: "1.2 변수의 선언과 초기화",
    concept: "변수를 사용하려면 먼저 선언해야 하며, 선언 시 메모리 공간이 할당됨. 초기화는 변수에 처음 값을 저장하는 것임.",
    code: `public class VarEx2 { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        int x = 10; // 변수 x를 선언하고 10으로 초기화함
        int y = 20; // 변수 y를 선언하고 20으로 초기화함
        int tmp = 0; // 두 값을 바꿀 때 사용할 임시 변수 tmp를 선언하고 0으로 초기화함

        System.out.println("x:" + x + " y:" + y); // 교환 전의 x와 y값을 출력함

        tmp = x; // x의 값을 tmp에 저장함
        x = y; // y의 값을 x에 저장함
        y = tmp; // tmp에 저장된 값(원래 x의 값)을 y에 저장함

        System.out.println("x:" + x + " y:" + y); // 교환 후의 x와 y값을 출력함
    } // 메인 메서드 끝
}`
  },
  {
    id: "2-2-1",
    title: "2.1 변수의 타입",
    concept: "자료형은 값의 종류에 따라 저장될 공간의 크기와 형식을 정의한 것임. 기본형(Primitive)과 참조형(Reference)으로 나뉨.",
    code: `public class VarTypeEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        // 기본형 변수
        int i = 100; // 정수형 변수 i에 100을 저장함
        double d = 3.14; // 실수형 변수 d에 3.14를 저장함
        boolean b = true; // 논리형 변수 b에 true를 저장함

        // 참조형 변수
        String str = "Hello"; // String 클래스 타입의 변수 str에 문자열 객체의 주소를 저장함
        java.util.Date date = new java.util.Date(); // Date 객체를 생성하여 그 주소를 date 변수에 저장함

        System.out.println(i); // 기본형 변수 i의 값을 출력함
        System.out.println(str); // 참조형 변수 str이 가리키는 문자열을 출력함
    } // 메인 메서드 끝
}`
  },
  {
    id: "2-3-1",
    title: "3.1 상수와 리터럴",
    concept: "상수(Constant)는 한 번 값을 저장하면 변경할 수 없는 저장공간이며, 리터럴(Literal)은 그 자체로 값을 의미하는 것임.",
    code: `public class ConstantEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        final int MAX_SPEED = 10; // 상수 MAX_SPEED를 선언하고 10으로 초기화함. final 키워드 사용함
        // MAX_SPEED = 20; // 상수는 값을 변경할 수 없으므로 에러가 발생함

        int triangleArea = (20 * 10) / 2; // 20, 10, 2 등은 리터럴임
        
        final int WIDTH = 20; // 폭을 의미하는 상수 WIDTH를 선언함
        final int HEIGHT = 10; // 높이를 의미하는 상수 HEIGHT를 선언함
        
        int rectArea = WIDTH * HEIGHT; // 상수를 사용하여 사각형의 넓이를 계산함
        System.out.println("Area: " + rectArea); // 계산된 넓이를 출력함
    } // 메인 메서드 끝
}`
  },
  {
    id: "2-4-1",
    title: "4.1 논리형 - boolean",
    concept: "논리형은 true와 false 중 하나를 저장하며, 조건식과 논리적 계산에 사용됨. 기본값은 false임.",
    code: `public class BooleanEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        boolean power = true; // 논리형 변수 power를 true로 초기화함
        boolean checked = false; // 논리형 변수 checked를 false로 초기화함

        if(power) { // power가 true이므로 조건식이 참이 됨
            System.out.println("Power is on"); // 전원이 켜져있음을 출력함
        } // if문 끝

        if(!checked) { // checked가 false이므로 !checked는 true가 됨
            System.out.println("Not checked"); // 체크되지 않았음을 출력함
        } // if문 끝
    } // 메인 메서드 끝
}`
  },
  {
    id: "2-4-2",
    title: "4.2 문자형 - char",
    concept: "문자형은 문자를 저장하기 위한 변수이며, 사실은 문자의 유니코드(정수)가 저장됨.",
    code: `public class CharEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        char ch1 = 'A'; // 문자 'A'를 ch1에 저장함
        char ch2 = 65; // 'A'의 유니코드 값인 65를 ch2에 저장함
        char ch3 = 0x0041; // 'A'의 유니코드 16진수 표현을 ch3에 저장함

        System.out.println("ch1=" + ch1); // 문자 'A'가 출력됨
        System.out.println("ch2=" + ch2); // 문자 'A'가 출력됨
        System.out.println("ch3=" + ch3); // 문자 'A'가 출력됨
    } // 메인 메서드 끝
}`
  },
  {
    id: "2-4-3",
    title: "4.3 정수형 - byte, short, int, long",
    concept: "정수형에는 byte(1byte), short(2byte), int(4byte), long(8byte)이 있으며, 각 타입마다 저장 가능한 값의 범위가 다름.",
    code: `public class IntegerEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        byte b = 127; // byte형 변수 b에 최대값 127을 저장함
        int i = 100; // int형 변수 i에 100을 저장함
        long l = 10000000000L; // long형 변수 l에 값을 저장함. 접미사 L을 붙여야 함

        System.out.println("b=" + b); // byte 값 출력함
        System.out.println("i=" + i); // int 값 출력함
        System.out.println("l=" + l); // long 값 출력함
        
        b++; // b의 값을 1 증가시킴. 127에서 1 증가하면 범위를 넘어 최소값 -128이 됨(오버플로우)
        System.out.println("b=" + b); // -128 출력됨
    } // 메인 메서드 끝
}`
  },
  {
    id: "2-4-4",
    title: "4.4 실수형 - float, double",
    concept: "실수형은 실수를 저장하기 위한 타입으로 float(4byte)와 double(8byte)이 있음. 정밀도에 차이가 있음.",
    code: `public class FloatEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        float f = 9.123456789f; // float형 변수 f를 초기화함. 접미사 f를 붙여야 함
        double d = 9.123456789; // double형 변수 d를 초기화함

        System.out.println("f :" + f); // float는 정밀도가 낮아 뒷자리가 잘리거나 반올림되어 출력됨
        System.out.println("d :" + d); // double은 정밀도가 높아 원래 값을 정확히 표현함
    } // 메인 메서드 끝
}`
  },
  {
    id: "2-5-1",
    title: "5.1 형변환(Casting)이란?",
    concept: "형변환이란 변수 또는 상수의 타입을 다른 타입으로 변환하는 것임. 서로 다른 타입 간의 연산을 수행하기 위해 사용함.",
    code: `public class CastingEx1 { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        double d = 85.4; // double형 변수 d를 85.4로 초기화함
        int score = (int)d; // double형 변수 d를 int형으로 형변환하여 score에 저장함. 소수점 이하는 버려짐

        System.out.println("score=" + score); // 형변환된 결과인 85를 출력함
        System.out.println("d=" + d); // 형변환 후에도 d의 값은 변하지 않음
    } // 메인 메서드 끝
}`
  },
  {
    id: "2-5-6",
    title: "5.6 자동 형변환",
    concept: "서로 다른 타입 간의 대입이나 연산 시, 컴파일러가 생략된 형변환을 자동으로 추가해주는 기능임. 표현 범위가 좁은 타입에서 넓은 타입으로 변환할 때 데이터 손실이 없으므로 자동 수행됨.",
    code: `public class AutoCastingEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        float f = 1234; // int형 리터럴 1234를 float형 변수 f에 저장함. 자동 형변환이 일어남
        
        // byte b = 1000; // 에러 발생. byte의 범위를 넘는 값을 저장하려 했기 때문임
        byte b = (byte)1000; // 명시적 형변환을 통해 강제로 저장함. 값의 손실이 발생할 수 있음
        
        int i = 3; // int형 변수 i를 3으로 초기화함
        double d = 1.0 + i; // 1.0(double) + i(int) -> 1.0 + 3.0(double)로 자동 형변환되어 연산됨

        System.out.println("f=" + f); // 1234.0 출력됨
        System.out.println("b=" + b); // 값 손실이 발생하여 예상치 못한 값이 출력될 수 있음
        System.out.println("d=" + d); // 4.0 출력됨
    } // 메인 메서드 끝
}`
  },
  // Chapter 3: 연산자
  {
    id: "3-1-1",
    title: "1.1 연산자와 피연산자",
    concept: "연산자(Operator)는 연산을 수행하는 기호이며, 피연산자(Operand)는 연산의 대상임.",
    code: `public class OperatorEx1 { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        int x = 5; // 피연산자 x를 5로 초기화함
        int y = 4 * x + 3; // 4, x, 3은 피연산자이고 *, +는 연산자임

        System.out.println("y=" + y); // 연산 결과인 23을 출력함
    } // 메인 메서드 끝
}`
  },
  {
    id: "3-2-1",
    title: "2.1 증감 연산자 ++, --",
    concept: "증감 연산자는 피연산자의 값을 1 증가(++)시키거나 1 감소(--)시킴. 전위형은 참조 전 증가, 후위형은 참조 후 증가임.",
    code: `public class OperatorEx2 { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        int i = 5, j = 0; // i는 5, j는 0으로 초기화함

        j = i++; // 후위형: i의 값(5)을 j에 저장한 후, i를 1 증가시킴
        System.out.println("j=i++; 실행 후, i=" + i +", j="+ j); // i=6, j=5 출력됨

        i = 5; // i를 다시 5로 초기화함
        j = 0; // j를 다시 0으로 초기화함

        j = ++i; // 전위형: i를 1 증가시킨 후(6), 그 값을 j에 저장함
        System.out.println("j=++i; 실행 후, i=" + i +", j="+ j); // i=6, j=6 출력됨
    } // 메인 메서드 끝
}`
  },
  {
    id: "3-2-2",
    title: "2.2 부호 연산자 +, -",
    concept: "부호 연산자 '-'는 피연산자의 부호를 반대로 변경함. '+'는 부호를 변경하지 않음.",
    code: `public class OperatorEx3 { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        int i = -10; // i를 -10으로 초기화함
        i = +i; // + 연산자는 부호를 바꾸지 않음
        System.out.println(i); // -10 출력됨

        i = -10; // i를 다시 -10으로 초기화함
        i = -i; // - 연산자는 부호를 반대로 바꿈
        System.out.println(i); // 10 출력됨
    } // 메인 메서드 끝
}`
  },
  {
    id: "3-3-1",
    title: "3.1 사칙 연산자 +, -, *, /",
    concept: "사칙 연산자는 덧셈, 뺄셈, 곱셈, 나눗셈을 수행함. 정수 나눗셈은 몫만 반환함.",
    code: `public class OperatorEx4 { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        int a = 10; // 변수 a를 10으로 초기화함
        int b = 4; // 변수 b를 4로 초기화함

        System.out.println(a + b); // 10 + 4 = 14 출력함
        System.out.println(a - b); // 10 - 4 = 6 출력함
        System.out.println(a * b); // 10 * 4 = 40 출력함
        System.out.println(a / b); // 10 / 4 = 2 (정수 나눗셈) 출력함
        System.out.println(a / (float)b); // 10 / 4.0f = 2.5 (실수 나눗셈) 출력함
    } // 메인 메서드 끝
}`
  },
  {
    id: "3-3-2",
    title: "3.2 나머지 연산자 %",
    concept: "나머지 연산자는 왼쪽의 피연산자를 오른쪽 피연산자로 나누고 난 나머지 값을 반환함.",
    code: `public class OperatorEx5 { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        int x = 10; // x를 10으로 초기화함
        int y = 8; // y를 8로 초기화함

        System.out.println(x % y); // 10을 8로 나눈 나머지인 2를 출력함
        System.out.println(x % 2); // 10을 2로 나눈 나머지 0 (짝수) 출력함
    } // 메인 메서드 끝
}`
  },
  {
    id: "3-4-1",
    title: "4.1 대소비교 연산자 <, >, <=, >=",
    concept: "두 피연산자의 크기를 비교하여 참(true) 또는 거짓(false)을 반환함.",
    code: `public class OperatorEx6 { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        System.out.println(10 > 20); // 10이 20보다 크지 않으므로 false 출력함
        System.out.println(10 < 20); // 10이 20보다 작으므로 true 출력함
        System.out.println(10 >= 10); // 10이 10보다 크거나 같으므로 true 출력함
    } // 메인 메서드 끝
}`
  },
  {
    id: "3-4-2",
    title: "4.2 등가비교 연산자 ==, !=",
    concept: "두 피연산자의 값이 같은지(==) 또는 다른지(!=)를 비교함. 참조형은 주소값을 비교함.",
    code: `public class OperatorEx7 { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        System.out.println(10 == 10.0f); // 값은 같으므로 true (자동 형변환) 출력함
        System.out.println('A' == 65); // 'A'는 65이므로 true 출력함
        
        String s1 = "abc"; // 문자열 리터럴 s1 생성함
        String s2 = new String("abc"); // 새로운 String 객체 s2 생성함
        
        System.out.println(s1 == s2); // 주소가 다르므로 false 출력함
        System.out.println(s1.equals(s2)); // 내용은 같으므로 true 출력함
    } // 메인 메서드 끝
}`
  },
  {
    id: "3-5-1",
    title: "5.1 논리 연산자 &&, ||, !",
    concept: "논리 연산자는 조건식을 연결할 때 사용함. &&는 모두 true일 때, ||는 하나라도 true일 때 true를 반환함.",
    code: `public class OperatorEx8 { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        int x = 10; // x를 10으로 초기화함
        int y = 20; // y를 20으로 초기화함

        boolean result1 = (x > 0) && (y > 0); // 둘 다 양수이므로 true 출력함
        boolean result2 = (x > 100) || (y > 0); // 하나라도 참이므로 true 출력함
        
        System.out.println("result1=" + result1); // true 출력함
        System.out.println("result2=" + result2); // true 출력함
    } // 메인 메서드 끝
}`
  },
  {
    id: "3-6-1",
    title: "6.1 조건 연산자 ? :",
    concept: "조건 연산자는 조건식의 결과에 따라 다른 값을 반환하는 삼항 연산자임.",
    code: `public class OperatorEx9 { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        int x = 10; // x를 10으로 초기화함
        int y = -10; // y를 -10으로 초기화함
        
        int absX = (x >= 0) ? x : -x; // x가 양수면 x, 아니면 -x를 대입함
        int absY = (y >= 0) ? y : -y; // y가 양수면 y, 아니면 -y를 대입함
        
        System.out.println("absX=" + absX); // 10 출력함
        System.out.println("absY=" + absY); // 10 출력함
    } // 메인 메서드 끝
}`
  },
  {
    id: "3-6-2",
    title: "6.2 대입 연산자 =",
    concept: "대입 연산자는 우변의 값을 좌변의 변수에 저장함. 복합 대입 연산자는 연산과 대입을 동시에 수행함.",
    code: `public class OperatorEx10 { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        int i = 10; // i에 10을 대입함
        
        i += 3; // i = i + 3; 과 같음. i는 13이 됨
        System.out.println(i); // 13 출력함
        
        i *= 2; // i = i * 2; 와 같음. i는 26이 됨
        System.out.println(i); // 26 출력함
    } // 메인 메서드 끝
}`
  }
];