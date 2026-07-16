export interface Vendor {
  id: string;
  vendorName: string;
  vendorCode: string;
  gstNumber: string;
  panNumber: string;
  email: string;
  phone: string;
  country: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  createdAt: string;
}