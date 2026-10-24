# 📱 ePhone Simulator v3.0 - Полное руководство

## ✅ Новые возможности:

### 🎨 Темы и дизайн:
- **Светлая/Тёмная тема** - переключается в настройках и Control Center
- **Material Icons** - поддержка Google Material иконок
- **6 обоев** - включая светлый вариант
- **Настраиваемые цвета акцента** - 6 вариантов

### 🎛 Control Center:
- Свайп вниз от статусбара для открытия
- Быстрые переключатели: Wi-Fi, Bluetooth, авиарежим
- Переключение темы
- Яркость и громкость
- Фонарик, таймер, калькулятор, камера

### 📱 Модели телефонов:
- **ePhone 8** - классический с кнопкой (375x667)
- **ePhone X** - безрамочный с чёлкой (375x812)
- **ePhone 14** - Dynamic Island (390x844)

### 🔒 Lock Screen:
- Редактируемые виджеты (погода, батарея, календарь, фитнес, часы, музыка)
- Настраиваемый шрифт
- Свайп вверх для разблокировки

### 🎮 Система .eapp:
- Пользовательские приложения в формате JSON
- Проверка совместимости с моделями
- Поддержка Material Icons
- API для сохранения данных
- Загрузка через UI или папку public/apps/

## 📄 Формат .eapp:

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
  "changelog": "Версия 1.0",
  "code": "<div>HTML</div><style>CSS</style><script>JS</script>"
}
```

## 🎮 API:

```javascript
ePhone.getScreenSize()     // { width: 390, height: 844 }
ePhone.getSettings()       // настройки (тема, модель, и т.д.)
ePhone.getModel()          // текущая модель
ePhone.vibrate(pattern)    // вибрация
ePhone.save(key, value)    // сохранить данные
ePhone.load(key)           // загрузить данные
ePhone.closeApp()          // закрыть приложение
```

## 🎨 Material Icons:

```html
<span class="material-icons">gamepad</span>
<span class="material-symbols-outlined">settings</span>
```

Или в иконке:
```json
{ "icon": "material:gamepad" }
```

## 🌗 Поддержка тем:

```javascript
const settings = ePhone.getSettings();
const isDark = settings.darkMode;

document.body.style.background = isDark ? '#000' : '#fff';
document.body.style.color = isDark ? '#fff' : '#000';
```

## 📱 Проверка совместимости:

Если приложение оптимизировано только для определённых моделей:
```json
{
  "supportedModels": ["iphone8", "iphonex"]
}
```

Пользователю будет предложено переключиться на совместимую модель.

## 📂 Структура файлов:

```
public/apps/
├── manifest.json          # Список .eapp файлов
├── template.eapp          # Шаблон
├── catch_star.eapp        # Игра
├── reaction_test.eapp     # Тест
├── README.md              # Документация
└── PROMPT_FOR_AI.md       # Промпт для ИИ
```

## 🚀 Как добавить приложение:

1. Создай `my_game.eapp` в `public/apps/`
2. Напиши JSON (смотри template.eapp)
3. Добавь в `manifest.json`
4. Перезагрузи страницу

Или загрузи через UI в Custom Apps.

## 💡 Советы:

- Используй Material Icons
- Поддерживай обе темы
- Указывай supportedModels
- Сохраняй прогресс через ePhone.save()
- Редактируй в Notepad++ или VS Code

## ⚠️ Системные приложения:

Системные приложения (Змейка, Тетрис, Настройки и т.д.) нельзя конвертировать в .eapp
потому что они потеряют функционал. Но их дизайн можно менять через настройки.

Удачи! 🎉
