// main.js

// Классы для данных
class User {
    constructor(name, phone, password) {
        this.id = Date.now() + Math.random().toString(36).substr(2, 9);
        this.name = name;
        this.phone = phone;
        this.password = password;
        this.avatar = this.generateAvatar();
        this.createdAt = new Date().toISOString();
    }
    
    generateAvatar() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'];
        return {
            color: colors[Math.floor(Math.random() * colors.length)],
            initials: this.getInitials()
        };
    }
    
    getInitials() {
        if (!this.name) return '?';
        const parts = this.name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return this.name[0].toUpperCase();
    }
}

class Chat {
    constructor(user1, user2) {
        this.id = Date.now() + Math.random().toString(36).substr(2, 9);
        this.user1Id = user1.id;
        this.user2Id = user2.id;
        this.createdAt = new Date().toISOString();
        this.lastMessage = null;
        this.messages = [];
        this.unreadCount = 0;
    }
}

// Основное приложение
class MessengerApp {
    constructor() {
        this.users = this.loadUsers();
        this.chats = this.loadChats();
        this.currentUser = null;
        
        this.init();
    }
    
    loadUsers() {
        const users = localStorage.getItem('messenger_users');
        return users ? JSON.parse(users) : [];
    }
    
    loadChats() {
        const chats = localStorage.getItem('messenger_chats');
        return chats ? JSON.parse(chats) : [];
    }
    
    saveUsers() {
        localStorage.setItem('messenger_users', JSON.stringify(this.users));
    }
    
    saveChats() {
        localStorage.setItem('messenger_chats', JSON.stringify(this.chats));
    }
    
    init() {
        this.checkAuth();
        this.addStyles();
    }
    
    checkAuth() {
        const savedUser = localStorage.getItem('messenger_current_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showChats();
        } else {
            this.showRegistration();
        }
    }
    
    showRegistration() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="auth-container">
                <div class="auth-card">
                    <div class="auth-header">
                        <div class="logo">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <circle cx="20" cy="20" r="18" stroke="white" stroke-width="2"/>
                                <path d="M12 20L18 26L28 14" stroke="white" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            <span>ChatApp</span>
                        </div>
                        <h1>Создать аккаунт</h1>
                        <p>Присоединяйтесь к сообществу</p>
                    </div>
                    
                    <form id="registrationForm" class="auth-form">
                        <div class="input-group">
                            <label for="name">Имя</label>
                            <input type="text" id="name" placeholder="Введите ваше имя" required>
                            <span class="input-icon">👤</span>
                        </div>
                        
                        <div class="input-group">
                            <label for="phone">Номер телефона</label>
                            <input type="tel" id="phone" placeholder="+7 (999) 999-99-99" required>
                            <span class="input-icon">📱</span>
                        </div>
                        
                        <div class="input-group">
                            <label for="password">Пароль</label>
                            <input type="password" id="password" placeholder="Создайте пароль" required>
                            <span class="input-icon">🔒</span>
                        </div>
                        
                        <button type="submit" class="btn-primary">
                            <span>Зарегистрироваться</span>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M4 10H16M16 10L12 6M16 10L12 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </form>
                    
                    <p class="auth-footer">
                        Уже есть аккаунт? <a href="#" id="showLogin">Войти</a>
                    </p>
                </div>
                
