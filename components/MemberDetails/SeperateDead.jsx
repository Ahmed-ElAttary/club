import React, { useState, useRef, useEffect, createRef } from "react";
import { useFormik, Formik } from "formik";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import { Toast } from "primereact/toast";
import submit from "@components/form/submit";
import Field from "@components/form/Field";
import { seperateDead } from "@components/Members/member";
import { useRouter } from "next/navigation";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import PaymentReceipt from "./PaymentReceipt";
import { useReactToPrint } from "react-to-print";
const SeperateDead = ({
  newDialog,
  toggleNewDialog,
  handleReload,
  title,

  selectedMember,
}) => {
  const [membershipData, setMembershipData] = useState();
  const pageRef = createRef();
  const handlePrint = useReactToPrint({
    content: () => pageRef.current,
  });
  useEffect(() => {
    if (membershipData) handlePrint();
  }, [membershipData]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [print, setPrint] = useState(null);
  const [selectedRefMember, setSelectedRefMember] = useState();

  const [seperateFees, setSeperateFees] = useState(0);
  const newDialogFooter = (
    <div style={{ textAlign: "left" }}>
      <Button
        label="حفظ"
        icon="pi pi-check"
        iconPos="right"
        loading={loading}
        onClick={async () => {
          setLoading(true);
          if (!selectedRefMember || !seperateFees) {
            toast.current.show({
              severity: "error",
              summary: "خطأ",
              detail: "برجاء ملئ الحقول المطلوبة",
              life: 3000,
            });
            setLoading(false);
            return;
          }
          const membership = await seperateDead(
            selectedMember,
            selectedRefMember,
            seperateFees,
            JSON.parse(localStorage.clubUser).id,
            JSON.parse(localStorage.clubUser).safe_no
          );

          setMembershipData(membership.data);

          setLoading(false);
          toggleNewDialog();
          router.push(`club/members/${selectedRefMember.id}`);
          toast.current.show({
            severity: "success",
            summary: "تم",
            detail: "تم فصل العضو",
            life: 3000,
          });
        }}
        type="submit"
      />
      <Button
        label="إلغاء"
        iconPos="right"
        icon="pi pi-times"
        onClick={toggleNewDialog}
      />
    </div>
  );
  return (
    <>
      {membershipData && (
        <PaymentReceipt
          membershipData={membershipData}
          member={{ ...selectedMember, name: selectedRefMember.name }}
          ref={pageRef}
        />
      )}
      <Toast ref={toast} />
      <Dialog
        visible={newDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={title}
        headerStyle={{ direction: "rtl" }}
        rtl={true}
        contentStyle={{ direction: "rtl" }}
        modal
        footer={newDialogFooter}
        onHide={toggleNewDialog}
      >
        <div className="card flex justify-content-center">
          <DataTable
            value={selectedMember.rel_members}
            selectionMode="radiobutton"
            selection={selectedRefMember}
            onSelectionChange={(e) => setSelectedRefMember(e.value)}
            dataKey="id"
            // tableStyle={{ minWidth: "50rem" }}
          >
            <Column
              selectionMode="single"
              headerStyle={{ width: "3rem" }}
            ></Column>

            <Column field="name" header="الاسم"></Column>
            <Column field="rel_ref.name" header="صلة القرابة"></Column>
            <Column field="rel_ref.member_type" header="نوع العضوية"></Column>
          </DataTable>
        </div>
        <label htmlFor="seperate_fees">رسم فصل العضوية</label>
        <input
          id="seperate_fees"
          type="number"
          value={seperateFees}
          onChange={(e) => {
            setSeperateFees(Number(e.target.value));
          }}
        />
      </Dialog>
    </>
  );
};

export default SeperateDead;
