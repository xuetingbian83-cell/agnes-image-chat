import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowUp,
  Camera,
  Check,
  ChevronDown,
  CirclePlus,
  Film,
  ImagePlus,
  Menu,
  Phone,
  Play,
  Search,
  Sparkles,
  Trash2,
  VolumeX,
  WandSparkles,
  X,
} from 'lucide-react';
import './styles.css';

const MODEL_OPTIONS = [
  'agnes-video',
  'wan-2-7',
  'seedance-2-0-fast',
  'seedance-2-0',
  'happyhorse-1-0',
  'wan22-animate-move',
  'wan22-animate-mix',
  'wan-2-6-i2v-flash',
  'Wan2.6',
  'Kling 3.0',
  'Hailuo 2.3',
  'Seedance 1.0 Pro',
  'Seedance 1.0 Pro fast',
  'Agnes Video v1',
  'Agnes Video',
  'Seedance 1.5 Pro',
  'default_video',
];

const MODEL_META = {
  'seedance-2-0-fast': '快速生成',
  'Seedance 1.0 Pro fast': '快速专业版',
  'wan-2-6-i2v-flash': '图生视频 · 快速',
  'Agnes Video': 'Agnes 推荐',
  'Agnes Video v1': '稳定版本',
  'Kling 3.0': '高质量运动表现',
  'Hailuo 2.3': '自然动态',
  'default_video': '默认视频路由',
  'agnes-video': 'Agnes 视频路由',
};

function StatusBar() {
  return (
    <div className="status-bar" aria-hidden="true">
      <span>14:22</span>
      <div className="status-icons"><span>5G</span><i className="signal" /><i className="wifi" /><i className="battery" /></div>
    </div>
  );
}

function IconButton({ label, children, className = '', ...props }) {
  return <button className={`icon-button ${className}`} aria-label={label} title={label} {...props}>{children}</button>;
}

function Toast({ text }) {
  return <div className="toast" role="status">{text}</div>;
}

function ConfirmDialog({ title = '放弃本次编辑？', description = '已选择的照片和动作描述不会保留。', confirmText = '放弃', onCancel, onConfirm }) {
  return (
    <div className="dialog-layer" role="presentation">
      <section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="discard-title">
        <div className="dialog-icon"><WandSparkles size={22} /></div>
        <h2 id="discard-title">{title}</h2>
        <p>{description}</p>
        <div className="dialog-actions">
          <button className="button secondary" onClick={onCancel}>继续编辑</button>
          <button className="button danger" onClick={onConfirm}>{confirmText}</button>
        </div>
      </section>
    </div>
  );
}

function ChatHeader({ onBack }) {
  return (
    <header className="chat-header">
      <IconButton label={onBack ? '返回' : '菜单'} onClick={onBack}>{onBack ? <ArrowLeft size={23} /> : <Menu size={25} />}</IconButton>
      <div className="chat-title">
        <strong>Agnes</strong>
        <span>AI 生成可能有误 请核实</span>
      </div>
      <div className="chat-header-actions">
        <IconButton label="打电话"><Phone size={25} /></IconButton>
        <IconButton label="静音"><VolumeX size={27} /></IconButton>
      </div>
    </header>
  );
}

function QuickActions({ onStart }) {
  return (
    <div className="quick-scroll" aria-label="快捷功能">
      <button className="quick-action"><Sparkles size={18} />快速</button>
      <button className="quick-action"><Phone size={18} />打电话</button>
      <button className="quick-action active" onClick={onStart}><Film size={17} />照片动起来</button>
      <button className="quick-action"><WandSparkles size={18} />AI 创作</button>
    </div>
  );
}

function Composer({ onStart }) {
  return (
    <footer className="chat-composer-wrap">
      <QuickActions onStart={onStart} />
      <div className="chat-composer">
        <IconButton label="拍照"><Camera size={23} /></IconButton>
        <span className="composer-placeholder">发消息...</span>
        <IconButton label="更多"><CirclePlus size={24} /></IconButton>
      </div>
      <div className="home-indicator" />
    </footer>
  );
}

