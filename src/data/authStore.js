let currentUser = null;
const listeners = new Set();

const publish = () => listeners.forEach((listener) => listener());

export const subscribeToAuth = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getCurrentUser = () => currentUser;

export const signIn = (identifier) => {
  currentUser = { identifier: identifier.trim() };
  publish();
  return currentUser;
};

export const signOut = () => {
  currentUser = null;
  publish();
};
