# Kanban Board (Webpack + Drag&Drop)

[![GitHub Pages](https://img.shields.io/badge/Live_Demo-FF6B6B?style=for-the-badge&logo=github)](https://your-username.github.io/kanban-board)
[![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=webpack)](https://webpack.js.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/ru/docs/Web/JavaScript)

## Проект канбан-доски с полным функционалом

![Превью приложения](./public/ExampleCanbanBoard.png)

<img src="./public/ScreenityCanban.gif" >

## Техническое задание

### 📌 Основные требования
- **Webpack** сборка с Babel, SCSS и asset-лоадерами
- **Компонентный подход** (разделение на логические модули)
- **Drag&Drop API** для перемещения задач
- **LocalStorage** для сохранения состояния
- **Адаптивный дизайн** (mobile-first)

### 🛠 Реализованный функционал
| Задание | Функционал | Статус |
|---------|------------|--------|
| **1. Базовый канбан** | 4 колонки задач, добавление/удаление | ✅ |
| **2. User Menu** | Аватар с выпадающим меню | ✅ |
| **3. Роли пользователей** | Admin/User с разными правами | ✅ |

## 🏗️ Архитектура проекта
```text
project/
├── public/                     # Статические файлы
├── src/
│   ├── models/                 # Классы
│   │   ├── BaseModel
│   │   ├── Task.js
│   │   ├── User.js
│   │
│   ├── services/               # Сервисы
│   │   ├── auth.js
│   │   └── userControl.js
│   │
│   ├── templates/              # Страницы
│   │   ├── admin/
│   │   ├── new-task.html
│   │   ├── no-access.html
│   │   └── taskField.html
│   ├── styles/                 #  Стили
│       ├── style.css
│
├── app.js
├── index.html
├── state.js
└── utils.js


## 🚀 Запуск проекта
```bash
# Установка зависимостей
npm install

# Development-сервер
npm run dev

# Production-сборка
npm run build
```
### Данные для авторизации

**User:**

- login: Vasya
- password: qwerty123

**Admin:**

- login: admin
- password: 123

## 🔧 Ключевые технологии
- Webpack 5 (с горячей перезагрузкой)

- Drag&Drop API (нативный, без библиотек)

- SCSS Modules (изолированные стили)

- LocalStorage (сохранение состояния)

### ✅ Критерии выполнения 
> 1. (20/20 баллов)

> 2. 5/5 Базовый функционал канбан-доски

> 3. 10/10 Drag&Drop между колонками

> 4. 20/20 Система ролей (Admin/User)

### 📝 Обратная связь от ментора
> "Спасибо за Ваше решение. Вы справились с заданием на максимальный балл.

**Плюсы:**

* Идеальная настройка Webpack

* Чистая компонентная архитектура

* Полноценный Drag&Drop

* Гибкая система ролей

>*Проверку выполнила ментор Миллер Алиса*""

### 📬 Контакты
Для вопросов и предложений:
* 📧 galiyaga@yandex.ru
* 📞 @hikitzo