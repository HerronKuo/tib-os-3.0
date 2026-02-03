// TIB OS PWA Service Worker
// 版本控制：更新此版本号会触发新缓存
const CACHE_NAME = 'tib-os-v1';
const RUNTIME_CACHE = 'tib-os-runtime-v1';

// 需要预缓存的核心资源
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/assets/data/prompts.js',
  '/assets/js/app.js',
  '/assets/js/desktop-view.js',
  '/assets/js/mobile-view.js',
  '/manifest.json'
];

// Service Worker 安装事件
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  // 预缓存核心资源
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Pre-caching app shell');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        // 强制激活新的 Service Worker
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Pre-caching failed:', error);
      })
  );
});

// Service Worker 激活事件
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  // 清理旧缓存
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // 立即控制所有页面
        return self.clients.claim();
      })
  );
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 跳过非 HTTP 请求（如 chrome-extension://）
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // CDN 资源使用网络优先策略（保证最新）
  if (url.hostname.includes('cdn.jsdelivr.net')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 成功响应后缓存到 runtime cache
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => {
          // 网络失败时从缓存读取
          return caches.match(request);
        })
    );
    return;
  }

  // 核心应用资源使用缓存优先策略
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // 缓存命中，同时后台更新
          fetchAndCache(request);
          return cachedResponse;
        }

        // 缓存未命中，从网络获取
        return fetchAndCache(request);
      })
      .catch((error) => {
        console.error('[SW] Fetch failed:', error);
        // 返回离线页面或错误提示
        return new Response('离线模式下无法访问此内容', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
  );
});

// 获取并缓存资源
function fetchAndCache(request) {
  return fetch(request)
    .then((response) => {
      // 检查响应是否有效
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }

      // 克隆响应以便缓存
      const responseToCache = response.clone();
      
      caches.open(CACHE_NAME)
        .then((cache) => {
          cache.put(request, responseToCache);
        });

      return response;
    })
    .catch((error) => {
      console.error('[SW] Fetch failed:', error);
      throw error;
    });
}

// 处理消息事件（用于手动清除缓存）
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('[SW] Clearing all caches');
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    });
  }
});

// Service Worker 错误处理
self.addEventListener('error', (event) => {
  console.error('[SW] Error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Unhandled promise rejection:', event.reason);
});
