import type { Page } from 'puppeteer';

const GROUP_POST_ARTICLE_ELEMENT = '#m_group_stories_container article';

export interface Post {
  publish_time: number;
  top_level_post_id: string;
  actor_id?: string;
  ent_attachement_type?: string;
  text?: string;
}

export async function loginFacebook(
  page: Page,
  email: string,
  password: string
) {
  await page.goto('https://m.facebook.com');

  const acceptCookieButton = 'button[value="Only allow essential cookies"]';
  await page.waitForSelector(acceptCookieButton);
  await page.click(acceptCookieButton);

  await page.type('input#m_login_email', email);
  await page.type('input#m_login_password', password);
  await page.click('button[value="Log in"]');

  await page.waitForNetworkIdle();
}

export async function getPostsFromGroupTimeline(page: Page): Promise<Post[]> {
  return page.evaluate((articleSelector) => {
    const dataList: Post[] = [];

    document.querySelectorAll(articleSelector).forEach((article) => {
      const dataFt = article.getAttribute('data-ft');

      if (dataFt) {
        const {
          ent_attachement_type,
          page_id,
          page_insights,
          top_level_post_id,
        } = JSON.parse(dataFt);

        const publish_time = page_insights[page_id]?.post_context?.publish_time;

        if (publish_time) {
          const text = [...article.querySelectorAll('.story_body_container p')]
            .map((p) => p.textContent)
            .join('\n')
            .replace('… More', '');

          const postData = {
            top_level_post_id,
            ent_attachement_type,
            actor_id: page_insights[page_id]?.actor_id,
            publish_time: publish_time * 1000,
            text,
          };

          dataList.push(postData);
        }
      }

      article.remove();
    });

    return dataList.sort((a, z) => z.publish_time - a.publish_time);
  }, GROUP_POST_ARTICLE_ELEMENT);
}

export async function loadNextPostsFromTimeline(page: Page) {
  await page.evaluate(() => {
    document.documentElement.scrollTop = 0;
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
  });

  await page.waitForSelector(GROUP_POST_ARTICLE_ELEMENT);
}
