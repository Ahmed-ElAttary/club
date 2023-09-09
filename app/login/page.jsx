"use client";
import React, { useState, useRef, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { login, getClubName } from "./login";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");

  const [clubName, setClubName] = useState("");

  useEffect(() => {
    setClubName(getClubName());
  }, []);
  const handleLogin = async () => {
    setLoading(true);
    if (userName && password) {
      const user = await login(userName, password);
      if (user) {
        const { id, fullname, safe_no } = user;
        localStorage.setItem(
          "clubUser",
          JSON.stringify({ id, fullname, safe_no })
        );

        router.push("club/members");
      } else {
        toast.current.show({
          severity: "error",
          summary: "خطأ",
          detail: "خطأ في اسم المستخدم أو كلمة المرور",
          life: 3000,
        });
      }
    } else {
      setLoading(false);
      toast.current.show({
        severity: "error",
        summary: "خطأ",
        detail: "برجاء ملئ/مراجعة الحقول المطلوبة",
        life: 3000,
      });
    }
  };

  const header = <img alt="Card" src="/login.png" />;
  const footer = (
    <div className="flex flex-wrap justify-content-end gap-2">
      <Button
        label="تسجيل دخول"
        icon="pi pi-sign-in"
        onClick={handleLogin}
        loading={loading}
      />
    </div>
  );
  return (
    <>
      <Toast ref={toast} />
      <div className="card flex justify-content-center">
        <Card
          title={clubName}
          subTitle="مرحبا بك"
          footer={footer}
          header={header}
          className="md:w-25rem"
          dir="rtl"
          style={{ background: "var(--gardientMinColor)" }}
        >
          <label htmlFor="username">اسم المستخدم</label>
          <InputText
            id="username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          <label htmlFor="password">كلمة المرور</label>

          <Password
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            feedback={false}
            toggleMask
            style={{ width: "100%" }}
          />
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
