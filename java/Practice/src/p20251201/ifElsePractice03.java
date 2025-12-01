package p20251201;
import java.util.*;
public class ifElsePractice03 {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
        Scanner sc = new Scanner(System.in);

        int a = sc.nextInt();
        int b = sc.nextInt();

        if (a > b){
            System.out.println(a*b);
        } else {
            System.out.println(b/a);
        }
	}

}
