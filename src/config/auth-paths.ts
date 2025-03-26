export const REDIRECT_PATH = '/auth/login';

// 公开路径（无需认证）
export const PUBLIC_PATHS = [
  '/',
  '/auth/login',
  '/auth/register',
  '/about',
  '/api/public', // 示例公开API
];

// 需要认证的API路径前缀
export const PROTECTED_API_PREFIXES = [
  '/api/user/',
  '/api/protected/',
  '/api/admin/', // 示例管理API
];

// 需要认证的页面路径（支持动态路由）
export const PROTECTED_PAGE_PATHS = [
  '/square', // 完全匹配/square
  '/square/[id]', // 动态路由/square/123
  '/dashboard',
  '/profile',
  '/settings',
  '/admin', // 示例管理页面
];
