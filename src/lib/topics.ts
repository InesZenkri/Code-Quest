import type { CodeChallenge, RoundResult } from '../types/game';

export interface TopicStat { topic: string; fixed: number; total: number }

// Per-topic tally of the rounds played this session.
export function topicStats(results: RoundResult[], deck: CodeChallenge[]): TopicStat[] {
  const byId = new Map(deck.map(c => [c.id, c.topic]));
  const stats = new Map<string, TopicStat>();
  for (const r of results) {
    const topic = byId.get(r.id) ?? 'Other';
    const stat = stats.get(topic) ?? { topic, fixed: 0, total: 0 };
    stat.total++;
    if (r.outcome === 'fixed') stat.fixed++;
    stats.set(topic, stat);
  }
  return [...stats.values()].sort((a, b) => b.total - a.total || a.topic.localeCompare(b.topic));
}
