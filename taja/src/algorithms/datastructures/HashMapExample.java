package algorithms.datastructures;

import java.util.HashMap;
import java.util.Map;

/*
### 해시맵 (HashMap) 활용
이 코드는 해시맵(HashMap)을 사용하여 데이터 빈도를 계산하는 예제임.
Key-Value 쌍으로 데이터를 저장하여 특정 항목의 등장 횟수를 효율적으로 계산하는 방법을 연습함.
*/
public class HashMapExample {
    public static void main(String[] args) {
        String text = "apple banana apple orange banana apple";
        Map<String, Integer> frequencyMap = new HashMap<>();

        for (String word : text.split(" ")) {
            frequencyMap.put(word, frequencyMap.getOrDefault(word, 0) + 1);
        }

        System.out.println("과일 빈도수:");
        for (Map.Entry<String, Integer> entry : frequencyMap.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}
