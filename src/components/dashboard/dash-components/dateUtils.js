// dateUtils.js
export function getWeekDays() {
  const today = new Date();
  const days = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    days.push({
      date: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }),
    });
  }

  return days;
}