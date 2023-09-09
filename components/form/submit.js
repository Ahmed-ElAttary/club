import { createMember, createRefMember } from "@components/Members/member";
export default async (table, method, data, utils) => {
  const {
    fields,
    setLoading,
    toast,
    toggle,
    handleReload,
    setSelectedImage,
    selectedImage,
    router,
    selectedMember,
  } = utils;
  setLoading(true);
  const data2Send = {};

  fields
    .filter((field) => field.dataType !== "file")
    .forEach((field) => {
      if (field.dataType == "number" && data[field.id] == NaN) {
        data2Send[field.id] = null;
      }
      if (field.dataType == "date") {
        data2Send[field.id] = new Date(data[field.id]);
      } else if (field.dataType == "number") {
        !data[field.id]
          ? (data2Send[field.id] = null)
          : (data2Send[field.id] = Number(data[field.id]));
      } else {
        data2Send[field.id] = data[field.id];
      }
    });
  // console.log(data2Send);
  if (selectedImage) {
    const formData = new FormData();
    formData.append("file", selectedImage);
    data2Send.file = formData;
  }
  let res;
  if (table == "members_ref") res = await createRefMember(method, data2Send);
  if (table == "members") res = await createMember(method, data2Send);
  setLoading(false);
  toast.current.show({
    severity: res.status,
    summary: res.status,
    detail: res.message,
    life: 3000,
  });

  if (res.status == "success") {
    if (method == "update") {
      // router.push(`/members/${data2Send.id}`);
      window.location.reload();
    }
    if (method == "create") {
      if (table == "members_ref")
        router.push(`club/members/ref/${res.data.id}`);
      if (table == "members") router.push(`club/members/${res.data.id}`);
    }
    setSelectedImage();
    toggle();
    handleReload();
  }
};
