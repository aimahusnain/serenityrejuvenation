/**
 * Export utility for generating Excel and CSV files from data
 */

export interface TransactionRow {
  serviceName: string;
  date: string;
  amount: number;
  status: string;
  clientName?: string;
}

/**
 * Convert data to CSV format and trigger download
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: Partial<Record<keyof T, string>>
): void {
  if (data.length === 0) {
    console.warn("No data to export");
    return;
  }

  // Get column keys from first row
  const keys = Object.keys(data[0]) as Array<keyof T>;

  // Create header row with custom headers if provided
  const headerRow = keys.map((key) =>
    headers?.[key] ? String(headers[key]) : String(key)
  );

  // Create data rows
  const dataRows = data.map((row) =>
    keys.map((key) => {
      const value = row[key];
      // Handle nested objects and special characters
      if (value === null || value === undefined) return "";
      const stringValue = String(value);
      // Escape quotes and wrap in quotes if contains comma or quote
      if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    })
  );

  // Combine headers and data
  const csvContent = [headerRow, ...dataRows]
    .map((row) => row.join(","))
    .join("\n");

  // Add BOM for Excel UTF-8 compatibility
  const BOM = "﻿";
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });

  // Create download link
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export transaction data to CSV with proper formatting
 */
export function exportTransactionsToCSV(
  transactions: TransactionRow[],
  filename: string = "transactions"
): void {
  const headers: Partial<Record<keyof TransactionRow, string>> = {
    serviceName: "Service",
    date: "Date",
    amount: "Amount ($)",
    status: "Status",
    clientName: "Client",
  };

  exportToCSV(transactions, filename, headers);
}

/**
 * Generate a simple HTML-based Excel file
 * Note: For complex Excel files, consider using a library like xlsx
 */
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  filename: string,
  sheetName: string = "Sheet1"
): void {
  if (data.length === 0) {
    console.warn("No data to export");
    return;
  }

  const keys = Object.keys(data[0]) as Array<keyof T>;

  // Create HTML table
  let table = "<table>";

  // Header row
  table += "<thead><tr>";
  keys.forEach((key) => {
    table += `<th style="background-color: #7a219f; color: white; padding: 8px; text-align: left;">${String(key)}</th>`;
  });
  table += "</tr></thead>";

  // Data rows
  table += "<tbody>";
  data.forEach((row, index) => {
    table += `<tr style="${index % 2 === 0 ? 'background-color: #f9f9f9;' : ''}">`;
    keys.forEach((key) => {
      const value = row[key];
      table += `<td style="padding: 8px; border: 1px solid #ddd;">${
        value === null || value === undefined ? "" : value
      }</td>`;
    });
    table += "</tr>";
  });
  table += "</tbody></table>";

  // Create HTML document
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        table { border-collapse: collapse; width: 100%; }
        td, th { font-family: Arial, sans-serif; font-size: 12px; }
      </style>
    </head>
    <body>${table}</body>
    </html>
  `;

  // Create blob and download
  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.xls`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Print a printable view of the data
 */
export function printData(data: any[], title: string = "Report"): void {
  const keys = Object.keys(data[0] || {});

  let content = `
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #7a219f; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th { background-color: #7a219f; color: white; padding: 10px; text-align: left; }
        td { padding: 8px; border: 1px solid #ddd; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p>Generated on ${new Date().toLocaleDateString()}</p>
      <table>
        <thead><tr>
  `;

  keys.forEach((key) => {
    content += `<th>${key}</th>`;
  });
  content += "</tr></thead><tbody>";

  data.forEach((row) => {
    content += "<tr>";
    keys.forEach((key) => {
      content += `<td>${row[key] ?? ""}</td>`;
    });
    content += "</tr>";
  });

  content += `
        </tbody>
      </table>
      <div class="footer">
        <p>Serenity Rejuvenation Med Spa - Admin Report</p>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  }
}
