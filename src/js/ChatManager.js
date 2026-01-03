/**
 * Класс управления сообщениями
 */

export class ChatManager {
  constructor(viewChat, httpLoader, webSocketLoader) {
    this.viewChat = viewChat;
    this.httpLoader = httpLoader;
    this.webSocketLoader = webSocketLoader;
    this.currentUser = null;

    this.initEventListeners();
  }

  initEventListeners() {
    // Обработчик отправки формы никнейма
    this.viewChat.nicknameForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nickname = this.viewChat.nicknameInput.value.trim();

      if (nickname) {
        this.registerUser(nickname);
      }
    });

    // Обработчик отправки сообщения
    this.viewChat.messageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const messageText = this.viewChat.messageInput.value.trim();

      if (messageText && this.currentUser) {
        this.sendMessage(messageText);
        this.viewChat.messageInput.value = '';
      }
    });

    // Обработчик кнопки выхода из чата
    this.viewChat.exitButton.addEventListener('click', () => {
      this.exitChat();
    });

    // Обработчик события перед закрытием вкладки/окна
    window.addEventListener('beforeunload', (e) => {
      this.exitChat();
    });
  }

  async registerUser(nickname) {
    const result = await this.httpLoader.registerUser(nickname);

    if (result.status === 'ok') {
      console.log(result.user);
      this.currentUser = result.user;
      this.viewChat.hideModal();
      this.viewChat.showChat();
      this.connectToWebSocket();
    } else {
      this.viewChat.showError(
        result.message || 'Неизвестная ошибка при регистрации'
      );
    }
  }

  connectToWebSocket() {
    this.webSocketLoader.connect(this.currentUser);

    // Устанавливаем обработчики событий
    this.webSocketLoader.onUsersUpdate = (users) => {
      this.handleUsersUpdate(users);
    };

    this.webSocketLoader.onMessageReceive = (messageData) => {
      this.handleMessageReceive(messageData);
    };
  }

  handleUsersUpdate(users) {
    // Очищаем текущий список пользователей
    this.viewChat.clearUsers();

    // Добавляем всех пользователей из обновленного списка
    users.forEach((user) => {
      this.viewChat.addUser(user);
    });
  }

  handleMessageReceive(messageData) {
    // Проверяем, является ли сообщение нашим собственным сообщением
    const isOwnMessage = messageData.user.id === this.currentUser.id;

    const message = {
      user: messageData.user,
      text: messageData.message,
      timestamp: Date.now(),
    };

    this.viewChat.addMessage(message, isOwnMessage);
  }

  sendMessage(text) {
    // Отправляем сообщение через WebSocket
    this.webSocketLoader.sendMessage(text);

    // Отображаем сообщение в чате
    const message = {
      user: this.currentUser,
      text: text,
      timestamp: Date.now(),
    };

    this.viewChat.addMessage(message, true);
  }

  exitChat() {
    // Отправляем сообщение о выходе и закрываем WebSocket
    this.webSocketLoader.sendExit();

    // Сбрасываем текущего пользователя
    this.currentUser = null;

    // Показываем модальное окно для ввода нового никнейма
    this.viewChat.showModal();

    // Скрываем чат
    this.viewChat.hideChat();

    // Сбрасываем состояние чата
    this.viewChat.resetChat();
  }
}
