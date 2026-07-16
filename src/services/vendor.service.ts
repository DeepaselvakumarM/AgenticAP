import { api } from "@/lib/api";

export const getVendors = async () => {
  const { data } =
    await api.get("/vendors");

  return data;
};

export const createVendor = async (
  payload: any
) => {
  const { data } =
    await api.post(
      "/vendors",
      payload
    );

  return data;
};

export const updateVendor = async (
  id: string,
  payload: any
) => {
  const { data } =
    await api.put(
      `/vendors/${id}`,
      payload
    );

  return data;
};

export const deleteVendor = async (
  id: string
) => {
  const { data } =
    await api.delete(
      `/vendors/${id}`
    );

  return data;
};

export const getVendorDashboard =
  async () => {
    const { data } =
      await api.get(
        "/vendor-dashboard"
      );

    return data;
  };