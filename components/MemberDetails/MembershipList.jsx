import React, { useState } from "react";
import LazyTable from "@components/LazyTable/LazyTable.jsx";
const MembershipList = ({ selectedMember, handleReload, reload }) => {
  return (
    <LazyTable
      table="memberships"
      paginator={true}
      key={reload}
      handleReload={handleReload}
      orderBy={{ serial_no: "desc" }}
      id="id"
      rows={10}
      include={{
        rel_status: true,
        rel_secondary: true,
        member: { select: { name: true } },
      }}
      filter={{
        member_code: selectedMember.member_code,
        canceled: 0,
        // secondary: 0,
      }}
      columns={[
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
          field: "start_date",
          header: "تاريخ البدء",
          filter: false,
          filterMode: "contains",

          dataType: "date",
        },
        {
          field: "end_date",
          header: "تاريخ الإنتهاء",
          filter: false,
          filterMode: "contains",

          dataType: "date",
        },
        {
          field: "total_amount",

          header: "الإجمالي",

          dataType: "number",
        },
        {
          field: "rel_status.name",

          header: "الحالة",
          filter: false,
          filterMode: "contains",

          dataType: "string",

          tag: "rel_status.tag",
        },
        {
          field: "Actions",

          header: "",
          frozen: true,
          alignFrozen: "left",
          dataType: "cancel",

          btnText: "إلغاء",
        },
      ]}
    />
  );
};

export default MembershipList;
