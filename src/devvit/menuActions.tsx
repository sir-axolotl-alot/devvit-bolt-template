import { Devvit } from '@devvit/public-api';
import { PostData } from '../shared/types/postData';
import { createRedisService } from './redisService';

// Configure Devvit's plugins
Devvit.configure({
  redditAPI: true,
});

const newGameForm = Devvit.createForm(
  {
    title: 'Create Instructions',
    description: 'Create a New Post with Instructions',
    fields: [
      {
        name: 'instructions',
        label: 'Instructions',
        type: 'string',
        placeholder: 'Enter the Instructions text here',
        required: true,
      },
    ],
    acceptLabel: 'Create Post!',
  },
  async (event, context) => {
    const { instructions } = event.values;
    // Create post data object
    const postData: PostData = {
      instructions: instructions,
    };
    await createNewPost('New Empty Bolt Project', postData, context);
  }
);

async function createNewPost(
  title: string,
  postData: PostData,
  context: Devvit.Context
) {
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
  label: '[+] New Bolt Template',
  location: 'subreddit',
  onPress: async (_event, context) => {
    context.ui.showForm(newGameForm);
  },
});
