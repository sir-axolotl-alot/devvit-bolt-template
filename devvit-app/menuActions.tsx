import { Devvit } from '@devvit/public-api';
import { PostData } from '../shared/types/postData.js';
import { createRedisService } from './redisService.js';

// Configure Devvit's plugins
Devvit.configure({
  redditAPI: true,
});

const newGameForm = Devvit.createForm(
  {
    title: 'Create Riddle',
    description: 'Create a Riddle',
    fields: [
      {
        name: 'riddle',
        label: 'Riddle',
        type: 'string',
        placeholder: 'Enter the riddle here',
        required: true,
      },
      {
        name: 'answer',
        label: 'Answer',
        type: 'string',
        placeholder: 'Enter the answer here',
        required: true,
      }
    ],
    acceptLabel: 'Create Riddle',
  },
  async (event, context) => {
    const { riddle, answer } = event.values;
    // Create post data object
    const postData: PostData = {
      riddle: riddle,
      answer: answer,
      solvedTimes: 0,
      playedTimes: 0,
    };
    const post = await createNewPost("New Riddle", postData, context);
  }
);

async function createNewPost(title:string, postData: PostData, context: Devvit.Context) {
  const { reddit, ui } = context;
  const subreddit = await reddit.getCurrentSubreddit();
  const post = await reddit.submitPost({
      title: title,
      subredditName: subreddit.name,
      // The preview appears while the post loads
      preview: (
          <vstack height="100%" width="100%" alignment="middle center">
              <text size="large">Loading ...</text>
          </vstack>
      ),
  });
  
  const redisService = createRedisService(context);
  await redisService.savePostData(post.id, postData);

  ui.showToast({ text: 'Created post!' });
  ui.navigateTo(post);
}

// Adds a new menu item to the subreddit allowing to create a new post
Devvit.addMenuItem({
  label: '[+] New Riddle',
  location: 'subreddit',
  onPress: async (_event, context) => {
    context.ui.showForm(newGameForm);
  },
});