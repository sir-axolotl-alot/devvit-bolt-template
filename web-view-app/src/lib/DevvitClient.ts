import { DevvitMessage, DevvitMessageType, WebViewMessage, WebViewMessageType, DevvitSystemMessage } from '../../../shared/types/message';

/**
 * DevvitClient - A client for communicating with the parent window
 * 
 * This class provides methods for sending and receiving messages to/from
 * the parent window using the postMessage API.
 */
export class DevvitClient {
  private initialized: boolean = false;
  private messageHandlers: Map<DevvitMessageType, (message: DevvitMessage) => void> = new Map();

  /**
   * Initialize the client and set up message listeners
   */
  public initialize(): void {
    if (this.initialized) return;
    
    // Set up event listener for Devvit system messages
    window.addEventListener('message', (ev:MessageEvent) => this.handleMessage(ev.data as DevvitSystemMessage));
    
    console.log('Webview', 'DevvitClient initialized');
    this.initialized = true;
    
    this.postMessage({type:'webViewReady'});
    console.log('Webview', 'Sent webViewReady message');

  }

  /**
   * Send a message to the parent window
   * 
   * @param message - The message to send
   * @type WebViewMessage
   */
  public postMessage(message:WebViewMessage): void {
    if (window.parent) {
      window.parent.postMessage(message, '*');
    } else {
      console.warn('No parent window found to post message to');
    }
  }

  /**
   * Handle incoming messages from the parent window
   */
  private handleMessage(devvitSystemMessage: DevvitSystemMessage): void {
    console.log('Webview', 'Handling message', devvitSystemMessage);
    const message = devvitSystemMessage.data.message;
    console.log('Webview', 'Parsed Message', message);
    const { type } = message;
    
    if (type && this.messageHandlers.has(type)) {
      const handler = this.messageHandlers.get(type);
      if (handler) {
        handler(message);
      }
    }
  }

    /**
   * Register a handler for a specific message type
   * 
   * @param type - The type of message to handle
   * @param handler - The function to call when a message of this type is received
   */
    public on(type: DevvitMessageType, handler: (data: DevvitMessage) => void): void {
      this.messageHandlers.set(type, handler);
    }
  
    /**
     * Remove a handler for a specific message type
     * 
     * @param type - The type of message to stop handling
     */
    public off(type: DevvitMessageType): void {
      this.messageHandlers.delete(type);
    }

  /**
   * Fetch users data
   * This would typically make an API call, but for now it just sends a message
   */
  public fetchUsers(): void {
    console.log('Fetching users...');
    return;
  }

  /**
   * Update user data
   * This would typically make an API call, but for now it just sends a message
   */
  public updateUser(userData: any): void {
    console.log('Updating user...', userData);
    return;
  }

  /**
   * Fetch posts data
   * This would typically make an API call, but for now it just sends a message
   */
  public fetchPosts(): void {
    console.log('Fetching posts...');
    return;
  }

  /**
   * Create a new post
   * This would typically make an API call, but for now it just sends a message
   */
  public createPost(postData: any): void {
    console.log('Creating post...', postData);
    return;
  }

  /**
   * Get weekly leaderboard data
   * This would typically make an API call, but for now it just sends a message
   */
  public getWeeklyLeaderboard(): void {
    console.log('Getting weekly leaderboard...');
    return;
  }

  /**
   * Get all-time leaderboard data
   * This would typically make an API call, but for now it just sends a message
   */
  public getAllTimeLeaderboard(): void {
    console.log('Getting all-time leaderboard...');
    return;
  }
}

// Create a singleton instance
const devvitClient = new DevvitClient();
export default devvitClient;