import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  User,
  Building2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MessagesPage: React.FC = () => {
  const { messages, sendReplyMessage } = useApp();
  const [activeThreadId, setActiveThreadId] = useState<string>(messages[0]?.id || '');
  const [replyInput, setReplyInput] = useState('');

  const activeThread = messages.find((m) => m.id === activeThreadId) || messages[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !activeThread) return;

    sendReplyMessage(activeThread.id, replyInput.trim());
    setReplyInput('');
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <h2 className="font-['Outfit'] text-2xl font-extrabold text-slate-900">
          Messages & Mentor Inquiries
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Direct communication channels with partner recruiters, hiring managers, and university academic mentors.
        </p>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px]">
        
        {/* Left Thread List (4 cols) */}
        <div className="md:col-span-4 border-r border-slate-200 bg-slate-50/50 flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Conversations ({messages.length})
            </span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {messages.map((thread) => {
              const isSelected = thread.id === activeThreadId;
              return (
                <div
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`p-4 cursor-pointer transition-colors flex items-start gap-3 ${
                    isSelected ? 'bg-indigo-50/80 border-r-2 border-indigo-600' : 'hover:bg-slate-100/70'
                  }`}
                >
                  <img
                    src={thread.senderAvatar}
                    alt={thread.senderName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {thread.senderName}
                      </span>
                      <span className="text-[10px] text-slate-600 shrink-0">
                        {thread.lastMessageTime}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-indigo-600 truncate">
                      {thread.company || thread.senderRole}
                    </p>
                    <p className="text-xs text-slate-600 truncate mt-1">
                      {thread.lastMessage}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Message Pane (8 cols) */}
        <div className="md:col-span-8 flex flex-col justify-between bg-white">
          {activeThread ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={activeThread.senderAvatar}
                    alt={activeThread.senderName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-200"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      {activeThread.senderName}
                    </h3>
                    <p className="text-xs text-slate-600">
                      {activeThread.senderRole} • <span className="font-semibold text-indigo-600">{activeThread.company}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Message List */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4 max-h-[380px]">
                {activeThread.messages.map((msg) => {
                  const isMe = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                            : 'bg-slate-100 text-slate-900 rounded-bl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-600 mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Reply Input Bar */}
              <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-slate-50/60 flex items-center gap-3">
                <input
                  type="text"
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  placeholder={`Reply to ${activeThread.senderName.split(' ')[0]}...`}
                  className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-600 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!replyInput.trim()}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="p-12 text-center text-slate-600 text-xs">
              Select a conversation to read messages.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
