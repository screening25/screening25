import java.util.*;
public class Main {
    public static void main(String[] args) {
        // Please write your code here.
        Scanner sc = new Scanner(System.in);

        int num = sc.nextInt();
        int x = 80 - num;

        if (num >= 80){
            System.out.println("pass");
        } else {
            System.out.println(x + " more score");
        }
    }
}