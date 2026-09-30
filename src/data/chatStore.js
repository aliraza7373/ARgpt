import seedChats from "./db";

const chats = new Map(
  seedChats.map((chat) => [chat.id, { ...chat, messages: [...chat.messages] }]),
);
const listeners = new Set();
let snapshot = [...chats.values()];

const publish = () => {
  snapshot = [...chats.values()];
  listeners.forEach((listener) => listener());
};

export const subscribeToChats = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getChats = () => snapshot;

export const getChat = (id) => chats.get(id) ?? null;

export const createChat = () => {
  const chat = {
    id: crypto.randomUUID(),
    title: "New chat",
    messages: [],
  };
  chats.set(chat.id, chat);
  publish();
  return chat;
};

export const addMessage = (chatId, message) => {
  const chat = chats.get(chatId);
  if (!chat) return null;

  const title = chat.title === "New chat" && message.sender === "user"
    ? message.text.trim().slice(0, 36) || "New chat"
    : chat.title;
  const updatedChat = {
    ...chat,
    title,
    messages: [...chat.messages, message],
  };
  chats.set(chatId, updatedChat);
  publish();
  return updatedChat;
};

export const deleteChat = (chatId) => {
  if (!chats.delete(chatId)) return false;
  publish();
  return true;
};
