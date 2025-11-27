import React, { useState, useRef, useEffect } from 'react';
import { streamChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'model',
      text: '你好！我是24数媒1班的 AI 助教。我可以帮你解答课程问题、提供设计灵感或编写代码。有什么我可以帮你的吗？',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Create a placeholder for the bot response
      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [
        ...prev,
        { id: botMsgId, role: 'model', text: '', timestamp: Date.now() }
      ]);

      let fullText = '';
      await streamChat(
        messages.map(m => ({ role: m.role, text: m.text })),
        userMsg.text,
        (chunk) => {
          fullText += chunk;
          setMessages(prev => prev.map(msg => 
            msg.id === botMsgId ? { ...msg, text: fullText } : msg
          ));
        }
      );
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), role: 'model', text: '抱歉，我现在遇到了一些连接问题，请稍后再试。', timestamp: Date.now() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="pt-24 pb-6 h-screen flex flex-col max-w-4xl mx-auto px-4">
      <div className="flex-none mb-6 text-center">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <Sparkles className="text-violet-500" /> AI 智能助教
        </h1>
        <p className="text-sm text-slate-500">Powered by Gemini 3.0 Pro</p>
      </div>

      <div className="flex-grow bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col">
        {/* Messages Area */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-violet-100 text-violet-600'
                }`}
              >
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                }`}
              >
                {msg.text || (isLoading && msg.role === 'model' ? <Loader2 className="w-4 h-4 animate-spin" /> : '')}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="relative flex items-center gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入你的问题..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none h-14 max-h-32 shadow-inner text-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`absolute right-2 top-2 p-2 rounded-lg transition-colors ${
                !input.trim() || isLoading
                  ? 'text-slate-400 bg-transparent'
                  : 'text-white bg-indigo-600 hover:bg-indigo-700 shadow-md'
              }`}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">AI 可能会产生不准确的信息，请核实重要内容。</p>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