function HomeScreen({ onStart }) {
  return (
    <main className="app-screen home-screen">
      <StatusBar />
      <ChatHeader />
      <section className="conversation home-conversation">
        <div className="message assistant-text">
          上传一张照片，我会帮你生成一个视频，让照片里的主体自然动起来。
        </div>
        <button className="photo-motion-entry" onClick={onStart}>
          <Film size={19} />
          <span>照片动起来</span>
        </button>
      </section>
      <Composer onStart={onStart} />
    </main>
  );
}

const GALLERY_PHOTOS = [
  '/reference.jpg',
  ...Array.from({ length: 28 }, (_, index) => `/gallery-${index + 1}.jpg`),
];

function GalleryScreen({ onClose, onSelect }) {
  return (
    <main className="app-screen gallery-screen">
      <StatusBar />
      <header className="gallery-header">
        <IconButton label="关闭相册" onClick={onClose}><X size={26} /></IconButton>
        <button className="album-title">所有照片 <ChevronDown size={19} /></button>
        <span className="header-spacer" />
      </header>
      <div className="gallery-grid" aria-label="所有照片，单选">
        {GALLERY_PHOTOS.map((src, index) => (
          <button key={src} className="gallery-tile" aria-label={`选择照片 ${index + 1}`} onClick={() => onSelect(src)}>
            <img src={src} alt="" />
          </button>
        ))}
      </div>
      <div className="gallery-home"><div className="home-indicator" /></div>
    </main>
  );
}

function ParameterButton({ label, value, onClick, wide = false }) {
  return (
    <button className={`parameter-button ${wide ? 'wide' : ''}`} onClick={onClick}>
      <span>{label}</span><strong>{value}</strong><ChevronDown size={15} />
    </button>
  );
}

function DurationMenu({ value, onSelect, onClose }) {
  return (
    <div className="floating-menu-layer" onMouseDown={onClose}>
      <div className="floating-menu duration-menu" role="menu" onMouseDown={(e) => e.stopPropagation()}>
        {[5, 8, 10].map((duration) => (
          <button key={duration} className="floating-option" onClick={() => onSelect(duration)}>
            <span>{duration}s</span>
            {value === duration && <Check size={24} />}
          </button>
        ))}
      </div>
    </div>
  );
}

function ModelMenu({ value, onSelect, onClose }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => MODEL_OPTIONS.filter((item) => item.toLowerCase().includes(query.trim().toLowerCase())), [query]);
  return (
    <div className="floating-menu-layer" onMouseDown={onClose}>
      <div className="floating-menu model-menu" role="menu" onMouseDown={(e) => e.stopPropagation()}>
        <label className="model-search">
          <Search size={17} />
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索模型" />
          {query && <IconButton label="清空搜索" onClick={() => setQuery('')}><X size={16} /></IconButton>}
        </label>
        {filtered.map((model) => (
          <button key={model} className="floating-option model-option" onClick={() => onSelect(model)}>
            <span><strong>{model}</strong><small>{MODEL_META[model] || '视频生成模型'}</small></span>
            {value === model && <Check size={24} />}
          </button>
        ))}
        {filtered.length === 0 && <div className="empty-search"><Search size={25} /><p>没有找到相关模型</p></div>}
      </div>
    </div>
  );
}

function KeyboardMock() {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ];
  return (
    <section className="keyboard-mock" aria-hidden="true">
      <div className="keyboard-toolbar"><span>du</span><span>☺</span><span>⌨</span><span>⌄</span></div>
      <div className="keyboard-row top">{rows[0].map((key) => <span key={key} className="key"><small>{rows[0].indexOf(key) + 1}</small>{key}</span>)}</div>
      <div className="keyboard-row mid">{rows[1].map((key) => <span key={key} className="key">{key}</span>)}</div>
      <div className="keyboard-row low"><span className="key special">⇧</span>{rows[2].map((key) => <span key={key} className="key">{key}</span>)}<span className="key special">⌫</span></div>
      <div className="keyboard-row bottom"><span className="key wide">符</span><span className="key wide">123</span><span className="key">，</span><span className="key space">●</span><span className="key">。</span><span className="key wide">中</span><span className="key enter">↵</span></div>
      <div className="keyboard-home" />
    </section>
  );
}

