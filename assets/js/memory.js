// CORTEX Memory — browser-side "database" layer.
// GitHub Pages serves static files only, so persistence lives in localStorage
// on the device. This module is the single place that reads/writes it.

const CortexMemory = (() => {
  function _get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.error("CortexMemory read failed:", key, e);
      return fallback;
    }
  }

  function _set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error("CortexMemory write failed:", key, e);
      return false;
    }
  }

  const keys = CORTEX_CONFIG.storageKeys;

  return {
    getTasks: () => _get(keys.tasks, []),
    setTasks: (tasks) => _set(keys.tasks, tasks),
    addTask: (task) => {
      const tasks = _get(keys.tasks, []);
      tasks.push({ id: Date.now(), done: false, ...task });
      _set(keys.tasks, tasks);
      return tasks;
    },

    getProjects: () => _get(keys.projects, []),
    setProjects: (p) => _set(keys.projects, p),

    getNotes: () => _get(keys.notes, []),
    setNotes: (n) => _set(keys.notes, n),

    getMemories: () => _get(keys.memories, []),
    addMemory: (entry) => {
      const mem = _get(keys.memories, []);
      mem.push({ id: Date.now(), createdAt: new Date().toISOString(), ...entry });
      _set(keys.memories, mem);
      return mem;
    },

    getSettings: () => _get(keys.settings, {}),
    setSettings: (s) => _set(keys.settings, { ..._get(keys.settings, {}), ...s }),

    getChatHistory: () => _get(keys.chatHistory, []),
    appendChat: (message) => {
      const history = _get(keys.chatHistory, []);
      history.push(message);
      _set(keys.chatHistory, history);
      return history;
    },
    clearChatHistory: () => _set(keys.chatHistory, []),
  };
})();
