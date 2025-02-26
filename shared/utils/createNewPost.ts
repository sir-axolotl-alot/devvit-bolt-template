import { PostData } from '../types/postData.js';

export async function createNewRandomPost(): Promise<PostData> {
    const poems = await import('../../data/poems.json');
    const randomIndex = Math.floor(Math.random() * poems.default.poems.length);
    const poem = poems.default.poems[randomIndex];
    const postData: PostData = {
        poemTitle: poem.title,
        poemBody: poem.body,
    };    
    return postData;
}