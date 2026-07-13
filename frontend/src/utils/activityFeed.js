export const logGlobalActivity = (user, action, icon, type) => {
  const feed = JSON.parse(localStorage.getItem('globalFeed')) || [];
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const next = [{ time, user, action, icon, type, id: Date.now() }, ...feed].slice(0, 30);
  localStorage.setItem('globalFeed', JSON.stringify(next));
  window.dispatchEvent(new Event('storage'));
};
