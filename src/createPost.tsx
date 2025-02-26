import { Devvit } from '@devvit/public-api';
import { createNewRandomPost } from '../shared/utils/createNewPost.js';
import { createRedisService, RedisService } from './redisService.js'; 

// Configure Devvit's plugins
Devvit.configure({
  redditAPI: true,
});

// Adds a new menu item to the subreddit allowing to create a new post
Devvit.addMenuItem({
  label: '[+] Devvit-as-a-backend post',
  location: 'subreddit',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: 'Devvit-as-a-backend post',
      subredditName: subreddit.name,
      // The preview appears while the post loads
      preview: (
        <vstack height="100%" width="100%" alignment="middle center">
          <text size="large">Loading ...</text>
        </vstack>
      ),
    });
    const postData = await createNewRandomPost();
    const redisService = createRedisService(context);
    await redisService.savePostData(post.id, postData);

    ui.showToast({ text: 'Created post!' });
    ui.navigateTo(post);
  },
});
