import { Devvit } from '@devvit/public-api';
import { PostData } from '../shared/types/postData.js';
import { createRedisService } from './redisService.js';

Devvit.configure({
  redditAPI: true,
});

const newGameForm = Devvit.createForm(
  {
    title: 'Create New Wordle',
    description: 'Create a new Wordle puzzle',
    fields: [
      {
        name: 'targetWord',
        label: 'Target Word (5 letters)',
        type: 'string',
        placeholder: 'Enter a 5-letter word',
        required: true,
        validation: (value) => {
          if (value.length !== 5) {
            return 'Word must be exactly 5 letters';
          }
          if (!/^[a-zA-Z]+$/.test(value)) {
            return 'Word must contain only letters';
          }
          return null;
        }
      }
    ],
    acceptLabel: 'Create Puzzle',
  },
  async (event, context) => {
    const { targetWord } = event.values;
    
    // Create post data object with initial stats
    const postData: PostData = {
      targetWord: targetWord.toLowerCase(),
      successCount: 0,
      failureCount: 0
    };
    
    const post = await createNewPost(`Wordle Puzzle: #${Date.now()}`, postData, context);
  }
);

async function createNewPost(title: string, postData: PostData, context: Devvit.Context) {
  const { reddit, ui } = context;
  const subreddit = await reddit.getCurrentSubreddit();
  const post = await reddit.submitPost({
    title: title,
    subredditName: subreddit.name,
    preview: (
      <vstack height="100%" width="100%" alignment="middle center">
        <text size="large">Loading Wordle...</text>
      </vstack>
    ),
  });
  
  const redisService = createRedisService(context);
  await redisService.savePostData(post.id, postData);

  ui.showToast({ text: 'Created new Wordle puzzle!' });
  ui.navigateTo(post);
}

Devvit.addMenuItem({
  label: '[+] New Wordle Puzzle',
  location: 'subreddit',
  onPress: async (_event, context) => {
    context.ui.showForm(newGameForm);
  },
});