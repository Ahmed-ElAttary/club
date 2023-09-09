"use server";
import prisma from "@app/api/db";
export const login = async (userName, password) => {
  const query = await prisma.users.findMany({
    where: { name: userName, password },
  });
  return query[0];
};
export async function getClubName() {
  "use server";
  return process.env["club"];
}
