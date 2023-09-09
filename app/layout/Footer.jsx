"use client";
import React from "react";
import "./Footer.css";
import { Button } from "primereact/button";
import Image from "next/image";
const Footer = () => {
  return (
    <div className="footer">
      <Image src="/logo.png" width={100} height={100} alt="logo" />
    </div>
  );
};

export default Footer;
