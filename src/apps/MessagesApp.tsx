import React, { useState } from 'react';

interface Message {
  id: number;
  text: string;
  sent: boolean;
  time: string;
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: Message[];
}

const initialChats: Chat[] = [
  {
    id: 1, name: 'Мама', avatar: '👩', lastMessage: 'Позвони когда будешь свободен', time: '12:30', unread: 2,
    messages: [
      { id: 1, text: 'Привет, как дела?', sent: false, time: '12:00' },
      { id: 2, text: 'Привет! Всё хорошо 😊', sent: true, time: '12:05' },
      { id: 3, text: 'Позвони когда будешь свободен', sent: false, time: '12:30' },
    ]
  },
  {
    id: 2, name: 'Андрей', avatar: '👨', lastMessage: 'Го в кино вечером?', time: '11:45', unread: 1,
    messages: [
      { id: 1, text: 'Йоу!', sent: false, time: '11:30' },
      { id: 2, text: 'Привет!', sent: true, time: '11:35' },
      { id: 3, text: 'Го в кино вечером?', sent: false, time: '11:45' },
    ]
  },
  {
    id: 3, name: 'Работа', avatar: '💼', lastMessage: 'Встреча в 15:00', time: '10:00', unread: 0,
    messages: [
      { id: 1, text: 'Доброе утро!', sent: false, time: '09:00' },
      { id: 2, text: 'Доброе!', sent: true, time: '09:15' },
      { id: 3, text: 'Встреча в 15:00', sent: false, time: '10:00' },
    ]
  },
  {
    id: 4, name: 'Доставка', avatar: '📦', lastMessage: 'Ваш заказ доставлен ✓', time: 'Вчера', unread: 0,
    messages: [
      { id: 1, text: 'Ваш заказ #4521 в пути', sent: false, time: 'Вчера' },
      { id: 2, text: 'Ваш заказ доставлен ✓', sent: false, time: 'Вчера' },
    ]
  },
];

const MessagesApp: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    const msg: Message = {
      id: Date.now(),
      text: newMessage,
      sent: true,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = chats.map(c =>
      c.id === selectedChat.id ? { ...c, messages: [...c.messages, msg], lastMessage: newMessage } : c
    );
    setChats(updated);
    setSelectedChat({ ...selectedChat, messages: [...selectedChat.messages, msg], lastMessage: newMessage });
    setNewMessage('');
  };

  if (selectedChat) {
    return (
      <div className="w-full h-full bg-black flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pb-3 border-b border-gray-800">
          <button onClick={() => setSelectedChat(null)} className="text-blue-400 text-sm">←</button>
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm">
            {selectedChat.avatar}
          </div>
          <div>
            <div className="text-white text-sm font-medium">{selectedChat.name}</div>
            <div className="text-green-400 text-xs">в сети</div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {selectedChat.messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] px-3 py-2 rounded-2xl ${
                msg.sent ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'
              }`}>
                <div className="text-sm">{msg.text}</div>
                <div className={`text-[10px] mt-1 ${msg.sent ? 'text-blue-200' : 'text-gray-400'}`}>{msg.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-800 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Сообщение..."
            className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 text-sm outline-none"
          />
          <button
            onClick={sendMessage}
            className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white"
          >
            ↑
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black overflow-y-auto pb-20">
      <div className="px-4 mb-4">
        <h1 className="text-white text-2xl font-bold">Сообщения</h1>
        <div className="bg-gray-800 rounded-xl px-4 py-2 flex items-center gap-2 mt-3">
          <span className="text-gray-400">🔍</span>
          <input type="text" placeholder="Поиск" className="bg-transparent text-white text-sm flex-1 outline-none" />
        </div>
      </div>

      <div className="px-4 space-y-1">
        {chats.map(chat => (
          <div
            key={chat.id}
            onClick={() => setSelectedChat(chat)}
            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer active:bg-gray-800"
          >
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xl">
              {chat.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <span className="text-white font-medium text-sm">{chat.name}</span>
                <span className="text-gray-500 text-xs">{chat.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs truncate">{chat.lastMessage}</span>
                {chat.unread > 0 && (
                  <span className="bg-green-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center ml-2">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagesApp;
