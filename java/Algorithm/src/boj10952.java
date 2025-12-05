import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class boj10952 {

	public static void main(String[] args) throws IOException { // IOException 처리 선언

		BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
		
		while (true) {
			
			String line = br.readLine(); 
			
			if (line == null || line.isEmpty()) {
                break;
            }
			
			StringTokenizer st = new StringTokenizer(line, " ");
			
			if (!st.hasMoreTokens()) {
			    continue;
			}

			int A = Integer.parseInt(st.nextToken());
			int B = Integer.parseInt(st.nextToken());
			
			if (A == 0 && B == 0) {
				break;
			}
			
			System.out.println(A + B);
		}
	}
}