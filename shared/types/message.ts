import { GameUserData, RedditUserData } from './userData.js';
import { PostData } from './postData.js';

export type GameResult = {
  success: boolean;
  guesses: number;
}

/** Message from Devvit to the web view. */
export type DevvitMessage =
  | { type: 'initialData'; data: { userId: string; postId: string } }
  | { type: 'fetchPostDataResponse'; data: { postData: PostData } }
  | { type: 'fetchUserDataResponse'; data: { redditUser: RedditUserData | null; dbUser: GameUserData | null; error: string } }
  | { type: 'submitGuessResponse'; data: { status: string } }
  | { type: 'gameCompleteResponse'; data: { status: string } }

/** Message from the web view to Devvit. */
export type WebViewMessage =
  | { type: 'webViewReady' }
  | { type: 'fetchPostData' }
  | { type: 'fetchUserData' }
  | { type: 'gameComplete'; data: { result: GameResult } }

export type WebViewMessageType = WebViewMessage['type'];
export type DevvitMessageType = DevvitMessage['type'];

export type DevvitSystemMessage = {
  data: { message: DevvitMessage };
  type?: 'devvit-message' | string;
};