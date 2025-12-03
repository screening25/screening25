import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Please write your code here.
        Scanner sc = new Scanner(System.in);

        int Amath = sc.nextInt();
        int Aeng = sc.nextInt();

        int Bmath = sc.nextInt();
        int Beng = sc.nextInt();


        if (Amath>Bmath && Aeng>Beng){
            System.out.println(1);
        } else {
            System.out.println(0);
        }
    }
}