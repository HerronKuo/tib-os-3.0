// TIB OS PWA - Mobile View Logic

// 核心场景定义
const CORE_SCENARIOS = [
    {
        id: 'market-scan',
        promptId: 'p13',
        title: '市场扫描',
        icon: '📡',
        desc: '输入市场数据，生成全景扫描日志',
        color: 'bg-blue-50 border-blue-200'
    },
    {
        id: 'event-analysis',
        promptId: 'p3',
        title: '事件解读',
        icon: '⚡',
        desc: '财报、新闻、股价异动',
        color: 'bg-orange-50 border-orange-200'
    },
    {
        id: 'discover-stock',
        promptId: 'p1',
        title: '发现股票',
        icon: '🔍',
        desc: '深度调研 + 市场定性',
        color: 'bg-green-50 border-green-200'
    },
    {
        id: 'trade-decision',
        promptId: 'p5',
        title: '买卖决策',
        icon: '💰',
        desc: '买入冷静剂 + 卖出决策',
        color: 'bg-purple-50 border-purple-200'
    }
];

// 按使用频率分组
const PROMPT_GROUPS = {
    high: {
        title: '🔥 高频（每天用）',
        prompts: ['p3', 'p13', 'p6']
    },
    medium: {
        title: '⚡ 中频（每周用）',
        prompts: ['p1', 'p2', 'p5', 'p12', 'p11']
    },
    low: {
        title: '📅 低频（按需用）',
        prompts: ['p4', 'p7', 'p8', 'p9', 'p15'],
        collapsible: true
    },
    advanced: {
        title: '🎓 高级功能',
        prompts: ['p10', 'p14'],
        collapsible: true
    }
};

// DOM 元素
let mobileContainer, bottomNav, promptModal;

// 初始化移动端视图
function initMobileView() {
    console.log('[Mobile View] Initializing...');
    
    // 检查是否已有移动端容器
    mobileContainer = document.getElementById('mobile-app-container');
    
    if (mobileContainer) {
        console.log('[Mobile View] Container found, rendering...');
        renderMobileHome();
        setupBottomNavigation();
    } else {
        console.log('[Mobile View] Creating mobile container...');
        createMobileContainer();
    }
}

// 创建移动端容器
function createMobileContainer() {
    // 隐藏桌面端元素
    const desktopElements = document.querySelectorAll('#tpe-nav, #tpe-grid');
    desktopElements.forEach(el => el.style.display = 'none');
    
    // 创建移动端容器
    mobileContainer = document.createElement('div');
    mobileContainer.id = 'mobile-app-container';
    mobileContainer.className = 'w-full min-h-screen bg-paper pb-20';
    document.querySelector('.flex-1.bg-paper')?.appendChild(mobileContainer);
    
    renderMobileHome();
    setupBottomNavigation();
}

// 渲染移动端首页
function renderMobileHome() {
    if (!mobileContainer) return;
    
    window.TIBApp.AppState.currentView = 'home';
    
    mobileContainer.innerHTML = `
        <!-- Header -->
        <header class="sticky top-0 bg-paper border-b-2 border-dashed border-slate-200 z-50 px-4 py-3">
            <div class="flex items-center justify-between">
                <h1 class="text-xl font-black text-ink flex items-center gap-2">
                    <span class="text-sm bg-brand-600 text-white px-2 py-0.5 rounded">PWA</span>
                    TIB OS
                </h1>
                <div class="flex items-center gap-2">
                    <button onclick="showInstallGuide()" class="text-slate-500 hover:text-brand-600 transition">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                    </button>
                    <button onclick="showProfile()" class="text-slate-500 hover:text-brand-600 transition">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 0118 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </header>

        <!-- Content -->
        <div class="px-4 py-4 space-y-6" id="mobile-content">
            ${renderRecommendedSection()}
            <div class="border-t-2 border-dashed border-slate-200 pt-6">
                <h2 class="text-lg font-bold text-ink mb-4">🚀 快速开始</h2>
                <div class="grid grid-cols-1 gap-3">
                    ${CORE_SCENARIOS.map(scenario => renderScenarioCard(scenario)).join('')}
                </div>
            </div>
            <div class="text-center pt-4">
                <button onclick="renderAllPrompts()" class="text-brand-600 font-bold hover:underline">
                    查看全部 15 个功能 →
                </button>
            </div>
        </div>
    `;
}

