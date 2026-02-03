// TIB OS PWA - Desktop View Logic

// 分类定义
const CATEGORIES = [
    { id: "all", name: "全部", icon: "📚" },
    { id: "市场洞察", name: "市场洞察", icon: "📡" },
    { id: "个股分析", name: "个股分析", icon: "🔬", children: ["初始调研", "动态热更新"] },
    { id: "战情分析", name: "战情分析", icon: "⚔️" },
    { id: "关键动作", name: "关键动作", icon: "🎯", children: ["买入", "卖出", "持有"] },
    { id: "全局与复盘", name: "全局与复盘", icon: "📊" }
];

// DOM 元素
let nav, grid, modal, mTitle, mInputs, mEditor, mCloseBtn, mCopyBtn, mCopyFeedback, mVersionSelect, mSaveVersionBtn, mResetBtn, mDeleteVersionBtn;

// 变量定义
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

// 初始化桌面视图
function initDesktopView() {
    console.log('[Desktop View] Initializing...');
    
    // 获取 DOM 元素
    nav = document.getElementById('tpe-nav');
    grid = document.getElementById('tpe-grid');
    modal = document.getElementById('tpe-modal');
    mTitle = document.getElementById('tpe-modal-title');
    mInputs = document.getElementById('tpe-modal-inputs');
    mEditor = document.getElementById('tpe-modal-editor');
    mCloseBtn = document.getElementById('tpe-modal-close');
    mCopyBtn = document.getElementById('tpe-copy-btn');
    mCopyFeedback = document.getElementById('tpe-copy-feedback');
    mVersionSelect = document.getElementById('tpe-version-select');
    mSaveVersionBtn = document.getElementById('tpe-save-version-btn');
    mResetBtn = document.getElementById('tpe-reset-btn');
    mDeleteVersionBtn = document.getElementById('tpe-delete-version-btn');
    
    // 如果元素不存在，说明是移动端视图，直接返回
    if (!nav || !grid) {
        console.log('[Desktop View] Elements not found, likely mobile view');
        return;
    }
    
    // 渲染界面
    renderNav();
    renderGrid();
    
    // 绑定事件
    bindEvents();
}

// 获取分类下的 prompt 数量
function getPromptCount(catId) {
    if (!window.PROMPTS_DATA) return 0;
    if (catId === "all") return window.PROMPTS_DATA.length;

    const catObj = CATEGORIES.find(c => c.id === catId);
    let targetCats = [catId];
    if (catObj && catObj.children) {
        targetCats = targetCats.concat(catObj.children);
    }

    return window.PROMPTS_DATA.filter(p => p.categories.some(c => targetCats.includes(c))).length;
}

// 渲染导航
function renderNav() {
    if (!nav) return;
    
    nav.innerHTML = '';
    CATEGORIES.forEach(cat => {
        const count = getPromptCount(cat.id);
        const hasChildren = cat.children && cat.children.length > 0;
        const isActive = window.TIBApp.AppState.activeCategory === cat.id;
        const wrapper = document.createElement('div');
        wrapper.className = 'mb-0 md:mb-2 mr-2 md:mr-0 min-w-[35%] md:min-w-0 flex-shrink-0';

        const btnClass = isActive ? 'tpe-btn-sketchy active' : 'tpe-btn-sketchy bg-white text-slate-700 hover:bg-slate-50';

        wrapper.innerHTML = `<button class="w-full text-left px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm font-bold flex items-center justify-between ${btnClass}" data-cat="${cat.id}">
            <span class="truncate mr-1">${cat.name}</span>
            ${hasChildren ? '<span class="text-slate-400 hidden md:inline">∧</span>' : `<span class="text-xs opacity-50 bg-black/5 px-2 py-0.5 rounded-full transform scale-90 md:scale-100">${count}</span>`}
        </button>`;

        if (hasChildren) {
            const subMenu = document.createElement('div');
            subMenu.className = 'mt-1 pl-4 space-y-1 hidden md:block';
            cat.children.forEach(childId => {
                const childCount = getPromptCount(childId);
                const isChildActive = window.TIBApp.AppState.activeCategory === childId;
                const childClass = isChildActive ? 'active' : '';
                subMenu.innerHTML += `<button class="tpe-btn-child w-full text-left px-4 py-2 text-xs flex items-center justify-between ${childClass}" data-cat="${childId}">
                    <span>${childId}</span><span class="text-[10px] opacity-40">${childCount}</span>
                </button>`;
            });
            wrapper.appendChild(subMenu);
        }
        nav.appendChild(wrapper);
    });
}

