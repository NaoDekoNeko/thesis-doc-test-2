import React, { useState, useRef, useEffect, useCallback } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

interface ChatSource {
  docFolder: string;
  title: string;
  url: string;
  category: string;
  contentPreview: string;
  score: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  sources?: ChatSource[];
  timing?: { searchMs: number; generationMs: number; totalMs: number };
  timestamp: Date;
}

const SITE_URLS: Record<string, string> = {
  'thesis-doc-test-1': 'https://platform-eng.naodeko.site',
  'thesis-doc-test-2': 'https://software-arch.naodeko.site',
};

function buildSourceUrl(docFolder: string, url: string): string {
  const base = SITE_URLS[docFolder] ?? '';
  if (!url) return base || '#';
  if (url.startsWith('http')) {
    try { url = new URL(url).pathname; } catch { return url; }
  }
  url = url.replace(/\/index\.html$/, '/');
  if (!url.endsWith('/')) url += '/';
  return `${base}${url.startsWith('/') ? url : `/${url}`}`;
}

const ChatBot: React.FC = () => {
  const { siteConfig } = useDocusaurusContext();
  const API_BASE_URL = siteConfig.customFields?.apiBaseUrl as string;

  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'system',
      content: '👋 Hola, soy el asistente RAG de documentación. Puedo responder preguntas sobre Platform Engineering y Software Architecture usando búsqueda híbrida semántica + FTS. ¿En qué puedo ayudarte?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSources, setShowSources] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setMessages((prev) => [...prev, {
      id: generateId(), role: 'user', content: trimmed, timestamp: new Date(),
    }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();

      setMessages((prev) => [...prev, {
        id: generateId(),
        role: 'assistant',
        content: data.answer,
        sources: data.sources,
        timing: data.timing,
        timestamp: new Date(),
      }]);
    } catch (error) {
      setMessages((prev) => [...prev, {
        id: generateId(),
        role: 'assistant',
        content: `❌ No se pudo conectar con el microservicio RAG.\n\`${API_BASE_URL}\`\n\nError: ${error}`,
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, API_BASE_URL]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome', role: 'system',
      content: '👋 Chat reiniciado. ¿En qué puedo ayudarte?',
      timestamp: new Date(),
    }]);
    setShowSources(null);
  };

  const formatContent = (content: string) =>
    content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/^- (.*)/gm, '<li>$1</li>')
      .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
      .replace(/\n/g, '<br/>');

  const containerClass = [
    styles.chatContainer,
    isOpen ? styles.chatOpen : styles.chatClosed,
    isFullScreen ? styles.chatFullScreen : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      {!isOpen && (
        <button className={styles.fab} onClick={() => setIsOpen(true)} aria-label="Abrir asistente RAG">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
            <path d="M7 9H9V11H7V9ZM11 9H13V11H11V9ZM15 9H17V11H15V9Z" fill="currentColor"/>
          </svg>
          <span className={styles.fabPulse} />
        </button>
      )}

      <div className={containerClass}>
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <div className={styles.headerAvatar}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <h3 className={styles.headerTitle}>RAG Assistant</h3>
              <span className={styles.headerStatus}>
                <span className={styles.statusDot} />
                Hybrid Search · Gemini
              </span>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.headerBtn} onClick={clearChat} title="Limpiar chat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
              </svg>
            </button>
            <button className={styles.headerBtn} onClick={() => setIsFullScreen(p => !p)} title={isFullScreen ? 'Reducir' : 'Pantalla completa'}>
              {isFullScreen
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" fill="currentColor"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" fill="currentColor"/></svg>
              }
            </button>
            <button className={styles.headerBtn} onClick={() => { setIsOpen(false); setIsFullScreen(false); }} title="Minimizar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.messages}>
          {messages.map((msg) => (
            <div key={msg.id} className={`${styles.message} ${styles[msg.role]}`}>
              {(msg.role === 'assistant' || msg.role === 'system') && (
                <div className={styles.messageAvatar}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                  </svg>
                </div>
              )}
              <div className={styles.messageBubble}>
                <div className={styles.messageContent} dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }} />
                {msg.sources && msg.sources.length > 0 && (
                  <div className={styles.sourcesSection}>
                    <button className={styles.sourcesToggle} onClick={() => setShowSources(showSources === msg.id ? null : msg.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h6v6h6v10H6z" fill="currentColor"/>
                      </svg>
                      {msg.sources.length} fuente{msg.sources.length > 1 ? 's' : ''}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={showSources === msg.id ? styles.chevronUp : styles.chevronDown}>
                        <path d="M7 10l5 5 5-5z" fill="currentColor"/>
                      </svg>
                    </button>
                    {showSources === msg.id && (
                      <div className={styles.sourcesList}>
                        {msg.sources.slice(0, 5).map((source, i) => (
                          <a key={i} href={buildSourceUrl(source.docFolder, source.url)} className={styles.sourceItem} target="_blank" rel="noopener noreferrer">
                            <span className={styles.sourceFolder}>{source.docFolder}</span>
                            <span className={styles.sourceTitle}>{source.title}</span>
                            {source.category && <span className={styles.sourceCategory}>{source.category}</span>}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {msg.timing && (
                  <div className={styles.timing}>⚡ {(msg.timing.totalMs / 1000).toFixed(1)}s</div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className={`${styles.message} ${styles.assistant}`}>
              <div className={styles.messageAvatar}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                </svg>
              </div>
              <div className={styles.messageBubble}>
                <div className={styles.loadingDots}><span /><span /><span /></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputArea}>
          <div className={styles.inputWrapper}>
            <textarea
              ref={inputRef}
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pregunta sobre la documentación..."
              rows={1}
              disabled={isLoading}
            />
            <button className={styles.sendBtn} onClick={sendMessage} disabled={!input.trim() || isLoading} aria-label="Enviar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
              </svg>
            </button>
          </div>
          <div className={styles.inputFooter}>pgvector · FTS español · Gemini 2.5 Flash</div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
