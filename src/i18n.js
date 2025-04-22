import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// الترجمات
const resources = {
  en: {
    translation: {
      "Don't have an account?": "Don't have an account?",
      "Sign Up": "Sign Up",
      "Already have account?": "Already have account?",
      "Sign In": "Sign In",
      "Full Name": "Full Name",
      "Enter your name": "Enter your name",
      "Email address": "Email address",
      "Enter your email": "Enter your email",
      "Password": "Password",
      "Enter your password": "Enter your password",
      "I accept Terms and Conditions": "I accept Terms and Conditions",
      "Log In": "Log In",
      "Don't have an account? Create your account, it takes less than a minute": "Don't have an account? Create your account, it takes less than a minute",
      "Enter your email address and password to access admin panel.": "Enter your email address and password to access admin panel.",
      "Sign in with": "Sign in with",
      "Sign up using": "Sign up using",
      "Please enter your email": "Please enter your email",
      "Please enter valid email": "Please enter valid email",
      "Please enter your password": "Please enter your password",
      "جاري التسجيل...": "Registering...",
      "جاري تسجيل الدخول...": "Logging in..."
    }
  },
  ar: {
    translation: {
      "Don't have an account?": "ليس لديك حساب؟",
      "Sign Up": "إنشاء حساب",
      "Already have account?": "لديك حساب بالفعل؟",
      "Sign In": "تسجيل الدخول",
      "Full Name": "الاسم الكامل",
      "Enter your name": "أدخل اسمك",
      "Email address": "البريد الإلكتروني",
      "Enter your email": "أدخل بريدك الإلكتروني",
      "Password": "كلمة المرور",
      "Enter your password": "أدخل كلمة المرور",
      "I accept Terms and Conditions": "أوافق على الشروط والأحكام",
      "Log In": "تسجيل الدخول",
      "Don't have an account? Create your account, it takes less than a minute": "ليس لديك حساب؟ أنشئ حسابك، الأمر يستغرق أقل من دقيقة",
      "Enter your email address and password to access admin panel.": "أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى لوحة الإدارة.",
      "Sign in with": "تسجيل الدخول باستخدام",
      "Sign up using": "التسجيل باستخدام",
      "Please enter your email": "الرجاء إدخال بريدك الإلكتروني",
      "Please enter valid email": "الرجاء إدخال بريد إلكتروني صالح",
      "Please enter your password": "الرجاء إدخال كلمة المرور",
      "جاري التسجيل...": "جاري التسجيل...",
      "جاري تسجيل الدخول...": "جاري تسجيل الدخول..."
    }
  }
};

i18n
  .use(initReactI18next) // تمرير i18n إلى react-i18next
  .init({
    resources,
    lng: 'ar', // اللغة الافتراضية
    fallbackLng: 'en', // اللغة الاحتياطية
    interpolation: {
      escapeValue: false // عدم الهروب من HTML
    }
  });

export default i18n;