import {
  degrees,
  PDFDocument,
  rgb,
  StandardFonts,
  PDFOperator,
  PDFFont,
} from "pdf-lib";
import { att_font } from "./font";
import fontkit from "@pdf-lib/fontkit";
import fs from "fs";
import path from "path";
import prisma from "@app/api/db";
import util from "util";
import { getImage } from "@components/Members/member";
const readFile = util.promisify(fs.readFile);
export async function GET(request) {
  // return new Response("hghgh");
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const ref = searchParams.get("ref");

  const existingPdfBytes = await readFile("public/card.pdf", (err) => {
    console.log("Error", err);
  });

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.setLanguage("ar-eg");

  // Embed the Helvetica font
  const TimesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  pdfDoc.registerFontkit(fontkit);

  const arabic = await pdfDoc.embedFont(att_font);

  const pages = pdfDoc.getPages();
  const page = pages[0];

  const query = await prisma[ref ? "members_ref" : "members"].findUnique({
    where: { id },
    include: { rel_member_type: { select: { name: true } } },
  });

  if (query) {
    let {
      member_code,
      serial_no,
      name,
      image_name,
      member_type,

      rel_member_type,
    } = query;

    async function embedType(folder, imageName) {
      const imageBase64 = await getImage(folder, imageName);
      const base64Data = await imageBase64.replace(
        `data:image/jpeg;base64,`,
        ""
      );
      const imageBuffer = await Buffer.from(base64Data, "base64");
      return await pdfDoc.embedJpg(imageBuffer);
    }
    const image1 = await embedType("members", member_code);

    if (ref) {
      const query = await prisma.members.findUnique({
        where: {
          member_code,
        },
      });

      const image2 = await embedType(
        "members-ref",
        `${member_code}-${serial_no}`
      );

      renderImages(image2, image1);
    } else {
      renderImages(image1, image1);
    }
    function renderImages(first, second) {
      page.drawImage(first, {
        x: 161,
        y: 267,
        width: 56,
        height: 79.5,
      });
      page.drawImage(second, {
        x: 224.1,
        y: 266.8,
        width: 10.5,
        height: 15.5,
      });
    }
    const label1 = `الاسم: ${name}`;
    const label2 = `رقم العضوية:`;

    const label3 = `نوع العضوية: ${rel_member_type.name}`;

    const labels = [label1, label2, label3];

    const textSize = 10;
    labels.forEach((el, index) => {
      page.drawText(el, {
        x: 382 - arabic.widthOfTextAtSize(el, textSize),
        y: 290 - (index - 1) * 27,
        size: textSize,

        font: arabic,
        color: rgb(0, 0, 0),
        rotate: degrees(0),
      });
    });

    page.drawText(String(member_code), {
      x: 320 - arabic.widthOfTextAtSize(String(member_code), textSize),
      y: 289,
      size: textSize,
      font: arabic,
      color: rgb(0, 0, 0),
      rotate: degrees(0),
    });
    const pdfBytes = await pdfDoc.save();

    return new Response(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
      },
    });
  }
  return new Response("No such member");
}
