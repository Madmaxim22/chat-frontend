import './css/style.css';
import { ChatManager } from './js/ChatManager.js';
import { ViewChat } from './js/ViewChat.js';
import { HttpLoader } from './js/HttpLoader.js';
import { WebSocketLoader } from './js/WebSocketLoader.js';

const viewChat = new ViewChat();
const httpLoader = new HttpLoader();
const webSocketLoader = new WebSocketLoader();
const chatManager = new ChatManager(viewChat, httpLoader, webSocketLoader);
