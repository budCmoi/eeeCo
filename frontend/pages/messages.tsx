import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, MessageSquare, User } from 'lucide-react';

import { api } from '@/services/api';
import { useAuthStore } from '@/store/auth-store';
import type { Conversation, Message } from '@/types';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'À l\'instant';
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function MessagesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      router.replace('/account');
      return;
    }
    api.get<Conversation[]>('/messages/conversations').then((res) => {
      setConversations(res.data ?? []);
    });
  }, [user, router]);

  useEffect(() => {
    if (!activeId) return;
    setLoadingMsgs(true);
    api
      .get<{ messages: Message[] }>(`/messages/conversations/${activeId}`)
      .then((res) => setMessages(res.data.messages ?? []))
      .finally(() => setLoadingMsgs(false));
  }, [activeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeConv = conversations.find((c) => c.id === activeId);

  const getOtherParticipant = (conv: Conversation) =>
    conv.participants?.find((p) => p.id !== user?._id);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !activeId || sending) return;
    setSending(true);
    try {
      const res = await api.post<Message>(`/messages/conversations/${activeId}/messages`, {
        content: newMessage.trim()
      });
      setMessages((prev) => [...prev, res.data]);
      setNewMessage('');
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Head>
        <title>Messages — EEECO</title>
      </Head>
      <div className="flex h-screen flex-col pt-[72px]">
        <div className="flex flex-1 overflow-hidden">
          {/* ── Sidebar conversations ── */}
          <div
            className={`flex w-full flex-col border-r border-white/8 md:w-80 ${activeId ? 'hidden md:flex' : 'flex'}`}
          >
            <div className="border-b border-white/8 px-5 py-4">
              <h1 className="font-display text-lg text-white">Messages</h1>
              <p className="mt-0.5 text-xs text-white/40">{conversations.length} conversation(s)</p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                  <MessageSquare className="h-8 w-8 text-white/20" />
                  <p className="text-sm text-white/40">Aucune conversation</p>
                  <p className="text-xs text-white/25">Contactez un vendeur depuis une fiche produit</p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const other = getOtherParticipant(conv);
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setActiveId(conv.id)}
                      className={`w-full border-b border-white/6 px-5 py-4 text-left transition-colors hover:bg-white/[0.03] ${
                        activeId === conv.id ? 'bg-white/[0.04]' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/8">
                          {other?.avatar ? (
                            <img src={other.avatar} className="h-full w-full rounded-full object-cover" alt="" />
                          ) : (
                            <User className="h-4 w-4 text-white/50" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white">{other?.name ?? 'Utilisateur'}</span>
                            {conv.lastMessageAt && (
                              <span className="text-xs text-white/30">{timeAgo(conv.lastMessageAt)}</span>
                            )}
                          </div>
                          {conv.lastMessage && (
                            <p className="mt-0.5 truncate text-xs text-white/40">{conv.lastMessage.content}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Zone messages ── */}
          <div className={`flex flex-1 flex-col ${activeId ? 'flex' : 'hidden md:flex'}`}>
            {!activeId ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3">
                <MessageSquare className="h-10 w-10 text-white/15" />
                <p className="text-sm text-white/35">Sélectionnez une conversation</p>
              </div>
            ) : (
              <>
                {/* Header conversation */}
                <div className="flex items-center gap-3 border-b border-white/8 px-5 py-3.5">
                  <button
                    onClick={() => setActiveId(null)}
                    className="rounded-full p-1.5 text-white/50 transition-colors hover:text-white md:hidden"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  {activeConv && (
                    <>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8">
                        <User className="h-4 w-4 text-white/50" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {getOtherParticipant(activeConv)?.name ?? 'Utilisateur'}
                        </p>
                        {activeConv.subject && (
                          <p className="text-xs text-white/35">{activeConv.subject}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-5 py-4" data-lenis-prevent>
                  {loadingMsgs ? (
                    <div className="flex justify-center py-8">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-green-light" />
                    </div>
                  ) : (
                    <AnimatePresence>
                      {messages.map((msg) => {
                        const isMe = msg.senderId === user?._id;
                        return (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-3 flex ${isMe ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs rounded-2xl px-4 py-2.5 text-sm leading-relaxed lg:max-w-sm ${
                                isMe
                                  ? 'rounded-br-sm bg-green-600 text-white'
                                  : 'rounded-bl-sm bg-white/[0.06] text-white/85'
                              }`}
                            >
                              {msg.content}
                              <p className={`mt-1 text-[0.6rem] ${isMe ? 'text-white/60' : 'text-white/30'}`}>
                                {timeAgo(msg.createdAt)}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="border-t border-white/8 px-5 py-3.5">
                  <div className="flex gap-3">
                    <input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Votre message..."
                      className="input-base flex-1"
                      maxLength={1000}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-xl bg-green-600 text-white transition-all hover:bg-green-700 disabled:opacity-40"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
