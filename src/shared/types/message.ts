import { GameUserData, RedditUserData } from './userData.js';
import { PostData } from './postData.js';
import { LeaderboardEntry } from './leaderboardEntry.js';
import { Product, Order } from './payments.js';

/** Message from Devvit to the web view. */
export type DevvitMessage =
  | { type: 'initialData'; data: { userId: string; postId: string } }
  | { type: 'fetchPostDataResponse'; data: { postData: PostData } }
  | {
      type: 'fetchLeaderboardResponse';
      data: { leaderboard: LeaderboardEntry[] };
    }
  | {
      type: 'fetchUserDataResponse';
      data: {
        redditUser: RedditUserData | null;
        dbUser: GameUserData | null;
        error: string;
      };
    }
  | {
      type: 'fetchAvailableProductsResponse';
      data: { products: Product[]; error: string };
    }
  | { type: 'fetchOrdersResponse'; data: { orders: Order[] } }
  | {
      type: 'buyProductResponse';
      data: { productSku: string; status: string; error: string };
    }
  | { type: 'setUserScoreResponse'; data: { status: string } }
  | { type: 'setUserDataResponse'; data: { status: string } };

export type DevvitMessageType = DevvitMessage['type'];

/** Message from the web view to Devvit. */
export type WebViewMessage =
  | { type: 'webViewReady' }
  | { type: 'fetchPostData' }
  | { type: 'setUserScore'; data: { score: number } }
  | { type: 'setUserData'; data: { userId: string; userData: GameUserData } }
  | { type: 'fetchLeaderboard'; data: { topEntries: number } }
  | { type: 'fetchUserData' }
  | { type: 'fetchAvailableProducts' }
  | { type: 'fetchOrders' }
  | { type: 'buyProduct'; data: { sku: string } };

export type WebViewMessageType = WebViewMessage['type'];

/**
 * Web view MessageEvent listener data type. The Devvit API wraps all messages
 * from Blocks to the web view.
 */
export type DevvitSystemMessage = {
  data: { message: DevvitMessage };
  /** Reserved type for messages sent via `context.ui.webView.postMessage`. */
  type?: 'devvit-message' | string;
};
