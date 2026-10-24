# 📱 ePhone Simulator - Руководство по .eapp приложениям

## ✅ Что нового в v3.2:

### 🎨 Улучшения интерфейса:
- **Убраны Windows-скроллбары** - теперь скролл выглядит как в iOS
- **Плавная прокрутка** - добавлен `-webkit-overflow-scrolling: touch`
- **Стиль iOS** - все скроллбары скрыты для чистого вида

### 🌐 Поддержка внешних библиотек:
- **CDN библиотеки** - можно подключать любые внешние библиотеки
- **Font Awesome** - для иконок
- **Animate.css** - для анимаций
- **React, Vue, Angular** - любые фреймворки
- **Полноценные веб-приложения** - можно портировать Telegram, WhatsApp и т.д.

### 🔒 Расширенные разрешения iframe:
- `allow-scripts` - выполнение JavaScript
- `allow-same-origin` - доступ к localStorage
- `allow-modals` - модальные окна (alert, confirm, prompt)
- `allow-popups` - открытие новых окон
- `allow-forms` - отправка форм
- `allow-top-navigation-by-user-activation` - навигация по клику

## 📄 Структура .eapp файла:

```json
{
  "id": "my_app",
  "name": "Моё Приложение",
  "icon": "material:gamepad",
  "color": "from-purple-500 to-pink-500",
  "version": "1.0.0",
  "author": "Ваше Имя",
  "description": "Описание",
  "supportedModels": ["iphone8", "iphonex", "iphone14"],
  "isSystem": false,
  "changelog": "Версия 1.0 - первый релиз",
  "code": "<div>HTML</div><style>CSS</style><script>JS</script>"
}
```

## 🌐 Использование внешних библиотек:

### Пример с Font Awesome и Animate.css:

```html
<!-- Подключаем внешние библиотеки -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">

<div class="my-app">
  <i class="fas fa-heart animate__animated animate__heartBeat"></i>
</div>

<style>
.my-app {
  text-align: center;
  padding: 20px;
}
.fas {
  font-size: 48px;
  color: #ff6b6b;
}
</style>
```

### Пример с React (через CDN):

```html
<!-- React CDN -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

<div id="root"></div>

<script type="text/babel">
function App() {
  const [count, setCount] = React.useState(0);
  
  return (
    <div style={{padding: '20px', textAlign: 'center'}}>
      <h1>React в ePhone!</h1>
      <p>Счётчик: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Увеличить
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script>
```

### Пример с Vue.js:

```html
<!-- Vue 3 CDN -->
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<div id="app">
  <h1>{{ message }}</h1>
  <button @click="count++">Счётчик: {{ count }}</button>
</div>

<script>
const { createApp } = Vue;

createApp({
  data() {
    return {
      message: 'Vue в ePhone!',
      count: 0
    }
  }
}).mount('#app');
</script>
```

### Пример портирования Telegram:

Смотри файл `public/apps/telegram_example.eapp` - это полноценный пример Telegram-подобного интерфейса с:
- Font Awesome иконками
- Animate.css анимациями
- Плавными переходами
- Адаптивным дизайном

## 🎮 API для приложений:

```javascript
// Получить настройки
const settings = ePhone.getSettings();
settings.darkMode      // true/false
settings.phoneModel    // 'iphone8' | 'iphonex' | 'iphone14'

// Получить модель
const model = ePhone.getModel();

// Сохранить/загрузить данные
ePhone.save('highscore', 1000);
const score = ePhone.load('highscore');

// Вибрация
ePhone.vibrate(200);

// Закрыть приложение
ePhone.closeApp();

// Изменить настройки
ePhone.setSettings({ darkMode: false });

// Переключить модель телефона
ePhone.switchModel('iphone14');
```

## 🎨 Material Icons:

В коде приложения можно использовать:
```html
<span class="material-icons">gamepad</span>
<span class="material-symbols-outlined">settings</span>
```

Или в иконке приложения:
```json
{ "icon": "material:gamepad" }
```

