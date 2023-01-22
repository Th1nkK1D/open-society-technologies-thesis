# Facebook group posts scraper

Using Puppeteer

## Setup

Create `.env` file

```
FACEBOOK_EMAIL=
FACEBOOK_PASSWORD=
```

## Run

```shell
yarn start <group_id> <date_from> <date_to>
```

Example:

```shell
yarn start 166477880066544 "2022-01-01 UTC+2" "2022-12-31 UTC+2"
```

## Output

CSV File with following headers

```csv
publish_time,top_level_post_id,actor_id,ent_attachement_type,text
```
