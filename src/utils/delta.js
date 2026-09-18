function buildDelta(current, previous, suffix = 'so voi ky truoc') {
  if (previous === 0) {
    return current === 0
      ? { text: `0% ${suffix}`, tone: 'neutral' }
      : { text: `Moi phat sinh ${suffix}`, tone: 'positive' };
  }
  const percent = ((current - previous) / previous) * 100;
  const sign = percent > 0 ? '+' : '';
  const tone = percent > 0 ? 'positive' : percent < 0 ? 'negative' : 'neutral';
  return { text: `${sign}${percent.toFixed(1)}% ${suffix}`, tone };
}

module.exports = buildDelta;
