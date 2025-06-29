// bookingLogic.js

/**
 * Generate an array of date intervals over a given count of days.
 * @param {number} intervalCount - Number of intervals (e.g., 4 → produces 5 dates)
 * @param {number} intervalDays  - Days between each interval
 * @returns {{From: string, To: string}[]}
 */
function generateDateInterval(intervalCount = 4, intervalDays = 1) {
  const result = [];
  const layoutOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
  let current = new Date();

  for (let i = 0; i <= intervalCount; i++) {
    const next = new Date(current);
    next.setDate(current.getDate() + intervalDays);

    result.push({
      From: current.toLocaleDateString('en-GB', layoutOptions),
      To:   next.toLocaleDateString('en-GB', layoutOptions),
    });

    current = next;
  }

  return result;
}


function generateTimeSlots(startStr = '06:30', endStr = '20:30', intervalMinutes = 10) {
  const slots = [];
  const now = new Date();

  const [sh, sm] = startStr.split(':').map(Number);
  const [eh, em] = endStr.split(':').map(Number);
  let current = new Date(now.getFullYear(), now.getMonth(), now.getDate(), sh, sm, 0);
  const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), eh, em, 0);

  while (current < endTime) {
    const formatted = current.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: true
    });
    slots.push({ time: formatted });
    current = new Date(current.getTime() + intervalMinutes * 60000);
  }

  return slots;
}

// Export utilities
module.exports = {
  generateDateInterval,
  generateTimeSlots,
};