function EditorScreen({ imageSrc, onClose, onDelete, onAddReference, onSubmit, initialSheet = null, keyboardMode = false }) {
  const [duration, setDuration] = useState(10);
  const [model, setModel] = useState('agnes-video');
  const [prompt, setPrompt] = useState('帮我让女孩跑动起来，1:1。');
  const [sheet, setSheet] = useState(initialSheet);
  const [toast, setToast] = useState('');
  const [keyboardOpen, setKeyboardOpen] = useState(keyboardMode);
  const toastTimer = useRef(null);

  const showToast = (text) => {
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  };

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  return (
    <main className={`app-screen editor-screen ${keyboardOpen ? 'keyboard-open' : ''}`}>
      <StatusBar />
      <header className="motion-header">
        <IconButton label="关闭编辑" className="editor-close" onClick={onClose}><X size={34} /></IconButton>
        <h1>照片动起来</h1>
      </header>

      <section className={`editor-content ${imageSrc ? 'has-image' : 'empty-image'}`}>
        {imageSrc ? (
          <div className="photo-frame">
            <img src={imageSrc} alt="已上传的参考照片" />
            <IconButton label="删除当前照片" className="delete-photo" onClick={() => (keyboardOpen ? onAddReference() : onDelete())}><Trash2 size={18} /></IconButton>
          </div>
        ) : (
          <button className="reference-empty" onClick={onAddReference}>
            <ImagePlus size={38} />
            <span>添加参考图（可选）</span>
          </button>
        )}
      </section>

      <section className="creation-panel">
        <div className="parameter-scroll">
          <ParameterButton label="比例" value="1:1" onClick={() => showToast('根据参考图适配最佳比例，不支持修改')} />
          <ParameterButton label="时长" value={`${duration}s`} onClick={() => setSheet('duration')} />
          <ParameterButton label="模型" value={model} onClick={() => setSheet('model')} wide />
        </div>
        <div className="prompt-wrap">
          <textarea value={imageSrc ? prompt : ''} disabled={!imageSrc} onFocus={() => setKeyboardOpen(true)} onChange={(e) => setPrompt(e.target.value.slice(0, 500))} placeholder="发消息..." rows={2} />
          <div className="prompt-footer">
            <button className="send-button" aria-label="生成视频" disabled={!imageSrc} onClick={() => onSubmit({ duration, model, prompt: prompt.trim() || '让照片主体自然动起来' })}>
              <ArrowUp size={21} />
            </button>
          </div>
        </div>
      </section>
      <div className="home-indicator" />

      {toast && <Toast text={toast} />}
      {sheet === 'duration' && <DurationMenu value={duration} onClose={() => setSheet(null)} onSelect={(value) => { setDuration(value); setSheet(null); }} />}
      {sheet === 'model' && <ModelMenu value={model} onClose={() => setSheet(null)} onSelect={(value) => { setModel(value); setSheet(null); }} />}
      {keyboardOpen && <KeyboardMock />}
    </main>
  );
}

function UserRequest({ data }) {
  return (
    <div className="message user-request">
      <img src={data.imageSrc} alt="用户上传的参考照片" />
      <div className="user-bubble">{data.prompt}</div>
      <div className="request-meta"><span>{data.duration}s</span><span>{data.model}</span></div>
    </div>
  );
}

function GeneratingCard({ stage }) {
  const progress = stage === 'done' ? 100 : stage === 'processing' ? 68 : 18;
  return (
    <article className="generation-card">
      <div className="generation-card-head">
        <span className={`spinner ${stage === 'done' ? 'complete' : ''}`}>{stage === 'done' ? <Check size={17} /> : <Sparkles size={17} />}</span>
        <div><strong>{stage === 'done' ? '视频已生成' : '正在生成视频'}</strong><small>{stage === 'processing' ? '正在处理人物动作与画面细节' : '任务已进入生成队列'}</small></div>
        <b>{progress}%</b>
      </div>
      <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
      {stage !== 'done' && <p>预计还需 1-3 分钟，完成后会自动发送给你。</p>}
    </article>
  );
}

