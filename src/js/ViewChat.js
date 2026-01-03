/**
 * Класс для отображения чата
 */

export class ViewChat {
  constructor() {
    this.modal = document.getElementById("modal");
    this.nicknameForm = document.getElementById("nicknameForm");
    this.nicknameInput = document.getElementById("nicknameInput");
    this.errorMessage = document.getElementById("error-message");
    this.chatContainer = document.getElementById("chatContainer");
    this.usersList = document.getElementById("usersList");
    this.messagesContainer = document.getElementById("messagesContainer");
    this.messageForm = document.getElementById("messageForm");
    this.messageInput = document.getElementById("messageInput");
    this.exitButton = document.getElementById("exitButton");

    this.showModal();
  }

  showModal() {
    this.modal.classList.remove("hidden");
  }

  hideModal() {
    this.modal.classList.add("hidden");
  }

  showError(message) {
    this.errorMessage.textContent = message;
  }

  clearError() {
    this.errorMessage.textContent = "";
  }

  showChat() {
    this.chatContainer.classList.remove("hidden");
  }

  hideChat() {
    this.chatContainer.classList.add("hidden");
  }

  addUser(user) {
    const userItem = document.createElement("li");
    userItem.id = `user-${user.id}`;
    userItem.textContent = user.name;
    this.usersList.append(userItem);
  }

  removeUser(userId) {
    const userItem = document.getElementById(`user-${userId}`);
    if (userItem) {
      userItem.remove();
    }
  }

  clearUsers() {
    this.usersList.innerHTML = "";
  }

  addMessage(message, isOwn = false) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    if (isOwn) {
      messageElement.classList.add("own-message");
    }

    const messageHeader = document.createElement("div");
    messageHeader.classList.add("message-header");

    const now = new Date(message.timestamp || Date.now());
    const timeString = now.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateString = now.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    if (isOwn) {
      messageHeader.textContent = `You, ${timeString} ${dateString}`;
    } else {
      messageHeader.textContent = `${message.user.name}, ${timeString} ${dateString}`;
    }

    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content");
    messageContent.textContent = message.text;

    messageElement.append(messageHeader);
    messageElement.append(messageContent);

    this.messagesContainer.append(messageElement);

    // Прокрутка к последнему сообщению
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  clearMessages() {
    this.messagesContainer.innerHTML = "";
  }

  resetChat() {
    // Очищаем список пользователей
    this.clearUsers();

    // Очищаем сообщения
    this.clearMessages();
  }
}
