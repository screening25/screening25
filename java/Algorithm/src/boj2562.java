import java.io.BufferedWriter;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.StreamTokenizer;
import java.io.IOException;

public class boj2562 {

	public static void main(String[] args) throws IOException{
		// TODO Auto-generated method stub
		BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
		
		int max = 0; 
		int index = 0; 
		
		for (int i = 1; i <= 9; i++) {
			int num = Integer.parseInt(br.readLine());
			
			if (max < num ) {
				max = num;  // 최대값 갱신 
				index = i;     // 위치 갱신 
			}
		}
	
		System.out.println(max);
		System.out.println(index);
		
	}

}
