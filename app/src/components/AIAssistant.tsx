import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { answerQuestion } from '../lib/assistant';

type Message = { role: 'user' | 'bot'; text: string };

const initialMessages: Message[] = [
  { role: 'bot', text: 'Pregúntame algo sobre mis proyectos, skills o experiencia.' },
];

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const question = input.trim();
    if (!question) return;

    const answer = answerQuestion(question);
    setMessages((prev) => [...prev, { role: 'user', text: question }, { role: 'bot', text: answer }]);
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 flex h-[420px] w-[320px] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl sm:w-[360px]"
          >
            <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text">Asistente</p>
                <p className="text-xs text-text-dim">Responde con datos reales del portafolio</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'ml-auto bg-accent text-white'
                      : 'bg-surface-2 text-text-muted'
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border p-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu pregunta..."
                aria-label="Escribe tu pregunta para el asistente"
                className="flex-1 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Enviar pregunta"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-white transition-colors hover:bg-accent-2"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Cerrar asistente' : 'Abrir asistente'}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_8px_24px_rgba(168,85,247,0.45)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-accent-2"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
