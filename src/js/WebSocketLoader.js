/**
 * Класс подключения к WebSocket
 */

import { WS_URL } from '../config.js';

export class WebSocketLoader {
  constructor() {
    this.ws = null;
    this.onUsersUpdate = null;
    this.onMessageReceive = null;
    this.currentUser = null;
  }

  connect(user) {
    this.currentUser = user;

    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => {
      console.log('Подключено к WebSocket серверу');
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Проверяем, является ли сообщение списком пользователей
      if (Array.isArray(data)) {
        if (this.onUsersUpdate) {
          this.onUsersUpdate(data);
        }
      }
      // Или это сообщение от другого пользователя
      else if (data.type === 'send') {
        if (this.onMessageReceive) {
          this.onMessageReceive(data);
        }
      }
    };

    this.ws.onclose = () => {
      console.log('Соединение с WebSocket сервером закрыто');
    };

    this.ws.onerror = (error) => {
      console.error('Ошибка WebSocket:', error);
    };
  }

  sendMessage(text) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        type: 'send',
        user: this.currentUser,
        message: text,
      };

      this.ws.send(JSON.stringify(message));
    }
  }

  sendExit() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.currentUser) {
      const exitMessage = {
        type: 'exit',
        user: this.currentUser,
      };

      this.ws.send(JSON.stringify(exitMessage));
      this.ws.close();
    }
  }
}
