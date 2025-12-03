import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int gender = sc.nextInt();
        int age = sc.nextInt();

        if (gender == 0) {            // 여자
            if (age >= 19) {
                System.out.println("WOMAN");
            } else {
                System.out.println("GIRL");
            }
        } else {                      // 남자
            if (age >= 19) {
                System.out.println("MAN");
            } else {
                System.out.println("BOY");
            }
        }
    }
}