// 渲染推荐部分
function renderRecommendedSection() {
    return `
        <div class="bg-brand-50 border-2 border-brand-200 rounded-lg p-4">
            <h2 class="text-lg font-bold text-ink mb-3">🎯 为你推荐</h2>
            <div class="bg-white rounded-lg p-3 border border-slate-200">
                <div class="flex items-start gap-3">
                    <span class="text-2xl">⚡</span>
                    <div class="flex-1">
                        <h3 class="font-bold text-ink mb-1">P3 事件解读</h3>
                        <p class="text-sm text-slate-600">最高频使用的功能，处理财报、新闻、股价异动</p>
                    </div>
                </div>
                <button onclick="openPromptById('p3')" class="mt-3 w-full bg-brand-600 text-white py-2 rounded font-bold hover:bg-brand-700 transition">
                    立即使用
                </button>
            </div>
        </div>
    `;
}

// 渲染场景卡片
function renderScenarioCard(scenario) {
    const prompt = window.TIBApp.findPrompt(scenario.promptId);
    if (!prompt) return '';
    
    return `
        <button 
            onclick="openPromptById('${scenario.promptId}')"
            class="w-full ${scenario.color} border-2 rounded-lg p-4 text-left hover:shadow-lg transition-all active:scale-95"
        >
            <div class="flex items-start gap-3">
                <span class="text-3xl">${scenario.icon}</span>
                <div class="flex-1">
                    <h3 class="font-bold text-ink text-base mb-1">${scenario.title}</h3>
                    <p class="text-xs text-slate-600">${scenario.desc}</p>
                </div>
            </div>
            <div class="mt-2 text-right">
                <span class="text-xs text-slate-500">使用 ${scenario.promptId.toUpperCase()} →</span>
            </div>
        </button>
    `;
}

// 渲染全部功能页面
function renderAllPrompts() {
    if (!mobileContainer) return;
    
    window.TIBApp.AppState.currentView = 'all-prompts';
    
    const content = document.getElementById('mobile-content');
    if (!content) return;
    
    content.innerHTML = `
        <div class="mb-6">
            <button onclick="renderMobileHome()" class="text-slate-600 hover:text-ink transition flex items-center gap-1">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                返回首页
            </button>
        </div>
        
        <div class="sticky top-16 bg-paper z-40 pb-4">
            <div class="relative">
                <input 
                    type="text" 
                    id="prompt-search"
                    placeholder="搜索功能..." 
                    oninput="filterPrompts(this.value)"
                    class="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg text-ink placeholder:text-slate-400 focus:outline-none focus:border-brand-600"
                />
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                    🔍
                </span>
            </div>
        </div>

        <div class="space-y-6" id="prompt-groups">
            ${Object.entries(PROMPT_GROUPS).map(([key, group]) => renderPromptGroup(key, group)).join('')}
        </div>
    `;
}

