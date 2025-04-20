import { Link, useNavigate } from "react-router-dom";
import { Button, Row, Col, Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
    console.log("تم الضغط على زر التسجيل", data);

    setErrorMessage(null);
    setSuccessMessage("");
    setLoading(true);

    if (!data.checkboxsignup) {
      setErrorMessage("يجب الموافقة على الشروط والأحكام");
      setLoading(false);
      return;
    }

    try {
      // تحضير البيانات للإرسال
      const userData = {
        name: data.fullname,
        email: data.email,
        password: data.password,
        password_confirmation: data.password,
      };
      
      console.log("Sending registration data:", userData);
      
      // إرسال البيانات مباشرة إلى API
      const response = await axios.post('http://127.0.0.1:8000/api/register', userData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log("Registration response:", response.data);
      
      // التعامل مع الاستجابة الناجحة
      setSuccessMessage("تم إنشاء الحساب بنجاح!");
      
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
      
    } catch (error) {
      console.error("Registration error details:", error);
      
      // التعامل مع أخطاء الاستجابة
      if (error.response) {
        console.log("Error status:", error.response.status);
        console.log("Error data:", error.response.data);
        
        if (error.response.data.errors) {
          const allErrors = Object.values(error.response.data.errors)
            .flat()
            .join(", ");
          setErrorMessage(allErrors);
        } else {
          setErrorMessage(error.response.data.message || "فشل إنشاء الحساب، تأكد من البيانات.");
        }
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
        helpText={t("Don't have an account? Create your account, it takes less than a minute")}
        bottomLinks={<BottomLink />}
      >
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <VerticalForm onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            label={t("Full Name")}
            type="text"
            name="fullname"
            placeholder={t("Enter your name")}
            containerClass={"mb-3"}
            {...register("fullname", { required: "الاسم الكامل مطلوب" })}
            errors={errors}
          />
          <FormInput
            label={t("Email address")}
            type="email"
            name="email"
            placeholder={t("Enter your email")}
            containerClass={"mb-3"}
            {...register("email", {
              required: "البريد الإلكتروني مطلوب",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "البريد الإلكتروني غير صالح",
              },
            })}
            errors={errors}
          />
          <FormInput
            label={t("Password")}
            type="password"
            name="password"
            placeholder={t("Enter your password")}
            containerClass={"mb-3"}
            {...register("password", {
              required: "كلمة المرور مطلوبة",
              minLength: {
                value: 8,
                message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
              },
            })}
            errors={errors}
          />
          <FormInput
            label={t("I accept Terms and Conditions")}
            type="checkbox"
            name="checkboxsignup"
            containerClass={"mb-3"}
            {...register("checkboxsignup")}
            errors={errors}
          />

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
    </>
  );
};

export default Register;