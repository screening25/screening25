export const chapter15_16 = [
  // Chapter 15: 입출력
  {
    id: "15-1-1",
    title: "1.1 입출력(I/O)과 스트림",
    concept: "입출력은 컴퓨터 내부/외부 장치와 프로그램 간에 데이터를 주고받는 것이며, 스트림은 데이터를 운반하는 단방향 통로임.",
    code: `import java.io.*;

public class IOEx1 {
    public static void main(String[] args) {
        byte[] inSrc = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9}; // 입력 소스 (바이트 배열)
        byte[] outSrc = null; // 출력 타겟 (바이트 배열)

        ByteArrayInputStream input = null; // 입력 스트림 참조변수 선언
        ByteArrayOutputStream output = null; // 출력 스트림 참조변수 선언

        input = new ByteArrayInputStream(inSrc); // 입력 스트림 생성
        output = new ByteArrayOutputStream(); // 출력 스트림 생성

        int data = 0; // 읽어온 데이터를 저장할 변수

        while((data = input.read()) != -1) { // 1바이트를 읽어옴. 더 이상 읽을 값이 없으면 -1 반환
            output.write(data); // 읽어온 데이터를 출력 스트림에 씀
        }

        outSrc = output.toByteArray(); // 스트림의 내용을 바이트 배열로 반환

        System.out.println("Input Source  : " + java.util.Arrays.toString(inSrc)); // 원본 출력
        System.out.println("Output Source : " + java.util.Arrays.toString(outSrc)); // 결과 출력
    }
}`
  },
  {
    id: "15-3-1",
    title: "3.1 보조 스트림 (BufferedInputStream)",
    concept: "보조 스트림은 자체적으로 입출력을 수행할 수 없으나, 기반 스트림에 연결되어 기능을 향상시킴. 데코레이터 패턴이 적용됨.",
    code: `import java.io.*;

public class BufferedIOEx {
    public static void main(String[] args) {
        try {
            // 기반 스트림 생성 (파일에서 읽기)
            FileInputStream fis = new FileInputStream("123.txt");
            
            // 보조 스트림 생성 (버퍼 기능 추가). 기반 스트림을 생성자의 매개변수로 받음
            BufferedInputStream bis = new BufferedInputStream(fis, 8192); // 버퍼 크기 8192 설정
            
            // 기반 스트림 생성 (파일에 쓰기)
            FileOutputStream fos = new FileOutputStream("123_copy.txt");
            
            // 보조 스트림 생성 (버퍼 기능 추가)
            BufferedOutputStream bos = new BufferedOutputStream(fos, 8192);

            int data = 0;
            while((data = bis.read()) != -1) { // 버퍼를 통해 파일에서 데이터를 읽음
                bos.write(data); // 버퍼를 통해 파일에 데이터를 씀
            }

            bis.close(); // 보조 스트림을 닫으면 기반 스트림도 자동으로 닫힘
            bos.close(); // 버퍼에 남아있는 데이터가 있으면 출력하고 닫음 (flush 자동 호출)
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}`
  },
  {
    id: "15-7-1",
    title: "7.1 직렬화(Serialization)와 역직렬화",
    concept: "직렬화는 객체를 연속적인 데이터(스트림)로 변환하는 것이며, 역직렬화는 스트림을 다시 객체로 복원하는 것임. Serializable 인터페이스를 구현해야 함.",
    code: `import java.io.*;
import java.util.ArrayList;

class UserInfo implements Serializable { // 직렬화 가능하도록 마커 인터페이스 구현
    String name;
    String password;
    int age;

    public UserInfo(String name, String password, int age) {
        this.name = name;
        this.password = password;
        this.age = age;
    }
    
    public String toString() {
        return "(" + name + "," + password + "," + age + ")";
    }
}

public class SerialEx {
    public static void main(String[] args) {
        try {
            String fileName = "UserInfo.ser"; // 객체를 저장할 파일 이름
            FileOutputStream fos = new FileOutputStream(fileName); // 파일 출력 스트림 생성
            BufferedOutputStream bos = new BufferedOutputStream(fos); // 버퍼 보조 스트림 연결
            ObjectOutputStream out = new ObjectOutputStream(bos); // 객체 직렬화 보조 스트림 연결

            UserInfo u1 = new UserInfo("JavaMan", "1234", 30); // 객체 생성
            UserInfo u2 = new UserInfo("JavaWoman", "4321", 26); // 객체 생성
            ArrayList<UserInfo> list = new ArrayList<>(); // 리스트 생성
            list.add(u1);
            list.add(u2);

            out.writeObject(u1); // 객체 u1을 직렬화하여 파일에 씀
            out.writeObject(u2); // 객체 u2를 직렬화하여 파일에 씀
            out.writeObject(list); // 리스트 객체(및 내부 요소들)를 직렬화하여 씀
            
            out.close(); // 스트림 닫기
            System.out.println("직렬화가 완료되었습니다.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}`
  },
  {
    id: "15-7-4",
    title: "7.4 직렬화 버전관리 (serialVersionUID)",
    concept: "클래스의 변경 여부를 식별하기 위해 serialVersionUID를 사용함. 명시하지 않으면 자동 생성되나, 클래스 변경 시 역직렬화 오류를 방지하기 위해 명시적으로 선언하는 것이 안전함.",
    code: `import java.io.Serializable;

class VersionedClass implements Serializable {
    // 클래스의 버전을 고정함. 클래스 내용이 바뀌어도 이 ID가 같으면 같은 클래스로 간주하여 역직렬화 시도함
    private static final long serialVersionUID = 123456789L; 
    
    int value;
    String data;
    // transient 키워드가 붙은 멤버는 직렬화 대상에서 제외됨 (보안상 민감한 데이터 등)
    transient String secretInfo; 
}

// *보안 유의점: 신뢰할 수 없는 데이터 스트림을 역직렬화하면 원격 코드 실행(RCE) 등의 공격에 노출될 수 있음.
// 따라서 화이트리스트 방식을 사용하거나, 역직렬화 필터를 적용해야 함.`
  },
  // Chapter 16: 네트워킹
  {
    id: "16-1-1",
    title: "1.1 클라이언트/서버와 IP, Port",
    concept: "클라이언트는 서비스를 요청하는 쪽, 서버는 서비스를 제공하는 쪽임. IP는 컴퓨터를 구별하는 주소이고, Port는 컴퓨터 내의 프로세스(프로그램)를 구별하는 번호임.",
    code: `import java.net.*;

public class NetworkBasic {
    public static void main(String[] args) {
        try {
            InetAddress ip = InetAddress.getByName("www.google.com"); // 도메인 이름으로 IP 정보 얻기
            
            System.out.println("getHostName() :" + ip.getHostName()); // 호스트 이름 출력
            System.out.println("getHostAddress() :" + ip.getHostAddress()); // IP 주소 출력
            System.out.println("toString() :" + ip.toString()); // 문자열 표현 출력

            byte[] ipAddr = ip.getAddress(); // IP 주소를 바이트 배열로 반환
            System.out.println("getAddress() :" + java.util.Arrays.toString(ipAddr));

            InetAddress localIp = InetAddress.getLocalHost(); // 로컬 호스트(내 컴퓨터)의 IP 정보 얻기
            System.out.println("Local Host IP :" + localIp.getHostAddress());
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }
    }
}`
  },
  {
    id: "16-2-1",
    title: "2.1 TCP 소켓 프로그래밍 - 서버",
    concept: "TCP는 연결형 프로토콜로 1:1 통신에 사용됨. ServerSocket은 포트를 열고 대기하며, 연결 요청이 오면 Socket을 생성하여 통신함.",
    code: `import java.net.*;
import java.io.*;
import java.util.Date;
import java.text.SimpleDateFormat;

public class TcpServer {
    public static void main(String[] args) {
        ServerSocket serverSocket = null; // 서버 소켓 참조변수

        try {
            // 7777번 포트를 열고 클라이언트의 연결을 기다리는 서버 소켓 생성
            serverSocket = new ServerSocket(7777);
            System.out.println(getTime() + "서버가 준비되었습니다.");
        } catch(IOException e) { e.printStackTrace(); }

        while(true) { // 계속해서 클라이언트의 연결을 받기 위해 무한 루프
            try {
                System.out.println(getTime() + "연결요청을 기다립니다.");
                
                // 클라이언트의 연결 요청이 올 때까지 블로킹(멈춤)됨. 연결되면 통신용 소켓 반환
                Socket socket = serverSocket.accept(); 
                System.out.println(getTime() + socket.getInetAddress() + "로부터 연결요청이 들어왔습니다.");

                // 소켓의 출력 스트림을 얻음
                OutputStream out = socket.getOutputStream(); 
                DataOutputStream dos = new DataOutputStream(out); // 데이터 전송을 위한 보조 스트림

                // 클라이언트로 메시지 전송
                dos.writeUTF("[Notice] Test Message1 from Server."); 
                System.out.println(getTime() + "데이터를 전송했습니다.");

                dos.close(); // 스트림 닫기
                socket.close(); // 소켓 닫기 (연결 종료)
            } catch (IOException e) {
                e.printStackTrace();
            }
        } // while
    } // main

    static String getTime() { // 현재 시간을 문자열로 반환하는 메서드
        SimpleDateFormat f = new SimpleDateFormat("[hh:mm:ss]");
        return f.format(new Date());
    }
}`
  },
  {
    id: "16-2-2",
    title: "2.1 TCP 소켓 프로그래밍 - 클라이언트",
    concept: "클라이언트는 Socket을 생성하여 서버의 IP와 Port로 연결을 요청함. 연결이 수락되면 스트림을 통해 데이터를 주고받음.",
    code: `import java.net.*;
import java.io.*;

public class TcpClient {
    public static void main(String[] args) {
        try {
            String serverIp = "127.0.0.1"; // 연결할 서버의 IP (로컬호스트)

            System.out.println("서버에 연결중입니다. 서버IP :" + serverIp);
            
            // 소켓을 생성하여 서버에 연결 요청 (IP, Port)
            Socket socket = new Socket(serverIp, 7777); 

            // 소켓의 입력 스트림을 얻음
            InputStream in = socket.getInputStream();
            DataInputStream dis = new DataInputStream(in); // 데이터 수신을 위한 보조 스트림

            // 서버로부터 받은 메시지 출력
            System.out.println("서버로부터 받은 메시지 :" + dis.readUTF()); 
            System.out.println("연결을 종료합니다.");

            dis.close(); // 스트림 닫기
            socket.close(); // 소켓 닫기
        } catch(ConnectException ce) {
            e.printStackTrace(); // 연결 실패 시 예외 처리
        } catch(IOException ie) {
            ie.printStackTrace();
        } catch(Exception e) {
            e.printStackTrace();
        }
    }
}`
  },
  {
    id: "16-2-3",
    title: "2.3 UDP 소켓 프로그래밍",
    concept: "UDP는 비연결형 프로토콜로 데이터를 패킷(DatagramPacket) 단위로 주고받음. 연결 과정이 없어 빠르지만 신뢰성은 낮음.",
    code: `import java.net.*;
import java.io.*;

public class UdpClient { // 데이터를 보내는 쪽 (Sender)
    public static void main(String[] args) {
        try {
            // UDP 소켓 생성
            DatagramSocket datagramSocket = new DatagramSocket();
            InetAddress serverAddress = InetAddress.getByName("127.0.0.1"); // 수신자 IP

            // 전송할 데이터
            byte[] msg = "Hello UDP".getBytes();

            // 데이터 패킷 생성 (데이터, 길이, 수신자IP, 수신자Port)
            DatagramPacket outPacket = new DatagramPacket(msg, msg.length, serverAddress, 8888);

            // 패킷 전송
            datagramSocket.send(outPacket);
            System.out.println("UDP 패킷 전송 완료");

            datagramSocket.close(); // 소켓 닫기
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

// *참고: 수신자(Server) 측 코드는 DatagramSocket(8888)로 생성 후 receive(packet) 메서드를 사용함.`
  }
];