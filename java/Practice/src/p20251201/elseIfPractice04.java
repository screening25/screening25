package p20251201;
import java.util.* ; 

public class elseIfPractice04 {
    public static void main(String[] args) {
        // Please write your code here.
        Scanner sc = new Scanner(System.in);
        int score = sc.nextInt();

        if (score >= 90 && score <= 100){
            System.out.println('A');
        } else if (score >= 80){
            System.out.println('B');
        } else if (score >= 70){
            System.out.println('C');
        } else if (score >= 60){
            System.out.println('D');
        } else {
            System.out.println('F');
        }
    }
}