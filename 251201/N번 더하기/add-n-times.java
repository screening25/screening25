import java.util.*;

public class Main {
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