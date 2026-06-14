## 🚀 Инструкция по запуску проекта

Проект построен на базе **Vite** и запускается с помощью стандартных **npm-скриптов**.

### ⚡ Быстрый старт

```bash
npm install
npm run dev
```

После запуска приложение будет доступно по адресу:

```text
http://localhost:5173
```

---

## 📋 Предварительные требования

Перед запуском убедитесь, что установлены:

- **Node.js** версии **18+** (рекомендуется LTS)
- **npm** (идёт вместе с Node.js)

Проверить установку можно командами:

```bash
node -v
npm -v
```

---

## 🔧 Локальный запуск (режим разработки)

Выполните следующие команды:

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/lfyz12/Pixi-to-skia-.git

# 2. Перейдите в директорию проекта
cd Pixi-to-skia-

# 3. Установите зависимости
npm install

# 4. Запустите сервер разработки
npm run dev
```

---

## 📦 Сборка проекта

Для создания production-сборки выполните:

```bash
npm run build
```

Результат сборки будет находиться в директории:

```text
dist/
```

---

## 👀 Предпросмотр production-сборки

Для локального запуска production-версии:

```bash
npm run preview
```

---

## 🛠 Используемые технологии

- TypeScript
- Vite
- PixiJS
- CanvasKit (Skia)

---

## ⚠ Возможные проблемы

Если возникают ошибки при установке зависимостей:

```bash
rm -rf node_modules package-lock.json
npm install
```

Для Windows:

```bash
rmdir /s /q node_modules
del package-lock.json
npm install
```