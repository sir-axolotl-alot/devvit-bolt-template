import './menuActions.js';

import { Devvit, useState, useWebView } from '@devvit/public-api';

import type { DevvitMessage, WebViewMessage } from '../shared/types/message.js';
import { createRedisService } from './redisService.js';
import { fetchAvailableProducts, fulfillOrder, handleWebViewMessages, productPurchaseHandler, refundOrder } from './webViewMessageHandler.js';
import { addPaymentHandler, useProducts, usePayments, OrderResultStatus } from '@devvit/payments';

Devvit.configure({
  redditAPI: true,
  redis: true,
});

addPaymentHandler({
  fulfillOrder: fulfillOrder,
  refundOrder: refundOrder
});

// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: 'Web View Example',
  height: 'tall',
  render: (context) => {
    // Load username with `useAsync` hook
    const [username] = useState(async () => {
      return (await context.reddit.getCurrentUsername()) ?? 'anon';
    });

    const catalog = useProducts(context);
    const payments = usePayments(async (result) => {
      const responseMessage:DevvitMessage = {
        type: 'buyProductResponse',
        data: {
          productSku: result.status === OrderResultStatus.Success ? result.sku : '',
          status: result.status === OrderResultStatus.Success ? 'success' : 'error',
          error: result.errorMessage ?? '',
        },
      }
      webView.postMessage(responseMessage);
      
      // Show a toast message
      context.ui.showToast(result.status === OrderResultStatus.Success ? 'Purchase successful!' : 'Purchase failed');
    });

    const webView = useWebView<WebViewMessage, DevvitMessage>({
      // URL of your web view content
      url: 'game.html',

      // Handle messages sent from the web view
      async onMessage(message: WebViewMessage, webView) {
        switch (message.type) {
          // Products and orders are managed by the payments hook and can only be declared at the top of a component
          case 'fetchAvailableProducts':
            if (catalog.error) {
                console.error('Devvit', 'Failed to fetch products:', catalog.error);
                webView.postMessage({
                    type: 'fetchAvailableProductsResponse',
                    data: {
                        products: [],
                        error: catalog.error.message,
                    },
                });
                return;
            }
            console.log('Fetched all products:', catalog.products);
            fetchAvailableProducts(webView, catalog.products);
            break;
          case 'fetchOrders':
            console.log('TODO');
            break;
          case 'buyProduct':
            console.log('Devvit', 'Received buy product message:', message.data.sku);
            payments.purchase(message.data.sku);
            break;
          default:
            // For all non-payment messages, handle them with the external handler
            await handleWebViewMessages(message, webView, context);
        }
      },
      onUnmount() {
        context.ui.showToast('Web view closed!');
      },
    });

    // Render the custom post type
    return (
      <vstack grow padding="small">
        <vstack grow alignment="middle center">
          <text size="xlarge" weight="bold">
            Example App
          </text>
          <spacer />
          <vstack alignment="start middle">
            <hstack>
              <text size="medium">Username:</text>
              <text size="medium" weight="bold">
                {' '}
                {username ?? ''}
              </text>
            </hstack>
          </vstack>
          <spacer />
          <button onPress={() => webView.mount()}>Launch App</button>
        </vstack>
      </vstack>
    );
  },
});

export default Devvit;
