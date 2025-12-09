import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.IOException;
import java.util.StringTokenizer;
import java.util.Arrays;

public class boj4153 {     public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));
        
        while(true) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            
            int x = Integer.parseInt(st.nextToken());
            int y = Integer.parseInt(st.nextToken());
            int z = Integer.parseInt(st.nextToken());
            
            // 종료 조건 
            if(x == 0 && y == 0 && z == 0) break;
            
            // 정렬을 통해 빗변(가장 큰 수) 찾기
            int[] nums = {x, y, z};
            Arrays.sort(nums);
            
            // 피타고라스 정리 확인: a^2 + b^2 = c^2
            if((nums[0] * nums[0]) + (nums[1] * nums[1]) == (nums[2] * nums[2])) {
                bw.write("right");
            } else {
                bw.write("wrong");
            }
            bw.newLine();
        }
        
        bw.flush();
        bw.close();
        br.close();
    }
}