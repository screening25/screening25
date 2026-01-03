package algorithms.sorting;

import java.util.Arrays;

/*
### 퀵 정렬 (Quick Sort)
이 코드는 대표적인 분할 정복 알고리즘인 퀵 정렬을 구현한 예제임.
피벗(pivot)을 기준으로 배열을 나누고 재귀적으로 정렬하는 핵심 로직을 연습하기에 적합함.
*/
public class QuickSort {
    public static void sort(int[] arr, int low, int high) {
        if (low >= high) return;

        int pivotIndex = partition(arr, low, high);
        sort(arr, low, pivotIndex - 1);
        sort(arr, pivotIndex + 1, high);
    }

    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                swap(arr, i, j);
            }
        }
        swap(arr, i + 1, high);
        return i + 1;
    }

    private static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    public static void main(String[] args) {
        int[] numbers = {9, 2, 4, 1, 5, 8, 3};
        sort(numbers, 0, numbers.length - 1);
        System.out.println("퀵 정렬 결과: " + Arrays.toString(numbers));
    }
}
