import React, { useState, useEffect } from 'react';
import { ForumTopic, Comment } from '../types';
import { MessageSquare, User, Clock, Plus, ArrowLeft, Send, Tag, Inbox } from 'lucide-react';

const Forum: React.FC = () => {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: '', content: '', author: '', category: 'study' });
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Load topics from local storage only. No mock data.
    const saved = localStorage.getItem('class_forum_topics');
    if (saved) {
      setTopics(JSON.parse(saved));
    }
  }, []);

  const saveTopics = (updatedTopics: ForumTopic[]) => {
    setTopics(updatedTopics);
    localStorage.setItem('class_forum_topics', JSON.stringify(updatedTopics));
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    const topic: ForumTopic = {
      id: Date.now().toString(),
      title: newTopic.title,
      content: newTopic.content,
      author: newTopic.author || '匿名',
      category: newTopic.category as any,
      date: new Date().toLocaleDateString(),
      views: 0,
      comments: []
    };
    saveTopics([topic, ...topics]);
    setIsCreating(false);
    setNewTopic({ title: '', content: '', author: '', category: 'study' });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopic || !newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: '我', 
      content: newComment,
      date: new Date().toLocaleDateString()
    };

    const updatedTopics = topics.map(t => {
      if (t.id === selectedTopic.id) {
        return { ...t, comments: [...t.comments, comment] };
      }
      return t;
    });

    saveTopics(updatedTopics);
    setSelectedTopic({ ...selectedTopic, comments: [...selectedTopic.comments, comment] });
    setNewComment('');
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'study': return 'bg-blue-100 text-blue-700';
      case 'project': return 'bg-purple-100 text-purple-700';
      case 'notice': return 'bg-red-100 text-red-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'study': return '学习交流';
      case 'project': return '项目合作';
      case 'notice': return '通知公告';
      default: return '闲聊灌水';
    }
  };

  // Detail View
  if (selectedTopic) {
    return (
      <div className="pt-24 pb-12 max-w-4xl mx-auto px-4 animate-fade-in min-h-screen">
        <button 
          onClick={() => setSelectedTopic(null)}
          className="flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> 返回讨论列表
        </button>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-100">
            <div className="flex gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(selectedTopic.category)}`}>
                {getCategoryLabel(selectedTopic.category)}
              </span>
              <span className="text-slate-400 text-sm flex items-center">
                <Clock className="w-3 h-3 mr-1" /> {selectedTopic.date}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-4">{selectedTopic.title}</h1>
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3">
                {selectedTopic.author[0]}
              </div>
              <span className="font-medium text-slate-700">{selectedTopic.author}</span>
            </div>
            <div className="prose max-w-none text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-xl whitespace-pre-wrap">
              {selectedTopic.content}
            </div>
          </div>

          <div className="p-8 bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" /> 
              评论 ({selectedTopic.comments.length})
            </h3>

            <div className="space-y-6 mb-8">
              {selectedTopic.comments.map(comment => (
                <div key={comment.id} className="flex gap-4 group">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-500 font-bold">
                    {comment.author[0]}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-semibold text-slate-700 text-sm">{comment.author}</span>
                      <span className="text-xs text-slate-400">{comment.date}</span>
                    </div>
                    <div className="bg-white p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-sm text-slate-600 text-sm border border-slate-100 group-hover:border-indigo-100 transition-colors">
                      {comment.content}
                    </div>
                  </div>
                </div>
              ))}
              {selectedTopic.comments.length === 0 && (
                <div className="text-center py-8 text-slate-400 italic">
                  暂无评论，快来抢沙发吧！
                </div>
              )}
            </div>

            <form onSubmit={handleAddComment} className="relative">
              <input
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="发表你的看法..."
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
              />
              <button 
                type="submit"
                disabled={!newComment.trim()}
                className="absolute right-2 top-2 p-1.5 text-white bg-indigo-600 rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="pt-24 pb-12 max-w-5xl mx-auto px-4 min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">班级讨论区</h1>
          <p className="text-slate-500 mt-2">交流想法，分享灵感，解决问题</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center transition-all transform hover:scale-105"
        >
          <Plus className="w-5 h-5 mr-2" /> 发起话题
        </button>
      </div>

      {isCreating && (
        <div className="mb-10 bg-white p-6 rounded-2xl shadow-xl border border-indigo-100 animate-fade-in-down">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">发起新话题</h3>
            <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600">取消</button>
          </div>
          <form onSubmit={handleCreateTopic} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                required
                type="text"
                placeholder="标题"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newTopic.title}
                onChange={e => setNewTopic({...newTopic, title: e.target.value})}
              />
               <select
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newTopic.category}
                onChange={e => setNewTopic({...newTopic, category: e.target.value})}
              >
                <option value="study">学习交流</option>
                <option value="project">项目合作</option>
                <option value="chat">闲聊灌水</option>
                <option value="notice">通知公告</option>
              </select>
            </div>
            <input
              required
              type="text"
              placeholder="你的昵称"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={newTopic.author}
              onChange={e => setNewTopic({...newTopic, author: e.target.value})}
            />
            <textarea
              required
              placeholder="详细内容..."
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
              value={newTopic.content}
              onChange={e => setNewTopic({...newTopic, content: e.target.value})}
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              发布
            </button>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {topics.map(topic => (
          <div 
            key={topic.id}
            onClick={() => setSelectedTopic(topic)}
            className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-slate-100 transition-all cursor-pointer flex flex-col md:flex-row md:items-center gap-4"
          >
             <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                  <MessageSquare className="w-6 h-6" />
                </div>
             </div>
             <div className="flex-grow">
               <div className="flex flex-wrap gap-2 items-center mb-2">
                 <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getCategoryColor(topic.category)}`}>
                    {getCategoryLabel(topic.category)}
                 </span>
                 <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                   {topic.title}
                 </h3>
               </div>
               <p className="text-slate-500 text-sm line-clamp-1 mb-2 md:mb-0">
                 {topic.content}
               </p>
             </div>
             <div className="flex items-center gap-4 text-xs text-slate-400 flex-shrink-0 border-t md:border-t-0 pt-3 md:pt-0 mt-2 md:mt-0">
               <span className="flex items-center"><User className="w-3 h-3 mr-1" /> {topic.author}</span>
               <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {topic.date}</span>
               <span className="flex items-center bg-slate-50 px-2 py-1 rounded">
                 <MessageSquare className="w-3 h-3 mr-1" /> {topic.comments.length}
               </span>
             </div>
          </div>
        ))}
        {topics.length === 0 && !isCreating && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Inbox className="w-10 h-10 text-slate-300" />
             </div>
             <p className="text-slate-500 text-lg">暂无话题</p>
             <p className="text-slate-400 text-sm mt-2">点击右上角"发起话题"来开启第一个讨论吧！</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;