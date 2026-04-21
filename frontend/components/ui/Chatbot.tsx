import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

type BotMessage = {
  id: string;
  from: 'bot' | 'user';
  text: string;
};

const FAQ: Record<string, string> = {
  livraison: 'Les délais de livraison varient de 2 à 10 jours selon le vendeur. Chaque fiche produit indique le délai estimé.',
  retour: 'Vous disposez de 14 jours après réception pour retourner un article. Contactez le vendeur via la messagerie.',
  paiement: 'Nous acceptons les cartes bancaires (Visa, Mastercard) et les paiements sécurisés via Stripe.',
  vendre: 'Pour vendre, créez un compte, puis cliquez sur "Vendre" dans le menu. Publiez vos articles en quelques minutes.',
  compte: 'Vous pouvez créer un compte gratuitement via le bouton "Mon compte" ou via Google.',
  contact: 'Pour contacter un vendeur, rendez-vous sur la fiche produit et cliquez sur "Contacter le vendeur".',
  securite: 'Tous les paiements sont chiffrés via Stripe. Vos données personnelles sont protégées conformément au RGPD.'
};

function getBotResponse(input: string): string {
  const text = input.toLowerCase();
  for (const [key, answer] of Object.entries(FAQ)) {
    if (text.includes(key)) return answer;
  }
  if (text.includes('bonjour') || text.includes('salut') || text.includes('hello')) {
    return 'Bonjour ! 👋 Je suis l\'assistant EEECO. Comment puis-je vous aider ? Demandez-moi des informations sur la livraison, les retours, la vente ou les paiements.';
  }
  if (text.includes('merci')) {
    return 'Avec plaisir ! N\'hésitez pas si vous avez d\'autres questions. 😊';
  }
  return 'Je ne suis pas sûr de comprendre votre question. Essayez de demander à propos de : livraison, retour, paiement, vendre, compte ou sécurité.';
}

const SUGGESTIONS = ['Livraison', 'Retours', 'Comment vendre ?', 'Paiements sécurisés'];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<BotMessage[]>([
    {
      id: '0',
      from: 'bot',
      text: 'Bonjour ! Je suis l\'assistant EEECO. Comment puis-je vous aider aujourd\'hui ?'
    }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: BotMessage = { id: Date.now().toString(), from: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const botMsg: BotMessage = {
        id: (Date.now() + 1).toString(),
        from: 'bot',
        text: getBotResponse(text)
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-green transition-all hover:bg-green-700"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Ouvrir le chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-6 z-50 flex h-[480px] w-[340px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-surface shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/8 bg-green-600/10 px-4 py-3.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Assistant EEECO</p>
                <p className="text-xs text-white/40">Réponses instantanées</p>
              </div>
              <div className="ml-auto flex h-2 w-2 rounded-full bg-green-light" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" data-lenis-prevent>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.from === 'user'
                        ? 'rounded-br-sm bg-green-600 text-white'
                        : 'rounded-bl-sm bg-white/[0.06] text-white/85'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50 transition-colors hover:border-green-600/40 hover:text-green-light"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-white/8 px-4 py-3">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Votre question…"
                  className="input-base flex-1 py-2 text-xs"
                  maxLength={300}
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-green-600 text-white transition-all hover:bg-green-700 disabled:opacity-40"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
