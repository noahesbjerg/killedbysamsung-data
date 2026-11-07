import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export const categories = ['App', 'Feature', 'Hardware', 'Platform', 'Service'];
const statuses = ['announced', 'discontinued'];
const fields = new Set(['id', 'name', 'category', 'status', 'startDate', 'endDate', 'description', 'sources']);

function isDate(value) {
  if (typeof value !== 'string' || !/^[1-9]\d{3}(?:-\d{2}(?:-\d{2})?)?$/.test(value)) return false;
  const [year, month = '01', day = '01'] = value.split('-');
  const fullDate = [year, month, day].join('-');
  const date = new Date(fullDate + 'T00:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().startsWith(fullDate);
}

function isText(value) {
  return typeof value === 'string' && value.trim() !== '';
}

export function validateCatalogue(entries) {
  if (!Array.isArray(entries) || !entries.length) throw new Error('Expected a nonempty catalogue array');
  const ids = new Set();
  for (const [index, entry] of entries.entries()) {
    const fail = message => { throw new Error('Entry ' + (entry?.id ?? index + 1) + ': ' + message); };
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) fail('expected an object');
    for (const key of Object.keys(entry)) if (!fields.has(key)) fail('unknown field ' + key);
    if (!isText(entry.id) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id)) fail('expected a lowercase slug');
    if (ids.has(entry.id)) fail('duplicate ID');
    ids.add(entry.id);
    if (!isText(entry.name) || !isText(entry.description)) fail('name and description are required');
    if (!categories.includes(entry.category) || !statuses.includes(entry.status)) fail('unknown category or status');
    if (!isDate(entry.endDate)) fail('invalid endDate');
    if ('startDate' in entry) {
      if (!isDate(entry.startDate)) fail('invalid startDate');
      const precision = Math.min(entry.startDate.length, entry.endDate.length);
      if (entry.startDate.slice(0, precision) > entry.endDate.slice(0, precision)) fail('startDate follows endDate');
    }
    if (!Array.isArray(entry.sources) || !entry.sources.length) fail('at least one source is required');
    for (const source of entry.sources) {
      if (!source || !isText(source.label) || !isText(source.url) || !URL.canParse(source.url)) fail('invalid source');
      const url = new URL(source.url);
      if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) fail('expected a public HTTPS source');
    }
  }
  return entries;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const data = JSON.parse(await readFile(new URL('catalogue.json', import.meta.url), 'utf8'));
  console.log('Validated ' + validateCatalogue(data).length + ' entries.');
}
