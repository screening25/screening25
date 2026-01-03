import { chapter2_3 } from "./chapter2_3";
import { chapter4_5 } from "./chapter4_5";
import { chapter6_7 } from "./chapter6_7";
import { chapter8_9_10 } from "./chapter8_9_10";
import { chapter11_12 } from "./chapter11_12";
import { chapter13_14 } from "./chapter13_14"; 
import { chapter15_16 } from "./chapter15_16";
import { chapter2Concepts } from './chapter2.ts';
import { chapter3Concepts } from './chapter3.ts';
import { chapter4Concepts } from './chapter4.ts';
import { chapter5Concepts } from './chapter5.ts';
import { chapter6Concepts } from './chapter6.ts';
import { chapter7Concepts } from './chapter7.ts';
import { chapter8Concepts } from './chapter8.ts';
import { chapter9Concepts } from './chapter9.ts';
import { chapter10Concepts } from './chapter10.ts';
import { chapter11Concepts } from './chapter11.ts';
import { chapter12Concepts } from './chapter12.ts';
import { chapter13Concepts } from './chapter13.ts';
import { chapter14Concepts } from './chapter14.ts';
import { chapter15Concepts } from './chapter15.ts';
import { chapter16Concepts } from './chapter16.ts';

// 공통 인터페이스
export interface Lesson {
  id: string;
  title: string;
  concept: string;
  code: string;
}

export interface Concept {
  id: string;
  chapter: string;
  title: string;
  content: string;
}

export const chapters = [
  { title: "Chapter 2, 3: 변수와 연산자", lessons: chapter2_3 },
  { title: "Chapter 4, 5: 조건문과 반복문, 배열", lessons: chapter4_5 },
  { title: "Chapter 6, 7: 객체지향 프로그래밍 I, II", lessons: chapter6_7 },
  { title: "Chapter 8, 9, 10: 예외처리, java.lang, 날짜와 시간", lessons: chapter8_9_10 },
  { title: "Chapter 11, 12: 컬렉션 프레임웍, 지네릭스 등", lessons: chapter11_12 },
  { title: "Chapter 13, 14: 쓰레드, 람다와 스트림", lessons: chapter13_14 },
  { title: "Chapter 15, 16: 입출력, 네트워킹", lessons: chapter15_16 },
  
];

// 모든 챕터를 통합한 배열
export const lessons: Lesson[] = chapters.flatMap(c => c.lessons);

// 모든 개념을 통합한 배열
const javaConcepts = [
  ...chapter2Concepts,
  ...chapter3Concepts,
  ...chapter4Concepts,
  ...chapter5Concepts,
  ...chapter6Concepts,
  ...chapter7Concepts,
  ...chapter8Concepts,
  ...chapter9Concepts,
  ...chapter10Concepts,
  ...chapter11Concepts,
  ...chapter12Concepts,
  ...chapter13Concepts,
  ...chapter14Concepts,
  ...chapter15Concepts,
  ...chapter16Concepts,
];
export const concepts: Concept[] = javaConcepts;