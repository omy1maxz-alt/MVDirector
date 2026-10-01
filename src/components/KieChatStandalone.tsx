import React from 'react';
import { KieChatModal } from '@/components/KieChatModal';

export const KieChatStandalone: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[100dvh] bg-[#08080a] flex flex-col overflow-hidden">
      <KieChatModal
        isOpen={true}
        isStandalone={true}
        onClose={() => {
          if (window.opener) {
            window.close();
          } else {
            window.location.href = window.location.pathname;
          }
        }}
      />
    </div>
  );
};
