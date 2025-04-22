import { Link, useNavigate } from "react-router-dom";
import { Button, Row, Col, Alert, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
          {t("Already have account?")}{" "}
          <Link to={"/auth/login"} className="text-white ms-1">
            <b>{t("Sign In")}</b>
          </Link>
        </p>
      </Col>
    </Row>
  );
};

/* social links */
const SocialLinks = () => {
  const socialLinks = [
    { variant: "primary", icon: "facebook" },
    { variant: "danger", icon: "google" },
    { variant: "info", icon: "twitter" },
    { variant: "secondary", icon: "github" },
  ];
  return (
    <ul className="social-list list-inline mt-3 mb-0">
      {socialLinks.map((item, index) => (
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
      ))}
    </ul>
  );
};

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("✅ onSubmit is running", data);
    console.log("Form data:", data);

    setErrorMessage(null);
    setSuccessMessage("");
    setLoading(true);

    if (!data.checkboxsignup) {
      setErrorMessage("يجب الموافقة على الشروط والأحكام");
      setLoading(false);
      return;
    }

    try {
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password,
      };

      console.log("Attempting to send data to API:", userData);
      
      // Use environment variable if available, fallback to localhost
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      
      const response = await axios.post(`${apiUrl}/api/register`, userData, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        // Add timeout to prevent hanging requests
        timeout: 10000,
      });

      console.log("Registration success:", response.data);
      setSuccessMessage("تم إنشاء الحساب بنجاح!");

      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (error) {
      console.error("Registration error details:", error);

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
          setErrorMessage(error.response.data.message || "فشل إنشاء الحساب");
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
    <AuthLayout
      helpText={t("Don't have an account? Create your account, it takes less than a minute")}
      bottomLinks={<BottomLink />}
    >
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <VerticalForm onSubmit={handleSubmit(onSubmit)}>
        {/* Replace FormInput with Form.Group */}
        <Form.Group className="mb-3">
          <Form.Label>{t("Full Name")}</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder={t("Enter your name")}
            isInvalid={!!errors.name}
            {...register("name", { required: "الاسم الكامل مطلوب" })}
          />
          {errors.name && (
            <Form.Control.Feedback type="invalid">
              {errors.name.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t("Email address")}</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder={t("Enter your email")}
            isInvalid={!!errors.email}
            {...register("email", {
              required: "البريد الإلكتروني مطلوب",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "البريد الإلكتروني غير صالح",
              },
            })}
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
            {...register("password", {
              required: "كلمة المرور مطلوبة",
              minLength: {
                value: 8,
                message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
              },
            })}
          />
          {errors.password && (
            <Form.Control.Feedback type="invalid">
              {errors.password.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label={t("I accept Terms and Conditions")}
            name="checkboxsignup"
            isInvalid={!!errors.checkboxsignup}
            {...register("checkboxsignup")}
          />
          {errors.checkboxsignup && (
            <Form.Control.Feedback type="invalid">
              {errors.checkboxsignup.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <div className="text-center d-grid">
          <Button variant="success" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-1"></span>
                {t("جاري التسجيل...")}
              </>
            ) : (
              t("Sign Up")
            )}
          </Button>
        </div>
      </VerticalForm>

      <div className="text-center">
        <h5 className="mt-3 text-muted">{t("Sign up using")}</h5>
        <SocialLinks />
      </div>
    </AuthLayout>
  );
};

export default Register;
