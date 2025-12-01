package p20251201;
import java.util.*;
public class ifElsePractice02 {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
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
