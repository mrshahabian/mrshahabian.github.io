import type { CollectionEntry } from 'astro:content';

// Event dates are free text ("18 April 2026", "1-4 July 2026"); sort on the
// first day so a plain string compare doesn't put "11 October" before "18 April".
function eventTime(date: string): number {
	const t = Date.parse(date.replace(/^(\d+)\s*[-–]\s*\d+/, '$1'));
	return Number.isNaN(t) ? 0 : t;
}

export function sortEventsNewestFirst(events: CollectionEntry<'events'>[]) {
	return events.sort((a, b) => eventTime(b.data.date) - eventTime(a.data.date));
}