## 📱 Проверка совместимости:

```json
{
  "supportedModels": ["iphone8", "iphonex"]
}
```

Если приложение не поддерживает текущую модель, пользователю будет предложено переключиться.

## 🌗 Поддержка тем:

```javascript
const settings = ePhone.getSettings();
const isDark = settings.darkMode;

document.body.style.background = isDark ? '#000' : '#fff';
document.body.style.color = isDark ? '#fff' : '#000';
```

## 📂 Структура файлов:

```
public/apps/
├── manifest.json              # Список загружаемых файлов
├── template.eapp              # Шаблон
├── catch_star.eapp            # Игра "Поймай Звезду"
├── reaction_test.eapp         # Тест реакции
├── telegram_example.eapp      # Пример с внешними библиотеками
└── system/                    # Системные приложения
    ├── snake.eapp
    ├── tetris.eapp
    ├── game2048.eapp
    ├── flappy.eapp
    ├── calculator.eapp
    ├── clock.eapp
    ├── weather.eapp
    ├── settings.eapp
    ├── appstore.eapp
    ├── notes.eapp
    ├── photos.eapp
    ├── music.eapp
    ├── safari.eapp
    ├── messages.eapp
    ├── maps.eapp
    └── health.eapp
```

## 🚀 Как добавить приложение:

1. Создай файл `my_app.eapp` в `public/apps/`
2. Напиши JSON с кодом (смотри примеры выше)
3. Добавь `"my_app.eapp"` в `manifest.json`
4. Перезагрузи страницу
5. Приложение появится в Custom Apps!

## 💡 Популярные CDN библиотеки:

### UI Фреймворки:
- **React**: `https://unpkg.com/react@18/umd/react.production.min.js`
- **Vue**: `https://unpkg.com/vue@3/dist/vue.global.js`
- **Angular**: `https://unpkg.com/@angular/core@16/bundles/core.umd.js`

### Иконки:
- **Font Awesome**: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`
- **Material Icons**: уже подключены по умолчанию
- **Bootstrap Icons**: `https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css`

### Анимации:
- **Animate.css**: `https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css`
- **AOS**: `https://unpkg.com/aos@2.3.1/dist/aos.css`

### Утилиты:
- **Lodash**: `https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js`
- **Moment.js**: `https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js`
- **Axios**: `https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js`

### Игры:
- **Phaser**: `https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js`
- **Three.js**: `https://cdnjs.cloudflare.com/ajax/libs/three.js/0.150.0/three.min.js`

## ⚠️ Ограничения:

- Нельзя использовать ES6 modules (import/export) - используй CDN версии
- Некоторые API могут быть ограничены из-за sandbox
- Максимальный размер файла: ~1MB
- Внешние ресурсы должны быть доступны по HTTPS

## 🎯 Примеры использования:

### Простое приложение с Font Awesome:
```json
{
  "id": "social_app",
  "name": "Соцсети",
  "icon": "material:share",
  "color": "from-blue-500 to-purple-500",
  "code": "<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css\"><div style=\"padding:20px;text-align:center;\"><i class=\"fab fa-facebook\" style=\"font-size:48px;color:#1877f2;margin:10px;\"></i><i class=\"fab fa-twitter\" style=\"font-size:48px;color:#1da1f2;margin:10px;\"></i><i class=\"fab fa-instagram\" style=\"font-size:48px;color:#e4405f;margin:10px;\"></i></div>"
}
```

### Игра на Phaser:
```json
{
  "id": "phaser_game",
  "name": "Phaser Игра",
  "icon": "material:sports_esports",
  "color": "from-green-500 to-teal-500",
  "code": "<script src=\"https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js\"></script><div id=\"game\"></div><script>var config={type:Phaser.AUTO,width:350,height:500,parent:'game',scene:{create:function(){this.add.text(100,200,'Phaser работает!',{fontSize:'24px',fill:'#fff'})}}};new Phaser.Game(config);</script>"
}
```

Удачи в разработке! 🎉