// 获取当前分类的 prompts
function getFilteredPrompts() {
    if (!window.PROMPTS_DATA) return [];
    if (window.TIBApp.AppState.activeCategory === "all") return window.PROMPTS_DATA;

    const catObj = CATEGORIES.find(c => c.id === window.TIBApp.AppState.activeCategory);
    let targetCats = [window.TIBApp.AppState.activeCategory];
    if (catObj && catObj.children) {
        targetCats = targetCats.concat(catObj.children);
    }

    return window.PROMPTS_DATA.filter(p => p.categories.some(c => targetCats.includes(c)));
}

// 渲染卡片
function renderGrid() {
    if (!grid) return;
    
    const prompts = getFilteredPrompts();
    grid.innerHTML = '';
    if (prompts.length === 0) {
        grid.innerHTML = '<div class="col-span-full py-10 opacity-50 italic text-center">此分类下暂无指令。</div>';
        return;
    }
    
    prompts.forEach(p => {
        const categoryTags = p.categories.map(c => 
            `<span class="text-[10px] bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded border border-brand-200">${c}</span>`
        ).join('');
        const card = document.createElement('div');
        card.className = 'tpe-card-sketchy p-4 cursor-pointer min-h-[160px] flex flex-col relative group';
        card.setAttribute('data-prompt-id', p.id);
        card.innerHTML = `
            <div class="mb-1 border-b-2 border-slate-100 border-dashed pb-1">
                <h4 class="font-black text-ink text-base leading-tight truncate" title="${p.title}">${p.title}</h4>
            </div>
            <div class="flex-1 overflow-hidden relative mb-2">
                <p class="text-xs text-slate-500 leading-snug" style="display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;">${p.desc}</p>
            </div>
            <div class="flex flex-wrap gap-1 mt-auto pt-2 border-t border-slate-100">${categoryTags}</div>
        `;
        grid.appendChild(card);
    });
}

// 渲染模态框输入
function renderModalInputs(reqs) {
    if (!mInputs) return;
    
    mInputs.innerHTML = '';
    if (!reqs || reqs.length === 0) {
        mInputs.innerHTML = '<p class="text-slate-400 text-xs text-center py-4 bg-slate-100 rounded border-2 border-dashed">无额外变量</p>';
        return;
    }
    
    reqs.forEach(key => {
        const d = INPUT_DEFS[key];
        if (!d) return;

        const isTextarea = d.type === 'textarea';
        const savedValue = window.TIBApp.loadFromLocalStorage(`var_${key}`, '');
        const inputEl = isTextarea 
            ? `<textarea class="inp-val w-full tpe-input-sketchy p-3 text-sm h-24" placeholder="${d.ph}">${savedValue}</textarea>`
            : `<input type="text" class="inp-val w-full tpe-input-sketchy p-3 text-sm" placeholder="${d.ph}" value="${savedValue}">`;
        const div = document.createElement('div');
        div.className = 'inp-group pb-4 border-b-2 border-slate-200 border-dashed last:border-0';
        div.setAttribute('data-key', key);
        div.innerHTML = `
            <label class="flex items-center gap-2 mb-2 cursor-pointer">
                <input type="checkbox" class="inp-check w-5 h-5 accent-brand-600" checked>
                <span class="text-xs font-black text-slate-600 uppercase">${d.label}</span>
            </label>
            ${inputEl}
        `;
        mInputs.appendChild(div);
    });
}

// 更新编辑器
function updateEditor() {
    if (!mEditor || !window.TIBApp.AppState.currentPromptId) return;
    
    let baseText = window.TIBApp.AppState.currentPromptDefaultText;
    if (mVersionSelect && mVersionSelect.value !== 'default') {
        const savedVersion = window.TIBApp.loadFromLocalStorage(`prompt_${window.TIBApp.AppState.currentPromptId}_${mVersionSelect.value}`, '');
        if (savedVersion) baseText = savedVersion;
    }

    let text = baseText;
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

    // 修复序号逻辑
    let listCounter = 0;
    text = text.split(/\r?\n/).map(line => {
        if (/^\d+\./.test(line)) {
            listCounter++;
            return line.replace(/^\d+\./, `${listCounter}.`);
        } else {
            if (line.trim() !== '') listCounter = 0;
            return line;
        }
    }).join('\n');

    mEditor.value = text;
}

