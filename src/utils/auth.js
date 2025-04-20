// وظائف مساعدة للتعامل مع المصادقة

/**
 * التحقق مما إذا كان المستخدم مسجل الدخول
 */
export const isAuthenticated = () => {
  return localStorage.getItem('authToken') !== null;
};

/**
 * الحصول على بيانات المستخدم الحالي
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

/**
 * تسجيل خروج المستخدم
 */
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.location.href = '/auth/login';
};

export default {
  isAuthenticated,
  getCurrentUser,
  logout
};