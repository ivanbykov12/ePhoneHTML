import React, { useState } from 'react';

interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
}

const NotesApp: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, title: 'Список покупок', content: 'Молоко, хлеб, яйца, сыр, масло', date: 'Сегодня' },
    { id: 2, title: 'Идеи для проекта', content: 'Сделать клон iPhone, добавить игры, Dynamic Island', date: 'Вчера' },
    { id: 3, title: 'Рецепт', content: 'Паста карбонара: бекон, яйца, пармезан, чёрный перец', date: '2 дня назад' },
  ]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const openNote = (note: Note) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const saveNote = () => {
    if (!selectedNote) return;
    setNotes(prev => prev.map(n => n.id === selectedNote.id ? { ...n, title: editTitle, content: editContent } : n));
    setSelectedNote(null);
  };

  const createNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: 'Новая заметка',
      content: '',
      date: 'Только что',
    };
    setNotes([newNote, ...notes]);
    openNote(newNote);
  };

  const deleteNote = (id: number) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    setSelectedNote(null);
  };

  if (selectedNote) {
    return (
      <div className="w-full h-full bg-black pt-2 flex flex-col">
        <div className="flex items-center justify-between px-4 mb-4">
          <button onClick={saveNote} className="text-blue-400 text-sm">← Заметки</button>
          <button onClick={() => deleteNote(selectedNote.id)} className="text-red-400 text-sm">Удалить</button>
        </div>
        <div className="flex-1 px-4 overflow-y-auto">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full bg-transparent text-white text-xl font-bold outline-none mb-3"
            placeholder="Заголовок"
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full bg-transparent text-gray-300 text-sm outline-none resize-none h-64"
            placeholder="Начните писать..."
          />
        </div>
        <div className="p-4 border-t border-gray-800">
          <button onClick={saveNote} className="w-full py-3 bg-yellow-500 rounded-xl text-black font-bold">
            Сохранить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black pt-2 overflow-y-auto pb-20">
      <div className="px-4 mb-4">
        <h1 className="text-white text-2xl font-bold">Заметки</h1>
        <div className="bg-gray-800 rounded-xl px-4 py-2 flex items-center gap-2 mt-3">
          <span className="text-gray-400">🔍</span>
          <input type="text" placeholder="Поиск" className="bg-transparent text-white text-sm flex-1 outline-none" />
        </div>
      </div>

      <div className="px-4 space-y-2">
        {notes.map(note => (
          <div
            key={note.id}
            onClick={() => openNote(note)}
            className="bg-gray-800 rounded-xl p-4 cursor-pointer active:bg-gray-700"
          >
            <div className="text-white font-medium">{note.title}</div>
            <div className="text-gray-400 text-sm mt-1 truncate">{note.content}</div>
            <div className="text-gray-500 text-xs mt-2">{note.date}</div>
          </div>
        ))}
      </div>

      <button
        onClick={createNote}
        className="fixed bottom-24 right-8 w-14 h-14 bg-yellow-500 rounded-full flex items-center justify-center text-2xl shadow-lg active:scale-90"
        style={{ position: 'absolute' }}
      >
        ✏️
      </button>
    </div>
  );
};

export default NotesApp;
