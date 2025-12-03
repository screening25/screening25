package p20251203;

import java.util.Scanner;

public class nestedConditionalStatement02 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
     
        int Y = sc.nextInt();

        if (Y % 4 == 0 && (Y % 100 != 0 || Y % 400 == 0)) {
            System.out.println("true");
        } else {
            System.out.println("false");
        }
    }
}