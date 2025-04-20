import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Alert, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import axios from "axios";

// components
import { VerticalForm, FormInput } from "@/components";
import AuthLayout from "./AuthLayout";

/* bottom links */
const BottomLink = () => {
  const { t } = useTranslation();

  return (
    <Row className="mt-3">
      <Col className="text-center">
        <p className="text-white-50">
          {t("Don't have an account?")}{" "}
          <Link to={"/auth/register"} className="text-white ms-1">
            <b>{t("Sign Up")}</b>
          </Link>
        </p>
      </Col>
    </Row>
  );
};

/* social links */
const SocialLinks = () => {
  const socialLinks = [
    {
      variant: "primary",
      icon: "facebook",
    },
    {
      variant: "danger",
      icon: "google",
    },
    {
      variant: "info",
      icon: "twitter",
    },
    {
      variant: "secondary",
      icon: "github",
    },
  ];
  return (
    <>
      <ul className="social-list list-inline mt-3 mb-0">
        {(socialLinks || []).map((item, index) => {
          return (
            <li key={index} className="list-inline-item">
              <Link
                to="#"
                className={classNames(
                  "social-list-item",
                  "border-" + item.variant,
                  "text-" + item.variant
                )}
              >
                <i className={classNames("mdi", "mdi-" + item.icon)}></i>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // form validation schema
  const schemaResolver = yupResolver(
    yup.object().shape({
      email: yup.string().required(t("Please enter your email")).email(t("Please enter valid email")),
      password: yup.string().required(t("Please enter your password")),
    })
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: schemaResolver });

  const onSubmit = async (formData) => {
    console.log("تم الضغط على زر تسجيل الدخول", formData);
    
    setLoading(true);
    setErrorMessage(null);

    try {
      // إرسال بيانات تسجيل الدخول مباشرة إلى API
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email: formData.email,
        password: formData.password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log("Login response:", response.data);
      
      // حفظ بيانات المستخدم وتوكن المصادقة في localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // التوجيه إلى الصفحة الرئيسية بعد تسجيل الدخول
      navigate('/');
      
    } catch (error) {
      console.error("Login error:", error);
      
      // التعامل مع أخطاء تسجيل الدخول
      if (error.response) {
        setErrorMessage(error.response.data.message || "فشل تسجيل الدخول. تأكد من بيانات الاعتماد الخاصة بك.");
      } else if (error.request) {
        setErrorMessage("لم يتم تلقي استجابة من الخادم. تأكد من تشغيل الخادم.");
      } else {
        setErrorMessage("حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthLayout
        helpText={t("Enter your email address and password to access admin panel.")}
        bottomLinks={<BottomLink />}
      >
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <VerticalForm onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            label={t("Email address")}
            type="email"
            name="email"
            placeholder={t("Enter your email")}
            containerClass={"mb-3"}
            {...register("email")}
            errors={errors}
          />
          <FormInput
            label={t("Password")}
            type="password"
            name="password"
            placeholder={t("Enter your password")}
            containerClass={"mb-3"}
            {...register("password")}
            errors={errors}
          />

          <div className="text-center d-grid">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1"></span>
                  {t("جاري تسجيل الدخول...")}
                </>
              ) : (
                t("Log In")
              )}
            </Button>
          </div>
        </VerticalForm>

        <div className="text-center">
          <h5 className="mt-3 text-muted">{t("Sign in with")}</h5>
          <SocialLinks />
        </div>
      </AuthLayout>
    </>
  );
};

export default Login;