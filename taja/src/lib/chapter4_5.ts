export const chapter4_5 = [
  // Chapter 4: 조건문과 반복문
  {
    id: "4-1-1",
    title: "1.1 if문",
    concept: "if문은 가장 기본적인 조건문으로, 조건식의 결과가 참(true)이면 괄호 안의 문장들을 실행함.",
    code: `public class IfEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        int score = 80; // 점수를 저장할 변수 score를 80으로 초기화함

        if (score > 60) { // score가 60보다 크면 참이므로 블록 내부가 실행됨
            System.out.println("합격입니다."); // "합격입니다."를 출력함
        } // if문 끝
        
        int x = 0; // 변수 x를 0으로 초기화함
        if (x == 0) System.out.println("x는 0입니다."); // 블록 없이 한 줄로 작성 가능함
    } // 메인 메서드 끝
}`
  },
  {
    id: "4-1-2",
    title: "1.2 if-else문",
    concept: "if-else문은 조건식이 참일 때와 거짓일 때 실행할 문장을 서로 다르게 지정할 수 있음.",
    code: `public class IfElseEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        int input = 5; // 입력값을 저장할 변수 input을 5로 초기화함

        if (input == 0) { // input이 0인지 검사함
            System.out.println("0입니다."); // 조건식이 참일 때 실행됨
        } else { // input이 0이 아니면 실행됨
            System.out.println("0이 아닙니다."); // 조건식이 거짓일 때 실행됨
        } // if-else문 끝
    } // 메인 메서드 끝
}`
  },
  {
    id: "4-1-3",
    title: "1.3 if-else if문",
    concept: "if-else if문은 처리해야 할 경우의 수가 셋 이상일 때 사용하며, 여러 조건식을 순차적으로 검사함.",
    code: `public class IfElseIfEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        int score = 85; // 점수 변수 score를 85로 초기화함
        char grade = ' '; // 학점을 저장할 변수 grade를 공백으로 초기화함

        if (score >= 90) { // score가 90 이상인지 검사함
            grade = 'A'; // 90 이상이면 A학점 저장함
        } else if (score >= 80) { // 90 미만이고 80 이상인지 검사함
            grade = 'B'; // 80 이상이면 B학점 저장함
        } else if (score >= 70) { // 80 미만이고 70 이상인지 검사함
            grade = 'C'; // 70 이상이면 C학점 저장함
        } else { // 위의 모든 조건이 거짓일 때 실행됨
            grade = 'D'; // 나머지는 D학점 저장함
        } // if-else if문 끝

        System.out.println("학점은 " + grade + "입니다."); // 계산된 학점을 출력함
    } // 메인 메서드 끝
}`
  },
  {
    id: "4-1-4",
    title: "1.4 중첩 if문",
    concept: "if문 블록 내부에 또 다른 if문을 포함시키는 것을 중첩 if문이라고 하며, 복잡한 조건을 단계적으로 검사할 때 사용함.",
    code: `public class NestedIfEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        int score = 95; // 점수를 95로 설정함
        String grade = ""; // 학점 문자열을 초기화함

        if (score >= 90) { // score가 90 이상인 경우
            grade = "A"; // 기본적으로 A학점을 부여함
            if (score >= 98) { // 90 이상이면서 98 이상인 경우
                grade += "+"; // A+가 됨
            } else if (score < 94) { // 90 이상이면서 94 미만인 경우
                grade += "-"; // A-가 됨
            } // 내부 if문 끝
        } else { // score가 90 미만인 경우
            grade = "B"; // B학점을 부여함
        } // 외부 if문 끝

        System.out.println("당신의 학점은 " + grade + "입니다."); // 최종 학점을 출력함
    } // 메인 메서드 끝
}`
  },
  {
    id: "4-1-5",
    title: "1.5 switch문",
    concept: "switch문은 단 하나의 조건식으로 많은 경우의 수를 처리할 수 있으며, if문보다 가독성이 좋고 속도가 빠를 수 있음.",
    code: `public class SwitchEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        int month = 3; // 현재 월을 3으로 설정함
        String season = ""; // 계절을 저장할 변수 선언함

        switch (month) { // month의 값을 평가함
            case 3: case 4: case 5: // month가 3, 4, 5 중 하나인 경우
                season = "봄"; // 계절을 봄으로 설정함
                break; // switch문을 탈출함
            case 6: case 7: case 8: // month가 6, 7, 8 중 하나인 경우
                season = "여름"; // 계절을 여름으로 설정함
                break; // break가 없으면 다음 case로 실행이 이어짐
            case 9: case 10: case 11: // month가 9, 10, 11 중 하나인 경우
                season = "가을"; // 계절을 가을로 설정함
                break; // switch문을 탈출함
            default: // 위의 어떤 case에도 해당하지 않는 경우
                season = "겨울"; // 계절을 겨울로 설정함
        } // switch문 끝

        System.out.println("현재 계절은 " + season + "입니다."); // 결과를 출력함
    } // 메인 메서드 끝
}`
  },
  {
    id: "4-2-1",
    title: "2.1 for문",
    concept: "for문은 초기화, 조건식, 증감식으로 구성되어 있으며, 반복 횟수를 알고 있을 때 적합한 반복문임.",
    code: `public class ForEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        int sum = 0; // 합계를 저장할 변수 sum을 0으로 초기화함

        for (int i = 1; i <= 5; i++) { // i는 1부터 5까지 1씩 증가하며 반복함
            sum += i; // sum에 i를 더함
            System.out.println("i=" + i + ", sum=" + sum); // 현재 i와 sum의 값을 출력함
        } // for문 끝

        // System.out.println(i); // 에러 발생. 변수 i는 for문 안에서만 유효함
    } // 메인 메서드 끝
}`
  },
  {
    id: "4-2-2",
    title: "2.2 중첩 for문",
    concept: "for문 안에 또 다른 for문을 포함시키는 것을 중첩 for문이라 하며, 2차원 데이터 처리에 주로 사용됨.",
    code: `public class NestedForEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        for (int i = 2; i <= 9; i++) { // 2단부터 9단까지 반복함
            for (int j = 1; j <= 9; j++) { // 각 단마다 1부터 9까지 곱하기 위해 반복함
                System.out.printf("%d x %d = %d%n", i, j, i * j); // 구구단을 출력함
            } // 안쪽 for문 끝
            System.out.println(); // 한 단이 끝나면 줄바꿈을 함
        } // 바깥쪽 for문 끝
        
        for (int i = 1; i <= 5; i++) { // 5줄을 출력하기 위한 반복문
            for (int j = 1; j <= i; j++) { // 각 줄마다 별의 개수를 늘려감
                System.out.print("*"); // 별을 출력함
            } // 안쪽 for문 끝
            System.out.println(); // 줄바꿈을 함
        } // 바깥쪽 for문 끝
    } // 메인 메서드 끝
}`
  },
  {
    id: "4-2-3",
    title: "2.3 while문",
    concept: "while문은 조건식이 참인 동안 블록 내의 문장을 반복해서 실행하며, 반복 횟수가 불확실할 때 주로 사용함.",
    code: `public class WhileEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        int i = 5; // 변수 i를 5로 초기화함

        while (i-- != 0) { // i가 0이 아닐 때까지 반복하며, 조건식 평가 후 i를 1 감소시킴
            System.out.println(i + " - I can do it."); // 메시지를 출력함
        } // while문 끝
        
        int sum = 0; // 합계를 저장할 변수
        int j = 0; // 반복 제어 변수
        
        while (sum <= 100) { // sum이 100 이하인 동안 반복함
            System.out.printf("%d - %d%n", j, sum); // 현재 값 출력함
            sum += ++j; // j를 증가시킨 후 sum에 더함
        } // while문 끝
    } // 메인 메서드 끝
}`
  },
  {
    id: "4-2-4",
    title: "2.4 do-while문",
    concept: "do-while문은 블록을 먼저 실행한 후 조건식을 평가하므로, 조건과 관계없이 최소 한 번은 실행됨.",
    code: `public class DoWhileEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        int input = 0; // 입력값을 저장할 변수
        int answer = 7; // 정답을 7로 설정함

        do { // 먼저 블록을 실행함
            input = (int)(Math.random() * 10) + 1; // 1~10 사이의 난수를 생성하여 input에 저장함 (사용자 입력 대용)
            System.out.println("시도한 값: " + input); // 시도한 값을 출력함
        } while (input != answer); // input이 answer와 다르면 반복함

        System.out.println("정답입니다."); // 반복이 종료되면 정답 메시지를 출력함
    } // 메인 메서드 끝
}`
  },
  {
    id: "4-2-5",
    title: "2.5 break문과 continue문",
    concept: "break문은 반복문을 즉시 탈출하고, continue문은 현재 반복을 건너뛰고 다음 반복으로 진행함.",
    code: `public class BreakContinueEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        for (int i = 0; i <= 10; i++) { // 0부터 10까지 반복함
            if (i % 3 == 0) { // i가 3의 배수인 경우
                continue; // 아래 문장을 실행하지 않고 다음 반복으로 넘어감
            }
            System.out.println(i); // 3의 배수가 아닌 수만 출력됨
        } // for문 끝

        int sum = 0; // 합계 변수
        int i = 0; // 제어 변수

        while (true) { // 무한 반복문
            if (sum > 100) { // 합계가 100을 넘으면
                break; // 반복문을 탈출함
            }
            ++i; // i를 증가시킴
            sum += i; // sum에 더함
        } // while문 끝
        System.out.println("i=" + i + ", sum=" + sum); // 결과 출력함
    } // 메인 메서드 끝
}`
  },
  {
    id: "4-2-6",
    title: "2.6 이름 붙은 반복문",
    concept: "중첩 반복문 앞에 이름을 붙이고 break나 continue에 이름을 지정하면, 해당 반복문을 제어할 수 있음.",
    code: `public class NamedLoopEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        Loop1 : for (int i = 2; i <= 9; i++) { // 바깥쪽 for문에 Loop1이라는 이름을 붙임
            for (int j = 1; j <= 9; j++) { // 안쪽 for문
                if (j == 5) { // j가 5가 되면
                    break Loop1; // Loop1 반복문을 완전히 탈출함
                    // break; // 이것은 안쪽 for문만 탈출함
                }
                System.out.println(i + "*" + j + "=" + i * j); // 구구단 출력함
            } // 안쪽 for문 끝
            System.out.println(); // 줄바꿈 (실행되지 않음)
        } // Loop1 끝
    } // 메인 메서드 끝
}`
  },
  // Chapter 5: 배열
  {
    id: "5-1-1",
    title: "1.1 배열이란?",
    concept: "배열(Array)은 같은 타입의 여러 변수를 하나의 묶음으로 다루는 것이며, 연속된 메모리 공간에 저장됨.",
    code: `public class ArrayEx1 { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        int score1 = 100, score2 = 90, score3 = 80; // 변수를 개별적으로 선언함
        int[] score = new int[3]; // 3개의 int 값을 저장할 수 있는 배열을 생성함
        
        score[0] = 100; // 배열의 첫 번째 요소에 100을 저장함
        score[1] = 90; // 배열의 두 번째 요소에 90을 저장함
        score[2] = 80; // 배열의 세 번째 요소에 80을 저장함

        System.out.println(score[0]); // 첫 번째 요소의 값을 출력함
        System.out.println(score[1]); // 두 번째 요소의 값을 출력함
    } // 메인 메서드 끝
}`
  },
  {
    id: "5-1-3",
    title: "1.3 배열의 길이와 인덱스",
    concept: "배열의 인덱스는 0부터 '길이-1'까지이며, 배열이름.length를 통해 배열의 길이를 얻을 수 있음.",
    code: `public class ArrayLengthEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        int[] arr = new int[5]; // 길이가 5인 int 배열을 생성함
        
        System.out.println("배열의 길이: " + arr.length); // 배열의 길이인 5를 출력함

        for (int i = 0; i < arr.length; i++) { // 배열의 길이만큼 반복함
            arr[i] = i * 10 + 50; // 각 요소에 값을 저장함
        } // for문 끝

        for (int i = 0; i < arr.length; i++) { // 배열의 모든 요소를 출력하기 위해 반복함
            System.out.println("arr[" + i + "]=" + arr[i]); // 인덱스와 값을 출력함
        } // for문 끝
        
        // System.out.println(arr[5]); // 에러 발생. 인덱스 범위를 벗어남 (ArrayIndexOutOfBoundsException)
    } // 메인 메서드 끝
}`
  },
  {
    id: "5-1-4",
    title: "1.4 배열의 초기화",
    concept: "배열은 생성과 동시에 초기화할 수 있으며, 중괄호 {}를 사용하여 값을 나열함.",
    code: `public class ArrayInitEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        int[] score = { 50, 60, 70, 80, 90 }; // 배열 생성 및 초기화를 동시에 수행함
        
        System.out.println(score[0]); // 50 출력함
        System.out.println(score[4]); // 90 출력함

        int[] arr; // 배열 참조변수 선언
        // arr = { 1, 2, 3 }; // 에러 발생. 선언과 생성을 분리할 때는 new int[]를 생략할 수 없음
        arr = new int[]{ 1, 2, 3 }; // OK. 생성과 초기화를 같이 할 때는 가능함
        
        System.out.println(arr[1]); // 2 출력함
    } // 메인 메서드 끝
}`
  },
  {
    id: "5-2-1",
    title: "2.1 배열의 활용 - 총합과 평균",
    concept: "for문을 이용하여 배열의 모든 요소를 순회하며 값을 더해 총합을 구하고, 이를 배열의 길이로 나누어 평균을 구함.",
    code: `public class ArraySumAvg { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        int sum = 0; // 총합을 저장할 변수
        float average = 0f; // 평균을 저장할 변수

        int[] score = { 100, 88, 100, 100, 90 }; // 점수 배열을 초기화함

        for (int i = 0; i < score.length; i++) { // 배열의 길이만큼 반복함
            sum += score[i]; // 각 요소의 값을 sum에 더함
        } // for문 끝

        average = sum / (float)score.length; // 총합을 개수로 나누어 평균을 계산함. 형변환 주의

        System.out.println("총점 : " + sum); // 총점 출력함
        System.out.println("평균 : " + average); // 평균 출력함
    } // 메인 메서드 끝
}`
  },
  {
    id: "5-2-2",
    title: "2.2 배열의 활용 - 최대값과 최소값",
    concept: "배열의 첫 번째 요소를 기준값으로 설정하고, 다른 요소들과 비교하며 최대값과 최소값을 갱신함.",
    code: `public class ArrayMinMax { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        int[] score = { 79, 88, 91, 33, 100, 55, 95 }; // 점수 배열 초기화함

        int max = score[0]; // 배열의 첫 번째 값으로 최대값을 초기화함
        int min = score[0]; // 배열의 첫 번째 값으로 최소값을 초기화함

        for (int i = 1; i < score.length; i++) { // 두 번째 요소부터 끝까지 반복함
            if (score[i] > max) { // 현재 요소가 max보다 크면
                max = score[i]; // max를 현재 요소로 변경함
            } else if (score[i] < min) { // 현재 요소가 min보다 작으면
                min = score[i]; // min을 현재 요소로 변경함
            }
        } // for문 끝

        System.out.println("최대값 :" + max); // 최대값 출력함
        System.out.println("최소값 :" + min); // 최소값 출력함
    } // 메인 메서드 끝
}`
  },
  {
    id: "5-2-3",
    title: "2.3 배열의 활용 - 섞기(Shuffle)",
    concept: "배열의 요소 순서를 랜덤하게 섞기 위해 임의의 인덱스를 선택하고 두 요소의 값을 교환하는 작업을 반복함.",
    code: `public class ArrayShuffle { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        int[] numArr = new int[10]; // 길이가 10인 배열 생성함

        for (int i = 0; i < numArr.length; i++) { // 0부터 9까지의 숫자로 초기화함
            numArr[i] = i; 
        }

        for (int i = 0; i < 100; i++) { // 100번 반복하여 섞음
            int n = (int)(Math.random() * 10); // 0~9 중의 한 값을 임의로 얻음
            
            // numArr[0]과 numArr[n]의 값을 서로 바꿈
            int tmp = numArr[0]; // 첫 번째 값을 임시 변수에 저장함
            numArr[0] = numArr[n]; // 임의의 위치 n의 값을 첫 번째 위치에 저장함
            numArr[n] = tmp; // 임시 변수의 값을 n번째 위치에 저장함
        } // for문 끝

        for (int i = 0; i < numArr.length; i++) { // 섞인 배열을 출력함
            System.out.print(numArr[i] + " "); 
        }
    } // 메인 메서드 끝
}`
  },
  {
    id: "5-3-1",
    title: "3.1 2차원 배열의 선언과 인덱스",
    concept: "2차원 배열은 테이블 형태의 데이터를 저장하기 위한 배열로, 행(row)과 열(column)의 인덱스를 사용함.",
    code: `public class Array2DEx { // 클래스 선언
    public static void main(String[] args) { // 메인 메서드 시작
        int[][] score = new int[4][3]; // 4행 3열의 2차원 배열을 생성함

        score[0][0] = 100; // 0행 0열에 100을 저장함
        score[2][1] = 50; // 2행 1열에 50을 저장함
        
        // 중첩 for문을 이용한 초기화
        for (int i = 0; i < score.length; i++) { // 행의 길이만큼 반복함
            for (int j = 0; j < score[i].length; j++) { // 각 행의 열 길이만큼 반복함
                score[i][j] = 10; // 모든 요소에 10을 저장함
            }
        }
        
        System.out.println("행의 개수: " + score.length); // 4 출력함
        System.out.println("0행의 열 개수: " + score[0].length); // 3 출력함
    } // 메인 메서드 끝
}`
  }
];