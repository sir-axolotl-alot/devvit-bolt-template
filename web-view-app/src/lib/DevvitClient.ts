import { DevvitMessage, DevvitMessageType, WebViewMessage, DevvitSystemMessage } from '../../../shared/types/message';

/**
 * DevvitClient - A client for communicating with the parent window
 * 
 * This class provides methods for sending and receiving messages to/from
 * the parent window using the postMessage API.
 */
export class DevvitClient {
  private initialized: boolean = false;
  private messageHandlers: Map<DevvitMessageType, (message: DevvitMessage) => void> = new Map();
  public userId:string|undefined;
  public postId:string|undefined;

  /**
   * Initialize the client and set up message listeners
   */
  public initialize(): void {
    if (this.initialized) return;
    
    // Set up event listener for Devvit system messages
    window.addEventListener('message', (ev:MessageEvent) => this.handleMessage(ev.data as DevvitSystemMessage));
    
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

    if (type == 'initialData') {
      this.userId = message.data.userId;
      this.postId = message.data.postId;
      this.initialized = true;
    } else if (type && this.messageHandlers.has(type)) {
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
}

// Create a singleton instance
const devvitClient = new DevvitClient();
export default devvitClient;