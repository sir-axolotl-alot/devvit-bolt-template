import { DevvitMessage, DevvitMessageType, WebViewMessage, DevvitSystemMessage } from '../../../shared/types/message';
import devvitMockedResponses, { DevvitMessageHandler } from './DevvitMockedResponses';

class DevvitBackendHandler implements DevvitMessageHandler {
  private window!: Window;

  constructor(window:Window) {
    this.window = window;
  }

  setMessageHandler(handler: (message: DevvitSystemMessage) => void) {
    window.addEventListener('message', (ev:MessageEvent) => handler(ev.data as DevvitSystemMessage));
  }

  postMessage(message: WebViewMessage) {
    this.window.parent.postMessage(message, '*');
  }
}

/**
 * DevvitClient - A client for communicating with the parent window
 * 
 * This class provides methods for sending and receiving messages to/from
 * the parent window using the postMessage API.
 */
export class DevvitClient {
  private initialized: boolean = false;
  private messageHandlers: Map<DevvitMessageType, (message: DevvitMessage) => void> = new Map();
  private devvitMessageHandler!: DevvitMessageHandler;

  /**
   * Initialize the client and set up message listeners
   */
  public initialize(useMockedResponses:boolean = false): void {
    if (this.initialized) return;

    if (useMockedResponses) {
      this.devvitMessageHandler = devvitMockedResponses;
      console.log('DevvitClient', 'Using mocked responses');
    } else {
      this.devvitMessageHandler = new DevvitBackendHandler(window);
      console.log('DevvitClient', 'Connected to Devvit Backend. Use `devvit playtest` to test your app');
    }
    this.devvitMessageHandler.setMessageHandler(this.handleMessage.bind(this));
    
    this.initialized = true;
  }

  /**
   * Send a message to the parent window
   * 
   * @param message - The message to send
   * @type WebViewMessage
   */
  public postMessage(message:WebViewMessage): void {
    this.devvitMessageHandler.postMessage(message);
  }

  /**
   * Handle incoming messages from the parent window
   */
  private handleMessage(devvitSystemMessage: DevvitSystemMessage): void {
    const message = devvitSystemMessage.data.message;
    console.log('Webview', 'Handling message', message);
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
}

// Create a singleton instance
const devvitClient = new DevvitClient();
export default devvitClient;