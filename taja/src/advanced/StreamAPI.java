package advanced;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/*
### 스트림 API (Stream)
이 코드는 Java 8부터 도입된 스트림 API를 활용하여 데이터를 선언적으로 처리하는 방법을 보여줍니다.
반복문(for, while)을 사용하지 않고도 데이터의 필터링, 변환, 정렬, 집계를 간결하게 수행할 수 있습니다.

**주요 개념:**
1. **Filter**: 조건에 맞는 요소만 걸러냅니다.
2. **Map**: 요소를 다른 형태로 변환합니다.
3. **Sorted**: 요소를 정렬합니다.
4. **Collect**: 처리된 결과를 리스트나 문자열 등으로 수집합니다.
*/
public class StreamAPI {
    public static void main(String[] args) {
        // 데이터 소스 준비
        List<String> names = Arrays.asList("Java", "Python", "JavaScript", "Go");

        System.out.println("원본 리스트: " + names);

        // 1. 스트림 파이프라인 구성
        // names.stream() : 리스트에서 스트림 생성
        List<String> longNamesInUpperCase = names.stream()
                .filter(name -> name.length() > 3) // [중개 연산] 길이가 3보다 큰 이름만 필터링 ("Go" 제외됨)
                .map(String::toUpperCase)          // [중개 연산] 모든 문자열을 대문자로 변환
                .sorted()                          // [중개 연산] 알파벳 순으로 정렬
                .collect(Collectors.toList());     // [최종 연산] 결과를 새로운 리스트로 수집

        System.out.println("처리된 이름 리스트: " + longNamesInUpperCase);

        // 2. 더 복잡한 스트림 활용 (문자열 연결)
        // 필터링된 결과들을 하나의 문자열로 합치는 예제
        String joinedNames = names.stream()
                .filter(name -> name.contains("a") || name.contains("A")) // 'a' 또는 'A'가 포함된 이름만
                .sorted(Comparator.comparingInt(String::length))          // 길이 순으로 정렬
                .collect(Collectors.joining(", "));               // ", "를 구분자로 하여 문자열 연결

        System.out.println("'a'가 포함된 언어(길이순): " + joinedNames);
        
        // 3. 숫자 스트림으로 변환하여 통계 내기
        // mapToInt를 사용하여 IntStream으로 변환하면 sum, average 등의 메서드 사용 가능
        int totalLength = names.stream()
                .mapToInt(String::length) // 각 이름의 길이로 변환
                .sum();                   // 길이의 총합 계산
        
        System.out.println("모든 이름의 길이 합: " + totalLength);
    }
}
