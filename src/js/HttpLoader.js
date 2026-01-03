/**
 * Класс для работы с HTTP запросами на сервер
 */

import { API_BASE_URL } from '../config.js';

export class HttpLoader {
  async registerUser(nickname) {
    try {
      const response = await fetch(`${API_BASE_URL}/new-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nickname }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при регистрации пользователя:', error);
      return {
        status: 'error',
        message: 'Не удалось подключиться к серверу',
      };
    }
  }
}
