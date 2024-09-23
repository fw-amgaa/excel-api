import * as XLSX from "xlsx";

export function convertXlsxToObjects(
  file: Uint8Array
): Record<string, string>[] {
  // Read the XLSX file
  const workbook = XLSX.read(file, { type: "array" });

  // Assume we're working with the first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert the sheet to an array of arrays
  const data: string[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  // Extract headers (first row)
  const headers = data.shift();

  if (!headers) {
    throw new Error("The XLSX file is empty or has no headers.");
  }

  // Convert the rest of the data to objects
  return data
    .filter((row) =>
      row.some((cell) => cell !== undefined && cell !== null && cell !== "")
    ) // Filter out empty rows
    .map((row) => {
      const obj: Record<string, string> = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || ""; // Assign empty string if cell is undefined
      });
      return obj;
    });
}
