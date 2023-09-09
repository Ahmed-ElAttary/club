"use client";
import React, { useState, useRef, useEffect, createRef } from "react";

import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";

import { Toast } from "primereact/toast";
import NewMembershipForm from "./NewMembershipForm";
import NewSwimmingForm from "./NewSwimmingForm";
import UpdateMemberForm from "@components/MemberDetails/UpdateMemberForm";
import { Accordion, AccordionTab } from "primereact/accordion";
import Print from "@components/printPdf/Print";
import { getMember } from "@components/Members/member";
import RelatedMember from "@components/RelatedMember/RelatedMember";
import MembershipList from "@components/MemberDetails/MembershipList";
import { useRouter } from "next/navigation";

import MemberData from "./MemberData";
import PaymentReceipt from "./PaymentReceipt";
import SuspendMemberForm from "./SuspendMemberForm";
import SeperateDead from "./SeperateDead";
import { useReactToPrint } from "react-to-print";
const MemberDetails = ({ member_id }) => {
  const allPageRef = createRef();
  const swimmingPageRef = createRef();
  const handleAllPrint = useReactToPrint({
    content: () => allPageRef.current,
  });
  const handleSwimmingPrint = useReactToPrint({
    content: () => swimmingPageRef.current,
  });
  const router = useRouter();
  const toast = useRef(null);
  const [newSwimmingDialog, setNewSwimmingDialog] = useState(false);
  const [newMembershipDialog, setNewMembershipDialog] = useState(false);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [printDialog, setPrintDialog] = useState(false);
  const [suspendDialog, setSuspendDialog] = useState(false);
  const [seperateDeadDialog, setseperateDeadDialog] = useState(false);
  const [reloadKeyMembership, setReloadKeyMembership] = useState("membership");
  const [reloadKeyMember, setReloadKeyMember] = useState("member");
  const [selectedMember, setSelectedMember] = useState();
  const [reload, setReload] = useState(1);
  const handleReload = () => {
    setReload(reload + 1);
  };
  // const [selectedMembership, setSelectedMembership] = useState();
  useEffect(() => {
    (async () => {
      const member = await getMember(member_id);
      // const membership = await getMembership(member.membership);
      // setSelectedMembership(membership);
      setSelectedMember(member);
      // console.log(member);
      // console.log(
      //   member.membership?.some((el) => {
      //     return el.status == 1 && el.swimming == 0 && el.secondary == 0;
      //   })
      // );
    })();
  }, [reloadKeyMember, reloadKeyMembership, reload]);
  const toggleSuspendDialog = () => {
    setSuspendDialog(!suspendDialog);
  };
  const toggleSeperateDeadDialog = () => {
    setseperateDeadDialog(!seperateDeadDialog);
  };
  function handleReloadMembership() {
    setReloadKeyMembership((prevKey) => prevKey + 1);
  }
  function handleReloadMember() {
    setReloadKeyMember((prevKey) => prevKey + 1);
  }

  const toggleNewMembershipDialog = () => {
    setNewMembershipDialog(!newMembershipDialog);
  };
  const toggleNewSwimmingDialog = () => {
    setNewSwimmingDialog(!newSwimmingDialog);
  };
  const toggleUpdateDialog = () => {
    setUpdateDialog(!updateDialog);
  };
  /////////////////////////////////////////////////////////////////////////////
  const togglePrintDialog = async () => {
    setPrintDialog(!printDialog);
    // window.open(`/api/print?id=${member_id}`);
    // const blob = await axios.get(
    //   `/api/print?member_id=${selectedMember.member_id}`,
    //   {
    //     responseType: "blob",
    //   }
    // );
  };
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
          label="إيقاف العضو"
          icon="pi pi-exclamation-circle"
          iconPos="right"
          onClick={toggleSuspendDialog}
        />
        <Button
          label="فصل العضو ونقل العضوية"
          icon="pi pi-arrow-right-arrow-left"
          iconPos="right"
          onClick={toggleSeperateDeadDialog}
        />
      </div>
    );
  };
  const membershipDetailsToolbarLeft = () => {
    return (
      <>
        <Button
          label="تجديد العضوية"
          icon="pi pi-plus"
          iconPos="right"
          onClick={toggleNewMembershipDialog}
          disabled={selectedMember.membership?.some((el) => {
            return el.status == 1 && el.secondary == 0;
          })}
          visible={JSON.parse(localStorage.clubUser).safe_no ? true : false}
        />
        <Button
          label="تجديد إشتراك سباحة"
          icon="pi pi-plus"
          iconPos="right"
          onClick={toggleNewSwimmingDialog}
          disabled={
            selectedMember.membership?.every((el) => el.secondary != 0) ||
            selectedMember.membership?.some(
              (el) => el.status == 1 && el.swimming > 0
            ) ||
            selectedMember.membership?.every((el) => el.status != 1)
          }
          visible={JSON.parse(localStorage.clubUser).safe_no ? true : false}
        />
      </>
    );
  };
  const memberDetailsToolbarRight = () => {
    return (
      <>
        <h1 className="label_club">بيانات العضوية</h1>
      </>
    );
  };
  const membershipDetailsToolbarRight = () => {
    return (
      <>
        <Button
          label="إيصال دفع"
          icon="pi pi-credit-card"
          iconPos="right"
          onClick={handleAllPrint}
          disabled={
            !selectedMember.membership?.some((el) => {
              return el.status == 1 && el.secondary == 0 && el.canceled == 0;
            })
          }
        />
        <Button
          label="إيصال إشتراك السباحة"
          icon="pi pi-credit-card"
          iconPos="right"
          onClick={handleSwimmingPrint}
          disabled={
            !selectedMember.membership?.some((el) => {
              return el.status == 1 && el.secondary == 1 && el.canceled == 0;
            })
          }
        />
      </>
    );
  };

  return (
    selectedMember &&
    reload && (
      <>
        <PaymentReceipt
          member={selectedMember}
          secondary={0}
          ref={allPageRef}
        />
        <PaymentReceipt
          member={selectedMember}
          secondary={1}
          ref={swimmingPageRef}
        />
        <Toast ref={toast} />

        <Print
          toggleNewDialog={togglePrintDialog}
          newDialog={printDialog}
          url={`/api/print?&id=${selectedMember.id}`}
        />

        <NewMembershipForm
          toggleNewDialog={toggleNewMembershipDialog}
          handleReload={handleReloadMembership}
          newDialog={newMembershipDialog}
          selectedMember={selectedMember}
        />

        <NewSwimmingForm
          toggleNewDialog={toggleNewSwimmingDialog}
          handleReload={handleReloadMembership}
          newDialog={newSwimmingDialog}
          selectedMember={selectedMember}
        />
        <SuspendMemberForm
          toggleNewDialog={toggleSuspendDialog}
          newDialog={suspendDialog}
          table="members"
          handleReload={handleReloadMember}
          key={"s" + reloadKeyMember + 1}
          title="إيقاف العضو"
          method="update"
          values={selectedMember}
        />
        <SeperateDead
          toggleNewDialog={toggleSeperateDeadDialog}
          newDialog={seperateDeadDialog}
          handleReload={handleReloadMember}
          key={"ss" + reloadKeyMember + 1}
          title="فصل العضو ونقل العضوية إلي"
          selectedMember={selectedMember}
          
        />
        <UpdateMemberForm
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

        <MemberData selectedMember={selectedMember} />
        <Accordion activeIndex={0}>
          <AccordionTab
            header="سجل التجديدات"
            headerStyle={{ direction: "rtl" }}
            key={reloadKeyMembership}
          >
            <Toolbar
              left={membershipDetailsToolbarLeft}
              right={membershipDetailsToolbarRight}
            ></Toolbar>
            <div>
              <MembershipList
                selectedMember={selectedMember}
                handleReload={handleReload}
                reload={reload}
              />
            </div>
          </AccordionTab>
          <AccordionTab
            header="الاعضاء التابعة"
            headerStyle={{ direction: "rtl" }}
          >
            <RelatedMember selectedMember={selectedMember} />
          </AccordionTab>
        </Accordion>
      </>
    )
  );
};

export default MemberDetails;
