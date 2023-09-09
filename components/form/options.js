"use server";
import prisma from "@app/api/db";
export async function getOptions(table) {

  const data = await prisma[table].findMany({
    select: { code: true, name: true },
  });

  return data;
}
