import React from 'react';
import PageHeader from './PageHeader';

interface LegalScreenProps {
  title: string;
  content: string;
  onBack: () => void;
}

const LegalScreen: React.FC<LegalScreenProps> = ({ title, content, onBack }) => {
  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 animate-fadeIn">
      <PageHeader title={title} onBack={onBack} />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: content }} />
      </main>
    </div>
  );
};

export default LegalScreen;
