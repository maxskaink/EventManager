
import { toast } from "sonner";

/**
 * Downloads a list of emails as a text file.
 * @param emails List of email strings.
 * @param filename Optional filename (default: emails_YYYY-MM-DD.txt).
 */
export const exportEmailsToTxt = (emails: string[], filename?: string) => {
  if (!emails.length) {
    toast.error("No hay correos para exportar.");
    return;
  }

  // Filter unique and valid emails
  const uniqueEmails = [...new Set(emails.filter(Boolean))];

  if (uniqueEmails.length === 0) {
    toast.error("No hay correos válidos para exportar.");
    return;
  }

  // Create content: emails separated by commas and newlines
  const content = uniqueEmails.join(",\n");

  // Create Blob
  const blob = new Blob([content], { type: "text/plain" });

  // Create URL
  const url = window.URL.createObjectURL(blob);

  // Create temporary link and trigger download
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || `emails_${new Date().toISOString().split("T")[0]}.txt`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Revoke URL
  window.URL.revokeObjectURL(url);

  toast.success(`📥 Descargado: ${uniqueEmails.length} correos`);
};
