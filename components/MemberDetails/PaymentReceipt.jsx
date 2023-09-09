"use client";

import React, { useRef, forwardRef, useEffect } from "react";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import "./PaymentReceipt.styles.css";

import { Button } from "primereact/button";
const PaymentReceipt = forwardRef(
  (
    {
      member,
      secondary,

      ref_member_id,
      membershipData,
    },
    ref
  ) => {
    const membership =
      membershipData ||
      member.membership.find(
        (el) =>
          el.status == 1 &&
          el.secondary == secondary &&
          el.ref_member_id == ref_member_id
      );

    const Receipt = () => {
      return (
        <div className="receipt">
          <div>محافظة القاهرة</div>
          <div>وزارة الشباب والرياضة</div>
          <div>مركز التنمية الشبابية بالجزيرة</div>
          <div className="flex justify-content-center">
            <div>
              اذن دفع رقم{" "}
              {String(membership?.safe_no) + String(membership?.serial_no)}
            </div>
          </div>
          <div className="flex justify-content-center">
            <div>رقم العضوية / {membership?.member_code}</div>
          </div>

          <div style={{ float: "left" }}>عضوية {member.member_type}</div>
          <div>الاسم / {member.name}</div>
          <br />
          <table>
            <thead>
              <tr>
                <td> </td>
                <td>عضوية اول مرة</td>
                <td>رسم التحاق</td>
                <td>تجديد</td>
                <td>بطاقة عضوية</td>
                <td>سنوات سابقة</td>
                <td>غرامة تأخير</td>
                <td>قسط.ق.م</td>
                <td>فرق اشتراك</td>
                <td>اضافة تابع</td>
                <td>فصل/نقل عضوية</td>
                <td>رسم صيانة وانشاء</td>
                <td>قيمة مضافة</td>

                <td>رسم إشتراك السباحة</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>القيمة</td>
                <td>{membership?.first_time_fee}</td>
                <td>{membership?.join_fee}</td>
                <td>{membership?.renew_fee}</td>
                <td>{membership?.membership_card_fee}</td>
                <td>{membership?.prev_years_fee}</td>
                <td>{membership?.delay_penalty}</td>
                <td>{membership?.installment}</td>
                <td>0</td>
                <td>{membership?.new_ref_fees}</td>
                <td>{membership?.seperate_fees}</td>
                <td>{membership?.maintenance_fee}</td>
                <td>{membership?.value_added_tax}</td>

                <td>{membership?.swimming}</td>
              </tr>
            </tbody>
          </table>
          <br />
          <div className="flex justify-between">
            <div>
              إجمالي قبل القيمة المضافة{"  "}
              {membership?.total_amount - membership?.value_added_tax}
            </div>

            <div>
              ضريبة قيمة مضافة {"  "}
              {membership?.value_added_tax}
            </div>
            <div>توقيع مسئول العضوية {"________"}</div>
          </div>
          <div className="flex justify-between">
            <div>الإجمالي العام {membership?.total_amount}</div>
            <div>توقيع المراجع {"________"}</div>
          </div>
          <div>
            تاريخ الإيصال{" "}
            {new Date(membership?.member_order_date).toLocaleDateString()}
          </div>
        </div>
      );
    };
    return (
      <>
        <div style={{ display: "none" }}>
          <div className="page" ref={ref} dir="rtl">
            <Receipt />
            <Receipt />
            <Receipt />
          </div>
        </div>
      </>
    );
  }
);

export default PaymentReceipt;