// 渲染 Prompt 分组
function renderPromptGroup(key, group) {
    const collapsed = window.TIBApp.loadFromLocalStorage(`group_${key}_collapsed`, false);
    
    const promptsHTML = group.prompts.map(promptId => {
        const prompt = window.TIBApp.findPrompt(promptId);
        if (!prompt) return '';
        
        return `
            <button 
                onclick="openPromptById('${promptId}')"
                class="w-full bg-white border-2 border-slate-200 rounded-lg p-4 text-left hover:border-brand-600 hover:shadow-md transition-all"
                data-prompt-id="${promptId}"
                data-prompt-title="${prompt.title}"
                data-prompt-desc="${prompt.desc}"
            >
                <div class="flex items-start gap-3">
                    <span class="text-2xl">${prompt.icon}</span>
                    <div class="flex-1">
                        <h4 class="font-bold text-ink text-sm mb-1">${prompt.title}</h4>
                        <p class="text-xs text-slate-600 line-clamp-2">${prompt.desc}</p>
                    </div>
                </div>
            </button>
        `;
    }).join('');

    return `
        <div class="prompt-group" data-group-key="${key}">
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-base font-bold text-ink">${group.title}</h3>
                ${group.collapsible ? `
                    <button 
                        onclick="toggleGroup('${key}')"
                        class="text-slate-500 hover:text-brand-600 transition"
                    >
                        ${collapsed ? '▶ 展开' : '▼ 收起'}
                    </button>
                ` : ''}
            </div>
            <div class="space-y-2 ${collapsed ? 'hidden' : ''}" id="group-${key}">
                ${promptsHTML}
            </div>
        </div>
    `;
}

// 切换分组展开/折叠
function toggleGroup(key) {
    const current = window.TIBApp.loadFromLocalStorage(`group_${key}_collapsed`, false);
    window.TIBApp.saveToLocalStorage(`group_${key}_collapsed`, !current);
    renderAllPrompts();
}

// 搜索过滤
function filterPrompts(searchTerm) {
    const groups = document.querySelectorAll('.prompt-group');
    const lowerSearch = searchTerm.toLowerCase();
    
    groups.forEach(group => {
        const buttons = group.querySelectorAll('button[data-prompt-id]');
        let hasVisible = false;
        
        buttons.forEach(btn => {
            const title = btn.dataset.promptTitle.toLowerCase();
            const desc = btn.dataset.promptDesc.toLowerCase();
            const matches = title.includes(lowerSearch) || desc.includes(lowerSearch);
            
            btn.style.display = matches ? 'block' : 'none';
            if (matches) hasVisible = true;
        });
        
        group.style.display = searchTerm && !hasVisible ? 'none' : 'block';
    });
}

// 设置底部导航
function setupBottomNavigation() {
    // 移除旧的底部导航
    const oldNav = document.getElementById('mobile-bottom-nav');
    if (oldNav) oldNav.remove();
    
    // 创建底部导航
    bottomNav = document.createElement('nav');
    bottomNav.id = 'mobile-bottom-nav';
    bottomNav.className = 'fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 z-50 px-2 py-2';
    bottomNav.innerHTML = `
        <div class="flex items-stretch">
            <button 
                onclick="renderMobileHome()" 
                class="flex-1 flex flex-col items-center gap-1 py-1 text-slate-600 hover:text-brand-600 transition"
                id="nav-home"
            >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                <span class="text-xs font-bold">首页</span>
            </button>
            <button 
                onclick="renderAllPrompts()" 
                class="flex-1 flex flex-col items-center gap-1 py-1 text-slate-600 hover:text-brand-600 transition"
                id="nav-all"
            >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                </svg>
                <span class="text-xs font-bold">全部</span>
            </button>
            <button 
                onclick="showProfile()" 
                class="flex-1 flex flex-col items-center gap-1 py-1 text-slate-600 hover:text-brand-600 transition"
                id="nav-profile"
            >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 0118 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span class="text-xs font-bold">我的</span>
            </button>
        </div>
    `;
    document.body.appendChild(bottomNav);
    updateActiveNav();
}

