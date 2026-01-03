package algorithms.dp;

/*
### 동적 계획법 (DP) - 피보나치 수열
이 코드는 동적 계획법(DP)의 기초인 피보나치 수열을 구현한 예제임.
메모이제이션(Memoization)을 통해 중복 계산을 피해 효율적으로 값을 구하는 원리를 연습함.
*/
public class FibonacciDP {
    static long[] memo;

    public static long fib(int n) {
        if (n <= 1) return n;
        if (memo[n] != 0) return memo[n];

        memo[n] = fib(n - 1) + fib(n - 2);
        return memo[n];
    }

    public static void main(String[] args) {
        int n = 40;
        memo = new long[n + 1];
        
        System.out.println("피보나치 수열 " + n + "번째 값: " + fib(n));
    }
}
