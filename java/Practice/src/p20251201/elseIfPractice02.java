package p20251201;
import java.util.*;

public class elseIfPractice02 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int money = sc.nextInt();

        if (money >= 3000) {
            System.out.println("book");
        } else if (money >= 1000 && money < 3000) {
            System.out.println("mask");
        } else {
            System.out.println("no");
        }
    }
}