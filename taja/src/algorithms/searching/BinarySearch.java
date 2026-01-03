package algorithms.searching;

/*
### 이진 탐색 (Binary Search)
이 코드는 정렬된 배열에서 특정 값을 빠르게 찾는 이진 탐색 알고리즘 예제임.
탐색 범위를 절반씩 줄여나가며 목표 값을 찾는 효율적인 탐색 과정을 연습함.
*/
public class BinarySearch {
    public static int search(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) {
                return mid; // 목표 값의 인덱스 반환
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1; // 값을 찾지 못한 경우
    }

    public static void main(String[] args) {
        int[] sortedNumbers = {1, 3, 5, 7, 9, 11, 13};
        int target = 7;
        int index = search(sortedNumbers, target);

        if (index != -1) {
            System.out.println("값 " + target + "은(는) 인덱스 " + index + "에 있습니다.");
        } else {
            System.out.println("값을 찾지 못했습니다.");
        }
    }
}
