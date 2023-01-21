import puppeteer from 'puppeteer';
import { csvFormatBody } from 'd3-dsv';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

const OUT_DIR = 'dist';
const CSV_HEADERS = [
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

// Prepare output file
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
  // Start puppeteer
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 5,
  });

  const page = await browser.newPage();
  await page.goto('https://m.facebook.com');

  // Accept cookie
  const acceptCookieButton = 'button[value="Only allow essential cookies"]';
  await page.waitForSelector(acceptCookieButton);
  await page.click(acceptCookieButton);

  // Login
  await page.type('input#m_login_email', facebookEmail);
  await page.type('input#m_login_password', facebookPassword);
  await page.click('button[value="Log in"]');
  await page.waitForNetworkIdle();

  // Open group
  await page.goto(`https://m.facebook.com/groups/${groupId}`);

  // Scrape group posts
  const posts = await page.evaluate(() => {
    const dataList = [];

    document
      .querySelector('#m_group_stories_container')
      ?.querySelectorAll('article')
      .forEach((article) => {
        const dataFt = article.getAttribute('data-ft');

        if (dataFt) {
          const {
            ent_attachement_type,
            page_id,
            page_insights,
            top_level_post_id,
          } = JSON.parse(dataFt);

          const text = [...article.querySelectorAll('.story_body_container p')]
            .map((p) => p.textContent)
            .join('\n')
            .replace('… More', '');

          const postData = {
            top_level_post_id,
            ent_attachement_type,
            actor_id: page_insights[page_id]?.actor_id,
            publish_time: page_insights[page_id]?.post_context?.publish_time,
            text,
          };

          dataList.push(postData);
        }

        article.remove();
      });

    return dataList;
  });

  writeFileSync(outputFile, '\n' + csvFormatBody(posts, CSV_HEADERS), {
    flag: 'a',
  });

  await browser.close();
})();
