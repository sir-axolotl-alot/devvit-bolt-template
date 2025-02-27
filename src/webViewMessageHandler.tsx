import { Devvit, UseWebViewResult } from "@devvit/public-api";
import { WebViewMessage, DevvitMessage } from "../shared/types/message.js";
import { createRedisService } from "./redisService.js";
import { createNewRandomPost } from "../shared/utils/createNewPost.js";

async function fetchPostData(message: WebViewMessage, webView: UseWebViewResult<DevvitMessage>, context: Devvit.Context) {
    const redisService = createRedisService(context);
    const postData = await redisService.getPostData(context.postId!);
    webView.postMessage({
      type: 'fetchPostDataReponse',
      data: {
        postData: postData
      },
    });
    console.log('Devvit', 'Sent post data to web view');
}

async function createNewPost(message: WebViewMessage, webView: UseWebViewResult<DevvitMessage>, context: Devvit.Context) {
    const newPostData = await createNewRandomPost();
    const redisService = createRedisService(context);
    const subreddit = await context.reddit.getCurrentSubreddit();
    const post = await context.reddit.submitPost({
        title: newPostData.poemTitle,
        subredditName: subreddit.name,
        // The preview appears while the post loads
        preview: (
            <vstack height="100%" width="100%" alignment="middle center">
            <text size="large">Loading ...</text>
            </vstack>
        ),
    });
    redisService.savePostData(post.id, newPostData);
    context.ui.navigateTo(post);
}

async function setUserScore(message: WebViewMessage, webView: UseWebViewResult<DevvitMessage>, context: Devvit.Context) {
    if (message.type === 'setUserScore') {
        console.log('Devvit', 'Received user score from web view:', message.data.score);
        const redisService = createRedisService(context);
        const username = (await context.reddit.getCurrentUsername()) ?? 'anon';
        redisService.setLeaderboardEntry(username, message.data.score);
        console.log('Devvit', 'Saved user score to leaderboard:', username, message.data.score);
    }    
}

async function fetchLeaderboard(message: WebViewMessage, webView: UseWebViewResult<DevvitMessage>, context: Devvit.Context) {
    if (message.type === 'fetchLeaderboard') {
        console.log('Devvit', 'Fetching leaderboard data');
        const redisService = createRedisService(context);
        const leaderboard = await redisService.getLeaderboard(message.data.topEntries);
        webView.postMessage({
        type: 'fetchLeaderboardResponse',
        data: {
            leaderboard: leaderboard
        },
        });
        console.log('Devvit', 'Sent leaderboard data to web view', leaderboard);
    }
}

async function fetchUserData(message: WebViewMessage, webView: UseWebViewResult<DevvitMessage>, context: Devvit.Context) {
    if (message.type === 'fetchUserData') {
        console.log('Devvit', 'Fetching user data for user:', message.data.userId);
        const redisService = createRedisService(context);
        const dbUserData = await redisService.getUserData(message.data.userId);
        const redditUserData = await context.reddit.getUserById(message.data.userId);
        webView.postMessage({
            type: 'fetchUserDataResponse',
            data: {
                redditUser: {userId: redditUserData!.id, username: redditUserData!.username},
                dbUser: dbUserData
            },
        });
        console.log('Devvit', 'Sent user data to web view');
    }
}

async function setUserData(message: WebViewMessage, webView: UseWebViewResult<DevvitMessage>, context: Devvit.Context) {
    if (message.type === 'setUserData') {
        console.log('Devvit', 'Received user data from web view:', message.data.userData);
        const redisService = createRedisService(context);
        redisService.saveUserData(message.data.userId, message.data.userData);
        console.log('Devvit', 'Saved user data to redis:', message.data.userData);
    }
}

export async function handleWebViewMessages(message: WebViewMessage, webView: UseWebViewResult<DevvitMessage>, context: Devvit.Context) {
    switch (message.type) {
        case 'webViewReady':
            await webView.postMessage({ type: 'initialData', data: { userId: context.userId ?? 'anon', postId: context.postId! } });
            break;
        case 'fetchPostData':
            await fetchPostData(message, webView, context);
            break;
        case 'createNewPost':
            await createNewPost(message, webView, context);
            break;
        case 'setUserScore':
            await setUserScore(message, webView, context);
            break;
        case 'fetchLeaderboard':
            await fetchLeaderboard(message, webView, context);
            break;
        case 'fetchUserData':
            await fetchUserData(message, webView, context);
            break;
        case 'setUserData':
            await setUserData(message, webView, context);
            break;
        default:
          throw new Error(`Unknown message type: ${message satisfies never}`);
      }
}