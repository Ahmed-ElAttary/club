"use server";
const {
  first_time_fee_ACCOUNT,
  membership_card_fee_ACCOUNT,
  maintenance_fee_ACCOUNT,
  renew_fee_ACCOUNT,
  delay_penalty_ACCOUNT,
  swimming_ACCOUNT,
  value_added_tax_ACCOUNT,
  ERP_HOST,
} = process.env;
import prisma from "@app/api/db";
import fs from "fs";
import path from "path";
import util from "util";
import axios from "axios";
import { hostname } from "os";
const readFile = util.promisify(fs.readFile);
export async function deleteMember(id) {
  const query = await prisma.members_ref.update({
    where: {
      id,
    },
    data: {
      deleted: 1,
    },
  });
  return {
    status: "success",
    message: "deleted Successfully !",
    data: query,
  };
}
export async function suspendOutdatedMembers() {
  const query = await prisma.memberships.updateMany({
    where: {
      // start_date: { lt: new Date(`${new Date().getFullYear()}`) },
      end_date: { lt: new Date() },

      status: { not: 2 },
    },
    data: { status: 2 },
  });

  return query.count;
}

export async function cancelReciept(id) {
  await prisma.memberships.updateMany({
    where: { OR: [{ id }, { related_membership: id }] },
    data: { canceled: 1 },
  });
}

export async function seperateMember(id, seperateFees, userID, safeNo) {
  try {
    const data = await prisma.members_ref.findUnique({ where: { id } });
    const {
      name,
      sex,
      birth_date,
      remark,
      join_date,
      user_id,
      serial_no,
      member_code,
    } = data;

    const imageName = `${member_code}-${serial_no}.jpg`;

    const createdMember = await createMember("create", {
      id,
      name,
      member_type: 5,
      sex,
      birth_date,
      remark,
      join_date,
      user_id,
    });
    const membershipData = await createMembership({
      seperate_fees: seperateFees,
      safe_no: safeNo,
      user_id: userID,
      member_code: createdMember.data.member_code,
      total_amount: seperateFees,
      secondary: 4,
      status: 3,
    });
    const imageNewName = `${createdMember.data.member_code}.jpg`;

    await moveImage(imageName, imageNewName);

    await prisma.members_ref.delete({ where: { id } });
    return membershipData;
  } catch (err) {
    console.log(err.message);
    return { status: "error", message: err.message };
  }
}

export async function moveImage(imageName, imageNewName) {
  try {
    const imagePath = `public/uploads/photos/members-ref/${imageName}`;
    const imageNewPath = `public/uploads/photos/members/${imageNewName}`;

    fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.log("File does not exist");
      } else {
        fs.rename(imagePath, imageNewPath, (moveErr) => {
          if (moveErr) {
            console.error("Error moving file:", moveErr);
          } else {
            console.log("File moved successfully");
          }
        });
      }
    });
  } catch (err) {
    console.log(err.message);
    return { status: "error", message: err.message };
  }
}
export async function seperateDead(
  selectedMember,
  selectedRefMember,
  seperateFees,
  userID,
  safeNo
) {
  const {
    id,
    name,
    sex,
    birth_date,
    remark,
    join_date,
    user_id,
    serial_no,
    member_code,
  } = selectedRefMember;
  await prisma.members.update({
    where: { id: selectedMember.id },
    data: {
      id,
      name,
      member_type: 5,
      sex,
      birth_date,
      remark,
      join_date,
      user_id,
    },
  });

  const membershipData = await createMembership({
    seperate_fees: seperateFees,
    safe_no: safeNo,
    user_id: userID,
    member_code,
    total_amount: seperateFees,
    secondary: 3,
    status: 3,
  });
  await prisma.members_ref.delete({ where: { id } });
  const imageName = `${member_code}-${serial_no}.jpg`;
  const imageNewName = `${member_code}.jpg`;

  await moveImage(imageName, imageNewName);
  return membershipData;
}

