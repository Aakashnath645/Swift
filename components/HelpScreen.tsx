import React from 'react';
import PageHeader from './PageHeader';

interface HelpScreenProps {
  onBack: () => void;
}

const HelpScreen: React.FC<HelpScreenProps> = ({ onBack }) => {
  return (
    <div className="flex-1 flex flex-col bg-gray-900 animate-fadeIn">
      <PageHeader title="Help & Support" onBack={onBack} />
      <main className="flex-1 flex items-center justify-center text-gray-500">
        <p>Help & Support page coming soon.</p>
      </main>
    </div>
  );
};

export default HelpScreen;