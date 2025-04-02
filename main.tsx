import './devvit-app/menuActions.js';
import { Devvit, useState, useWebView } from '@devvit/public-api';
import type { DevvitMessage, WebViewMessage } from './shared/types/message.js';
import { handleWebViewMessages } from './devvit-app/webViewMessageHandler.js';
import { createRedisService } from './devvit-app/redisService.js';

Devvit.configure({
  redditAPI: true,
  redis: true,
});

// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: 'Wordle Puzzle',
  height: 'tall',
  render: (context) => {
    const [postData] = useState(async () => {
      const redisService = createRedisService(context);
      return await redisService.getPostData(context.postId!);
    });

    const [username] = useState(async () => {
      return (await context.reddit.getCurrentUsername()) ?? 'anon';
    });

    const webView = useWebView<WebViewMessage, DevvitMessage>({
      url: 'index.html',
      onMessage(message: WebViewMessage, webView) {
        handleWebViewMessages(message, webView, context, {});
      },
    });

    // Render the custom post type
    return (
      <vstack grow padding="small">
        <vstack grow alignment="middle center" gap="medium">
          <text size="xlarge" weight="bold">
            Reddit Wordle
          </text>
          {postData && (
            <vstack alignment="middle center" gap="small">
              <text>Success Rate: {Math.round((postData.successCount / (postData.successCount + postData.failureCount || 1)) * 100)}%</text>
              <text>Total Attempts: {postData.successCount + postData.failureCount}</text>
            </vstack>
          )}
          <button 
            onPress={() => webView.mount()}
            appearance="primary"
          >
            Play Wordle
          </button>
        </vstack>
      </vstack>
    );
  },
});

export default Devvit;