import React, { useState } from 'react';
import { X, Send, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RecruiterCandidate } from '../types';

interface RecruiterMessageModalProps {
  candidate: RecruiterCandidate;
  onClose: () => void;
}

const renderTextWithLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, i) => {
    if (part.match(urlRegex)) {
      return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 break-all">{part}</a>;
    }
    return <span key={i}>{part}</span>;
  });
};

export const RecruiterMessageModal: React.FC<RecruiterMessageModalProps> = ({ candidate, onClose }) => {
  const { messages, sendReplyMessage, recruiterProfile, createNewMessageThread } = useApp() as any;
  const [text, setText] = useState('');

  // Find existing thread or mock one
  const existingThread = messages.find((m: any) => m.senderName === recruiterProfile.companyName && m.id.includes(candidate.id));
  
  const threadMessages = existingThread ? existingThread.messages : [];

  const handleSend = () => {
    if (!text.trim()) return;

    if (existingThread) {
      sendReplyMessage(existingThread.id, text, 'other');
    } else {
      // Create new thread via context
      if (createNewMessageThread) {
        createNewMessageThread({
          id: `msg_thread_${candidate.id}_${Date.now()}`,
          senderName: recruiterProfile.companyName || 'Recruiter',
          senderRole: 'Recruiter',
          senderAvatar: recruiterProfile.companyLogo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
          lastMessage: text,
          lastMessageTime: 'Just now',
          unread: false,
          messages: [
            {
              id: `m_${Date.now()}`,
              sender: 'other', // other from student perspective is the recruiter sending to the student
              text: text,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        }, candidate.id);
      }
    }
    setText('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full flex flex-col h-[60vh] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <img src={candidate.avatar} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Message {candidate.name}</h3>
              <p className="text-[11px] text-slate-500">{candidate.college}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-5 bg-slate-50 space-y-4">
          {threadMessages.length === 0 ? (
            <div className="text-center text-sm text-slate-400 mt-10">
              No messages yet. Start a conversation with {candidate.name}!
            </div>
          ) : (
            threadMessages.map((msg: any) => (
              <div key={msg.id} className={`flex ${msg.sender === 'other' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.sender === 'other' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-xs'}`}>
                  <p>{renderTextWithLinks(msg.text)}</p>
                  <span className={`text-[9px] block mt-1 opacity-70 ${msg.sender === 'other' ? 'text-indigo-100 text-right' : 'text-slate-400 text-left'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-200 bg-white shrink-0 flex items-center gap-2">
          <input 
            type="text" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            onClick={handleSend}
            disabled={!text.trim()}
            className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};
