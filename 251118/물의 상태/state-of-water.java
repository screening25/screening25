import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = sc.nextInt();

        if (n < 0) {
            System.out.println("ice");
        } else if (0 <= n && n < 100) { 
            System.out.println("water");
        } else {
            System.out.println("vapor");
        }
    }
}
