package p20251201;
import java.util.Scanner;

public class whilePractice01 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int N = sc.nextInt();
        int M = sc.nextInt();
    
        while(N != 0){
            System.out.println(N);
            
            N = N / M;
        }
    }
}