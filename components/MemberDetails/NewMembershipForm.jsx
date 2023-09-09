import React, { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { createMembership } from "@components/Members/member";
import { Toast } from "primereact/toast";

import Field from "@components/form/Field";
function isDifference21YearsOrMore(date1, date2) {
  const millisecondsInYear = 1000 * 60 * 60 * 24 * 365;
  const differenceInMilliseconds = Math.abs(date2 - date1);
  const differenceInYears = differenceInMilliseconds / millisecondsInYear;

  return differenceInYears >= 21;
}
const NewMembershipForm = ({
  newDialog,
  toggleNewDialog,
  handleReload,
  selectedMember,
}) => {
  const intialFields = [
    {
      id: "safe_no",
      name: "رقم الخزنة",
      fieldType: "input",
      dataType: "number",
      disabled: true,
      required: true,
    },
    {
      id: "member_code",
      name: "رقم العضوية",
      fieldType: "input",
      dataType: "text",
      disabled: true,
      required: true,
      value: selectedMember.member_code,
    },
    {
      id: "member_order_date",
      name: "تاريخ التجديد",
      fieldType: "input",
      dataType: "date",
      required: true,
    },
    {
      id: "start_date",
      name: "تاريخ البدء",
      fieldType: "input",
      dataType: "date",
      required: true,
    },

    {
      id: "end_date",
      name: "تاريخ الإنتهاء",
      fieldType: "input",
      dataType: "date",
      required: true,
    },
    {
      id: "renew_years",
      name: "سنوات التجديد",
      fieldType: "input",
      dataType: "number",
      required: true,
    },
    {
      id: "first_time_fee",
      name: "رسم إشتراك أول مرة",
      fieldType: "input",
      dataType: "number",
      required: true,
    },
    {
      id: "join_fee",
      name: "رسم إلتحاق",
      fieldType: "input",
      dataType: "number",
      required: true,
    },
    {
      id: "form_no",
      name: "رقم الاستمارة",
      fieldType: "input",
      dataType: "number",
      required: true,
    },
    {
      id: "membership_card_fee",
      name: "رسم بطاقة العضوية",
      fieldType: "input",
      dataType: "number",
      required: true,
    },
    {
      id: "maintenance_fee",
      name: "رسم صيانة وإنشاء",
      fieldType: "input",
      dataType: "number",
      required: true,
    },
    {
      id: "prev_years_fee",
      name: "سنوات سابقة",
      fieldType: "input",
      dataType: "number",
      required: true,
    },
    {
      id: "renew_fee",
      name: "رسم تجديد",
      fieldType: "input",
      dataType: "number",
      required: true,
    },

    {
      id: "delay_penalty",
      name: "غرامة تأخير",
      fieldType: "input",
      dataType: "number",
      required: true,
    },

    {
      id: "swimming",
      name: "رسم إشتراك سباحة",
      fieldType: "input",
      dataType: "number",
      required: true,
    },
    {
      id: "value_added_tax",
      name: "ضريبة القيمة المضافة",
      fieldType: "input",
      dataType: "number",
      disabled: true,
      required: true,
    },
    {
      id: "installment",
      name: "قسط قيمة مضافة",
      fieldType: "input",
      dataType: "number",
      disabled: false,
      required: true,
    },
    {
      id: "total_amount",
      name: "الإجمالي العام",
      fieldType: "input",
      dataType: "number",
      disabled: true,
      required: true,
    },
    {
      id: "remark",
      name: "ملاحظات",
      fieldType: "input",
      dataType: "text",
      required: false,
    },
    {
      id: "user_id",
      name: "user_id",
      fieldType: "input",
      dataType: "text",
      required: false,
      // disabled: true,
      hidden: true,
    },
  ];

  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([]);
  const [fieldsValues, setFieldsValues] = useState({});
  const [formReload, setFormReload] = useState(0);

  // useEffect(() => {
  //   console.log(fieldsValues);
  // }, [fieldsValues]);
  useEffect(() => {
    if (selectedMember) {
      // console.log(selectedMember);
      const values = {};
      values.safe_no = "";
      values.member_code = selectedMember.member_code;
      ////////////////**************safe no ********************//////////////////////////////////// */
      values.safe_no =
        localStorage.clubUser && JSON.parse(localStorage.clubUser).safe_no;
      /////////////////////////////////////////// swimming calculations ///////////////////
      values.swimming = 150;
      /////////////////////////////////////////// first time fee calculations ///////////////////
      values.first_time_fee = 0;
      values.join_fee = 0;
      values.installment = 0;

      ////////////////**************date calculations********************//////////////////////////////////// */
      values.member_order_date = new Date();

      // const startDateCheck = new Date(
      //   `${values.member_order_date.getFullYear()}-07-01`
      // );
      // const endDateCheck = new Date(
      //   `${values.member_order_date.getFullYear()}-12-31`
      // );

      // if (
      //   values.member_order_date >= startDateCheck &&
      //   values.member_order_date <= endDateCheck
      // ) {
      //   values.start_date = new Date(
      //     `${values.member_order_date.getFullYear()}-07-01`
      //   );
      // } else {
      //   values.start_date = new Date(
      //     `${values.member_order_date.getFullYear() - 1}-07-01`
      //   );
      // }
      values.start_date = new Date();
      values.end_date = new Date(
        `${values.start_date.getFullYear() + 1}-06-30`
      );
      /////////////////////////////////////////// renew years calculations ///////////////////

      const latency_years = selectedMember.membership[0]?.end_date
        ? values.start_date.getFullYear() -
          selectedMember.membership[0]?.end_date.getFullYear()
        : 0;
      values.renew_years = latency_years + 1;

      ///////////////////////////////////////////membership_card_fee calculations ///////////////////
      values.membership_card_fee =
        5 * values.renew_years * (selectedMember.rel_members.length + 1);
      ///////////////////////////////////////////maintenance_fee calculations ///////////////////
      const m_f_value = selectedMember.rel_members.length ? 100 : 50;

      if (values.renew_years > 3) values.maintenance_fee = 3 * m_f_value;
      else {
        values.maintenance_fee = values.renew_years * m_f_value;
      }
      ///////////////////////////////////////////renew fee calculations ///////////////////
      let member_renew;
      let total_ref_members_renew;
      if ([12, 14].includes(selectedMember.section)) {
        member_renew = 450;
        total_ref_members_renew = selectedMember.rel_members.reduce(
          (sum, member) => {
            return (
              sum +
              (isDifference21YearsOrMore(
                new Date(),
                new Date(member.birth_date)
              )
                ? 450
                : 350)
            );
          },
          0
        );
      } else {
        member_renew = selectedMember.rel_member_type.price;
        total_ref_members_renew = selectedMember.rel_members.reduce(
          (sum, member) => {
            return (
              sum +
              (isDifference21YearsOrMore(
                new Date(),
                new Date(member.birth_date)
              )
                ? 100
                : member.rel_ref.price)
            );
          },
          0
        );
      }

      if ([2, 22, 23].includes(selectedMember.section))
        values.renew_fee = 0.5 * (member_renew + total_ref_members_renew);
      else values.renew_fee = member_renew + total_ref_members_renew;
      values.prev_years_fee =
        latency_years * (member_renew + total_ref_members_renew);
      /////////////////////////////////////////// delay_penalty calculations ///////////////////
      if (latency_years == 0) values.delay_penalty = 0;
      if (latency_years == 1)
        values.delay_penalty = parseFloat((0.2 * values.renew_fee).toFixed(2));
      if (latency_years == 2)
        values.delay_penalty = parseFloat((0.7 * values.renew_fee).toFixed(2));
      if (latency_years >= 3)
        values.delay_penalty = parseFloat((1.4 * values.renew_fee).toFixed(2));

      /////////////////////////////////////////// value_added_tax calculations ///////////////////
      values.value_added_tax = parseFloat(
        (
          0.14 *
          (values.membership_card_fee +
            values.maintenance_fee +
            values.join_fee)
        ).toFixed(2)
      );

      /////////////////////////////////////////// total amount calculations ///////////////////
      values.total_amount =
        values.membership_card_fee +
        values.maintenance_fee +
        values.renew_fee +
        values.delay_penalty +
        values.value_added_tax +
        values.swimming +
        values.first_time_fee +
        values.join_fee +
        values.installment +
        values.prev_years_fee;
      values.user_id =
        localStorage.clubUser && JSON.parse(localStorage.clubUser).id;
      ////////////////*******************************************//////////////////////////////////// */
      Object.entries(values).forEach((val) => {
        if (val[1] === null) values[val[0]] = "";
        formik.setFieldValue(val[0], val[1]);
      });

      setFieldsValues(values);
    }

    setFields(intialFields);
  }, [formReload]);
  const toast = useRef(null);
  function toggle() {
    formik.handleReset;
    formik.resetForm();
    setFormReload(formReload + 1);
    toggleNewDialog();
  }
  const formik = useFormik({
    initialValues: fields.reduce((obj, field) => {
      if (field.dataType == "text") obj[field.id] = "";
      if (field.value) obj[field.id] = field.value;

      return obj;
    }, {}),
    validate: (data) => {
      let errors = {};
      fields.forEach((field) => {
        if (!data[field.id] && field.required) {
          if (field.dataType != "number") errors[field.id] = `هذا الحقل إجباري`;
        }
        if (
          field.dataType == "number" &&
          isNaN(data[field.id]) &&
          field.required
        ) {
          errors[field.id] = `هذا الحقل إجباري`;
        }
      });
      if (data.end_date <= data.start_date) {
        errors.end_date = "يجب ان يكون تاريخ الانتهاء بعد تاريخ البدء";
      }

      return errors;
    },
    onSubmit: async (data) => {
      setLoading(true);
      const res = await createMembership(data);
      setLoading(false);

      if (res.status == "success") {
        toggle();
        handleReload();
      }

      toast.current.show({
        severity: res.status,
        summary: res.status,
        detail: res.message,
        life: 3000,
      });
    },
  });

  const newDialogFooter = (
    <div style={{ textAlign: "left" }}>
      <Button
        label="إضافة"
        icon="pi pi-check"
        loading={loading}
        iconPos="right"
        onClick={() => {
          if (!formik.isValid) {
            toast.current.show({
              severity: "error",
              summary: "خطأ",
              detail: "برجاء ملئ/مراجعة الحقول المطلوبة",
              life: 3000,
            });
          }
          formik.handleSubmit();
        }}
        type="submit"
      />
      <Button
        label="إلغاء"
        iconPos="right"
        icon="pi pi-times"
        onClick={toggle}
      />
    </div>
  );

  const isFormFieldInvalid = (id) => {
    return formik.errors[id];
  };

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="p-error">{formik.errors[name]}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  const handleFileChange = (event) => {
    let values2Tax = {
      membership_card_fee: fieldsValues.membership_card_fee,
      maintenance_fee: fieldsValues.maintenance_fee,
      join_fee: fieldsValues.join_fee,
    };

    if (Object.keys(values2Tax).find((el) => el == event.target.id)) {
      values2Tax = { ...values2Tax, [event.target.id]: event.target.value };
    }

    const value_added_tax = parseFloat(
      (
        0.14 *
        (+values2Tax.membership_card_fee +
          +values2Tax.maintenance_fee +
          +values2Tax.join_fee)
      ).toFixed(2)
    );

    let values2Sum = {
      membership_card_fee: fieldsValues.membership_card_fee,
      maintenance_fee: fieldsValues.maintenance_fee,
      renew_fee: fieldsValues.renew_fee,
      delay_penalty: fieldsValues.delay_penalty,
      value_added_tax,
      swimming: fieldsValues.swimming,
      first_time_fee: fieldsValues.first_time_fee,
      join_fee: fieldsValues.join_fee,
      installment: fieldsValues.installment,
      prev_years_fee: fieldsValues.prev_years_fee,
    };
    if (Object.keys(values2Sum).find((el) => el == event.target.id)) {
      values2Sum = { ...values2Sum, [event.target.id]: event.target.value };
    }
    const total_amount = Object.values(values2Sum).reduce(
      (accumulator, currentValue) => accumulator + Number(currentValue),
      0
    );
    formik.setFieldValue("value_added_tax", value_added_tax);
    formik.setFieldValue("total_amount", total_amount);

    setFieldsValues({
      ...fieldsValues,
      [event.target.id]: event.target.value,
      value_added_tax,
      total_amount,
    });

    if (event.target.id == "image") {
      const file = event.target.files[0];
      setSelectedImage(file);
    }

    formik.handleChange(event);
  };
  return (
    <>
      <Toast ref={toast} />

      <Dialog
        visible={newDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="تجديد العضوية"
        headerStyle={{ direction: "rtl" }}
        rtl={true}
        contentStyle={{ direction: "rtl" }}
        modal
        footer={newDialogFooter}
        onHide={toggleNewDialog}
      >
        <div className="card flex justify-content-center">
          <form className="flex flex-column gap-2">
            <br />

            {fieldsValues &&
              fields.map((field) => {
                return (
                  <Field
                    key={field.id}
                    id={field.id}
                    name={field.name}
                    isFormFieldInvalid={isFormFieldInvalid}
                    getFormErrorMessage={getFormErrorMessage}
                    onChange={handleFileChange}
                    value={fieldsValues[field.id]}
                    fieldType={field.fieldType}
                    dataType={field.dataType}
                    disabled={field.disabled}
                    hidden={field.hidden}
                    required={field.required}
                  />
                );
              })}
          </form>
        </div>
      </Dialog>
    </>
  );
};

export default NewMembershipForm;