function VideoCard({ imageSrc, onPlay, onDownload }) {
  return (
    <article className="result-card">
      <p>你的视频生成好了。</p>
      <div className="video-cover" onClick={onPlay} role="button" tabIndex={0}>
        <img src={imageSrc} alt="生成视频封面" />
        <span className="ai-watermark">AgnesAI生成</span>
        <span className="play-button"><Play size={20} fill="currentColor" /></span>
        <IconButton label="下载视频" className="download-video" onClick={(e) => { e.stopPropagation(); onDownload(); }}><ArrowDownToLine size={19} /></IconButton>
      </div>
    </article>
  );
}

function ChatResultScreen({ data, onBack, initialStage = 'queued', freezeStage = false }) {
  const [stage, setStage] = useState(initialStage);
  const [toast, setToast] = useState('');
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (freezeStage || initialStage === 'done') return undefined;
    const processing = setTimeout(() => setStage('processing'), 1200);
    const done = setTimeout(() => setStage('done'), 3600);
    return () => { clearTimeout(processing); clearTimeout(done); };
  }, [freezeStage, initialStage]);

  return (
    <main className="app-screen result-screen">
      <StatusBar />
      <ChatHeader onBack={onBack} />
      <section className="conversation">
        <UserRequest data={data} />
        <div className="assistant-text">我来为您生成一个视频，让照片中的女孩跑动起来。<br /><br />视频生成大约需要 1-3 分钟，生成好后我会主动发送给你。本次生成将消耗每日免费额度。</div>
        <GeneratingCard stage={stage} />
        {stage === 'done' && <VideoCard imageSrc={data.imageSrc} onPlay={() => setPlaying(true)} onDownload={() => { setToast('视频已保存到本地'); setTimeout(() => setToast(''), 2000); }} />}
      </section>
      <Composer onStart={() => onBack('gallery')} />
      {toast && <Toast text={toast} />}
      {playing && (
        <div className="player-layer">
          <StatusBar />
          <IconButton label="关闭播放" className="player-close" onClick={() => setPlaying(false)}><X size={27} /></IconButton>
          <div className="motion-preview"><img src={data.imageSrc} alt="视频播放预览" /></div>
          <div className="player-label"><span>0:03</span><div><i /></div><span>{data.duration === 10 ? '0:10' : `0:0${data.duration}`}</span></div>
        </div>
      )}
    </main>
  );
}

function App() {
  const reviewParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const reviewScreen = reviewParams.get('screen');
  const reviewStage = reviewParams.get('stage');
  const [screen, setScreen] = useState(['home', 'gallery', 'editor', 'result'].includes(reviewScreen) ? reviewScreen : 'home');
  const [selectedImage, setSelectedImage] = useState(reviewParams.get('empty') === '1' ? null : '/reference.jpg');
  const [galleryReturn, setGalleryReturn] = useState('home');
  const [request, setRequest] = useState({
    duration: 10,
    model: 'agnes-video',
    prompt: '帮我让女孩跑动起来，1:1。',
    imageSrc: '/reference.jpg',
  });
  const openGallery = (returnTo = 'home') => {
    setGalleryReturn(returnTo);
    setScreen('gallery');
  };

  return (
    <div className="prototype-shell">
      {screen === 'home' && <HomeScreen onStart={() => openGallery('home')} />}
      {screen === 'gallery' && <GalleryScreen onClose={() => setScreen(galleryReturn === 'editor' ? 'editor' : 'home')} onSelect={(src) => { setSelectedImage(src); setScreen('editor'); }} />}
      {screen === 'editor' && <EditorScreen imageSrc={selectedImage} initialSheet={reviewParams.get('sheet')} keyboardMode={reviewParams.get('keyboard') === '1'} onClose={() => setScreen('home')} onDelete={() => setSelectedImage(null)} onAddReference={() => openGallery('editor')} onSubmit={(data) => { setRequest({ ...data, imageSrc: selectedImage }); setScreen('result'); }} />}
      {screen === 'result' && <ChatResultScreen initialStage={['queued', 'processing', 'done'].includes(reviewStage) ? reviewStage : 'queued'} freezeStage={Boolean(reviewStage)} data={request} onBack={(target) => setScreen(target === 'gallery' ? 'gallery' : 'home')} />}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