// 更新导航高亮
function updateActiveNav() {
    const view = window.TIBApp.AppState.currentView;
    
    document.querySelectorAll('#mobile-bottom-nav button').forEach(btn => {
        btn.classList.remove('text-brand-600');
        btn.classList.add('text-slate-600');
    });
    
    const activeBtn = document.getElementById(`nav-${view === 'home' ? 'home' : 'all'}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-slate-600');
        activeBtn.classList.add('text-brand-600');
    }
}

// 打开 Prompt
function openPromptById(promptId) {
    const prompt = window.TIBApp.findPrompt(promptId);
    if (!prompt) return;
    
    console.log('[Mobile View] Opening prompt:', promptId);
    
    // 复用桌面端的模态框
    window.TIBApp.AppState.currentPromptId = prompt.id;
    window.TIBApp.AppState.currentPromptDefaultText = prompt.text;
    
    // 创建移动端 Prompt 模态框
    createPromptModal(prompt);
}

// 创建 Prompt 模态框（移动端全屏）
function createPromptModal(prompt) {
    // 移除旧的模态框
    const oldModal = document.getElementById('mobile-prompt-modal');
    if (oldModal) oldModal.remove();
    
    promptModal = document.createElement('div');
    promptModal.id = 'mobile-prompt-modal';
    promptModal.className = 'fixed inset-0 bg-paper z-[10000] overflow-y-auto';
    promptModal.innerHTML = `
        <div class="sticky top-0 bg-paper border-b-2 border-dashed border-slate-200 z-10 px-4 py-3 flex items-center justify-between">
            <h2 class="text-lg font-bold text-ink flex items-center gap-2">
                <span class="text-2xl">${prompt.icon}</span>
                <span>${prompt.title}</span>
            </h2>
            <button onclick="closePromptModal()" class="text-ink hover:text-red-600 transition text-2xl">✕</button>
        </div>
        
        <div class="px-4 py-4 space-y-4">
            <div class="bg-brand-50 border border-brand-200 rounded-lg p-3">
                <p class="text-sm text-slate-700">${prompt.desc}</p>
            </div>
            
            <div id="mobile-inputs"></div>
            
            <div class="bg-white border-2 border-slate-200 rounded-lg p-4">
                <label class="text-xs font-black text-slate-600 uppercase mb-2 block">📝 预览与编辑</label>
                <textarea 
                    id="mobile-editor"
                    class="w-full bg-white border-2 border-slate-200 rounded p-3 text-sm h-64 focus:outline-none focus:border-brand-600"
                    spellcheck="false"
                ></textarea>
            </div>
            
            <div class="sticky bottom-0 bg-paper py-4 border-t-2 border-dashed border-slate-200">
                <button 
                    id="mobile-copy-btn"
                    onclick="copyMobilePrompt()"
                    class="w-full bg-brand-600 text-white font-bold py-4 rounded-lg text-lg hover:bg-brand-700 transition"
                >
                    📋 复制 Prompt
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(promptModal);
    document.body.style.overflow = 'hidden';
    
    // 渲染输入
    renderMobileInputs(prompt.inputs);
    updateMobileEditor(prompt);
}

// 渲染移动端输入
function renderMobileInputs(reqs) {
    const container = document.getElementById('mobile-inputs');
    if (!container) return;
    
    const INPUT_DEFS = {
        'ticker': { label: 'Ticker 标的', ph: 'e.g. NVDA' },
        'price': { label: 'Price 价格/数据', ph: '输入当前价格、市值或结果...', type: 'textarea' },
        'sentiment': { label: 'Sentiment 情绪/宏观', ph: '输入市场情绪或宏观背景...', type: 'textarea' },
        'event': { label: 'Event 事件内容', ph: '粘贴新闻/财报/公告内容...', type: 'textarea' },
        'context': { label: 'Context 知识库/持仓', ph: '粘贴知识库、持仓或背景信息...', type: 'textarea' },
        'notes': { label: 'Notes 补充说明', ph: '补充说明、目标或理由...', type: 'textarea' },
        'strategy': { label: 'Strategy 策略', ph: 'SOP 1 (PVE) 或 SOP 2 (PVP)...', type: 'text' },
        'action': { label: 'Action 操作意图', ph: '打算做什么操作...', type: 'textarea' },
        'reason': { label: 'Reason 理由', ph: '操作背后的逻辑...', type: 'textarea' }
    };
    
    container.innerHTML = '';
    if (!reqs || reqs.length === 0) {
        container.innerHTML = '<p class="text-slate-400 text-xs text-center py-4 bg-slate-100 rounded border-2 border-dashed">无额外变量</p>';
        return;
    }
    
    reqs.forEach(key => {
        const d = INPUT_DEFS[key];
        if (!d) return;

        const isTextarea = d.type === 'textarea';
        const savedValue = window.TIBApp.loadFromLocalStorage(`var_${key}`, '');
        const inputEl = isTextarea 
            ? `<textarea class="inp-val w-full bg-white border-2 border-slate-200 rounded p-3 text-sm h-20 focus:outline-none focus:border-brand-600" placeholder="${d.ph}">${savedValue}</textarea>`
            : `<input type="text" class="inp-val w-full bg-white border-2 border-slate-200 rounded p-3 text-sm focus:outline-none focus:border-brand-600" placeholder="${d.ph}" value="${savedValue}">`;
        
        const div = document.createElement('div');
        div.className = 'inp-group';
        div.setAttribute('data-key', key);
        div.innerHTML = `
            <label class="flex items-center gap-2 mb-2 cursor-pointer">
                <input type="checkbox" class="inp-check w-5 h-5 accent-brand-600" checked>
                <span class="text-xs font-bold text-slate-700 uppercase">${d.label}</span>
            </label>
            ${inputEl}
        `;
        container.appendChild(div);
    });
    
    // 绑定输入事件
    container.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', updateMobileEditor.bind(null, prompt));
    });
    
    container.querySelectorAll('.inp-check').forEach(el => {
        el.addEventListener('change', updateMobileEditor.bind(null, prompt));
    });
}

