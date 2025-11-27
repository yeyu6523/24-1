import React, { useState } from 'react';
import { generateVeoVideo, checkApiKey, promptApiKeySelection } from '../services/geminiService';
import { Upload, Film, AlertCircle, Play, Loader2 } from 'lucide-react';

const VeoAnimator: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setVideoUrl(null);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      // 1. Check API Key Authorization first
      const hasKey = await checkApiKey();
      if (!hasKey) {
        setLoading(false);
        await promptApiKeySelection();
        // User needs to select key, then re-click generate
        return;
      }

      // 2. Generate
      const url = await generateVeoVideo(selectedFile, prompt);
      setVideoUrl(url);
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes("Requested entity was not found")) {
        await promptApiKeySelection();
        setError("API Key 会话过期或无效。请重新选择 API Key 后重试。");
      } else {
        setError("生成视频时出错。请检查您的 API Key 额度或重试。 " + (err.message || ''));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 max-w-5xl mx-auto px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent mb-4">
          Veo 影像工坊
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          上传静态图片，利用 Google Veo (veo-3.1) 模型让它动起来。
          <br/>
          <span className="text-sm text-slate-400 bg-slate-100 px-2 py-1 rounded mt-2 inline-block">
            注意：这需要使用您自己的付费 API Key
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">1. 上传图片</label>
            <div className={`relative border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center transition-colors ${selectedFile ? 'border-indigo-400 bg-indigo-50' : 'border-slate-300 hover:border-indigo-300 hover:bg-slate-50'}`}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="h-full w-full object-contain rounded-lg p-2" />
              ) : (
                <>
                  <Upload className="w-10 h-10 text-slate-400 mb-2" />
                  <p className="text-slate-500 font-medium">点击或拖拽上传图片</p>
                  <p className="text-xs text-slate-400 mt-1">支持 JPG, PNG</p>
                </>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">2. 提示词 (可选)</label>
            <textarea
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-pink-500 outline-none h-24 resize-none"
              placeholder="描述您想生成的动画效果，例如：'Cinematic shot, camera pans right, wind blowing hair...'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!selectedFile || loading}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-md transition-all flex items-center justify-center ${
              !selectedFile || loading
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-violet-600 hover:scale-[1.02] hover:shadow-lg'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                正在生成中 (这可能需要几分钟)...
              </>
            ) : (
              <>
                <Film className="w-6 h-6 mr-2" />
                开始生成视频
              </>
            )}
          </button>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-start text-sm">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="bg-slate-900 rounded-2xl shadow-2xl p-6 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
           {videoUrl ? (
             <div className="w-full h-full flex flex-col items-center">
               <h3 className="text-white/80 font-medium mb-4 self-start flex items-center">
                 <Play className="w-4 h-4 mr-2" /> 生成结果
               </h3>
               <video 
                 src={videoUrl} 
                 controls 
                 autoPlay 
                 loop 
                 className="w-full h-auto max-h-[500px] rounded-lg shadow-black/50 shadow-lg border border-white/10"
               />
               <a 
                href={videoUrl} 
                download="veo-generated.mp4"
                className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors text-sm font-medium border border-white/20"
               >
                 下载视频
               </a>
             </div>
           ) : (
             <div className="text-center text-slate-500">
               <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                 <Film className="w-10 h-10 opacity-50" />
               </div>
               <p>视频生成结果将显示在这里</p>
               <p className="text-xs text-slate-600 mt-2">支持 1080p 分辨率</p>
             </div>
           )}

           {/* Decorative background elements */}
           <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
           <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default VeoAnimator;
