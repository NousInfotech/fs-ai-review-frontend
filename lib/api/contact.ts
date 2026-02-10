// lib/sendFormData.ts

export interface FormPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const API_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_API_URL || "";

export async function sendFormData(payload: FormPayload): Promise<void> {
  if (!API_URL) {
    throw new Error("Google Script API URL is missing");
  }

  await fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  // Since mode is 'no-cors', we cannot read the response body or status.
  // The fetch will only throw on network errors.
  console.log("✅ Form data sent successfully (no-cors mode)");
}
