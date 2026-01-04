import { useState, useEffect, useMemo, useRef } from "react";
import { lessons, Lesson, chapters, concepts } from "./lib/lessons";
import { useEngine } from "./hooks/useEngine";
import Stats from "./components/Stats";
import RestartButton from "./components/RestartButton";
import TypingArea from "./components/TypingArea";
import { useTypingStats } from "./hooks/useTypingStats";

interface LessonStats {
  history: number[];
  bestWpm: number;
}

const App = () => {
  // --- State Loading from LocalStorage ---
  // 백엔드 API를 사용하여 마지막 레슨과 뷰 모드를 기억합니다.
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'typing' | 'concept'>('typing');
  const [lesson, setLesson] = useState<Lesson>(lessons[0]);
  const [isLoading, setIsLoading] = useState(true); // 데이터 로딩 상태 추가

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
  const { status, typed, cursor } = state;
  const { wpm, accuracy } = useTypingStats(typed, textToType, status);
  const [lessonStats, setLessonStats] = useState<LessonStats>({ history: [], bestWpm: 0 });

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    document.title = "Typin' Code ⌨️";
  }, []);

  // --- State Loading from Backend ---
  // 앱이 처음 로드될 때 서버에서 상태를 복원합니다.
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/progress');
        if (res.ok) {
          const data = await res.json();
          if (data.lastLessonId) {
            const savedLesson = lessons.find(l => l.id === data.lastLessonId);
            if (savedLesson) setLesson(savedLesson);
          }
          if (data.viewMode) setViewMode(data.viewMode as 'typing' | 'concept');
          if (data.typedContent) actions.handleTyped(data.typedContent);
        }
      } catch (error) {
        console.error("Failed to load progress from backend", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProgress();
  }, []);

  // 현재 진행 상황(레슨, 뷰모드, 입력내용)을 서버에 저장합니다.
  useEffect(() => {
    if (isLoading) return;

    const saveProgress = async () => {
      try {
        await fetch('http://localhost:8080/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lastLessonId: lesson.id,
            viewMode: viewMode,
            typedContent: status !== 'finished' ? typed : ''
          })
        });
      } catch (error) {
        console.error("Failed to save progress", error);
      }
    };
    
    // 너무 잦은 요청을 방지하기 위해 디바운스 처리 등을 고려할 수 있습니다.
    const timeoutId = setTimeout(saveProgress, 1000);
    return () => clearTimeout(timeoutId);
  }, [lesson.id, viewMode, typed, status, isLoading]);

  // 자동 포커스 처리
  useEffect(() => {
    if (!isLoading && status !== 'finished') {
      inputRef.current?.focus();
    }
  }, [status, textToType, isLoading]);
  
  // 서버에서 통계 데이터 로드
  useEffect(() => {
    if (isLoading) return;
    
    fetch(`http://localhost:8080/api/stats?lessonId=${lesson.id}&viewMode=${viewMode}`)
      .then(res => res.json())
      .then(data => setLessonStats(data))
      .catch(() => setLessonStats({ history: [], bestWpm: 0 }));
  }, [lesson, viewMode, isLoading]);

  // 완료 시 통계 업데이트
  useEffect(() => {
    if (status === "finished" && wpm > 0) {
      setLessonStats(prevStats => {
        const newHistory = [...prevStats.history, wpm];
        const newBestWpm = Math.max(prevStats.bestWpm, wpm);
        const newStats = { history: newHistory, bestWpm: newBestWpm };
        
        fetch('http://localhost:8080/api/stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lessonId: lesson.id,
            viewMode: viewMode,
            ...newStats
          })
        });
        
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

  if (isLoading) {
    return <div className="min-h-screen bg-vscode-bg text-dracula-fg flex items-center justify-center">Loading...</div>;
  }

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
            <h1 className="text-3xl font-bold text-dracula-purple">Typin' Code ⌨️</h1>
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