package p20251201;
import java.util.*;
public class input05 {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();

        int temp ; 

        temp = a; 
        a = b ; 
        b = temp; 

        System.out.println(a + " " + b);
	}

}
