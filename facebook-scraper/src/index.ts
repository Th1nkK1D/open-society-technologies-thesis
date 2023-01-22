import { launch } from 'puppeteer';
import { csvFormatBody } from 'd3-dsv';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import {
  getPostsFromGroupTimeline,
  loadNextPostsFromTimeline,
  loginFacebook,
  Post,
} from './actions.js';

const OUT_DIR = 'out';
const CSV_HEADERS: Array<keyof Post> = [
  'publish_time',
  'top_level_post_id',
  'actor_id',
  'ent_attachement_type',
  'text',
];

const groupId = process.argv[process.argv.length - 3];
const dateFrom = new Date(process.argv[process.argv.length - 2]);
const dateTo = new Date(process.argv[process.argv.length - 1]);
const facebookEmail = process.env.FACEBOOK_EMAIL;
const facebookPassword = process.env.FACEBOOK_PASSWORD;

if (!facebookEmail || !facebookPassword) {
  console.error('ERROR: Please specify Facebook credential');
  process.exit(1);
}

console.log(`Target groupId: ${groupId}`);
console.log(`From: ${dateFrom.toLocaleDateString()}`);
console.log(`To: ${dateTo.toLocaleDateString()}`);

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

  const epochFrom = dateFrom.getTime();
  const epochTo = dateTo.getTime();
  let currentPagePostCount: number = 0;
  let isStarted = false;

  do {
    const posts = await getPostsFromGroupTimeline(page);

    const filteredPosts = posts.filter(
      ({ publish_time }) => publish_time >= epochFrom && publish_time <= epochTo
    );

    currentPagePostCount = filteredPosts.length;

    if (currentPagePostCount > 0) {
      writeFileSync(
        outputFile,
        '\n' + csvFormatBody(filteredPosts, CSV_HEADERS),
        {
          flag: 'a',
        }
      );

      isStarted = true;
    }

    console.log(
      `${new Date(posts[0].publish_time).toLocaleDateString()} -> ${new Date(
        posts[posts.length - 1].publish_time
      ).toLocaleDateString()} (${currentPagePostCount} posts found)`
    );

    await loadNextPostsFromTimeline(page);
  } while (!isStarted || currentPagePostCount > 0);

  await browser.close();
})();
