"use client";
import React from "react";
import "./Header.css";
import { Button } from "primereact/button";
import Image from "next/image";
const Header = () => {
  return (
    <div className="header">
      <Image src="/logo.png" width={200} height={200} alt="logo" />
      {/* <div style={{ position: "absolute", right: 0, top: 0 }}>
        <Button label="تسجيل الخروج" />
      </div> */}
    </div>
  );
};

export default Header;
