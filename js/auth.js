// Получаем формы регистрации и логина
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const accountForm = document.getElementById('accountForm'); // Новая форма аккаунта
const logoutButton = document.getElementById('logoutButton'); // Кнопка выхода

let users = JSON.parse(localStorage.getItem('users')) || []; // Получаем список пользователей из LocalStorage

// Если есть форма регистрации
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        // Проверяем, существует ли уже пользователь
        if (users.some(user => user.email === email)) {
            alert('Этот email уже зарегистрирован!');
            return;
        }

        // Сохраняем нового пользователя
        users.push({ email, password, nickname: '', avatar: '' });
        localStorage.setItem('users', JSON.stringify(users)); // Сохраняем пользователей в LocalStorage

        if (remember) {
            localStorage.setItem('userEmail', email);
            localStorage.setItem('isLoggedIn', 'true'); // Сохраняем состояние авторизации
        }

        alert('Пользователь зарегистрирован!');
        window.location.href = 'index.html'; // Перенаправление на страницу логина
    });
}

// Если есть форма логина
if (loginForm) {
    // Проверяем, был ли пользователь ранее авторизован
    const checkLogin = () => {
        const loggedInEmail = localStorage.getItem('userEmail');
        if (loggedInEmail) {
            // Если пользователь уже авторизован, перенаправляем его на главную страницу
            window.location.href = 'audio-planet.html'; // Перенаправление на главную страницу
        }
    };

    // Устанавливаем таймаут перед проверкой
    setTimeout(checkLogin, 100); // Задержка 100 мс для предотвращения немедленного перенаправления

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Проверяем, введенные данные с сохраненными пользователями
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            alert('Успешный вход!');
            localStorage.setItem('isLoggedIn', 'true'); // Устанавливаем флаг авторизации
            localStorage.setItem('userEmail', email); // Сохраняем email для будущих входов
            window.location.href = 'audio-planet.html'; // Перенаправление на главную страницу
        } else {
            alert('Неверный email или пароль');
        }
    });
}

// Проверка авторизации при доступе к странице audio-planet.html
const checkAuth = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        alert('Вам нужно войти в систему, чтобы получить доступ к этой странице.');
        window.location.href = 'login.html';
    }
};

// Если мы находимся на audio-planet.html, проверяем авторизацию
if (window.location.pathname.includes('audio-planet.html')) {
    checkAuth();
}

// Если есть форма аккаунта
if (accountForm) {
    const nicknameInput = document.getElementById("nickname");
    const avatarInput = document.getElementById("avatar");
    const avatarImage = document.getElementById("avatarImage");

    // Загрузка данных при открытии страницы аккаунта
    const currentUserEmail = localStorage.getItem("userEmail");
    const currentUser = users.find(user => user.email === currentUserEmail);

    if (currentUser) {
        nicknameInput.value = currentUser.nickname || ''; // Загружаем никнейм
        if (currentUser.avatar) {
            avatarImage.src = currentUser.avatar; // Загружаем аватар
            avatarImage.style.display = 'block'; // Убедитесь, что аватар отображается
        }
    }

    // Обработка отправки формы аккаунта
    accountForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Отмена стандартной отправки формы

        const newNickname = nicknameInput.value;
        const avatarFile = avatarInput.files[0];

        // Сохранение никнейма и аватара в Local Storage
        if (currentUser) {
            currentUser.nickname = newNickname; // Обновляем никнейм
            if (avatarFile) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    currentUser.avatar = e.target.result; // Сохраняем аватар
                    localStorage.setItem('users', JSON.stringify(users)); // Сохраняем изменения
                    alert("Никнейм и аватар сохранены!");
                    avatarImage.src = e.target.result; // Обновление аватара на странице
                };
                reader.readAsDataURL(avatarFile);
            } else {
                localStorage.setItem('users', JSON.stringify(users)); // Сохраняем изменения
                alert("Никнейм сохранен!");
            }

            // Можно добавить логику для сохранения пароля
            const password = document.getElementById("password").value;
            if (password) {
                currentUser.password = password; // Обновляем пароль
                localStorage.setItem('users', JSON.stringify(users)); // Сохраняем изменения
                alert("Пароль обновлен!");
            }
        }
    });
}

// Переход на страницу аккаунта при нажатии на кнопку
const accountButton = document.getElementById('accountButton');

if (accountButton) {
    accountButton.addEventListener('click', () => {
        window.location.href = 'account.html'; // Переход на страницу аккаунта
    });
}

// Обработка кнопки выхода из аккаунта
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn'); // Удаляем флаг авторизации
        localStorage.removeItem('userEmail'); // Удаляем email
        alert('Вы вышли из системы.');
        window.location.href = 'index.html'; // Перенаправление на страницу логина
    });
}
