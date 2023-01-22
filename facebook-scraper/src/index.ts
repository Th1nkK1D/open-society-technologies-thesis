import { launch } from 'puppeteer';
import { csvFormatBody } from 'd3-dsv';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { getPostsFromGroupTimeline, loginFacebook, Post } from './actions.js';

const OUT_DIR = 'dist';
const CSV_HEADERS: Array<keyof Post> = [
  'publish_time',
  'top_level_post_id',
  'actor_id',
  'ent_attachement_type',
  'text',
];

const groupId = process.argv[process.argv.length - 1];
const facebookEmail = process.env.FACEBOOK_EMAIL;
const facebookPassword = process.env.FACEBOOK_PASSWORD;

if (!facebookEmail || !facebookPassword) {
  console.error('ERROR: Please specify Facebook credential');
  process.exit(1);
}

console.log(`Target group: ${groupId}`);

if (!existsSync(OUT_DIR)) {
  mkdirSync(OUT_DIR);
}

const outputFile = `${OUT_DIR}/${new Date()
  .toLocaleString('en', {
    dateStyle: 'short',
    timeStyle: 'medium',
    hour12: false,
  })
  .replaceAll(':', '-')
  .replaceAll('/', '-')
  .replaceAll(', ', '_')}.csv`;

console.log(`Writing to ${outputFile}`);

writeFileSync(outputFile, CSV_HEADERS.join(','));

(async () => {
  const browser = await launch({
    headless: false,
    slowMo: 5,
  });

  const page = await browser.newPage();

  await loginFacebook(page, facebookEmail, facebookPassword);

  await page.goto(`https://m.facebook.com/groups/${groupId}`);

  const posts = await getPostsFromGroupTimeline(page);

  writeFileSync(outputFile, '\n' + csvFormatBody(posts, CSV_HEADERS), {
    flag: 'a',
  });

  await browser.close();
})();
