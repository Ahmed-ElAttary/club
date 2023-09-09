"use server";
import prisma from "@app/api/db";

export async function getData(
  table,
  lazyState,
  orderBy,
  include,
  filter,
  columns,
  download
) {
  const { rows: take, first: skip, filters } = lazyState;

  let where = filter;
  let select;
  if (columns) {
    select = Object.fromEntries(
      columns.filter((item) => !item.includes(".")).map((key) => [key, true])
    );
  }

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
    // select,
    where,
    include,
    orderBy,
    take,
    skip,
  };
  download && delete options.take;
  download && delete options.skip;
  download && delete options.include;
  const data = await prisma[table].findMany(options);

  const totalRecords = await prisma[table].count({ where });

  return { data: JSON.stringify(data), totalRecords };
}
