package p20251201;
import java.util.*;
public class sumAverageDistract {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();

        int sum = a + b + c;
        int avg = sum/3;

        System.out.println(sum);
        System.out.println(avg);
        System.out.println(sum-avg);
	}

}
