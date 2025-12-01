package p20251201;
import java.util.*;
public class sumAverage {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
        Scanner sc = new Scanner(System.in);

        int a = sc.nextInt();
        int b = sc.nextInt();

        int sum = a + b;
        double avg = sum / 2.0;   

        System.out.printf("%d %.1f", sum, avg);
	}

}
