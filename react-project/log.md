# React 프로젝트 기술 명세서
**작성 일자: 2026년 1월 4일**

## 1. React 기본 요소

### 1.1. 컴포넌트 (Component)
- **정의**: UI를 구성하는 독립적이고 재사용 가능한 코드 단위
- **상세 설명**:
    - 컴포넌트는 로직과 UI를 하나로 묶어 캡슐화하며, 이를 조합하여 복잡한 애플리케이션 구축
    - 함수형 컴포넌트와 클래스형 컴포넌트가 있으며, 현재는 주로 함수형 컴포넌트와 Hook을 사용하는 것이 표준적인 방식
- **주요 특징**:
    - **재사용성**: 한 번 정의된 컴포넌트는 프로젝트 내 어디서든 재사용 가능
    - **유지보수성**: UI의 각 부분을 독립적으로 관리할 수 있어 수정 및 테스트 용이
    - **추상화**: 복잡한 내부 구현을 숨기고, 정의된 인터페이스(Props)를 통해서만 상호작용
- **프로젝트 내 사용 예시**: `CommonHeader.tsx`, `Card.tsx`, `CommonNav.tsx` 등

### 1.2. JSX (JavaScript XML)
- **정의**: JavaScript 코드 내에서 UI의 구조를 시각적으로 표현하기 위해 사용되는 XML과 유사한 구문 확장
- **상세 설명**:
    - HTML과 거의 동일한 문법을 사용하여 개발자가 UI 구조를 직관적으로 파악하고 작성할 수 있도록 지원
    - 브라우저가 직접 실행하는 코드가 아니며, Babel과 같은 트랜스파일러에 의해 `React.createElement()` 형태의 표준 JavaScript 코드로 변환
- **주요 문법**:
    - 모든 엘리먼트는 반드시 닫혀야 함 (`<br />`)
    - 최상위 엘리먼트는 하나여야 함 (필요시 `<>...</>` Fragment 사용)
    - JavaScript 표현식은 `{}` 안에 작성
    - HTML의 `class` 속성 대신 `className` 사용

## 2. 데이터 관리 및 흐름

### 2.1. 상태 (State) 와 `useState`
- **정의**: 컴포넌트의 생명주기 동안 유지되며, 변화 시 UI가 다시 렌더링되는 동적인 데이터 `useState`는 함수형 컴포넌트에서 상태를 관리하기 위한 Hook
- **상세 설명**:
    - `const [state, setState] = useState(initialValue)` 형태로 선언
    - `state`: 현재 상태 값
    - `setState`: 상태를 비동기적으로 업데이트하는 함수 이 함수를 통해서만 상태를 변경해야 React가 변화를 감지하고 리렌더링을 수행
- **주요 특징**:
    - **지역성**: 상태는 선언된 컴포넌트 내에서만 유효 (Local State)
    - **반응성**: `setState` 호출 시 상태 변경에 따라 UI가 자동으로 업데이트
- **프로젝트 내 사용 예시**: `CommonNav.tsx` (`useState<Navigation[]>`)

### 2.2. 동적 데이터 바인딩 (Dynamic Data Binding)
- **정의**: 변수나 상태 값을 JSX 내에 직접 삽입하여 UI에 동적으로 표시하는 기법
- **상세 설명**:
    - JSX 내에서 중괄호 `{}`를 사용하여 JavaScript 변수, 상태, 또는 표현식의 결과값을 텍스트나 속성에 연결
    - 데이터가 변경되면 해당 데이터를 사용하는 UI 부분이 자동으로 업데이트
- **프로젝트 내 사용 예시**: `CommonHeader.tsx` (`{/* [공부] 외부 링크/정보... */}` 부분)

### 2.3. 불변성 (Immutability)
- **정의**: 생성된 후에는 수정할 수 없는 데이터의 특성 React에서는 상태 객체나 배열의 원본을 직접 수정하지 않고, 복사본을 만들어 변경 사항을 적용하는 원칙을 의미
- **상세 설명**:
    - React는 상태의 참조(메모리 주소)가 변경되었는지 여부를 비교하여 리렌더링을 결정 (Shallow Compare)
    - 원본 객체나 배열을 직접 수정하면 참조가 변경되지 않아 React가 변화를 감지하지 못하고 UI가 업데이트되지 않는 문제가 발생할 수 있음
- **구현 방법**:
    - 배열: `[...array]`, `array.map()`, `array.filter()` 등
    - 객체: `{...object}`
- **프로젝트 내 사용 예시**: `CommonNav.tsx` (`[...navJson]`)

