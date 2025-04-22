import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Alert, Row, Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import axios from "axios";

// components
import { VerticalForm } from "@/components";
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
      // Use environment variable if available, fallback to localhost
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      
      // إرسال بيانات تسجيل الدخول مباشرة إلى API
      const response = await axios.post(`${apiUrl}/api/login`, {
        email: formData.email,
        password: formData.password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // Add timeout to prevent hanging requests
        timeout: 10000,
      });
      
      console.log("Login response:", response.data);
      
      // Save the authentication token and user data in localStorage
      localStorage.setItem('authToken', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      // console.log(response.data.tokin);
      // التوجيه إلى الصفحة الرئيسية بعد تسجيل الدخول مع تحديث الصفحة
      window.location.href = '/dashboard';
      
    } catch (error) {
      console.error("Login error:", error);
      
      // More detailed error handling
      if (error.code === 'ECONNABORTED') {
        setErrorMessage("انتهت مهلة الاتصال بالخادم. تأكد من أن الخادم يعمل.");
      } else if (error.response) {
        console.log("Error status:", error.response.status);
        console.log("Error data:", error.response.data);
        
        if (error.response.data.errors) {
          const allErrors = Object.values(error.response.data.errors).flat().join(", ");
          setErrorMessage(allErrors);
        } else {
          setErrorMessage(error.response.data.message || "فشل تسجيل الدخول. تأكد من بيانات الاعتماد الخاصة بك.");
        }
      } else if (error.request) {
        setErrorMessage("لم يتم تلقي استجابة من الخادم. تأكد من تشغيل الخادم على العنوان http://localhost:8000");
      } else {
        setErrorMessage(`حدث خطأ أثناء الاتصال بالخادم: ${error.message}`);
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>{t("Email address")}</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder={t("Enter your email")}
              isInvalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <Form.Control.Feedback type="invalid">
                {errors.email.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("Password")}</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder={t("Enter your password")}
              isInvalid={!!errors.password}
              {...register("password")}
            />
            {errors.password && (
              <Form.Control.Feedback type="invalid">
                {errors.password.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

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
        </form>

        <div className="text-center">
          <h5 className="mt-3 text-muted">{t("Sign in with")}</h5>
          <SocialLinks />
        </div>
      </AuthLayout>
    </>
  );
};

export default Login;