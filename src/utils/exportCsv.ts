import {
  mkConfig,
  generateCsv,
  download,
} from "export-to-csv";

export const exportCsv = (
  data: Record<string, unknown>[],
  filename: string
) => {
  const csvConfig = mkConfig({
    filename,
    useKeysAsHeaders: true,
  });

  const csv = generateCsv(csvConfig)(data);

  download(csvConfig)(csv);
};