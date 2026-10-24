# 📱 ePhone Simulator - Полное руководство по .eapp

## 📂 Где находятся системные .eapp?

Системные приложения находятся в папке **`public/apps/system/`**:

```
public/apps/system/
├── snake.eapp         # 🐍 Змейка
├── tetris.eapp        # 🧱 Тетрис
├── game2048.eapp      # 🔢 2048
├── calculator.eapp    # 🔢 Калькулятор
├── clock.eapp         # ⏰ Часы
└── weather.eapp       # 🌤 Погода
```

## 🏛 Что такое системные приложения?

Системные приложения:
- Находятся в `public/apps/system/`
- Помечены флагом `"isSystem": true`
- Отображаются на рабочем столе с синей буквой **"S"** в углу иконки
- Могут быть отредактированы как обычные .eapp файлы
- Загружаются автоматически при старте

## 📝 Как редактировать системное приложение?

1. Открой файл в `public/apps/system/` (например `snake.eapp`)
2. Редактируй в Notepad++ или VS Code
3. Сохрани файл
4. Перезагрузи страницу в браузере
5. Изменения применятся!

## ⚠️ Важно при редактировании

- Создавай резервные копии перед изменением
- Системные приложения имеют сложную логику
- Не удаляй обязательные поля: `id`, `name`, `icon`, `code`
- Тестируй изменения перед публикацией

## 📄 Структура .eapp файла

```json
{
  "id": "snake_system",
  "name": "Змейка",
  "icon": "material:catching_pokemon",
  "color": "from-green-400 to-green-600",
  "version": "1.0.0",
  "author": "ePhone System",
  "description": "Классическая игра Змейка",
  "supportedModels": ["iphone8", "iphonex", "iphone14"],
  "isSystem": true,
  "changelog": "Системное приложение",
  "code": "<div>...</div><style>...</style><script>...</script>"
}
```

## 🎮 API для приложений

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
```

## 🎨 Material Icons

Используй Material Icons в коде:
```html
<span class="material-icons">gamepad</span>
```

Или в иконке приложения:
```json
{ "icon": "material:gamepad" }
```

## 🌗 Поддержка тем

```javascript
const settings = ePhone.getSettings();
const isDark = settings.darkMode;

document.body.style.background = isDark ? '#000' : '#fff';
document.body.style.color = isDark ? '#fff' : '#000';
```

## 📱 Проверка совместимости

```json
{
  "supportedModels": ["iphone8", "iphonex"]
}
```

Если приложение не поддерживает текущую модель, пользователю будет предложено переключиться.

## 🚀 Создание своего приложения

1. Создай файл `my_app.eapp` в `public/apps/`
2. Напиши JSON с кодом
3. Добавь `"my_app.eapp"` в `manifest.json`
4. Перезагрузи страницу
5. Приложение появится в папке Custom Apps!

## 💡 Примеры системных .eapp

### Змейка (snake.eapp)
- Canvas-based игра
- Сохранение рекорда через `ePhone.save()`
- Поддержка тёмной/светлой темы
- Material Icons для кнопок

### Тетрис (tetris.eapp)
- Классический Тетрис на Canvas
- Система очков и рекордов
- Адаптивные цвета под тему

### 2048 (game2048.eapp)
- Сетка 4x4 с анимациями
- Сохранение лучшего счёта
- Градиентные плитки

### Калькулятор (calculator.eapp)
- Полный функционал калькулятора
- Поддержка всех операций
- Стилизация под iOS

### Часы (clock.eapp)
- Мировое время
- Секундомер
- Таймер
- Будильники

### Погода (weather.eapp)
- 5 городов
- Почасовой прогноз
- Прогноз на неделю
- Детали (ветер, влажность)

## 📚 Дополнительные ресурсы

- `public/apps/PROMPT_FOR_AI.md` - промпт для ИИ
- `public/apps/template.eapp` - шаблон для создания приложений
- `public/apps/catch_star.eapp` - пример игры
- `public/apps/reaction_test.eapp` - пример утилиты

Удачи в разработке! 🎉