// 更新移动端编辑器
function updateMobileEditor(prompt) {
    const editor = document.getElementById('mobile-editor');
    if (!editor) return;
    
    const patterns = {
        ticker: /\[\[?Ticker\]?\]|\[股票标的ticker\]|\[股票标的\]|\[Target Ticker\]|\[代码\]/gi,
        price: /\[Price Data\]|\[Current Price Data\]|\[当前价格[^\]]*\]|\[当前价格\/市值\]|\[Price\]|\[Total Net Worth\]|\[Result\]/gi,
        sentiment: /\[Market Sentiment\]|\[市场情绪\]|\[宏观环境\]|\[Macro Context\]|\[Sentiment\]/gi,
        event: /\[Event\]|\[Event Content\]|\[事件详情\]|\[事件内容\]|\[事件\/研报内容\]|\[Macro Event\]|\[宏观事件\]/gi,
        context: /\[Context\]|\[Knowledge Base Summary\]|\[Knowledge Base\]|\[知识库内容\]|\[持仓数据\]|\[交易详情\]|\[操作意图与理由\]|\[持仓情况\]|\[Current Portfolio\]|\[Original Thesis\]|\[Holdings\]/gi,
        notes: /\[Notes\]|\[Additional Notes\]|\[补充说明\]|\[Objective\]|\[Exit Reason\]/gi,
        strategy: /\[Strategy\]|\[Current Strategy\]/gi,
        action: /\[Action\]|\[Intended Action\]/gi,
        reason: /\[Reason\]|\[Reasoning\]/gi
    };
    
    let text = window.TIBApp.AppState.currentPromptDefaultText;
    
    document.querySelectorAll('.inp-group').forEach(g => {
        const key = g.dataset.key;
        const checkbox = g.querySelector('.inp-check');
        const input = g.querySelector('.inp-val');
        const checked = checkbox ? checkbox.checked : false;
        const val = input ? input.value : '';

        window.TIBApp.saveToLocalStorage(`var_${key}`, val);

        const pattern = patterns[key] || new RegExp(`\\[${key}\\]`, 'gi');

        if (checked && val.trim()) {
            text = text.replace(pattern, `[${val}]`);
        } else if (!checked) {
            const lineRegex = new RegExp(`^\\d+\\..*(?:${pattern.source}).*$(\\r?\\n)?`, 'gmi');
            text = text.replace(lineRegex, '');
        }
    });

    editor.value = text;
}

