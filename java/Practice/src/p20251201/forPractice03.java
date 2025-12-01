package p20251201;
import java.util.*;

public class forPractice03 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int A = sc.nextInt();
        int N = sc.nextInt();

        int sum = A; 

        for (int i = 0; i < N; i++) {
            sum += N; 
            System.out.println(sum);
        }
    }
}