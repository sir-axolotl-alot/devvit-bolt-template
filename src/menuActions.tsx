import { Devvit } from '@devvit/public-api';
import { createNewRandomPost } from './webViewMessageHandler.js';

// Configure Devvit's plugins
Devvit.configure({
  redditAPI: true,
});

// Adds a new menu item to the subreddit allowing to create a new post
Devvit.addMenuItem({
  label: '[+] Devvit-as-a-backend post',
  location: 'subreddit',
  onPress: async (_event, context) => {
    await createNewRandomPost(context);
  },
});