// 复制移动端 Prompt
async function copyMobilePrompt() {
    const editor = document.getElementById('mobile-editor');
    const btn = document.getElementById('mobile-copy-btn');
    
    if (!editor || !btn) return;
    
    const content = editor.value;
    if (!content.trim()) {
        window.TIBApp.showErrorToast('内容为空！');
        return;
    }
    
    const success = await window.TIBApp.copyToClipboard(content);
    if (success) {
        window.TIBApp.showToast('已复制到剪贴板！');
        btn.innerHTML = '✅ 已复制!';
        setTimeout(() => btn.innerHTML = '📋 复制 Prompt', 2000);
    }
}

// 关闭 Prompt 模态框
function closePromptModal() {
    if (promptModal) {
        promptModal.remove();
        promptModal = null;
        document.body.style.overflow = '';
    }
}

// 显示个人页面
function showProfile() {
    const content = document.getElementById('mobile-content');
    if (!content) return;
    
    window.TIBApp.AppState.currentView = 'profile';
    content.innerHTML = `
        <div class="space-y-6">
            <div class="bg-white border-2 border-slate-200 rounded-lg p-6">
                <h2 class="text-lg font-bold text-ink mb-4">📊 使用统计</h2>
                <div class="space-y-3 text-sm">
                    <div class="flex justify-between">
                        <span class="text-slate-600">总使用次数</span>
                        <span class="font-bold text-ink">${window.TIBApp.loadFromLocalStorage('total_uses', 0)} 次</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-600">常用 Prompt</span>
                        <span class="font-bold text-ink">P3 事件解读</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-600">上次使用</span>
                        <span class="font-bold text-ink">${new Date().toLocaleDateString('zh-CN')}</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-white border-2 border-slate-200 rounded-lg p-6">
                <h2 class="text-lg font-bold text-ink mb-4">🔧 设置</h2>
                <div class="space-y-3">
                    <button onclick="showInstallGuide()" class="w-full bg-brand-50 border-2 border-brand-200 rounded-lg p-3 text-left hover:bg-brand-100 transition">
                        <div class="flex items-center gap-2">
                            <span class="text-xl">📱</span>
                            <span class="font-bold text-ink">PWA 安装指南</span>
                        </div>
                    </button>
                    <button onclick="clearAllData()" class="w-full bg-red-50 border-2 border-red-200 rounded-lg p-3 text-left hover:bg-red-100 transition">
                        <div class="flex items-center gap-2">
                            <span class="text-xl">🗑️</span>
                            <span class="font-bold text-ink">清除所有数据</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    updateActiveNav();
}

// 清除所有数据
function clearAllData() {
    if (confirm('确定要清除所有本地存储的数据吗？')) {
        localStorage.clear();
        window.TIBApp.showToast('数据已清除');
        setTimeout(() => location.reload(), 1000);
    }
}

// 显示安装指南
function showInstallGuide() {
    window.location.href = '/install-guide/install.html';
}

// 导出初始化函数
window.initMobileView = initMobileView;
window.renderMobileHome = renderMobileHome;
window.renderAllPrompts = renderAllPrompts;
window.openPromptById = openPromptById;
window.closePromptModal = closePromptModal;
window.showProfile = showProfile;
window.showInstallGuide = showInstallGuide;
window.toggleGroup = toggleGroup;
window.filterPrompts = filterPrompts;
window.copyMobilePrompt = copyMobilePrompt;
window.clearAllData = clearAllData;
