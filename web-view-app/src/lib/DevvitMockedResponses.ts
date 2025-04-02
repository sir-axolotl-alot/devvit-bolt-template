import { DevvitMessage, WebViewMessage, DevvitSystemMessage } from '../../../shared/types/message';

export interface DevvitMessageHandler {
    setMessageHandler: (handler: (message: DevvitSystemMessage) => void) => void;
    postMessage: (message: WebViewMessage) => void;
}
  
export class DevvitMockedResponses implements DevvitMessageHandler {
    private messageHandler!: (message: DevvitSystemMessage) => void;

    postMessage(message: WebViewMessage) {
      this.mockWebViewMessageResponse(message);
    }
    setMessageHandler(handler: (message: DevvitSystemMessage) => void) {
      this.messageHandler = handler;
    }

    sendMockedResponse(message: DevvitMessage) {
        this.messageHandler({
            type: 'devvit-message',
            data: { message }
        });
    }
    
    mockWebViewMessageResponse(message: WebViewMessage): void {
        console.log('WebView Mocked Responses', 'Handling message', message);
        switch (message.type) {
            case 'fetchPostData':
                this.sendMockedResponse({
                    type: 'fetchPostDataResponse',
                    data: {
                        postData: {
                            targetWord: 'hello',
                            successCount: 10,
                            failureCount: 5
                        }
                    }
                });
                break;
            case 'fetchUserData':
                this.sendMockedResponse({
                    type: 'fetchUserDataResponse',
                    data: {
                        redditUser: { userId: 'anon', username: 'anon' },
                        dbUser: {
                            currentStreak: 3,
                            bestStreak: 5,
                            totalPlayed: 10,
                            totalWins: 7,
                            averageGuesses: 3.5,
                            guessDistribution: [1, 2, 3, 1, 0, 0]
                        },
                        error: ''
                    }
                });
                break;
            case 'gameComplete':
                this.sendMockedResponse({
                    type: 'gameCompleteResponse',
                    data: {
                        status: 'success'
                    }
                });
                break;
        }
    } 
}

const devvitMockedResponses = new DevvitMockedResponses();
export default devvitMockedResponses;