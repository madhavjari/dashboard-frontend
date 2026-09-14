import { MANUAL_PAYMENTS_URL } from "../../config/reportUrls";

async function parseResponse(response) {
  const payload = await response.json().catch(() => ({}));
  if (response.ok) return payload;

  const validationMessage = Object.values(payload.errors ?? {})
    .flat()
    .find(Boolean);
  throw new Error(
    validationMessage || payload.message || "Unable to update this payment",
  );
}

export async function createManualPayment(accessToken, payment) {
  const response = await fetch(MANUAL_PAYMENTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payment),
  });
  return parseResponse(response);
}

export async function cancelManualPayment(accessToken, paymentId) {
  const response = await fetch(`${MANUAL_PAYMENTS_URL}/${paymentId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return parseResponse(response);
}
