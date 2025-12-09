import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer; 

public class boj2675 {

	public static void main(String[] args) throws IOException{
		// TODO Auto-generated method stub
		BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
		// 테스트 케이스 개수 T 
		int T = Integer.parseInt(br.readLine());
		
		for (int i = 0; i < T; i++) {
			StringTokenizer st = new StringTokenizer(br.readLine(), " ");
			
			// 반복횟수 R 입력 
			int R = Integer.parseInt(st.nextToken());
			
			// 원본 문자열 S 입력 
			// 공백을 기준으로 나눠서 저장 
			String S = st.nextToken();
			
			StringBuilder P = new StringBuilder();
			
			for (int j = 0;  j < S.length(); j++ ) {
				char ch = S.charAt(j);
				
				for (int k = 0; k < R; k++) {
					P.append(ch);
				}
			}
			
			System.out.println(P.toString());
		}
		br.close();
	}

}
