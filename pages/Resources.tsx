import React, { useState, useEffect } from 'react';
import { Resource } from '../types';
import { Plus, FileText, Link as LinkIcon, Video, Download } from 'lucide-react';

const MOCK_RESOURCES: Resource[] = [
  { id: '1', title: '数据结构 (C语言版).pdf', description: '严蔚敏经典教材电子版，包含线性表、栈、树、图等核心算法详解。', url: '#', category: 'file', date: '2024-03-10' },
  { id: '2', title: '概率论与数理统计笔记', description: '期末复习重点整理，包含大数定律、假设检验等章节公式汇总。', url: '#', category: 'file', date: '2024-03-12' },
  { id: '3', title: '数据库原理及应用教程', description: 'SQL Server 基础操作视频教程与实验指导书。', url: '#', category: 'video', date: '2024-03-15' },
  { id: '4', title: 'React 官方文档', description: 'React 学习的权威指南，包含最新 Hook 特性。', url: 'https://react.dev', category: 'link', date: '2024-02-01' },
];

const Resources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newRes, setNewRes] = useState({ title: '', description: '', url: '', category: 'link' });

  useEffect(() => {
    const saved = localStorage.getItem('class_resources');
    if (saved) {
      setResources(JSON.parse(saved));
    } else {
      setResources(MOCK_RESOURCES);
    }
  }, []);

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    const item: Resource = {
      id: Date.now().toString(),
      title: newRes.title,
      description: newRes.description,
      url: newRes.url,
      category: newRes.category as any,
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [item, ...resources];
    setResources(updated);
    localStorage.setItem('class_resources', JSON.stringify(updated));
    setShowModal(false);
    setNewRes({ title: '', description: '', url: '', category: 'link' });
  };

  const getIcon = (cat: string) => {
    switch(cat) {
      case 'file': return <FileText className="w-6 h-6 text-orange-500" />;
      case 'video': return <Video className="w-6 h-6 text-red-500" />;
      default: return <LinkIcon className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">学习资料库</h2>
          <p className="text-slate-500 mt-2">共享知识，共同进步</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full shadow-lg flex items-center transition-all transform hover:scale-105"
        >
          <Plus className="w-5 h-5 mr-2" /> 上传资料
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map(res => (
          <div key={res.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6 border border-slate-100 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                {getIcon(res.category)}
              </div>
              <span className="text-xs text-slate-400 font-mono bg-slate-100 px-2 py-1 rounded">{res.date}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1">{res.title}</h3>
            <p className="text-slate-600 text-sm mb-6 flex-grow line-clamp-3">{res.description}</p>
            <a 
              href={res.url} 
              target="_blank" 
              rel="noreferrer"
              className="mt-auto w-full flex items-center justify-center px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4 mr-2" /> 
              {res.category === 'link' ? '访问链接' : '下载文件'}
            </a>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up">
            <h3 className="text-xl font-bold mb-4 text-slate-800">添加新资源</h3>
            <form onSubmit={handleAddResource} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">标题</label>
                <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={newRes.title} onChange={e => setNewRes({...newRes, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">类型</label>
                <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newRes.category} onChange={e => setNewRes({...newRes, category: e.target.value})}>
                  <option value="link">网页链接</option>
                  <option value="file">文件</option>
                  <option value="video">视频</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">链接/地址</label>
                <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={newRes.url} onChange={e => setNewRes({...newRes, url: e.target.value})} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">简介</label>
                <textarea className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none h-24" 
                  value={newRes.description} onChange={e => setNewRes({...newRes, description: e.target.value})} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">取消</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors">确认添加</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;