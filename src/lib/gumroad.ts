const GUMROAD_API = "https://api.gumroad.com/v2";

function getAccessToken(): string {
  const token = process.env.GUMROAD_ACCESS_TOKEN;
  if (!token) throw new Error("GUMROAD_ACCESS_TOKEN not set");
  return token;
}

function getStoreId(): string | null {
  return process.env.NEXT_PUBLIC_GUMROAD_STORE_ID || null;
}

export function isGumroadConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_GUMROAD_STORE_ID && !!process.env.GUMROAD_ACCESS_TOKEN;
}

export type GumroadProduct = "monthly" | "quarterly" | "yearly";

const PRODUCT_PERMALINKS: Record<GumroadProduct, string> = {
  monthly: "civy-pro-monthly",
  quarterly: "civy-pro-quarterly",
  yearly: "civy-pro-yearly",
};

export function getGumroadProductUrl(tier: GumroadProduct): string | null {
  const storeId = getStoreId();
  if (!storeId) return null;
  return `https://${storeId}.gumroad.com/l/${PRODUCT_PERMALINKS[tier]}`;
}

export function getProductPermalink(tier: GumroadProduct): string {
  return PRODUCT_PERMALINKS[tier];
}

export async function getProductId(permalink: string): Promise<string | null> {
  const token = getAccessToken();
  try {
    const res = await fetch(`${GUMROAD_API}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ access_token: token }),
    });
    const data = await res.json();
    if (!data.success) return null;
    const product = data.products?.find(
      (p: { custom_permalink: string }) => p.custom_permalink === permalink
    );
    return product?.id || null;
  } catch {
    return null;
  }
}

export async function verifyLicense(
  productId: string,
  licenseKey: string
): Promise<{ success: boolean; purchase?: Record<string, unknown> }> {
  try {
    const res = await fetch(`${GUMROAD_API}/licenses/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        product_id: productId,
        license_key: licenseKey,
        increment_uses_count: "false",
      }),
    });
    return await res.json();
  } catch {
    return { success: false };
  }
}

type GumroadEvent =
  | "sale"
  | "refund"
  | "cancellation"
  | "subscription_updated"
  | "subscription_ended"
  | "subscription_restarted";

export async function subscribeToResource(
  event: GumroadEvent,
  postUrl: string
): Promise<boolean> {
  const token = getAccessToken();
  try {
    const res = await fetch(`${GUMROAD_API}/resource_subscriptions`, {
      method: "PUT",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        access_token: token,
        resource_name: event,
        post_url: postUrl,
      }),
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}