export async function createMember(method, data) {
  try {
    const { file } = data;
    delete data.file;

    if (method == "create") {
      const getMaxMemberCode = await prisma.members.aggregate({
        _max: {
          member_code: true,
        },
      });
      const maxMemberCode = getMaxMemberCode._max.member_code;

      data.member_code = maxMemberCode + 1;

      const query = await prisma.members.create({
        data,
      });
      if (file) await setImage(query.member_code, file, `members`);
      return {
        status: "success",
        message: "Created Successfully !",
        data: query,
      };
    }
    const { id } = data;
    const query = await prisma.members.update({
      where: { id },
      data,
    });
    if (file) await setImage(query.member_code, file, `members`);
    return {
      status: "success",
      message: "Updated Successfully !",
      data: query,
    };
  } catch (err) {
    console.log(err.message);
    return { status: "error", message: err.message };
  }
}
export async function createRefMember(method, data) {
  try {
    const { file, member_code, new_ref_fees, safe_no, user_id } = data;
    delete data.file;
    delete data.new_ref_fees;
    delete data.safe_no;
    if (method == "create") {
      const getMaxSerial = await prisma.members_ref.aggregate({
        _max: {
          serial_no: true,
        },
        where: { member_code },
      });
      const maxSerial = getMaxSerial._max.serial_no;
      data.serial_no = maxSerial + 1;
      const query = await prisma.members_ref.create({
        data,
      });
      await createMembership({
        new_ref_fees,
        safe_no,
        user_id,
        member_code,
        total_amount: new_ref_fees,
        ref_member_id: query.id,
        secondary: 2,
        status: 3,
      });
      if (file)
        await setImage(
          `${query.member_code}-${query.serial_no}`,
          file,
          `members-ref`
        );

      return {
        status: "success",
        message: "Created Successfully !",
        data: query,
      };
    }
    const { id } = data;
    const query = await prisma.members_ref.update({
      where: { id },
      data,
    });
    if (file)
      await setImage(
        `${query.member_code}-${query.serial_no}`,
        file,
        `members-ref`
      );
    return {
      status: "success",
      message: "Updated Successfully !",
      data: query,
    };
  } catch (err) {
    console.log(err.message);
    return { status: "error", message: err.message };
  }
}

