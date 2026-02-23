/**
 * PayPal API Utilities (Server-Only)
 *
 * - OAuth2 access token exchange with caching
 * - Webhook signature verification via PayPal's API
 */

// --- Configuration ---

const PAYPAL_API_URL =
  process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

// --- Token Cache ---

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

/**
 * Get a PayPal OAuth2 access token.
 * Caches the token until 60s before expiry.
 */
export async function getPayPalAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;

  if (!clientId || !secret) {
    throw new Error("PayPal credentials not configured");
  }

  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PayPal OAuth2 token request failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  // Expire 60s early to avoid edge-case failures
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;

  return cachedToken!;
}

// --- Webhook Verification ---

/**
 * Verify a PayPal webhook signature by calling PayPal's
 * POST /v1/notifications/verify-webhook-signature endpoint.
 *
 * @returns `true` if the signature is valid, `false` otherwise.
 */
export async function verifyWebhookSignature(
  headers: Headers,
  rawBody: string
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  if (!webhookId) {
    console.error("PAYPAL_WEBHOOK_ID is not configured — rejecting webhook");
    return false;
  }

  const transmissionId = headers.get("paypal-transmission-id");
  const transmissionTime = headers.get("paypal-transmission-time");
  const transmissionSig = headers.get("paypal-transmission-sig");
  const certUrl = headers.get("paypal-cert-url");
  const authAlgo = headers.get("paypal-auth-algo");

  if (!transmissionId || !transmissionTime || !transmissionSig || !certUrl || !authAlgo) {
    console.warn("Missing PayPal verification headers");
    return false;
  }

  try {
    const accessToken = await getPayPalAccessToken();

    const verifyResponse = await fetch(
      `${PAYPAL_API_URL}/v1/notifications/verify-webhook-signature`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          auth_algo: authAlgo,
          cert_url: certUrl,
          transmission_id: transmissionId,
          transmission_sig: transmissionSig,
          transmission_time: transmissionTime,
          webhook_id: webhookId,
          webhook_event: JSON.parse(rawBody),
        }),
      }
    );

    if (!verifyResponse.ok) {
      const errorText = await verifyResponse.text();
      console.error("PayPal verification API error:", verifyResponse.status, errorText);
      return false;
    }

    const result = await verifyResponse.json();
    return result.verification_status === "SUCCESS";
  } catch (error) {
    console.error("PayPal webhook verification error:", error);
    return false;
  }
}

// --- Subscription Management ---

interface PayPalPricingScheme {
  fixed_price?: {
    value: string;
    currency_code: string;
  };
}

interface PayPalBillingCycle {
  tenure_type: "REGULAR" | "TRIAL";
  pricing_scheme?: PayPalPricingScheme;
}

interface PayPalPlanDetails {
  id: string;
  name: string;
  billing_cycles?: PayPalBillingCycle[];
}

export async function getPayPalPlanDetails(planId: string) {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_API_URL}/v1/billing/plans/${planId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`PayPal get plan details error (${planId}):`, response.status, text);
      return null;
    }

    const data = (await response.json()) as PayPalPlanDetails;
    
    // Extract price from the active billing cycle
    const regularCycle = data.billing_cycles?.find(
      (cycle) => cycle.tenure_type === "REGULAR"
    );
    
    if (regularCycle?.pricing_scheme?.fixed_price) {
      return {
        value: regularCycle.pricing_scheme.fixed_price.value,
        currency: regularCycle.pricing_scheme.fixed_price.currency_code
      };
    }
    
    return null;
  } catch (error) {
    console.error("PayPal get plan details error:", error);
    return null;
  }
}

/**
 * Cancel a PayPal subscription via the Billing API.
 */
export async function cancelPayPalSubscription(
  subscriptionId: string,
  reason?: string
): Promise<{ error?: string }> {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}/cancel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          reason: reason || "User requested cancellation",
        }),
      }
    );

    // PayPal returns 204 No Content on success
    if (!response.ok && response.status !== 204) {
      const text = await response.text();
      console.error("PayPal cancel subscription error:", response.status, text);
      return { error: `PayPal API error: ${response.status}` };
    }

    return {};
  } catch (error) {
    console.error("PayPal cancel subscription error:", error);
    return { error: "Failed to cancel subscription with PayPal" };
  }
}

/**
 * Revise a PayPal subscription to switch to a different plan.
 * Returns an approval URL that the user must visit to confirm the change.
 */
export async function revisePayPalSubscription(
  subscriptionId: string,
  newPlanId: string
): Promise<{ approvalUrl?: string; error?: string }> {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}/revise`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          plan_id: newPlanId,
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("PayPal revise subscription error:", response.status, text);
      return { error: `PayPal API error: ${response.status}` };
    }

    const data = await response.json();

    // PayPal returns HATEOAS links — find the approval URL
    const approvalLink = data.links?.find(
      (link: { rel: string; href: string }) => link.rel === "approve"
    );

    return { approvalUrl: approvalLink?.href };
  } catch (error) {
    console.error("PayPal revise subscription error:", error);
    return { error: "Failed to revise subscription with PayPal" };
  }
}

/**
 * Fetch subscription details from PayPal.
 */
export async function getPayPalSubscriptionDetails(subscriptionId: string) {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error(`PayPal get subscription details error (${subscriptionId}):`, response.status, text);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("PayPal get subscription details error:", error);
    return null;
  }
}
