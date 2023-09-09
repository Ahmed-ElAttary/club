"use client";
import React, { useState, useRef, useEffect, createRef } from "react";
import LazyTable from "@components/LazyTable/LazyTable.jsx";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";

import { Toast } from "primereact/toast";

import { Accordion, AccordionTab } from "primereact/accordion";
import Print from "@components/printPdf/Print";
import {
  deleteMember,
  getRefMember,
  seperateMember,
} from "@components/Members/member";

import { useRouter } from "next/navigation";

import RefMemberData from "./RefMemberData";
import UpdateRefMemberForm from "./UpdateRefMemberForm";
import { Dialog } from "primereact/dialog";
import SuspendMemberForm from "../MemberDetails/SuspendMemberForm";
import { useReactToPrint } from "react-to-print";
import PaymentReceipt from "@components/MemberDetails/PaymentReceipt";
const RefMemberDetails = ({ member_id }) => {
  const [seperateFees, setSeperateFees] = useState(0);
  const [membershipData, setMembershipData] = useState();
  const pageRef = createRef();
  const handlePrint = useReactToPrint({
    content: () => pageRef.current,
  });
  useEffect(() => {
    if (membershipData) handlePrint();
  }, [membershipData]);
  const router = useRouter();
  const toast = useRef(null);
  const [newDialog, setNewDialog] = useState(false);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [printDialog, setPrintDialog] = useState(false);
  const [suspendDialog, setSuspendDialog] = useState(false);
  const [reloadKeyMember, setReloadKeyMember] = useState("member");
  const [selectedMember, setSelectedMember] = useState();

  useEffect(() => {
    (async () => {
      const member = await getRefMember(member_id);
      setSelectedMember(member);
    })();
  }, []);

  function handleReloadMember() {
    setReloadKeyMember((prevKey) => prevKey + 1);
  }

  const toggleNewDialog = () => {
    setNewDialog(!newDialog);
  };
  const toggleUpdateDialog = () => {
    setUpdateDialog(!updateDialog);
  };
  /////////////////////////////////////////////////////////////////////////////
  const togglePrintDialog = async () => {
    setPrintDialog(!printDialog);
    // window.open(`/api/print?ref=true&id=${member_id}`);
    // const blob = await axios.get(
    //   `/api/print?member_id=${selectedMember.member_id}`,
    //   {
    //     responseType: "blob",
    //   }
    // );
  };
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [seperateDialog, setSeperateDialog] = useState(false);
  const toggleConfirmDeleteDialog = () => {
    setDeleteDialog(!deleteDialog);
  };
  const toggleConfirmSeperateDialog = () => {
    setSeperateDialog(!seperateDialog);
  };
  const toggleSuspendDialog = () => {
    setSuspendDialog(!suspendDialog);
  };
  async function deleteMemberHandler() {
    setLoading(true);
    const count = await deleteMember(member_id);

    setLoading(false);
    toggleConfirmDeleteDialog();
    router.back();
    toast.current.show({
      severity: "success",
      summary: "تم",
      detail: "تم حذف العضو",

      life: 3000,
    });
  }
  async function seperateMemberHandler() {
    setLoading(true);
    if (!seperateFees) {
      toast.current.show({
        severity: "error",
        summary: "خطأ",
        detail: "برجاء ملئ الحقول المطلوبة",
        life: 3000,
      });
      setLoading(false);
      return;
    }

    const membership = await seperateMember(
      member_id,
      seperateFees,
      JSON.parse(localStorage.clubUser).id,
      JSON.parse(localStorage.clubUser).safe_no
    );
    setMembershipData(membership.data);
    setLoading(false);
    toggleConfirmSeperateDialog();

    router.push(`club/members/${member_id}`);
    toast.current.show({
      severity: "success",
      summary: "تم",
      detail: "تم فصل العضو",

      life: 3000,
    });
  }
  const [loading, setLoading] = useState(false);
  const deleteDialogFooter = (
    <div style={{ textAlign: "left" }}>
      <Button
        label="نعم"
        icon="pi pi-check"
        iconPos="right"
        loading={loading}
        onClick={async () => {
          await deleteMemberHandler();
        }}
      />
      <Button
        label="لا"
        icon="pi pi-times"
        iconPos="right"
        onClick={toggleConfirmDeleteDialog}
      />
    </div>
  );
  const seperateDialogFooter = (
    <div style={{ textAlign: "left" }}>
      <Button
        label="نعم"
        icon="pi pi-check"
        iconPos="right"
        loading={loading}
        onClick={async () => {
          await seperateMemberHandler();
        }}
      />
      <Button
        label="لا"
        icon="pi pi-times"
        iconPos="right"
        onClick={toggleConfirmSeperateDialog}
      />
    </div>
  );
  ////////////////////////////////////////////////////////////////////////////
  const memberDetailsToolbarLeft = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          icon="pi pi-chevron-left"
          outlined
          onClick={() => router.back()}
        />

        <Button
          icon="pi pi-users"
          outlined
          onClick={() => router.replace("club/members")}
        />
        <Button
          label="تعديل البيانات"
          icon="pi pi-user-edit"
          iconPos="right"
          onClick={toggleUpdateDialog}
        />
        <Button
          label="طباعة الكارنيه"
          icon="pi pi-print"
          iconPos="right"
          onClick={togglePrintDialog}
        />
        <Button
          label="حذف"
          icon="pi pi-trash"
          iconPos="right"
          onClick={toggleConfirmDeleteDialog}
        />
        <Button
          label="إيقاف"
          icon="pi pi-exclamation-circle"
          iconPos="right"
          onClick={toggleSuspendDialog}
        />
        <Button
          label="فصل"
          icon="pi pi-link"
          iconPos="right"
          onClick={toggleConfirmSeperateDialog}
        />
      </div>
    );
  };

  const memberDetailsToolbarRight = () => {
    return (
      <>
        <h1 className="label_club">بيانات العضوية</h1>
      </>
    );
  };

  return (
    selectedMember && (
      <>
        {membershipData && (
          <PaymentReceipt
            member={selectedMember}
            membershipData={membershipData}
            ref={pageRef}
          />
        )}
        <Toast ref={toast} />

        <Dialog
          visible={deleteDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="إنتبه !"
          headerStyle={{ direction: "rtl" }}
          rtl={true}
          contentStyle={{ direction: "rtl" }}
          modal
          footer={deleteDialogFooter}
          onHide={toggleConfirmDeleteDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />

            <span>هل تريد حذف العضو ؟</span>
          </div>
        </Dialog>
        <Dialog
          visible={seperateDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="هل تريد فصل العضو ؟"
          headerStyle={{ direction: "rtl" }}
          rtl={true}
          contentStyle={{ direction: "rtl" }}
          modal
          footer={seperateDialogFooter}
          onHide={toggleConfirmSeperateDialog}
        >
          <div className="confirmation-content">
            <label htmlFor="seperate_fees">رسم فصل العضوية</label>
            <input
              id="seperate_fees"
              type="number"
              value={seperateFees}
              onChange={(e) => {
                setSeperateFees(Number(e.target.value));
              }}
            />
          </div>
        </Dialog>
        <Print
          toggleNewDialog={togglePrintDialog}
          newDialog={printDialog}
          url={`/api/print?ref=true&id=${selectedMember.id}`}
        />
        <SuspendMemberForm
          toggleNewDialog={toggleSuspendDialog}
          newDialog={suspendDialog}
          table="members_ref"
          handleReload={handleReloadMember}
          key={"s" + reloadKeyMember + 1}
          title="إيقاف العضو"
          method="update"
          values={selectedMember}
        />
        <UpdateRefMemberForm
          toggleNewDialog={toggleUpdateDialog}
          handleReload={handleReloadMember}
          key={reloadKeyMember + 1}
          newDialog={updateDialog}
          title="تعديل بيانات العضو"
          method="update"
          values={selectedMember}
        />
        <Toolbar
          left={memberDetailsToolbarLeft}
          right={memberDetailsToolbarRight}
        ></Toolbar>

        <RefMemberData selectedMember={selectedMember} />
        <Accordion activeIndex={0}>
          <AccordionTab
            header="العضو العامل التابع له"
            headerStyle={{ direction: "rtl" }}
          >
            <LazyTable
              key={reloadKeyMember}
              table="members"
              id="id"
              rows={5}
              filter={{
                member_code: selectedMember.member_code,
              }}
              include={{
                membership: {
                  where: { canceled: 0, secondary: 0 },
                  orderBy: {
                    end_date: "desc",
                  },
                  take: 1,
                  include: { rel_status: true },
                },
              }}
              columns={[
                {
                  field: "member_code",
                  header: "رقم العضوية",

                  dataType: "number",
                },
                {
                  field: "name",
                  header: "الاسم",

                  dataType: "string",
                },
                {
                  field: "national_id",
                  header: "الرقم القومي",
                  filter: false,

                  dataType: "string",
                },
                {
                  field: "membership.start_date",

                  header: "تاريخ البدء",
                  filter: false,

                  dataType: "date",
                },
                {
                  field: "membership.end_date",

                  header: "تاريخ الإنتهاء",
                  filter: false,

                  dataType: "date",
                },
                {
                  field: "membership.rel_status.name",

                  header: "الحالة",
                  filter: false,

                  dataType: "string",

                  tag: "membership.rel_status.tag",
                },
                {
                  field: "Actions",

                  header: "",
                  frozen: true,
                  alignFrozen: "left",
                  dataType: "custom",
                  btnText: "المزيد",
                  url: "club/members/",
                },
              ]}
            />
          </AccordionTab>
        </Accordion>
      </>
    )
  );
};

export default RefMemberDetails;
