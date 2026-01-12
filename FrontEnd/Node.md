
# Node.js

Node.js는 웹 브라우저가 아닌 환경에서도 자바스크립트 코드를 실행할 수 있게 해주는 **자바스크립트 런타임(Runtime)**, 즉 자바스크립트 실행 환경이다.
> '런타임'이라는 단어를 조금 더 쉽게 표현하자면 자바스크립트 **'구동기'** 라고 할 수 있다.

## Node.js가 필요한 이유

### 자바스크립트의 역사 (History)
*   자바스크립트는 본래 웹 페이지 내의 상호작용을 처리하기 위해 만들어진 간단한 스크립트 언어로, 오직 **웹 브라우저 내에서만** 동작하도록 개발되었다.
*   동시대의 Java나 C와 달리 유연하고 작성이 편리하여 **생산성**을 중시했다.
*   자바스크립트의 매력에 빠진 개발자들은 이를 웹 브라우저 밖, 즉 **웹 외부**에서도 사용하고 싶어 했다.

### Node.js의 등장과 변화
Node.js의 등장으로 자바스크립트는 기존의 한계를 넘어서기 시작했다.

*   자바스크립트로 **웹 서버**를 구축하는 사례가 늘어났다.
*   활용 범위가 모바일을 넘어 **데스크탑 앱**으로까지 확장되었다.

---

Node.js는 단순한 상호작용에 그쳤던 자바스크립트를 **범용적**으로 사용할 수 있게 해주는 실행 환경이다. 우리가 배우고자 하는 **React** 또한 이 Node.js 환경을 기반으로 동작하는 기술이다.
 
---

# Node.js 사용하기

프로그래밍에서 특정 목적을 갖는 프로그램을 만들 때 '프로젝트'라는 단위를 사용하듯, Node.js 환경에서는 **패키지(Package)** 라는 단위로 프로그램을 구성한다.

## 1. 패키지 생성 및 초기화
1.  **루트 폴더 생성**: 예) `section01`
2.  **패키지 초기화**: 터미널에서 `npm init` 명령어 실행
    *   `package.json` 파일이 자동으로 생성된다.
    *   `name`, `version` 등의 정보를 입력하거나 엔터를 눌러 기본값으로 설정할 수 있다.

## 2. Node.js 실행
1.  `index.js` 파일 생성
    ```javascript
    console.log("Hello Node.js!");
    ```
2.  터미널에서 실행
    ```bash
    node index.js
    # 출력: Hello Node.js!
    ```
    *   `src` 폴더 내부에 파일이 있다면 `node src/index.js`와 같이 경로를 지정하여 실행한다.

## 3. Package Scripts (스크립트 활용)
`package.json`의 `scripts` 항목을 통해 자주 사용하는 명령어를 정의할 수 있다.

```json
{
  "scripts": {
    "start": "node src/index.js"
  }
}
```
*   실행 명령어: `npm run start` (또는 `npm start`)

---

# 모듈 시스템 (Module System)

## 모듈이란?
쇼핑몰을 개발한다고 가정해 보자. 회원 가입, 장바구니, 결제 등 다양한 기능이 필요하다. 이 모든 기능을 하나의 파일에 작성하면 관리가 어렵고 효율이 떨어진다.
따라서 기능별로 파일(`user.js`, `cart.js`, `payment.js`)을 나누어 관리하는데, 이렇게 분리된 각각의 자바스크립트 파일을 **모듈(Module)** 이라고 한다.

## 모듈 시스템의 종류
모듈을 생성하고, 불러오고, 사용하는 기능을 제공하는 시스템이다. 자바스크립트의 대표적인 모듈 시스템으로는 **CommonJS(CJS)** 와 **ES Module(ESM)** 이 있다.

### 1. CJS (CommonJS)
Node.js의 기본 모듈 시스템이다.

**math.js (모듈 정의)**
```javascript
function add(a, b) {
    return a + b;
}

function sub(a, b) {
    return a - b;
}

module.exports = {
    add: add,
    sub: sub,
};
```

**index.js (모듈 사용)**
```javascript
// 모듈 불러오기
const moduleData = require('./math');

console.log(moduleData.add(5, 3)); // 8
console.log(moduleData.sub(5, 3)); // 2

// 구조 분해 할당 사용
const { add, sub } = require('./math');
console.log(add(5, 3)); // 8
```

### 2. ES Module (ESM)
최신 자바스크립트 표준 모듈 시스템이다. Node.js에서 사용하려면 설정이 필요하다.

**설정 방법 (`package.json`)**
`"type": "module"` 속성을 추가해야 한다. (CJS와 동시에 사용 불가)
```json
{
  "type": "module"
}
```

**math.js (모듈 정의)**
```javascript
// 개별 내보내기 (Named Export)
export function add(a, b) {
    return a + b;
}

export function sub(a, b) {
    return a - b;
}

// 기본 내보내기 (Default Export)
export default function multiply(a, b) {
    return a * b;
}
```

**index.js (모듈 사용)**
```javascript
// 확장자(.js)를 반드시 명시해야 함
import { add, sub } from './math.js';
import multiply from './math.js';

console.log(add(5, 3)); // 8
console.log(multiply(5, 3)); // 15
```

> **참고**: `export default`는 모듈당 **하나만** 존재할 수 있다. 만약 여러 개를 `default`로 내보내려고 하면 문법 에러(SyntaxError)가 발생한다. 여러 값을 내보내야 한다면 `export { a, b }` 형태의 Named Export를 사용해야 한다.

---

# 라이브러리 (Library)

프로그램을 개발할 때 필요한 다양한 기능들을 미리 만들어 모듈화해 놓은 것이다.

## 1. 라이브러리 검색 및 설치
**NPM (Node Package Manager)**은 Node.js의 라이브러리들이 등록되어 있는 저장소다.
*   [npmjs.com](https://www.npmjs.com)에서 필요한 라이브러리를 검색할 수 있다.
*   **설치 명령어**:
    ```bash
    npm install randomcolor
    ```

## 2. package.json과 의존성
라이브러리를 설치하면 `package.json` 파일의 `dependencies` 항목에 추가된다.

```json
"dependencies": {
  "randomcolor": "^0.6.2"
}
```

### package-lock.json
*   `package.json`은 버전의 범위(Range)를 명시하지만, `package-lock.json`은 실제로 설치된 **정확한 버전 정보**를 저장한다.
*   협업 시 팀원 간에 동일한 버전의 라이브러리를 사용하도록 보장해 준다.

## 3. node_modules 폴더
*   설치된 라이브러리 파일들이 실제로 저장되는 공간이다.
*   용량이 매우 크기 때문에 Git과 같은 버전 관리 시스템에 올리지 않는다 (공유하지 않음).
*   `package.json`에 의존성 정보가 명시되어 있으므로, 언제든지 다음 명령어로 다시 다운로드할 수 있다.
    ```bash
    npm install
    # 또는 npm i
    ```

## 4. 라이브러리 사용 예시 (randomcolor)

```javascript
import randomColor from 'randomcolor'; // 라이브러리 이름으로 불러오기

const color = randomColor();
console.log(color); // 예: #ead89d (무작위 색상 출력)
```