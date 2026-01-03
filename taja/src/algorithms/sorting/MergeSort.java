package algorithms.sorting;

import java.util.Arrays;

/*
### 병합 정렬 (Merge Sort)
이 코드는 안정적인 정렬 알고리즘인 병합 정렬을 구현한 예제임.
배열을 최소 단위까지 분할한 후, 정렬하며 다시 병합하는 재귀적 구조를 연습함.
*/
public class MergeSort {
    public static void sort(int[] arr, int left, int right) {
        if (left >= right) return;

        int mid = left + (right - left) / 2;
        sort(arr, left, mid);
        sort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }

    private static void merge(int[] arr, int left, int mid, int right) {
        int[] temp = new int[right - left + 1];
        int i = left, j = mid + 1, k = 0;

        while (i <= mid && j <= right) {
            if (arr[i] <= arr[j]) temp[k++] = arr[i++];
            else temp[k++] = arr[j++];
        }

        while (i <= mid) temp[k++] = arr[i++];
        while (j <= right) temp[k++] = arr[j++];

        System.arraycopy(temp, 0, arr, left, temp.length);
    }

    public static void main(String[] args) {
        int[] numbers = {7, 3, 6, 2, 8, 1, 4, 5};
        sort(numbers, 0, numbers.length - 1);
        System.out.println("병합 정렬 결과: " + Arrays.toString(numbers));
    }
}
