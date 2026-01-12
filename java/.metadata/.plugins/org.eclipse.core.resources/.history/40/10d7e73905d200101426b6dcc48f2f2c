import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.util.StringTokenizer;

public class boj10951 {
    public static void main(String[] args) throws IOException {

        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));

        String line;

        while (true) {
            line = br.readLine();
            
            if (line == null) {
                break;
            }

            StringTokenizer st = new StringTokenizer(line);
            int A = Integer.parseInt(st.nextToken());
            int B = Integer.parseInt(st.nextToken());

            bw.write(Integer.toString(A + B));
            bw.newLine();
        }

        bw.flush();
        bw.close();
        br.close();
    }
}
