# 📱 ePhone Simulator - Система плагинов .eapp

## ✅ Что добавлено в v3.0:

### 🎨 Новые возможности:

1. **Светлая/Тёмная тема** - переключается в настройках и Control Center
2. **Control Center** - свайп вниз от статусбара для быстрого доступа
3. **Material Icons** - поддержка иконок Google Material в приложениях
4. **Проверка совместимости** - приложения спрашивают разрешение на переключение модели
5. **Редактируемый Lock Screen** - виджеты настраиваются в настройках
6. **Все настройки работают** - все вкладки полностью функциональны

### 📁 Структура .eapp файла:

```json
{
  "id": "my_app",
  "name": "Моё Приложение",
  "icon": "material:gamepad",  // или эмодзи "🎮"
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

### 🎮 Новое API:

```javascript
// Получить настройки (тема, модель, и т.д.)
const settings = ePhone.getSettings();
const isDark = settings.darkMode;
const model = settings.phoneModel;

// Получить текущую модель
const model = ePhone.getModel(); // 'iphone8' | 'iphonex' | 'iphone14'

// Сохранить/загрузить данные
ePhone.save('key', value);
const data = ePhone.load('key');

// Вибрация
ePhone.vibrate(200);

// Закрыть приложение
ePhone.closeApp();
```

### 🎨 Material Icons:

В коде приложения можно использовать:
```html
<span class="material-icons">gamepad</span>
<span class="material-symbols-outlined">settings</span>
```

Или в иконке приложения:
```json
{
  "icon": "material:gamepad"
}
```

### 📱 Поддержка моделей:

Если приложение оптимизировано только для определённых моделей:
```json
{
  "supportedModels": ["iphone8", "iphonex"]
}
```

Пользователю будет предложено переключиться на совместимую модель.

### 🌗 Поддержка тем:

Обязательно поддерживайте обе темы:
```javascript
const settings = ePhone.getSettings();
const isDark = settings.darkMode;

// Применяйте стили в зависимости от темы
document.body.style.background = isDark ? '#000' : '#fff';
document.body.style.color = isDark ? '#fff' : '#000';
```

### 🎛 Control Center:

- Свайп вниз от статусбара для открытия
- Быстрый доступ к Wi-Fi, Bluetooth, авиарежиму
- Переключение тёмной/светлой темы
- Яркость и громкость
- Фонарик, таймер, калькулятор, камера

### ⚙️ Настройки:

Все вкладки полностью функциональны:
- **Epple ID** - профиль пользователя
- **Настройки сайта** - модель телефона, Dynamic Island, Control Center
- **Экран и яркость** - тёмная тема, яркость, размер текста, цвет акцента
- **Обои** - 6 вариантов включая светлый
- **Основные** - имя устройства, язык, тактильный отклик, звуки

### 📂 Файлы:

```
public/apps/
├── manifest.json          # Список загружаемых файлов
├── template.eapp          # Шаблон с Material Icons и поддержкой тем
├── catch_star.eapp        # Игра "Поймай Звезду"
├── reaction_test.eapp     # Тест реакции
├── README.md              # Документация
└── PROMPT_FOR_AI.md       # Промпт для ИИ (обновлён!)
```

### 🚀 Как добавить приложение:

1. Создай файл `my_game.eapp` в `public/apps/`
2. Напиши JSON с кодом (смотри template.eapp)
3. Добавь `"my_game.eapp"` в `manifest.json`
4. Перезагрузи страницу
5. Приложение появится в Custom Apps!

### 💡 Советы:

- Используй Material Icons для красивых иконок
- Поддерживай обе темы (тёмную и светлую)
- Указывай supportedModels если нужно
- Сохраняй прогресс через ePhone.save()
- Редактируй в Notepad++ или VS Code

### ⚠️ Системные приложения:

Системные приложения (Змейка, Тетрис, Настройки и т.д.) нельзя конвертировать в .eapp
потому что они потеряют функционал. Но их дизайн можно менять через настройки.

### 🎯 Примеры использования:

**Простое приложение с Material Icons:**
```json
{
  "id": "counter",
  "name": "Счётчик",
  "icon": "material:plus_one",
  "color": "from-green-500 to-teal-500",
  "code": "<div style='padding:20px;text-align:center;'><span class='material-icons' style='font-size:64px;' id='count'>0</span><br><button onclick='inc()' style='padding:20px;font-size:24px;'><span class='material-icons'>add</span></button></div><script>let c=0;function inc(){c++;document.getElementById('count').textContent=c;}</script>"
}
```

**Приложение с поддержкой темы:**
```json
{
  "id": "themed_app",
  "name": "Тематическое",
  "icon": "🎨",
  "code": "<div id='app' style='padding:20px;'><h1>Привет!</h1></div><script>const s=ePhone.getSettings();const app=document.getElementById('app');app.style.background=s.darkMode?'#1a1a1a':'#f0f0f0';app.style.color=s.darkMode?'#fff':'#000';</script>"
}
```

Удачи в разработке! 🎉
