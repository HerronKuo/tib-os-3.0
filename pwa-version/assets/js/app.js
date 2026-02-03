// TIB OS PWA - Main Application Logic

// 状态管理
const AppState = {
    isMobile: false,
    currentView: 'home', // 'home', 'all-prompts', 'prompt-detail', 'profile'
    activeCategory: 'all',
    currentPromptId: null,
    currentPromptDefaultText: ''
};

// 设备检测
function isMobile() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// 初始化
function init() {
    // 检测设备
    AppState.isMobile = isMobile();
    console.log('[App] Device detected:', AppState.isMobile ? 'Mobile' : 'Desktop');

    // 等待 PROMPTS_DATA 加载
    if (!window.PROMPTS_DATA) {
        console.log('[App] Waiting for PROMPTS_DATA...');
        setTimeout(init, 100);
        return;
    }

    // 注册 Service Worker
    registerServiceWorker();

    // 根据设备加载相应的视图
    if (AppState.isMobile) {
        initMobileView();
    } else {
        initDesktopView();
    }

    // 监听窗口大小变化
    window.addEventListener('resize', debounce(() => {
        const wasMobile = AppState.isMobile;
        const isNowMobile = isMobile();
        
        if (wasMobile !== isNowMobile) {
            console.log('[App] View mode changed, reloading...');
            location.reload();
        }
    }, 250));
}

// 注册 Service Worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('[SW] Service Worker registered:', registration.scope);
                    
                    // 监听 Service Worker 更新
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch((error) => {
                    console.error('[SW] Registration failed:', error);
                });
        });
    } else {
        console.log('[SW] Service Worker not supported');
    }
}

// 显示更新提示
function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 left-4 right-4 bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg z-[10000] flex items-center justify-between gap-4';
    notification.innerHTML = `
        <div>
            <div class="font-bold">有新版本可用</div>
            <div class="text-sm opacity-90">点击刷新以获取最新功能</div>
        </div>
        <button onclick="location.reload()" class="bg-white text-blue-600 px-4 py-2 rounded font-bold hover:bg-blue-50 transition">
            刷新
        </button>
    `;
    document.body.appendChild(notification);
    
    // 5秒后自动隐藏
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 查找 Prompt
function findPrompt(id) {
    if (!window.PROMPTS_DATA) return null;
    return window.PROMPTS_DATA.find(p => p.id === id);
}

// 复制到剪贴板
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (e) {
        // 回退方案
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (e) {
            console.error('Copy failed:', e);
            document.body.removeChild(textArea);
            return false;
        }
    }
}

// 显示提示消息
function showToast(message, duration = 2000) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-20 left-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-[10000] text-center font-bold';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// 显示错误消息
function showErrorToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-20 left-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-[10000] text-center font-bold';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// 保存到 localStorage
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(`tib_pwa_${key}`, JSON.stringify(value));
    } catch (e) {
        console.error('[LocalStorage] Save failed:', e);
    }
}

// 从 localStorage 读取
function loadFromLocalStorage(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(`tib_pwa_${key}`);
        return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
        console.error('[LocalStorage] Load failed:', e);
        return defaultValue;
    }
}

// 判断是否为 PWA
function isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
}

// 获取应用信息
function getAppInfo() {
    return {
        isPWA: isPWA(),
        isMobile: AppState.isMobile,
        userAgent: navigator.userAgent,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight
    };
}

// 导出全局函数（供其他模块使用）
window.TIBApp = {
    AppState,
    findPrompt,
    copyToClipboard,
    showToast,
    showErrorToast,
    saveToLocalStorage,
    loadFromLocalStorage,
    isPWA,
    getAppInfo
};

// 启动应用
document.addEventListener('DOMContentLoaded', init);