### 2.4. 인터페이스 (Interface)
- **정의**: TypeScript에서 객체의 구조를 정의하는 '타입 명세'
- **상세 설명**:
    - 객체가 가져야 할 속성과 각 속성의 타입을 지정하여 코드의 타입 안정성을 보장
    - 컴파일 시점에 타입 오류를 검출하여 런타임 에러 방지
- **주요 특징**:
    - **가독성 및 문서화**: 데이터 구조를 명확하게 표현하여 코드 이해도를 높임
    - **개발 생산성**: IDE의 자동 완성 및 타입 추론 기능을 극대화
- **프로젝트 내 사용 예시**: `CommonNav.tsx` (`interface Navigation`)

## 3. UI 렌더링 및 인터랙션

### 3.1. 리스트 렌더링과 Key Prop
- **정의**: 배열 데이터를 UI 요소 목록으로 변환하여 렌더링하는 기법
- **상세 설명**:
    - JavaScript의 `map()` 메서드를 사용하여 배열의 각 요소를 JSX 엘리먼트로 매핑
    - **Key Prop**: 리스트 내 각 항목을 고유하게 식별하기 위한 문자열 또는 숫자 React의 재조정(Reconciliation) 과정에서 변경, 추가, 삭제된 항목을 효율적으로 식별하는 데 사용
- **`key` Prop의 중요성**:
    - `key`는 형제 엘리먼트 사이에서만 고유하면 됨
    - `key`가 없거나 불안정할 경우(예: 배열 인덱스 사용), 리스트의 순서 변경이나 항목 추가/삭제 시 성능 저하 및 UI 상태 오류 유발 가능
- **프로젝트 내 사용 예시**: `CommonNav.tsx` (`nav.map(...)`)

### 3.2. 이벤트 핸들러 (Event Handler)
- **정의**: 사용자 입력(클릭, 키보드 입력 등)에 반응하여 특정 로직을 실행하는 함수
- **상세 설명**:
    - JSX 엘리먼트에 `onClick`, `onChange` 등의 속성으로 함수를 전달하여 이벤트를 처리
    - 이벤트 핸들러 함수는 일반적으로 컴포넌트 내에 정의
- **프로젝트 내 사용 예시**: `Card.tsx` (`<Card onClick={...}>`)

## 4. 스타일링 및 아키텍처

### 4.1. Layout Wrapper 패턴
- **정의**: 여러 페이지에 걸쳐 공통적으로 나타나는 레이아웃(헤더, 푸터 등)을 별도의 컴포넌트로 분리하고, 페이지의 고유 콘텐츠를 자식으로 받아 렌더링하는 디자인 패턴
- **주요 장점**:
    - **코드 중복 제거**: 공통 레이아웃 코드를 한 곳에서 관리
    - **유지보수성 향상**: 레이아웃 수정 시 해당 Wrapper 컴포넌트만 변경
- **프로젝트 내 사용 예시**: `src/pages/index/index.tsx`

### 4.2. CSS Modules
- **정의**: CSS 클래스 이름이 전역 스코프에서 충돌하는 것을 방지하기 위해, CSS를 컴포넌트 단위로 지역화(Localize)하는 기술
- **동작 방식**:
    - `[name].module.css` 형식으로 파일을 작성하면, 빌드 시 각 클래스 이름이 `[파일명]_[클래스명]__[해시]` 형태의 고유한 이름으로 변환
    - 컴포넌트에서는 `import styles from './[name].module.css'`로 불러와 `styles.클래스명` 형태로 사용
- **프로젝트 내 사용 예시**: `CommonNav.tsx`, `Card.module.scss`

### 4.3. BEM (Block, Element, Modifier)
- **정의**: CSS 클래스 이름 작성을 위한 방법론으로, UI 구조를 명확하게 표현하여 가독성과 유지보수성을 높이는 것을 목표로 함
- **구조**:
    - **Block**: 재사용 가능한 기능적 독립체 (`.card`)
    - **Element**: 블록을 구성하는 부분 (`.card__title`) `__`로 연결
    - **Modifier**: 블록이나 요소의 상태 또는 변형 (`.card--highlighted`) `--`로 연결
- **프로젝트 내 사용 예시**: `CommonHeader.tsx`

### 4.4. 미디어 쿼리 (Media Query)
- **정의**: 뷰포트 너비 등 디바이스의 특정 조건에 따라 다른 스타일 규칙을 적용하는 CSS 기능 반응형 웹 디자인의 핵심 기술
- **구문**: `@media (조건) { 스타일 규칙 }` 예: `@media (max-width: 768px) { ... }`
- **프로젝트 내 사용 예시**: `Card.module.scss`

---

## 부록: '공부' 주석 원본 (개념별)

