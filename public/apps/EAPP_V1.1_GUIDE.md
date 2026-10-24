# 📱 eApp v1.1 - Новая версия формата

## 🆕 Что нового в v1.1?

### ✨ Новые возможности:

1. **Кастомные стили** - полностью независимые от темы сайта
2. **Собственный фон** - любой цвет или градиент
3. **Ориентация** - portrait/landscape/auto
4. **Полноэкранный режим** - скрытие статусбара
5. **Внешние библиотеки** - структурированное подключение CDN
6. **Разрешения** - явное указание необходимых прав
7. **Метаданные** - категория, теги, контакты
8. **Настройки запуска** - splash screen, анимации

## 📄 Структура .eapp v1.1

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
  "code": "<div>HTML</div><style>CSS</style><script>JS</script>",
  
  "eappVersion": "1.1",
  
  "style": ".my-app { background: red; }",
  
  "background": "#1a1a1a",
  
  "orientation": "portrait",
  
  "fullscreen": false,
  
  "externalLibs": {
    "css": ["https://cdn.example.com/style.css"],
    "js": ["https://cdn.example.com/script.js"]
  },
  
  "permissions": {
    "vibration": true,
    "notifications": false,
    "camera": false,
    "location": false,
    "storage": true
  },
  
  "metadata": {
    "category": "Игры",
    "tags": ["puzzle", "casual"],
    "minOS": "1.0",
    "website": "https://example.com",
    "email": "support@example.com"
  },
  
  "launchConfig": {
    "splashScreen": true,
    "splashDuration": 2000,
    "animation": "fade"
  }
}
```

## 🎨 Кастомные стили (style)

Полностью независимые от темы сайта стили:

```json
{
  "style": ".my-app { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); } .button { transition: all 0.3s ease; } .button:hover { transform: scale(1.1); }"
}
```

## 🖼️ Фон приложения (background)

Любой CSS цвет или градиент:

```json
{
  "background": "#17212b"
}
```

или

```json
{
  "background": "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
}
```

## 🔄 Ориентация (orientation)

- `"portrait"` - только портретная (по умолчанию)
- `"landscape"` - только альбомная
- `"auto"` - автоматическая

```json
{
  "orientation": "landscape"
}
```

## 📺 Полноэкранный режим (fullscreen)

Скрывает статусбар и home indicator:

```json
{
  "fullscreen": true
}
```

## 📚 Внешние библиотеки (externalLibs)

Структурированное подключение CDN:

```json
{
  "externalLibs": {
    "css": [
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
    ],
    "js": [
      "https://unpkg.com/react@18/umd/react.production.min.js",
      "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"
    ]
  }
}
```

## 🔐 Разрешения (permissions)

Явное указание необходимых прав:

```json
{
  "permissions": {
    "vibration": true,
    "notifications": true,
    "camera": false,
    "location": false,
    "storage": true
  }
}
```

## 📋 Метаданные (metadata)

Дополнительная информация о приложении:

```json
{
  "metadata": {
    "category": "Мессенджеры",
    "tags": ["chat", "messaging", "social"],
    "minOS": "1.0",
    "website": "https://telegram.org",
    "email": "support@telegram.org"
  }
}
```

## 🚀 Настройки запуска (launchConfig)

```json
{
  "launchConfig": {
    "splashScreen": true,
    "splashDuration": 2000,
    "animation": "fade"
  }
}
```

Анимации:
- `"fade"` - плавное появление
- `"slide"` - скольжение
- `"zoom"` - увеличение
- `"none"` - без анимации

## 🔄 Обратная совместимость

Старые .eapp v1.0 файлы продолжают работать! Версия определяется автоматически:

- Если есть поле `"eappVersion": "1.1"` → версия 1.1
- Иначе → версия 1.0

На иконке приложения отображается версия:
- `v1.0` - старая версия
- `v1.1` - новая версия

## 📝 Примеры

### Минимальное приложение v1.1:

```json
{
  "id": "simple_app",
  "name": "Простое",
  "icon": "🎯",
  "color": "from-blue-500 to-purple-500",
  "eappVersion": "1.1",
  "code": "<div style='padding:20px;color:white;'><h1>Привет!</h1></div>"
}
```

### Приложение с кастомным фоном и стилями:

```json
{
  "id": "styled_app",
  "name": "Стильное",
  "icon": "✨",
  "color": "from-pink-500 to-rose-500",
  "eappVersion": "1.1",
  "background": "#1a1a2e",
  "style": ".app { font-family: 'Comic Sans MS'; } .title { color: #ff6b6b; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }",
  "code": "<div class='app'><h1 class='title'>Стильное приложение!</h1></div>"
}
```

### Приложение с внешними библиотеками:

```json
{
  "id": "react_app",
  "name": "React App",
  "icon": "⚛️",
  "color": "from-cyan-500 to-blue-500",
  "eappVersion": "1.1",
  "externalLibs": {
    "js": [
      "https://unpkg.com/react@18/umd/react.production.min.js",
      "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
      "https://unpkg.com/@babel/standalone/babel.min.js"
    ]
  },
  "code": "<div id='root'></div><script type='text/babel'>function App(){return <h1 style={{color:'white',padding:'20px'}}>React работает!</h1>}ReactDOM.createRoot(document.getElementById('root')).render(<App/>);</script>"
}
```

### Полноценное приложение со всеми возможностями:

Смотри файл `public/apps/telegram_v2.eapp` - это полный пример .eapp v1.1!

## 🎯 API для приложений

В v1.1 добавлен новый метод:

```javascript
// Получить информацию о приложении
const info = ePhone.getAppInfo();
// { id: 'my_app', name: 'Моё Приложение', version: '1.1', author: 'Ваше Имя' }
```

Остальные методы остались прежними:
- `ePhone.getScreenSize()`
- `ePhone.vibrate(pattern)`
- `ePhone.save(key, value)`
- `ePhone.load(key)`
- `ePhone.closeApp()`
- `ePhone.getSettings()`
- `ePhone.getModel()`
- `ePhone.setSettings(settings)`
- `ePhone.switchModel(model)`

## 💡 Советы

1. **Используйте v1.1** для новых приложений - больше возможностей
2. **Кастомные стили** не зависят от темы сайта
3. **Внешние библиотеки** подключайте через `externalLibs`
4. **Указывайте разрешения** явно для безопасности
5. **Добавляйте метаданные** для лучшей организации
6. **Тестируйте** на всех моделях телефонов

## 🆚 Сравнение версий

| Возможность | v1.0 | v1.1 |
|-------------|------|------|
| Базовый код | ✅ | ✅ |
| Кастомные стили | ❌ | ✅ |
| Собственный фон | ❌ | ✅ |
| Ориентация | ❌ | ✅ |
| Полноэкранный режим | ❌ | ✅ |
| Внешние библиотеки | ⚠️ (в коде) | ✅ (структурированно) |
| Разрешения | ❌ | ✅ |
| Метаданные | ❌ | ✅ |
| Настройки запуска | ❌ | ✅ |
| Обратная совместимость | ✅ | ✅ |

Удачи в разработке! 🚀
