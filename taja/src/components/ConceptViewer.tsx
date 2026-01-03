import React from 'react';
import { Concept } from '../lib/lessons';

interface ConceptViewerProps {
  concept: Concept | undefined;
}

const ConceptViewer: React.FC<ConceptViewerProps> = ({ concept }) => {
  if (!concept) {
    return (
      <div className="bg-dracula-bg p-6 rounded-lg text-dracula-comment">
        <p>해당 레슨의 개념 설명을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-dracula-bg p-8 rounded-lg shadow-lg space-y-4 prose prose-invert max-w-none">
      <h3 className="text-2xl font-bold text-dracula-cyan border-b border-dracula-comment pb-2">
        {concept.title.replace(/###\s*/, '')}
      </h3>
      <p className="text-dracula-fg leading-relaxed whitespace-pre-wrap">{concept.content}</p>
    </div>
  );
};

export default ConceptViewer;