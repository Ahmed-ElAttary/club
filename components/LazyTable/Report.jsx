"use client";

import React, { useRef, useEffect, useState } from "react";
import ReactToPrint from "react-to-print";
import "./Report.styles.css";
import { getReportData } from "./report.js";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
const columnSum = (data, column) => {
  return parseFloat(
    data
      ?.filter((el) => {
        return el.canceled == 0;
      })
      .reduce((accumulator, currentValue) => {
        return accumulator + Number(currentValue[column]);
      }, 0)
      .toFixed(2)
  );
};
const Report = ({ member, lazyState, orderBy, include, filter }) => {
  const [data, setData] = useState();
  const membership = member?.membership[0];
  const handleGetReportData = async () => {
    const data2Report = await getReportData(
      lazyState,
      orderBy,
      include,
      filter
    );
    setData(data2Report);
  };
  useEffect(() => {
    (async () => {
      await handleGetReportData();
    })();
  }, []);
  const pageRef = useRef();
  const Receipt = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>رقم العضوية</th>
            <th>الاسم</th>
            <th>عضوية اول مرة</th>
            <th>رسم التحاق</th>
            <th>تجديد</th>
            <th>بطاقة عضوية</th>
            <th>سنوات سابقة</th>
            <th>غرامة تأخير</th>
            <th>قسط.ق.م</th>
            <th>فرق اشتراك</th>
            <th>اضافة تابع</th>
            <th>فصل/نقل عضوية</th>
            <th>رسم صيانة وانشاء</th>
            <th>إجمالي ق-ق</th>
            <th>قيمة مضافة</th>
            <th>الإجمالي</th>
            <th>إذن دفع رقم</th>
            <th>تاريخ الإذن</th>
            <th>رسم إشتراك السباحة</th>
            <th>الحالة</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((el, index) => {
            return (
              <tr key={index}>
                <td>{el.member_code}</td>
                <td style={{ whiteSpace: "nowrap" }}>{el.member?.name}</td>
                <td>{el.first_time_fee}</td>
                <td>{el.join_fee}</td>
                <td>{el.renew_fee}</td>
                <td>{el.membership_card_fee}</td>
                <td>{el.prev_years_fee}</td>
                <td>{el.delay_penalty}</td>
                <td>{el.installment}</td>
                <td>0</td>
                <td>{el.new_ref_fees}</td>
                <td>{el.seperate_fees}</td>
                <td>{el.maintenance_fee}</td>
                <td>{el.total_amount - el.value_added_tax}</td>
                <td>{el.value_added_tax}</td>
                <td>{el.total_amount}</td>
                <td>{String(el.safe_no) + String(el.serial_no)}</td>
                <td>{new Date(el.member_order_date).toLocaleDateString()}</td>
                <td>{el.swimming}</td>
                <td>{el.rel_canceled.name}</td>
              </tr>
            );
          })}
          <tr className="sum">
            <td colspan="2">الإجماليات</td>
            <td>{columnSum(data, "first_time_fee")}</td>
            <td>{columnSum(data, "join_fee")}</td>
            <td>{columnSum(data, "renew_fee")}</td>
            <td>{columnSum(data, "membership_card_fee")}</td>
            <td>{columnSum(data, "prev_years_fee")}</td>
            <td>{columnSum(data, "delay_penalty")}</td>
            <td>{columnSum(data, "installment")}</td>
            <td>0</td>
            <td>{columnSum(data, "new_ref_fees")}</td>
            <td>{columnSum(data, "seperate_fees")}</td>
            <td>{columnSum(data, "maintenance_fee")}</td>
            <td>
              {parseFloat(
                data
                  ?.filter((el) => {
                    return el.canceled == 0;
                  })
                  .reduce((accumulator, currentValue) => {
                    return (
                      accumulator +
                      Number(currentValue.total_amount) -
                      Number(currentValue.value_added_tax)
                    );
                  }, 0)
                  .toFixed(2)
              )}
            </td>
            <td>{columnSum(data, "value_added_tax")}</td>
            <td>{columnSum(data, "total_amount")}</td>
            <td></td>
            <td></td>
            <td>{columnSum(data, "swimming")}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    );
  };
  return (
    <>
      <ReactToPrint
        trigger={() => (
          <Button label="إستخراج تقرير" icon="pi pi-book" iconPos="right" />
        )}
        content={() => pageRef.current}
      />
      <div style={{ display: "none" }}>
        <div className="page" ref={pageRef} dir="rtl">
          <div className="receipt">
            <div>محافظة القاهرة</div>
            <div>وزارة الشباب والرياضة</div>
            <div>مركز التنمية الشبابية بالجزيرة</div>
            <div className="flex justify-content-center space-x-4">
              <div className="m-2">
                إحصائية خزينة رقم :{" "}
                {localStorage.clubUser &&
                  JSON.parse(localStorage.clubUser).safe_no}
              </div>
              <div className="m-2">
                اسم مسئول الخزينة :{" "}
                {localStorage.clubUser &&
                  JSON.parse(localStorage.clubUser).fullname}
              </div>
              <div className="m-2">{new Date().toLocaleDateString()}</div>
            </div>
            <Receipt />
            <div className="flex justify-between ">
              <div className="m-2">توقيع مسئول خزينة داخلية</div>
              <div className="m-2">توقيع مراجع الخزينة</div>
              <div className="m-2">توقيع رئيس قسم العضوية</div>
            </div>
            {}
          </div>
        </div>
      </div>
    </>
  );
};

export default Report;
