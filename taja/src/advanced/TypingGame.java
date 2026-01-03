package advanced;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Scanner;

/*
### 타자 연습 게임 (Typing Game)
이 코드는 타자 연습 프로그램의 핵심 로직을 담고 있습니다.
사용자로부터 단어를 입력받아 정확도와 시간을 측정합니다.

**주요 기능 및 개념:**
1. **Scanner 사용**: `System.in.read()` 대신 `Scanner.nextLine()`을 사용하여
   한글 깨짐, 백스페이스 인식 불가, 엔터 키 처리 문제를 해결했습니다.
   (운영체제 터미널의 입력 버퍼를 활용하므로 IME 조합 및 수정이 가능함)
2. **컬렉션 프레임워크**: `ArrayList`를 사용하여 연습할 단어 목록을 관리합니다.
3. **시간 측정**: `System.currentTimeMillis()`를 이용해 경과 시간을 계산합니다.
4. **상세한 주석**: 코드의 각 부분에 대한 원리와 설명을 포함했습니다.
*/
public class TypingGame {

    // 연습할 단어들을 저장할 리스트
    private List<String> words;
    // 사용자 입력을 받기 위한 Scanner 객체
    private Scanner scanner;

    public TypingGame() {
        words = new ArrayList<>();
        scanner = new Scanner(System.in);
        initializeWords();
    }

    // 초기 단어 목록 설정
    private void initializeWords() {
        words.add("Java");
        words.add("Polymorphism");
        words.add("Inheritance");
        words.add("Encapsulation");
        words.add("Stream API");
        words.add("객체지향");
        words.add("다형성");
        words.add("람다식");
        
        // 게임의 재미를 위해 단어 순서를 무작위로 섞음 (Collections.shuffle)
        Collections.shuffle(words);
    }

    // 게임 시작 메서드
    public void start() {
        System.out.println("=== 타자 연습 게임을 시작합니다 ===");
        System.out.println("제시된 단어를 정확하게 입력하고 엔터를 누르세요.");
        System.out.println("'exit'를 입력하면 게임이 종료됩니다.\n");

        int score = 0;
        long startTime = System.currentTimeMillis(); // 전체 게임 시작 시간 기록

        // 리스트에 있는 모든 단어에 대해 반복
        for (String targetWord : words) {
            System.out.println("제시어: " + targetWord);
            System.out.print("입력: ");

            /*
             * [입력 처리 핵심]
             * scanner.nextLine()을 사용합니다.
             * - next(): 공백 전까지만 읽으므로 띄어쓰기 포함 단어 처리가 어렵고 엔터 처리가 꼬일 수 있음.
             * - nextLine(): 엔터 키를 누를 때까지의 한 줄을 통째로 읽습니다.
             *   이 방식은 터미널에서 백스페이스로 수정하거나 한글을 조합하는 과정을
             *   자바가 아닌 터미널이 처리하게 하므로 입력 오류가 없습니다.
             */
            String input = scanner.nextLine();

            // 게임 종료 조건 확인
            if ("exit".equalsIgnoreCase(input)) {
                System.out.println("게임을 종료합니다.");
                break;
            }

            // 입력값 검증 (공백 제거 후 비교)
            if (targetWord.equals(input.trim())) {
                System.out.println(">> 정답입니다!");
                score++;
            } else {
                System.out.println(">> 오타입니다. (정답: " + targetWord + ")");
            }
            System.out.println("--------------------------------");
        }

        long endTime = System.currentTimeMillis(); // 게임 종료 시간 기록
        showResult(score, startTime, endTime);
    }

    // 결과 출력 메서드
    private void showResult(int score, long start, long end) {
        // 밀리초(ms) 단위를 초(s) 단위로 변환
        double duration = (end - start) / 1000.0;
        
        System.out.println("\n=== 게임 결과 ===");
        System.out.println("총 문제 수: " + words.size());
        System.out.println("맞춘 개수: " + score);
        System.out.printf("소요 시간: %.2f초\n", duration);
        
        // 평균 속도 계산 (단순히 맞춘 개수 기준)
        if (duration > 0) {
            double wpm = (score / duration) * 60;
            System.out.printf("분당 단어 처리 속도(대략): %.0f WPM\n", wpm);
        }
    }

    public static void main(String[] args) {
        // TypingGame 객체 생성 및 시작
        // main 메서드는 프로그램의 진입점 역할만 수행하고, 실제 로직은 객체 내에서 처리
        TypingGame game = new TypingGame();
        game.start();
    }
}