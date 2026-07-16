import { api } from "@/lib/api";

export const uploadInvoice = async (
  file: File
) => {
  const formData = new FormData();

  formData.append("file", file);

  const { data } = await api.post(
    "/invoices",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return data;
};

export const getInvoices = async () => {
  const { data } = await api.get(
    "/invoices"
  );

  return data;
};

export const deleteInvoice = async (
  id: string
) => {
  const { data } = await api.delete(
    `/invoices/${id}`
  );

  return data;
};