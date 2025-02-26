import { UserData } from './userData.js';
import { PostData } from './postData.js';
import { LeaderboardEntry } from './leaderboardEntry.js';

/** Message from Devvit to the web view. */
export type DevvitMessage =
  | { type: 'initialData'; data: { postData:PostData } }
  | { type: 'leaderboardUpdated'; data: { leaderboard:LeaderboardEntry[] } };

export type DevvitMessageType = DevvitMessage['type'];

/** Message from the web view to Devvit. */
export type WebViewMessage =
  | { type: 'webViewReady' };

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
