import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import prisma from "@app/api/db";

// export const config = {
//   api: {
//     bodyParser: false, // enable form data
//   },
// };

export async function POST(req, res) {
  try {
    const data = await req.formData();
    const file = await data.get("file");
    const id = await data.get("id");

    const bufferData = Buffer.from(await file.arrayBuffer());

    fs.writeFile(
      `public/uploads/member-photo/${id}${path.extname(file.name)}`,
      bufferData,
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
    const query = await prisma.members.update({
      where: { id },
      data: { image_name: `${id}${path.extname(file.name)}` },
    });

    return NextResponse.json({
      status: "success",
      message: "image successfully uploaded !",
    });
  } catch (err) {
    return NextResponse.json({
      status: "error",
      message: err.message,
    });
  }
}