// 版本管理
function loadVersionList() {
    if (!mVersionSelect) return;
    
    mVersionSelect.innerHTML = '<option value="default">默认版本</option>';
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i), prefix = `tib_pwa_prompt_${window.TIBApp.AppState.currentPromptId}_`;
        if (key.startsWith(prefix)) {
            const v = key.substring(prefix.length);
            mVersionSelect.innerHTML += `<option value="${v}">📌 ${v}</option>`;
        }
    }
    if (mDeleteVersionBtn) {
        mDeleteVersionBtn.classList.toggle('hidden', mVersionSelect.value === 'default');
    }
}

function saveVersion() {
    const name = prompt('请输入版本名称：', `v${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}`);
    if (!name) return;
    window.TIBApp.saveToLocalStorage(`prompt_${window.TIBApp.AppState.currentPromptId}_${name}`, mEditor.value);
    loadVersionList();
    mVersionSelect.value = name;
    window.TIBApp.showToast('版本已保存！');
}

function deleteVersion() {
    const v = mVersionSelect.value;
    if (v === 'default') return;
    if (confirm(`确定删除版本 "${v}" 吗？`)) {
        localStorage.removeItem(`tib_pwa_prompt_${window.TIBApp.AppState.currentPromptId}_${v}`);
        loadVersionList();
        mVersionSelect.value = 'default';
        updateEditor();
        window.TIBApp.showToast('版本已删除');
    }
}

// 打开模态框
function openModal(promptId) {
    const p = window.TIBApp.findPrompt(promptId);
    if (!p) return;
    
    window.TIBApp.AppState.currentPromptId = p.id;
    window.TIBApp.AppState.currentPromptDefaultText = p.text;
    
    if (mTitle) {
        mTitle.innerHTML = `<span class="text-3xl mr-3">${p.icon}</span><span class="underline decoration-wavy decoration-brand-600">${p.title}</span>`;
    }
    
    loadVersionList();
    renderModalInputs(p.inputs);
    updateEditor();
    
    if (modal) {
        modal.classList.remove('hidden');
    }
}

// 复制 Prompt
async function copyPrompt() {
    const content = mEditor.value;
    if (!content.trim()) {
        window.TIBApp.showErrorToast('内容为空！');
        return;
    }
    
    const success = await window.TIBApp.copyToClipboard(content);
    if (success) {
        window.TIBApp.showToast('已复制到剪贴板！');
        mCopyBtn.innerHTML = '✅ 已复制!';
        setTimeout(() => mCopyBtn.innerHTML = '📋 复制 Prompt', 2000);
    } else {
        mEditor.select();
        document.execCommand('copy');
        window.TIBApp.showToast('已复制到剪贴板！');
    }
}

// 绑定事件
function bindEvents() {
    if (!nav) return;
    
    // 导航点击
    nav.addEventListener('click', e => {
        const btn = e.target.closest('[data-cat]');
        if (btn) {
            window.TIBApp.AppState.activeCategory = btn.dataset.cat;
            renderNav();
            renderGrid();
        }
    });

    // 卡片点击
    if (grid) {
        grid.addEventListener('click', e => {
            const card = e.target.closest('[data-prompt-id]');
            if (card) openModal(card.dataset.promptId);
        });
    }

    // 模态框事件
    if (mCloseBtn) {
        mCloseBtn.addEventListener('click', () => {
            if (modal) modal.classList.add('hidden');
        });
    }
    
    if (modal) {
        modal.addEventListener('click', e => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal) {
            modal.classList.add('hidden');
        }
    });

    // 输入事件
    document.addEventListener('input', e => {
        if (e.target.classList.contains('inp-val')) {
            updateEditor();
        }
    });
    
    document.addEventListener('change', e => {
        if (e.target.classList.contains('inp-check')) {
            updateEditor();
        }
    });

    if (mVersionSelect) {
        mVersionSelect.addEventListener('change', () => {
            if (mDeleteVersionBtn) {
                mDeleteVersionBtn.classList.toggle('hidden', mVersionSelect.value === 'default');
            }
            updateEditor();
        });
    }

    // 版本按钮
    if (mSaveVersionBtn) {
        mSaveVersionBtn.addEventListener('click', saveVersion);
    }
    
    if (mResetBtn) {
        mResetBtn.addEventListener('click', () => {
            if (mVersionSelect) {
                mVersionSelect.value = 'default';
                updateEditor();
                window.TIBApp.showToast('已重置为默认版本');
            }
        });
    }
    
    if (mDeleteVersionBtn) {
        mDeleteVersionBtn.addEventListener('click', deleteVersion);
    }
    
    if (mCopyBtn) {
        mCopyBtn.addEventListener('click', copyPrompt);
    }
}

// 导出初始化函数
window.initDesktopView = initDesktopView;
