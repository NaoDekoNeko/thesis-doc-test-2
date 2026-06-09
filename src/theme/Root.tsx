import React from 'react';
import ChatBot from '../components/ChatBot';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ChatBot />
    </>
  );
}
