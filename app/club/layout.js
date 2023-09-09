"use client";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Card } from "primereact/card";
import { useRouter } from "next/navigation";
import { Toolbar } from "primereact/toolbar";
import { useState, useEffect } from "react";

export default function ClubLayout({ children }) {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.clubUser) router.replace("/login");
  }, []);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("clubUser");

    router.replace("login");
  };
  const rightToolbarTemplate = (
    <Button
      icon="pi pi-bars"
      outlined
      onClick={() => {
        setVisible(true);
      }}
    />
  );

  const footer = (
    <div className="flex flex-wrap justify-content-end gap-2">
      <Button label="تسجيل خروج" icon="pi pi-sign-out" onClick={handleLogout} />
    </div>
  );

  return (
    <>
      <Toolbar right={rightToolbarTemplate}></Toolbar>
      <Sidebar
        visible={visible}
        onHide={() => setVisible(false)}
        dir="rtl"
        position="right"
      >
        <Card
          title={() => {
            return (
              localStorage.clubUser &&
              JSON.parse(localStorage.clubUser).fullname
            );
          }}
          subTitle="مرحبا بك"
          footer={footer}
          dir="rtl"
        >
          <div className="flex flex-col">
            <Button
              label="قائمة الأعضاء"
              outlined
              loading={loading}
              onClick={() => {
                setLoading(true);
                router.replace("club/members");
                setLoading(false);
              }}
            />
            <Button
              label="قائمة تجديدات العضويات"
              outlined
              loading={loading}
              onClick={() => {
                setLoading(true);
                router.replace("club/memberships");
                setLoading(false);
              }}
            />
          </div>
        </Card>
      </Sidebar>
      {children}
    </>
  );
}