### Layout Wrapper
- `// [공부] Layout Wrapper: 전체 페이지의 규격과 배경 등을 결정하는 최상위 컨테이너`
  - `src/pages/index/index.tsx`

### Media Query
- `// [공부] Media Query: 화면 크기에 따른 반응형 스타일 정의`
  - `src/pages/index/components/Card.module.scss`

### Event Handler
- `// [공부] Event Handler: 카드 클릭 시 실행될 함수 정의`
  - `src/pages/index/components/Card.tsx`

### className
- `// [공부] className: CSS Module을 사용하여 고유한 클래스명을 적용`
  - `src/pages/index/components/Card.tsx`

### BEM 패턴
- `// [공부] BEM 패턴: header__logoBox와 같은 명명 규칙을 통한 클래스 구조화`
  - `src/components/common/header/CommonHeader.tsx`

### 동적 데이터 바인딩
- `{* [공부] 외부 링크/정보: 동적 데이터 바인딩이 필요한 텍스트 영역 *}`
  - `src/components/common/header/CommonHeader.tsx`

### Interface
- `// [공부] Interface: 데이터 구조의 규격을 정의하여 타입 안정성 및 자동 완성 지원`
  - `src/components/common/navigation/CommonNav.tsx`

### Generics (in `useState`)
- `// [공부] Generics: useState<Navigation[]>를 통해 상태에 저장될 배열 요소의 타입 강제`
  - `src/components/common/navigation/CommonNav.tsx`

### Immutability
- `// [공부] Immutability: [...navJson] 스프레드 연산자로 원본 주소값을 복사하여 새로운 배열 생성`
  - `src/components/common/navigation/CommonNav.tsx`

### .map() (리스트 렌더링)
- `// [공부] .map(): 배열 데이터를 순회하며 리액트 엘리먼트(JSX)로 변환하는 핵심 메서드`
  - `src/components/common/navigation/CommonNav.tsx`

### Key Prop
- `// [공부] Key Prop: 리액트가 변경된 리스트 항목을 추적하기 위한 고유 식별자 할당`
  - `src/components/common/navigation/CommonNav.tsx`

### CSS Modules
- `// [공부] CSS Modules: 스타일 충돌 방지를 위해 클래스명을 고유값으로 변환하여 적용`
  - `src/components/common/navigation/CommonNav.tsx`

---

# 매일 학습 내용 정리를 위한 프롬프트

현재 React 프로젝트의 내용을 바탕으로, 아래의 모든 요구사항을 **반드시** 준수하여 `log.md` 학습 로그 파일을 생성 및 업데이트해줘

**[기본 수행 작업]**
1.  프로젝트 전체에서 '공부'라는 키워드가 포함된 주석을 모두 검색
2.  오늘 날짜를 기준으로, 해당 주석 내용에서 학습한 모든 React 및 관련 웹 기술 개념을 정리

**[콘텐츠 요구사항]**
1.  **문서 제목**: `# React 프로젝트 기술 명세서`로 설정.
2.  **작성 일자**: 문서 제목 바로 아래에 `**작성 일자: YYYY년 MM월 DD일**` 형식으로 오늘 날짜를 명시
3.  **내용 구성**:
    -   React를 처음 배우는 사람을 기준으로, 가장 기초적인 개념(예: 컴포넌트, JSX)부터 시작하여 주석에서 유추할 수 있는 모든 기술 개념을 체계적으로 설명
    -   각 개념은 '정의', '상세 설명', '주요 특징', '프로젝트 내 사용 예시' 등의 항목으로 명확하게 구분하여 기술
4.  **부록**:
    -   문서 마지막에 `## 부록: '공부' 주석 원본 (개념별)` 섹션을 추가
    -   이 섹션에서는 찾은 '공부' 주석 원본을 각 개념별로 분류
    -   각 항목의 형식은 아래 예시를 정확히 따를 것:
        ```
        ### [개념 이름]
        - `[주석 내용 원본]`
          - `[주석이 위치한 파일 경로]`
        ```

**[스타일 및 어조 요구사항]**
1.  **전체 톤**: 개인적인 의견이나 대화체 없이, 건조하고 객관적인 기술 명세서 스타일을 유지
2.  **문장 종결**: 문장 끝에 `.`(마침표)를 절대로 사용하지 말 것
3.  **서술어 형식**: 문장 끝을 `-함`, `-임`과 같은 명사형 종결 어미로 끝내지 말 것. (예: "구축함" -> "구축")
4.  **반드시 지켜야 하는 사항**: 다른 날짜에 작성된 것들은 건드리지 않을 것 

**[AI 에이전트 응답 관련]**
-   이 프롬프트를 처리하는 과정에서의 너의 모든 답변은 반드시 격식 있고 중립적인 톤을 유지할 것