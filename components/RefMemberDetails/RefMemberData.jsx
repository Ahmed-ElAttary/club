import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { getImage } from "@components/Members/member";
const RefMemberData = ({ selectedMember }) => {
  const {
    rel_member_type,
    name,

    member_code,
    birth_date,

    rel_ref,
    suspended,
    rel_sex,
    serial_no,
    join_date,
    remark,
    member_order_date,
  } = selectedMember;
  const [image, setImage] = useState();

  useEffect(() => {
    (async () => {
      setImage(await getImage("members-ref", `${member_code}-${serial_no}`));
      // console.log(selectedMember);
    })();
  }, []);

  return (
    <div
      dir="rtl"
      style={{
        border: "5px solid var(--mainColor)",
        borderRadius: "12px",
        background: "var(--gardientMinColor)",
      }}
    >
      <div className="card flex justify-content-center">
        <img
          alt="photo"
          style={{
            maxHeight: "15rem",
            height: "15rem",
            width: "auto",
            borderRadius: "12px",
            marginTop: "1rem",
            marginBottom: "1rem",
            border: "5px solid var(--mainColor)",
          }}
          src={image}
        />
      </div>
      <div>
        <div className="card flex flex-column md:flex-row">
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">الاسم</span>
            <InputText disabled value={name || ""} />
          </div>
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">تاريخ الميلاد</span>
            <InputText
              disabled
              value={new Date(birth_date).toLocaleDateString()}
            />
          </div>
        </div>
        <div className="card flex flex-column md:flex-row">
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">رقم العضوية</span>
            <InputText disabled value={member_code || ""} />
          </div>
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">نوع العضوية</span>
            <InputText disabled value={rel_ref?.member_type || ""} />
          </div>
        </div>
        <div className="card flex flex-column md:flex-row">
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">تاريخ الإلتحاق</span>
            <InputText
              disabled
              value={new Date(join_date).toLocaleDateString()}
            />
          </div>
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">الجنس</span>
            <InputText disabled value={rel_sex?.name || ""} />
          </div>
        </div>

        <div className="card flex flex-column md:flex-row">
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">صلة القرابة</span>
            <InputText disabled value={rel_ref?.name || ""} />
          </div>
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">ترتيبه</span>
            <InputText disabled value={serial_no || ""} />
          </div>
        </div>
        <div className="card flex flex-column md:flex-row">
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">الحالة</span>
            <InputText disabled value={suspended || ""} />
          </div>
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">ملاحظات</span>
            <InputText disabled value={remark || ""} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefMemberData;
