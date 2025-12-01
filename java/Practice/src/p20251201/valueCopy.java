package p20251201;

public class valueCopy {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
	     int a = 1;
        int b = 5;
        int c = 3;

        a = c;
        a = a + c;
        b = b - c;

        System.out.println(a);
        System.out.println(b);
        System.out.println(c);
	}

}
