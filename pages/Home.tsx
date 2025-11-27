import React from 'react';
import { ArrowRight, Sparkles, Users, Calendar, MessageSquare } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="animate-fade-in min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/30 to-slate-50">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-indigo-100 text-indigo-600 text-sm font-medium mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            数字媒体技术 · 创意无限
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
              24数媒1班
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Welcome to Class 1 of 2024 Digital Media Technology. <br/>
            在这里，我们用技术重构想象，用数据定义未来。
          </p>

          {/* Featured Class Poster Section */}
          <div className="relative max-w-4xl mx-auto mb-16 group cursor-default">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-white border-4 border-white/50 ring-1 ring-slate-900/5 aspect-video flex items-center justify-center bg-slate-100">
               {/* 
                  Updated to a reliable Unsplash image featuring colorful paint/art to resemble the class poster style.
               */}
               <img 
                 src="https://images.unsplash.com/photo-1560421683-6856ea585c78?q=80&w=2074&auto=format&fit=crop" 
                 alt="24数媒1班 班级海报" 
                 className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-[1.02]"
               />
               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <p className="text-white text-lg font-medium">我们的班级精神图腾</p>
               </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button 
              onClick={() => onNavigate('forum')}
              className="px-8 py-4 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg shadow-indigo-200 flex items-center justify-center"
            >
              <MessageSquare className="mr-2 w-5 h-5" /> 加入讨论
            </button>
            <button 
              onClick={() => onNavigate('veo')}
              className="px-8 py-4 bg-white text-slate-700 rounded-full font-semibold hover:bg-slate-50 transition-all transform hover:scale-105 shadow-lg border border-slate-200 flex items-center justify-center"
            >
              <Sparkles className="mr-2 w-5 h-5 text-pink-500" /> AI 创作工坊
            </button>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { id: 'feed', icon: Calendar, title: '班级动态', desc: '最新通知与活动回顾', color: 'bg-blue-100 text-blue-600' },
             { id: 'resources', icon: Users, title: '资源共享', desc: '课件、素材与教程', color: 'bg-green-100 text-green-600' },
             { id: 'chat', icon: MessageSquare, title: 'AI 助教', desc: 'Gemini 3.0 答疑解惑', color: 'bg-violet-100 text-violet-600' },
             { id: 'veo', icon: Sparkles, title: 'Veo 视频', desc: '前沿 AI 视频生成', color: 'bg-pink-100 text-pink-600' },
           ].map((item) => (
             <div 
               key={item.id}
               onClick={() => onNavigate(item.id)}
               className="group p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all cursor-pointer border border-slate-100 hover:border-indigo-100 hover:-translate-y-1"
             >
               <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12`}>
                 <item.icon className="w-6 h-6" />
               </div>
               <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
               <p className="text-slate-500 text-sm">{item.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Home;