export async function setImage(imageName, form, folder) {
  const file = await form.get("file");
  try {
    const bufferData = Buffer.from(await file.arrayBuffer());
    fs.writeFile(
      `public/uploads/photos/${folder}/${imageName}.jpg`,
      bufferData,
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
    // await prisma[table].update({
    //   where: { id },
    //   data: { image_name: `${id}${path.extname(file.name)}` },
    // });

    return {
      status: "success",
      message: "image successfully uploaded !",
    };
  } catch (err) {
    return {
      status: "error",
      message: err.message,
    };
  }
}

export async function getImage(folder, imageName) {
  const filePath = `public/uploads/photos/${folder}/${imageName}.jpg`;
  try {
    const image = await readFile(filePath, "base64");
    return `data:image/jpeg;base64,${image}`;
  } catch (err) {
    const image = await readFile("public/profile.jpg", "base64");
    return `data:image/jpeg;base64,${image}`;
  }
}

export async function getMember(id) {
  const query = await prisma.members.findUnique({
    where: { id },
    include: {
      membership: {
        orderBy: {
          end_date: "desc",
        },
        where: { canceled: 0 },
        // take: 1,
        include: { rel_status: true },
      },
      rel_members: {
        include: { rel_ref: true },
      },
      rel_member_type: { select: { name: true, price: true } },
      rel_area: { select: { name: true } },
      rel_job: { select: { name: true } },
      rel_marital_status: { select: { name: true } },
      rel_city: { select: { name: true } },
      rel_nationality: { select: { name: true } },
      rel_qual: { select: { name: true } },

      rel_religion: { select: { name: true } },
      rel_section: { select: { name: true } },
      rel_sex: { select: { name: true } },
      rel_trans: { select: { name: true } },
    },
  });
  return query;
}
export async function getRefMember(id) {
  const query = await prisma.members_ref.findUnique({
    where: { id },
    include: {
      rel_member_type: { select: { name: true } },

      rel_ref: true,

      rel_sex: { select: { name: true } },
    },
  });
  return query;
}
export async function getMembership(id) {
  const query = await prisma.memberships.findUnique({
    where: { id },
    include: { member: true },
  });
  return query;
}

export async function createMembership(data) {
  try {
    const query = await prisma.memberships.create({
      data,
    });

    // syncERP(query);
    return {
      status: "success",
      message: "Created Successfully !",
      data: query,
    };
  } catch (err) {
    console.log(err.message);
    return { status: "error", message: err.message };
  }
}
async function syncERP(data) {
  try {
    let headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
    };

    const {
      safe_no,
      serial_no,
      member_order_date,
      remark,
      first_time_fee,
      membership_card_fee,
      maintenance_fee,
      renew_fee,
      delay_penalty,
      swimming,
      value_added_tax,
      total_amount,
    } = data;

    let bodyContent = JSON.stringify({
      ref: String(safe_no) + String(serial_no),
      note: remark || "",
      account_items: [
        {
          account_id: total_amount,
          credit: total_amount,
        },
        {
          account_id: await accountID(first_time_fee_ACCOUNT),
          debit: first_time_fee,
        },
        {
          account_id: await accountID(membership_card_fee_ACCOUNT),
          debit: membership_card_fee,
        },
        {
          account_id: await accountID(maintenance_fee_ACCOUNT),
          debit: maintenance_fee,
        },
        {
          account_id: await accountID(renew_fee_ACCOUNT),
          debit: renew_fee,
        },
        {
          account_id: await accountID(delay_penalty_ACCOUNT),
          debit: delay_penalty,
        },
        {
          account_id: await accountID(swimming_ACCOUNT),
          debit: swimming,
        },
        {
          account_id: value_added_tax_ACCOUNT,
          debit: value_added_tax,
        },
      ],
      currency: "1",
      created_date: member_order_date,
    });

    let reqOptions = {
      url: `${ERP_HOST}/journal/create/`,
      method: "POST",
      headers: headersList,
      data: bodyContent,
    };

    let response = await axios.request(reqOptions);
    if (response.data.status) {
      const query = await prisma.memberships.update({
        where: {
          id: data.id,
        },
        data: {
          is_synced: 1,
        },
      });
    }
    console.log(response.data);
  } catch (err) {
    console.log("erp create journal", err.message);
    return { status: "error", message: err.message };
  }
}
async function accountID(code) {
  try {
    let headersList = {
      Accept: "*/*",
    };

    let reqOptions = {
      url: `${ERP_HOST}/api/account_items_list?code=${code}`,
      method: "GET",
      headers: headersList,
    };

    let response = await axios.request(reqOptions);
    return response.data.result[0].id;
  } catch (err) {
    console.log("erp get account_id", err.message);
    return { status: "error", message: err.message };
  }
}
async function login(login, password, db) {
  try {
    let headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
    };

    let bodyContent = JSON.stringify({
      jsonrpc: "2.0",
      params: { db, login, password },
    });

    let reqOptions = {
      url: `${ERP_HOST}/web/session/authenticate`,
      method: "POST",
      headers: headersList,
      data: bodyContent,
    };

    let response = await axios.request(reqOptions);
    return response.data;
  } catch (err) {
    console.log("erp Login", err.message);
    return { status: "error", message: err.message };
  }
}
async function test_login() {
  try {
    let headersList = {
      Accept: "*/*",
    };

    let reqOptions = {
      url: `${ERP_HOST}/my_services_api/ping/?message=test%20login`,
      method: "GET",
      headers: headersList,
    };

    let response = await axios.request(reqOptions);
    return response.data;
  } catch (err) {
    console.log("erp test Login", err.message);
    return { status: "error", message: err.message };
  }
}
/////////////////////////// REQUEST ///////////////////////////////
//   {
//     "ref":"att",
//     "note":"note for any thing will be here ",
//     "account_items": [
//     {
//         "account_id": 3275,
//         "debit": 100.0

//     }
//     ,
//      {
//         "account_id": 3276,
//         "debit": 100.0

//     }
// ]
// ,
//     "currency":"1",
//     "created_date":"2020-01-01"

// }
//////////////////////////RESPONSE////////////////////////////

// {
//   "result": 30,
//   "Status": true
// }
