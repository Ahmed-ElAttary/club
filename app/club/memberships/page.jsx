"use client";
import React, { useEffect, useState } from "react";
import LazyTable from "@components/LazyTable/LazyTable.jsx";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";

const MembershipsPage = () => {
  // console.log(JSON.parse(localStorage.clubUser));
  const [user_id, setUser_id] = useState(
    "0446b155-d399-4b09-8048-20ff0ab1722f"
  );

  // useEffect(() => {
  //   // setUser_id(JSON.parse(localStorage.clubUser).id);
  // }, []);

  return (
    <>
      <LazyTable
        // exportName="memberships"
        table="memberships"
        id="id"
        tableHeader="report"
        paginator={true}
        rows={10}
        filter={{ user_id }}
        orderBy={{ serial_no: "desc" }}
        include={{
          member: {
            include: { rel_member_type: { select: { name: true } } },
          },
          rel_canceled: true,
          rel_status: true,
          rel_secondary: true,
        }}
        columns={[
          {
            field: "member_code",
            header: "رقم العضوية",
            filter: true,
            filterElement: "filterInputNumber",
            filterMode: "equals",

            dataType: "number",
          },

          {
            field: "member.name",
            header: "الاسم",
            //  filter: true,
            filterMode: "contains",

            dataType: "string",
          },
          {
            field: "rel_secondary.name",

            header: "نوع الإيصال",

            dataType: "string",
          },
          {
            field: "serial_no",

            header: "رقم الإيصال",

            dataType: "number",
          },
          {
            field: "safe_no",

            header: "رقم الخزينة",

            dataType: "number",
          },
          {
            field: "member_order_date",

            header: "تاريخ الإيصال",
            filter: true,
            filterMode: "equals",
            filterElement: "filterDate",
            dataType: "date",
          },
          {
            field: "start_date",

            header: "تاريخ البدء",
            filter: true,

            filterMode: "equals",
            filterElement: "filterDate",
            dataType: "date",
          },
          {
            field: "end_date",

            header: "تاريخ الإنتهاء",
            filter: true,

            filterMode: "equals",
            filterElement: "filterDate",
            dataType: "date",
          },
          {
            field: "total_amount",

            header: "الإجمالي",

            dataType: "number",
          },
          {
            field: "member.rel_member_type.name",

            header: "نوع العضوية",
            filter: false,

            dataType: "string",
          },
          {
            field: "member.member_type",
            // filter: true,

            // filterMode: "equals",
            header: "كود",

            dataType: "number",
          },
          {
            field: "rel_canceled.name",

            header: "الحالة",
            filter: false,

            dataType: "string",
          },
          // {
          //   field: "Actions",

          //   header: "",
          //   frozen: true,
          //   alignFrozen: "left",
          //   dataType: "custom",
          //   url: "members/",
          //   btnText: "المزيد",
          // },
        ]}
      />
    </>
  );
};

export default MembershipsPage;
