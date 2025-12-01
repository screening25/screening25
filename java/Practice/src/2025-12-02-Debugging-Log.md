# [2025-12-01] Java Deugging Log

## 1\. `String str = sc.next()`

### 1\. 발생한 문제

#### 증상

공백이 포함된 문자열 입력 시, 공백 이후 내용이 잘리고 입력이 종료

**틀린 코드**

```java
String str = sc.next();
```

-----

### 2\. 원인 분석

  - Scanner의 next()메서드는 공백(Space), 탭(Tab), 개행(Enter)을 **구분자**로 인식하기 때문
  - "Hello World"를 입력해도 "Hello"만 변수에 저장

-----

### 3\. 해결방법

  - 개행(Enter)키를 입력하기 전까지 모든 문자열(공백 포함)을 읽는 `nextLine()` 사용

**수정된 코드**

```java
String str = sc.nextLine();
```

-----

### 4\. insight

  - \#Java, \#Scanner, \#next\_vs\_nextLine

## 2\. `for (N = 1 ; N <= 6 ; N++)`

### 1\. 발생한 문제

#### 증상

입력받은 N만큼 반복해야 하는데, N이 1로 변해버리고 항상 6번만 반복

**틀린 코드**

```java
int N = sc.nextInt();
// 입력받은 변수 N을 반복문 카운터로 덮어씌움 (Overwriting)
for (N = 1 ; N <= 6 ; N++ ){
    System.out.println("LeebrosCode");
}
```

-----

### 2\. 원인 분석

  - 입력변수와 제어변수를 분리하지 않음
  - 초기화 식 N = 1 이 실행되는 순간, `sc.nextInt()`로 받은 값은 사라짐

-----

### 3\. 해결 방법

  - 새로운 제어변 수 `i`를 선언하여 사용

**수정된 코드**

```java
// N은 건드리지 않고, i를 사용해 횟수 체크
for (int i = 0; i < N; i++) {
    System.out.println("LeebrosCode");
}
```

-----

### 4\. Insight

  - \#Varialbe\_Scope \#Overwriting

## 3\. `System.out.println(sum+N);`

### 1\. 발생한 문제

#### 증상

`sum`값이 누적되어 커져야 하는데, 계속 동일한 계산 결과만 출력

**틀린 코드**

```java
// sum에 값을 저장하지 않고, 화면에 출력만 함
System.out.println(sum + N);
```

-----

### 2\. 원인 분석

  - 산술 연산자(+)는 값을 반환할 뿐 저장하지 않음
  - 변수의 상태를 바꾸려면 대입 연산자가 필요함

-----

### 3\. 해결 방법

  - 복합 대입 연산자(+=)를 사용하여 변수 값 갱신

**수정된 코드**

```java
sum += N; // sum = sum + N;
System.out.println(sum);
```

-----

### 4\. Insight

  - 
## 4\. M으로 게속 나누기

### 1\. 발생한 문제

#### 증상

cannot find symbol variable div 컴파일 에러 및 로직 오류

**틀린 코드**

```java
// 1. div가 선언되기 전에 사용됨
while(div == 0){
    System.out.println(div);
    int div = N/M; // 2. while 블록 안에서 선언됨 (Scope 제한)
}
```

-----

### 2\. 원인 분석

  - Scope Issue: white 블록 {} 내부 변수는 조건시 ()에서 보이지 않음
  - Logic Error: "0이 되기전까지는"는 \!= 0으로 표현해야 함

-----

### 3\. 해결 방법

  - 변수 선언 위치 수정 및ㅇ 문제 지문 순서대로 로직 구현

**수정된 코드**

```java
// N이 0이 아닐 때까지 반복
while(N != 0){
    System.out.println(N); // 현재 값 출력
    N = N / M;             // N 갱신 (누적 나눗셈)
}
```

-----

작성해주신 디버깅 로그를 바탕으로 **변수 스코프(Scope)와 연산자 우선순위** 관련 추가 연습 문제를 생성해 드리는 것 가능
