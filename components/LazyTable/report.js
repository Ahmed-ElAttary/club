"use server";
import prisma from "@app/api/db";
export async function getReportData(lazyState, orderBy, include, filter) {
  const { rows: take, first: skip, filters } = lazyState;

  let where = filter;
  if (filters) {
    where = {
      ...where,
      ...Object.entries(filters).reduce((acc, [key, { value, matchMode }]) => {
        if (!(matchMode == "equals" && !value))
          acc[key] = { [matchMode]: value ?? "" };
        return acc;
      }, {}),
    };
  }
  // console.log("where", where);
  const options = {
    where,
    include,
    orderBy,
    take,
    skip,
  };
  delete options.take;
  delete options.skip;

  const data = await prisma.memberships.findMany(options);

  return data;
}
