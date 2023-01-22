import type { Page } from 'puppeteer';

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
  return page.evaluate(() => {
    const dataList: Post[] = [];

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
}
