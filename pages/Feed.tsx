import React, { useState, useEffect } from 'react';
import { NewsItem } from '../types';
import { Plus, Clock, User, Inbox } from 'lucide-react';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<NewsItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', author: '' });

  useEffect(() => {
    // Load posts from local storage only. No mock data.
    const saved = localStorage.getItem('class_feed');
    if (saved) {
      setPosts(JSON.parse(saved));
    }
  }, []);

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    const item: NewsItem = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: newPost.author || '匿名',
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [item, ...posts];
    setPosts(updated);
    localStorage.setItem('class_feed', JSON.stringify(updated));
    setShowForm(false);
    setNewPost({ title: '', content: '', author: '' });
  };

  return (
    <div className="pt-24 pb-12 max-w-4xl mx-auto px-4 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">班级公众号</h2>
          <p className="text-slate-500 mt-2">最新通知、活动回顾、班级趣事</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-md"
        >
          <Plus className="w-5 h-5 mr-1" /> 发布内容
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-white rounded-xl shadow-lg border border-indigo-100 animate-fade-in-down">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">发布新动态</h3>
          <form onSubmit={handleAddPost} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">标题</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                value={newPost.title}
                onChange={e => setNewPost({...newPost, title: e.target.value})}
                placeholder="请输入标题"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">作者</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                value={newPost.author}
                onChange={e => setNewPost({...newPost, author: e.target.value})}
                placeholder="你的名字"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">内容</label>
              <textarea
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all h-32"
                value={newPost.content}
                onChange={e => setNewPost({...newPost, content: e.target.value})}
                placeholder="分享些什么..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                发布
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-8">
        {posts.map(post => (
          <article key={post.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-slate-100">
            {post.image && (
              <div className="h-48 md:h-64 overflow-hidden relative group">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
              </div>
            )}
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-3">{post.title}</h3>
              <div className="flex items-center text-sm text-slate-500 mb-4 space-x-4">
                <span className="flex items-center"><User className="w-4 h-4 mr-1" /> {post.author}</span>
                <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {post.date}</span>
              </div>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>
          </article>
        ))}
        {posts.length === 0 && !showForm && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Inbox className="w-10 h-10 text-slate-300" />
             </div>
             <p className="text-slate-500 text-lg">暂无动态</p>
             <p className="text-slate-400 text-sm mt-2">点击右上角"发布内容"来创建第一条班级新闻吧！</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;