                <div class="auth-decoration">
                    <div class="decoration-content">
                        <h2>Добро пожаловать!</h2>
                        <p>Общайтесь с друзьями и близкими в удобном мессенджере</p>
                        <div class="feature-list">
                            <div class="feature-item">
                                <span>💬</span>
                                <span>Мгновенные сообщения</span>
                            </div>
                            <div class="feature-item">
                                <span>🔒</span>
                                <span>Безопасность данных</span>
                            </div>
                            <div class="feature-item">
                                <span>🌍</span>
                                <span>Доступно везде</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('registrationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.registerUser();
        });
        
        document.getElementById('showLogin')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLogin();
        });
    }
    
    showLogin() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="auth-container">
                <div class="auth-card">
                    <div class="auth-header">
                        <div class="logo">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <circle cx="20" cy="20" r="18" stroke="white" stroke-width="2"/>
                                <path d="M12 20L18 26L28 14" stroke="white" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            <span>ChatApp</span>
                        </div>
                        <h1>Вход в аккаунт</h1>
                        <p>С возвращением!</p>
                    </div>
                    
                    <form id="loginForm" class="auth-form">
                        <div class="input-group">
                            <label for="loginPhone">Номер телефона</label>
                            <input type="tel" id="loginPhone" placeholder="+7 (999) 999-99-99" required>
                            <span class="input-icon">📱</span>
                        </div>
                        
                        <div class="input-group">
                            <label for="loginPassword">Пароль</label>
                            <input type="password" id="loginPassword" placeholder="Введите пароль" required>
                            <span class="input-icon">🔒</span>
                        </div>
                        
                        <button type="submit" class="btn-primary">
                            <span>Войти</span>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M4 10H16M16 10L12 6M16 10L12 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </form>
                    
                    <p class="auth-footer">
                        Нет аккаунта? <a href="#" id="showRegister">Зарегистрироваться</a>
                    </p>
                </div>
                
                <div class="auth-decoration">
                    <div class="decoration-content">
                        <h2>Рады видеть вас снова!</h2>
                        <p>Войдите, чтобы продолжить общение</p>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.loginUser();
        });
        
        document.getElementById('showRegister')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegistration();
        });
    }
    
    registerUser() {
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        
        if (!name || !phone || !password) {
            this.showNotification('Пожалуйста, заполните все поля', 'error');
            return;
        }
        
        const existingUser = this.users.find(u => u.phone === phone);
        if (existingUser) {
            this.showNotification('Пользователь с таким номером уже существует', 'error');
            return;
        }
        
        const newUser = new User(name, phone, password);
        this.users.push(newUser);
        this.saveUsers();
        
        this.currentUser = newUser;
        localStorage.setItem('messenger_current_user', JSON.stringify(newUser));
        
        this.showNotification('Регистрация прошла успешно!', 'success');
        this.showChats();
    }
    
    loginUser() {
        const phone = document.getElementById('loginPhone').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        const user = this.users.find(u => u.phone === phone && u.password === password);
        
        if (!user) {
            this.showNotification('Неверный номер телефона или пароль', 'error');
            return;
        }
        
        this.currentUser = user;
        localStorage.setItem('messenger_current_user', JSON.stringify(user));
        
        this.showNotification('Вход выполнен успешно!', 'success');
        this.showChats();
    }
    
    showChats() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="chats-layout">
                <aside class="sidebar">
                    <div class="sidebar-header">
                        <div class="user-profile">
                            <div class="user-avatar" style="background-color: ${this.currentUser.avatar.color}">
                                ${this.currentUser.avatar.initials}
                            </div>
                            <div class="user-info">
                                <h3>${this.currentUser.name}</h3>
                                <span class="user-status">online</span>
                            </div>
                        </div>
                        <button class="icon-button" id="logoutBtn" title="Выйти">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M7 17H4C3.46957 17 2.96086 16.7893 2.58579 16.4142C2.21071 16.0391 2 15.5304 2 15V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                <path d="M13 13L17 9L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                <path d="M17 9H7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="search-box">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="2"/>
                            <path d="M14 14L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        <input type="text" id="searchChats" placeholder="Поиск чатов...">
                    </div>
                    
                    <div class="add-contact">
                        <h4>Новый чат</h4>
                        <div class="add-contact-input">
                            <input type="tel" id="newContactPhone" placeholder="Введите номер телефона">
                            <button class="btn-add" id="addContactBtn">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 4V16M4 10H16" stroke="white" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <div class="chats-list" id="chatsList">
                        <!-- Чаты будут загружаться сюда -->
                    </div>
                </aside>
                
                <main class="chat-main">
                    <div class="welcome-screen">
                        <div class="welcome-content">
                            <div class="welcome-icon">💬</div>
                            <h2>Добро пожаловать в ChatApp!</h2>
                            <p>Выберите чат или создайте новый, чтобы начать общение</p>
                            <div class="welcome-tips">
                                <div class="tip">
                                    <span>📱</span>
                                    <span>Добавляйте контакты по номеру телефона</span>
                                </div>
                                <div class="tip">
                                    <span>💭</span>
                                    <span>Общайтесь с друзьями</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        `;
        
        this.loadChatsList();
        this.bindChatEvents();
    }
    
    loadChatsList() {
        const chatsList = document.getElementById('chatsList');
        
        const userChats = this.chats.filter(chat => 
            chat.user1Id === this.currentUser.id || chat.user2Id === this.currentUser.id
        );
        
        if (userChats.length === 0) {
            chatsList.innerHTML = `
                <div class="empty-chats">
                    <div class="empty-icon">💬</div>
                    <p>У вас пока нет чатов</p>
                    <span class="empty-hint">Добавьте контакт по номеру телефона</span>
                </div>
            `;
            return;
        }
        
        userChats.sort((a, b) => {
            const dateA = a.lastMessage ? new Date(a.lastMessage.timestamp) : new Date(a.createdAt);
            const dateB = b.lastMessage ? new Date(b.lastMessage.timestamp) : new Date(b.createdAt);
            return dateB - dateA;
        });
        
        chatsList.innerHTML = userChats.map(chat => {
            const otherUser = this.getOtherUser(chat);
            const lastMessage = chat.lastMessage || { text: 'Нет сообщений', timestamp: chat.createdAt };
            
            return `
                <div class="chat-item" data-chat-id="${chat.id}">
                    <div class="chat-avatar" style="background-color: ${otherUser.avatar.color}">
                        ${otherUser.avatar.initials}
                    </div>
                    <div class="chat-info">
                        <div class="chat-name-row">
                            <span class="chat-name">${otherUser.name}</span>
                            <span class="chat-time">${this.formatTime(lastMessage.timestamp)}</span>
                        </div>
                        <div class="chat-last-message">
                            <span class="message-text">${lastMessage.text}</span>
                            ${chat.unreadCount > 0 ? `<span class="unread-badge">${chat.unreadCount}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        document.querySelectorAll('.chat-item').forEach(item => {
            item.addEventListener('click', () => {
                const chatId = item.dataset.chatId;
                this.openChat(chatId);
            });
        });
    }
    
    addNewContact() {
        const phone = document.getElementById('newContactPhone').value.trim();
        
        if (!phone) {
            this.showNotification('Введите номер телефона', 'error');
            return;
        }
        
        let contact = this.users.find(u => u.phone === phone && u.id !== this.currentUser.id);
        
        if (!contact) {
            contact = new User(`Пользователь ${phone}`, phone, '');
            this.users.push(contact);
            this.saveUsers();
        }
        
        const existingChat = this.chats.find(chat => 
            (chat.user1Id === this.currentUser.id && chat.user2Id === contact.id) ||
            (chat.user1Id === contact.id && chat.user2Id === this.currentUser.id)
        );
        
        if (!existingChat) {
            const newChat = new Chat(this.currentUser, contact);
            this.chats.push(newChat);
            this.saveChats();
            
            document.getElementById('newContactPhone').value = '';
            this.loadChatsList();
            this.showNotification('Чат создан!', 'success');
        } else {
            this.showNotification('Чат с этим пользователем уже существует', 'info');
        }
    }
    
    openChat(chatId) {
        const chat = this.chats.find(c => c.id === chatId);
        if (!chat) return;
        
        const otherUser = this.getOtherUser(chat);
        
        const mainElement = document.querySelector('.chat-main');
        mainElement.innerHTML = `
            <div class="chat-window">
                <div class="chat-window-header">
                    <div class="chat-window-user">
                        <div class="chat-avatar large" style="background-color: ${otherUser.avatar.color}">
                            ${otherUser.avatar.initials}
                        </div>
                        <div class="chat-window-info">
                            <h3>${otherUser.name}</h3>
                            <span class="user-status">был(а) недавно</span>
                        </div>
                    </div>
                </div>
                
                <div class="messages-container" id="messagesContainer">
                    <div class="messages-list">
                        <!-- Сообщения будут здесь -->
                    </div>
                </div>
                
                <div class="message-input-container">
                    <input type="text" id="messageInput" placeholder="Написать сообщение...">
                    <button class="send-button" id="sendMessageBtn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        // Здесь будет логика отправки сообщений
        document.getElementById('sendMessageBtn')?.addEventListener('click', () => {
            const input = document.getElementById('messageInput');
            if (input.value.trim()) {
                this.showNotification('Функция отправки сообщений будет добавлена позже', 'info');
                input.value = '';
            }
        });
    }
    
    getOtherUser(chat) {
        const otherUserId = chat.user1Id === this.currentUser.id ? chat.user2Id : chat.user1Id;
        return this.users.find(u => u.id === otherUserId);
    }
    
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'только что';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} мин`;
        if (diff < 86400000) return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        if (diff < 604800000) return date.toLocaleDateString('ru-RU', { weekday: 'short' });
        return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    }
    
    logout() {
        localStorage.removeItem('messenger_current_user');
        this.currentUser = null;
        this.showLogin();
    }
    
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    bindChatEvents() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
        
        const addContactBtn = document.getElementById('addContactBtn');
        if (addContactBtn) {
            addContactBtn.addEventListener('click', () => this.addNewContact());
        }
        
        const phoneInput = document.getElementById('newContactPhone');
        if (phoneInput) {
            phoneInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addNewContact();
                }
            });
        }
        
        const searchInput = document.getElementById('searchChats');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                // Здесь будет поиск по чатам
                console.log('Поиск:', e.target.value);
            });
        }
    }
    
    addStyles() {
        const styles = `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }
            
            #app {
                min-height: 100vh;
            }
            
            /* Аутентификация */
            .auth-container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                min-height: 100vh;
            }
            
            .auth-card {
                background: white;
                padding: 60px 40px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            
            .auth-header {
                text-align: center;
                margin-bottom: 40px;
                width: 100%;
                max-width: 400px;
            }
            
            .logo {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                margin-bottom: 30px;
            }
            
            .logo svg circle {
                stroke: #667eea;
            }
            
            .logo svg path {
                stroke: #667eea;
            }
            
            .logo span {
                font-size: 24px;
                font-weight: bold;
                color: #667eea;
            }
            
            .auth-header h1 {
                font-size: 32px;
                color: #333;
                margin-bottom: 10px;
            }
            
            .auth-header p {
                color: #666;
            }
            
            .auth-form {
                width: 100%;
                max-width: 400px;
            }
            
            .input-group {
                margin-bottom: 20px;
                position: relative;
            }
            
            .input-group label {
                display: block;
                margin-bottom: 8px;
                color: #555;
                font-weight: 500;
                font-size: 14px;
            }
            
            .input-group input {
                width: 100%;
                padding: 15px 45px;
                border: 2px solid #e0e0e0;
                border-radius: 12px;
                font-size: 16px;
                transition: all 0.3s;
            }
            
            .input-group input:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
            
            .input-icon {
                position: absolute;
                left: 15px;
                bottom: 15px;
                font-size: 20px;
                color: #999;
            }
            
            .btn-primary {
                width: 100%;
                padding: 15px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 18px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                transition: all 0.3s;
                margin-top: 20px;
            }
            
            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
            }
            
            .auth-footer {
                margin-top: 30px;
                color: #666;
            }
            
            .auth-footer a {
                color: #667eea;
                text-decoration: none;
                font-weight: 600;
            }
            
            .auth-footer a:hover {
                text-decoration: underline;
            }
            
            .auth-decoration {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            }
            
            .decoration-content {
                text-align: center;
                max-width: 400px;
                padding: 40px;
            }
            
            .decoration-content h2 {
                font-size: 36px;
                margin-bottom: 20px;
            }
            
            .decoration-content p {
                font-size: 18px;
                opacity: 0.9;
                margin-bottom: 40px;
            }
            
            .feature-list {
                display: flex;
                flex-direction: column;
                gap: 20px;
                text-align: left;
            }
            
            .feature-item {
                display: flex;
                align-items: center;
                gap: 15px;
                font-size: 18px;
            }
            
            .feature-item span:first-child {
                font-size: 24px;
            }
            
            /* Чаты */
            .chats-layout {
                display: grid;
                grid-template-columns: 350px 1fr;
                height: 100vh;
                background: white;
            }
            
            .sidebar {
                background: #f8f9fa;
                border-right: 1px solid #e0e0e0;
                display: flex;
                flex-direction: column;
            }
            
            .sidebar-header {
                padding: 20px;
                background: white;
                border-bottom: 1px solid #e0e0e0;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .user-profile {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .user-avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 18px;
            }
            
            .user-info h3 {
                font-size: 16px;
                color: #333;
                margin-bottom: 4px;
            }
            
            .user-status {
                font-size: 13px;
                color: #4CAF50;
            }
            
            .icon-button {
                width: 40px;
                height: 40px;
                border: none;
                background: none;
                border-radius: 50%;
                cursor: pointer;
                color: #666;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
            }
            
            .icon-button:hover {
                background: #f0f0f0;
                color: #333;
            }
            
            .search-box {
                padding: 20px;
                position: relative;
            }
            
            .search-box svg {
                position: absolute;
                left: 35px;
                top: 35px;
                color: #999;
            }
            
            .search-box input {
                width: 100%;
                padding: 12px 20px 12px 45px;
                border: 1px solid #e0e0e0;
                border-radius: 25px;
                font-size: 14px;
                background: white;
            }
            
            .search-box input:focus {
                outline: none;
                border-color: #667eea;
            }
            
            .add-contact {
                padding: 0 20px 20px;
            }
            
            .add-contact h4 {
                color: #333;
                margin-bottom: 10px;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .add-contact-input {
                display: flex;
                gap: 10px;
            }
            
            .add-contact-input input {
                flex: 1;
                padding: 12px;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
            }
            
            .add-contact-input input:focus {
                outline: none;
                border-color: #667eea;
            }
            
            .btn-add {
                width: 45px;
                height: 45px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
            }
            
            .btn-add:hover {
                transform: scale(1.05);
            }
            
            .chats-list {
                flex: 1;
                overflow-y: auto;
                padding: 0 20px;
            }
            
            .chat-item {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px;
                background: white;
                border-radius: 12px;
                margin-bottom: 10px;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .chat-item:hover {
                transform: translateX(5px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            
            .chat-avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 16px;
                flex-shrink: 0;
            }
            
            .chat-avatar.large {
                width: 60px;
                height: 60px;
                font-size: 20px;
            }
            
            .chat-info {
                flex: 1;
                min-width: 0;
            }
            
            .chat-name-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 5px;
            }
            
            .chat-name {
                font-weight: 600;
                color: #333;
            }
            
            .chat-time {
                font-size: 12px;
                color: #999;
            }
            
            .chat-last-message {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 13px;
            }
            
            .message-text {
                color: #666;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 150px;
            }
            
            .unread-badge {
                background: #667eea;
                color: white;
                padding: 2px 6px;
                border-radius: 10px;
                font-size: 11px;
                font-weight: 600;
            }
            
            .empty-chats {
                text-align: center;
                padding: 40px 20px;
                color: #999;
            }
            
            .empty-icon {
                font-size: 48px;
                margin-bottom: 15px;
                opacity: 0.5;
            }
            
            .empty-hint {
                font-size: 13px;
                display: block;
                margin-top: 10px;
            }
            
            /* Главное окно */
            .chat-main {
                background: #f5f7fb;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .welcome-screen {
                text-align: center;
                max-width: 400px;
                padding: 40px;
            }
            
            .welcome-icon {
                font-size: 80px;
                margin-bottom: 30px;
                opacity: 0.5;
            }
            
            .welcome-screen h2 {
                color: #333;
                margin-bottom: 15px;
            }
            
            .welcome-screen p {
                color: #666;
                margin-bottom: 30px;
            }
            
            .welcome-tips {
                display: flex;
                flex-direction: column;
                gap: 15px;
                text-align: left;
                background: white;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            }
            
            .tip {
                display: flex;
                align-items: center;
                gap: 10px;
                color: #666;
            }
            
            .tip span:first-child {
                font-size: 20px;
            }
            
            /* Окно чата */
            .chat-window {
                display: flex;
                flex-direction: column;
                height: 100%;
                width: 100%;
            }
            
            .chat-window-header {
                padding: 20px;
                background: white;
                border-bottom: 1px solid #e0e0e0;
            }
            
            .chat-window-user {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .chat-window-info h3 {
                color: #333;
                margin-bottom: 5px;
            }
            
            .messages-container {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
            }
            
            .message-input-container {
                padding: 20px;
                background: white;
                border-top: 1px solid #e0e0e0;
                display: flex;
                gap: 10px;
            }
            
            .message-input-container input {
                flex: 1;
                padding: 15px;
                border: 1px solid #e0e0e0;
                border-radius: 25px;
                font-size: 14px;
            }
            
            .message-input-container input:focus {
                outline: none;
                border-color: #667eea;
            }
            
            .send-button {
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                transition: all 0.3s;
            }
            
            .send-button:hover {
                transform: scale(1.1);
            }
            
            /* Уведомления */
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 12px;
                color: white;
                transform: translateX(400px);
                transition: transform 0.3s;
                z-index: 1000;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification.success {
                background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            }
            
            .notification.error {
                background: linear-gradient(135deg, #f44336 0%, #da190b 100%);
            }
            
            .notification.info {
                background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
            }
            
            /* Адаптивность */
            @media (max-width: 768px) {
                .auth-container {
                    grid-template-columns: 1fr;
                }
                
                .auth-decoration {
                    display: none;
                }
                
                .chats-layout {
                    grid-template-columns: 1fr;
                }
                
                .sidebar {
                    display: none;
                }
            }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }
}

// Создаем корневой элемент
document.addEventListener('DOMContentLoaded', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    
    new MessengerApp();
});