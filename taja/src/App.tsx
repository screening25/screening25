import { useState, useEffect, useMemo, useRef } from "react";
import { lessons, Lesson, chapters, concepts } from "./lib/lessons";
import { useEngine } from "./hooks/useEngine";
import Stats from "./components/Stats";
import RestartButton from "./components/RestartButton";
import TypingArea from "./components/TypingArea";

interface LessonStats {
  history: number[];
  bestWpm: number;
}

const App = () => {
  // --- State Loading from LocalStorage ---
  // localStorage를 "DB"로 사용하여 마지막 레슨과 뷰 모드를 기억합니다.
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'typing' | 'concept'>(() => {
    return (localStorage.getItem('taja-viewMode') as 'typing' | 'concept') || 'typing';
  });
  const [lesson, setLesson] = useState<Lesson>(() => {
    const savedLessonId = localStorage.getItem('taja-lessonId');
    return lessons.find(l => l.id === savedLessonId) || lessons[0];
  });

  const currentConcept = useMemo(() => {
    const conceptId = `concept-${lesson.id}`;
    return concepts.find(c => c.id === conceptId);
  }, [lesson]);

  const textToType = useMemo(() => {
    if (viewMode === 'concept') {
      return currentConcept?.content ?? '해당 레슨의 개념 설명을 찾을 수 없습니다.';
    }
    return lesson.code;
  }, [viewMode, lesson, currentConcept]);

  // WPM, 정확도 등 타이핑 관련 계산은 useEngine 훅에서 처리됩니다.
  const { state, actions } = useEngine(textToType);
  const { status, wpm, accuracy, typed, cursor } = state;
  const [lessonStats, setLessonStats] = useState<LessonStats>({ history: [], bestWpm: 0 });

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // --- State Saving to LocalStorage ---
  // 앱이 처음 로드될 때 저장된 타이핑 내용을 복원합니다.
  useEffect(() => {
    const savedTyped = localStorage.getItem('taja-typed');
    if (savedTyped) {
      actions.handleTyped(savedTyped);
    }
    // 이 effect는 마운트 시 한 번만 실행되어야 합니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 현재 진행 상황(레슨, 뷰모드, 입력내용)을 localStorage에 저장합니다.
  useEffect(() => {
    localStorage.setItem('taja-lessonId', lesson.id);
    localStorage.setItem('taja-viewMode', viewMode);
    if (status !== 'finished') {
      localStorage.setItem('taja-typed', typed);
    } else {
      localStorage.removeItem('taja-typed'); // 완료되면 저장된 내용 삭제
    }
  }, [lesson.id, viewMode, typed, status]);

  // 자동 포커스 처리
  useEffect(() => {
    if (status !== 'finished') {
      inputRef.current?.focus();
    }
  }, [status, textToType]);
  
  // 로컬 스토리지에서 통계 데이터 로드
  useEffect(() => {
    const statsKey = `taja-lessonStats_${lesson.id}_${viewMode}`; // 모드별 통계 저장
    try {
      const storedStats = localStorage.getItem(statsKey);
      if (storedStats) setLessonStats(JSON.parse(storedStats));
      else setLessonStats({ history: [], bestWpm: 0 });
    } catch (e) {
      setLessonStats({ history: [], bestWpm: 0 });
    }
  }, [lesson, viewMode]);

  // 완료 시 통계 업데이트
  useEffect(() => {
    if (status === "finished" && wpm > 0) {
      setLessonStats(prevStats => {
        const newHistory = [...prevStats.history, wpm];
        const newBestWpm = Math.max(prevStats.bestWpm, wpm);
        const newStats = { history: newHistory, bestWpm: newBestWpm };
        localStorage.setItem(`taja-lessonStats_${lesson.id}_${viewMode}`, JSON.stringify(newStats));
        return newStats;
      });
    }
  }, [status, wpm, lesson.id, viewMode]);

  const handleLessonSelect = (lessonId: string) => {
    const newLesson = lessons.find((l) => l.id === lessonId);
    if (newLesson && lesson.id !== newLesson.id) {
        setLesson(newLesson);
        setViewMode('typing'); // 레슨 변경 시 타이핑 모드로 초기화
        actions.restart();
    }
    setIsNavOpen(false);
  };
  
  const handleRestart = () => {
    actions.restart();
  }

  const averageWpm = useMemo(() => {
    if (lessonStats.history.length === 0) return 0;
    const total = lessonStats.history.reduce((acc, curr) => acc + curr, 0);
    return total / lessonStats.history.length;
  }, [lessonStats.history]);

  const isFinished = status === "finished";
  const progress = cursor > 0 ? (cursor / textToType.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-vscode-bg text-dracula-fg font-mono" onClick={() => inputRef.current?.focus()}>
      <textarea
        ref={inputRef}
        className="absolute top-[-9999px] left-[-9999px] opacity-0"
        value={typed}
        onChange={(e) => actions.handleTyped(e.target.value)}
        onBlur={() => { if (status !== 'finished') inputRef.current?.focus() }}
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            actions.handleTyped(typed + "    ");
          } else if (e.key === "Enter") {
            e.preventDefault();
            actions.handleTyped(typed + "\n");
          }
        }}
        disabled={status === 'finished'}
      />

      {isNavOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setIsNavOpen(false)}>
          <div className="w-full max-w-4xl max-h-[80vh] overflow-y-auto bg-vscode-bg border border-dracula-comment rounded-lg shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 border-b border-dracula-comment pb-4">
              <h2 className="text-2xl font-bold text-dracula-purple">Select Lesson</h2>
              <button onClick={() => setIsNavOpen(false)} className="text-dracula-fg hover:text-white text-2xl">&times;</button>
            </div>
            <div className="space-y-8">
              {chapters.map((chapter, idx) => (
                <div key={idx}>
                  <h3 className="text-lg font-bold text-dracula-cyan mb-3 sticky top-0 bg-vscode-bg py-2 z-10">{chapter.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {chapter.lessons.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => handleLessonSelect(l.id)}
                        className={`p-3 text-left rounded border transition-all ${lesson.id === l.id ? "bg-dracula-purple text-white border-dracula-purple shadow-md" : "bg-gray-800 text-dracula-fg border-dracula-comment hover:border-dracula-purple hover:bg-opacity-80"}`}
                      >
                        <div className="text-xs font-bold text-dracula-pink mb-1">{l.id}</div>
                        <div className="text-sm font-medium truncate">{l.title}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="flex flex-col items-center p-8">
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-dracula-purple">Typin' Java</h1>
            <button onClick={() => setIsNavOpen(true)} className="px-4 py-2 bg-dracula-purple text-white rounded-md hover:bg-opacity-80">
              Select Lesson
            </button>
          </div>

          <div className="flex justify-center mb-4 border-b-2 border-dracula-comment">
            <button onClick={() => setViewMode('typing')} className={`px-6 py-2 text-lg ${viewMode === 'typing' ? 'text-dracula-cyan border-b-2 border-dracula-cyan' : 'text-dracula-comment'}`}>
              Typing Practice
            </button>
            <button onClick={() => setViewMode('concept')} className={`px-6 py-2 text-lg ${viewMode === 'concept' ? 'text-dracula-cyan border-b-2 border-dracula-cyan' : 'text-dracula-comment'}`}>
              Concept Study
            </button>
          </div>

          <div className="relative">
            <TypingArea code={textToType} typed={typed} />
            {isFinished && (
              <div className="absolute inset-0 flex items-center justify-center bg-vscode-bg bg-opacity-90 transition-opacity">
                <div className="text-center space-y-4 p-8 bg-dracula-bg rounded-lg shadow-lg">
                  <p className="text-3xl font-bold text-dracula-green">Completed!</p>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xl">
                    <span className="text-right text-dracula-comment">WPM:</span><span className="text-left text-white">{wpm.toFixed(0)}</span>
                    <span className="text-right text-dracula-comment">Accuracy:</span><span className="text-left text-white">{accuracy.toFixed(0)}%</span>
                    <span className="text-right text-dracula-comment">Best WPM:</span><span className="text-left text-dracula-cyan">{lessonStats.bestWpm.toFixed(0)}</span>
                    <span className="text-right text-dracula-comment">Avg WPM:</span><span className="text-left text-dracula-orange">{averageWpm.toFixed(0)}</span>
                  </div>
                  <RestartButton onRestart={handleRestart} />
                </div>
              </div>
            )}
          </div>
          <div className="h-10 flex items-center justify-between gap-4 mt-4">
            <div className="w-full bg-dracula-comment h-2 rounded-full">
              <div className="bg-dracula-green h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
            {!isFinished && <Stats wpm={wpm} accuracy={accuracy} />}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;