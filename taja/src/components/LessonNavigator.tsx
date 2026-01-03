import { useState } from 'react';
import { Lesson } from '../lib/lessons';

interface LessonNavigatorProps {
  lessons: Lesson[];
  onSelect: (lessonId: string) => void;
  currentLessonId: string;
}

const LessonNavigator = ({ lessons, onSelect, currentLessonId }: LessonNavigatorProps) => {
  const [openChapter, setOpenChapter] = useState<string | null>(null);

  const groupedLessons = lessons.reduce((acc, lesson) => {
    (acc[lesson.category] = acc[lesson.category] || []).push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  const toggleChapter = (chapter: string) => {
    setOpenChapter(openChapter === chapter ? null : chapter);
  };

  return (
    <div className="w-full h-[80vh] bg-dracula-bg border border-dracula-comment rounded-md p-4 overflow-y-auto">
      <h2 className="text-xl font-bold text-white mb-4">Select a Lesson</h2>
      <nav className="space-y-1">
        {Object.entries(groupedLessons).map(([category, lessonsInCategory]) => (
          <div key={category} className="border-b border-dracula-comment last:border-b-0 py-1">
            <button
              onClick={() => toggleChapter(category)}
              className="w-full text-left px-3 py-2 text-lg font-bold text-dracula-purple rounded-md hover:bg-vscode-bg flex justify-between items-center"
            >
              <span>{category}</span>
              <span className="transform transition-transform duration-200" style={{ transform: openChapter === category ? 'rotate(90deg)' : 'rotate(0deg)' }}>{'>'}</span>
            </button>
            {openChapter === category && (
              <div className="pl-4 mt-2 space-y-1">
                {lessonsInCategory.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => onSelect(lesson.id)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      currentLessonId === lesson.id
                        ? 'bg-dracula-purple text-white'
                        : 'text-dracula-fg hover:bg-vscode-bg'
                    }`}
                  >
                    {lesson.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default LessonNavigator;