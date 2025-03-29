import { ContentItem } from '@/models/content';
import type { CheckoutItem } from '@/models/checkout';

export function useCheckoutService(apiBaseUrl: string = import.meta.env.VITE_API_ENDPOINT) {
  const checkoutEndpoint = `${apiBaseUrl}/create-checkout`;
  const sessionStatusEndpoint = `${apiBaseUrl}/session-status`;

  /**
   * Create a checkout session for content purchase
   * @param contentItem The content item to purchase
   * @param customerEmail Customer's email address
   * @param successUrl URL to redirect after successful payment
   * @param cancelUrl URL to redirect after cancelled payment
   */
  async function createContentCheckout(
    contentItem: ContentItem,
    customerEmail: string,
    successUrl: string,
    cancelUrl: string
  ) {
    // Create checkout items array with the content item
    const items: CheckoutItem[] = [
      {
        name: contentItem.title,
        price: contentItem.price,
        quantity: 1,
        description: contentItem.description,
        images: contentItem.imageUrl  ? [`${apiBaseUrl}/${contentItem.imageUrl}`] : []
      }
    ];

    // Prepare checkout session request
    const checkoutData = {
      items,
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      order_id: `content-${contentItem.id}-${Date.now()}`,
      metadata: {
        contentId: contentItem.id,
        contentTitle: contentItem.title
      }
    };

    // Send request to backend
    console.log("checkoutData",checkoutData)
    const response = await fetch(checkoutEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(checkoutData)
    });

    if (!response.ok) {
      throw new Error(`Checkout API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get the status of a checkout session
   * @param sessionId The Stripe checkout session ID
   */
  async function getSessionStatus(sessionId: string) {
    const response = await fetch(`${sessionStatusEndpoint}/${sessionId}`);

    if (!response.ok) {
      throw new Error(`Session status API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  return {
    createContentCheckout,
    getSessionStatus
  };
}