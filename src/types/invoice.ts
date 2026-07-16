export type InvoiceStatus =
  | "UPLOADED"
  | "PROCESSING"
  | "OCR_COMPLETE"
  | "PII_MASKED"
  | "EXTRACTION_COMPLETE"
  | "VALIDATION_COMPLETE"
  | "HUMAN_REVIEW"
  | "APPROVED"
  | "FAILED";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendor: string;
  uploadedAt: string;
  status: InvoiceStatus;
  confidenceScore: number;
  amount: number;
  currency: string;
}