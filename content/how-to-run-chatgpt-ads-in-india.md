---
title: How to Run ChatGPT Ads in India (2026 Guide)
description: Learn how to run ChatGPT ads in India: sign up at ads.openai.com, set a ₹725 daily budget, write context hints, add the pixel and launch. Costs and FAQs.
date: 2026-11-13
---
To run ChatGPT ads in India, create an advertiser account at ads.openai.com, pass business verification, add a payment method, and pick a campaign objective. Set a daily budget of at least ₹725, write context hints for each ad group, add a short ad with a landing page, install the OpenAI Pixel, and launch. Ads show to logged-in adults on the Free and Go plans.

This guide walks through each step in order, then covers cost, ad specs, restrictions and the mistakes that waste a first test budget. If you would rather hand the work to someone else, see our page on [ChatGPT ads management](/chatgpt-ads-management/) or our guide to [choosing a ChatGPT ads agency in India](/chatgpt-ads-agency-india/).

## ChatGPT ads in India at a glance

| Question | Answer |
| --- | --- |
| Are ChatGPT ads live in India? | Yes. They started in late August 2026, and OpenAI announced the launch on 27 August. |
| Can Indian businesses buy them directly? | Yes. Self-serve Ads Manager opened to Indian advertisers on 4 September 2026. |
| Where do I sign up? | ads.openai.com |
| Minimum daily budget | ₹725 (about $8) |
| Billing models | CPM (per 1,000 impressions), CPC (per click) and conversion-optimized bidding |
| Who sees the ads? | Logged-in adults on the Free and Go plans |
| Who does not? | Plus, Pro, Business, Enterprise and Education users, accounts believed to be under 18, and Temporary Chats |
| Where do ads appear? | Below a relevant ChatGPT answer, labelled as an ad |
| How is targeting done? | Context hints written in plain language. There are no keywords. |
| How is the auction run? | Relevance-weighted second-price auction |

## What are ChatGPT ads?

ChatGPT ads are sponsored placements that appear below an answer when a product or service fits the conversation. They are labelled as ads. OpenAI says the ad system runs separately from the answer system, so an advertiser cannot pay to change what ChatGPT tells a user. It also says conversations stay private from advertisers.

The buying logic differs from search ads. You do not bid on keywords. You describe the situation a customer is in, and the system matches your ad to relevant conversations. In Ads Manager, a campaign holds the objective, budget, schedule and location. An ad group holds the context hints. An ad holds the title, copy, image and landing page.

## Who sees ChatGPT ads in India?

Only logged-in adults on the Free and Go plans see ads. Go costs ₹399 a month in India. People on Plus, Pro, Business, Enterprise and Education plans see none.

OpenAI also keeps ads out of conversations about health, mental health and politics, and out of Temporary Chats. OpenAI said it expects about one in five ChatGPT queries in India to show an ad. India is now ChatGPT's largest market by weekly users, according to Forbes, so the Free and Go audience is large.

A lower-priced plan does not mean a lower-intent buyer. Plan tier shows willingness to pay OpenAI, and says little about whether someone will buy your product.

## What do you need before you start?

- Business details for verification, and a separate email address for each brand account
- A payment card, plus a tax adviser's view on GST treatment
- A landing page that loads fast and is not blocked to OpenAI's crawlers (check robots.txt)
- Access to your website or Google Tag Manager so you can install the OpenAI Pixel
- A square image (PNG or JPG, up to 1200 × 1200 pixels), a short title and a short description
- A budget plan for a test of two to four weeks

## How do you run ChatGPT ads in India? A 9-step process

### Step 1: Create your Ads Manager account

Go to ads.openai.com and sign up. Pick India as the country, INR as the billing currency and IST as the time zone. You cannot change any of the three after the account exists. Each brand needs its own account, and each account needs a different email address.

### Step 2: Complete advertiser verification

Verification runs through Persona, and it also confirms that your products meet OpenAI's ads policies. Read the policy list before you build anything, because some categories are blocked (see the restrictions section below).

### Step 3: Set up billing

Add a billing profile and a payment method. Nothing delivers until both are done. One Indian guide describes postpaid billing, where your saved card is charged when the account reaches its billing threshold. Check the billing screen for the exact terms on your account.

### Step 4: Install conversion tracking before you spend

In Ads Manager, open Conversions under Tools and create a data source. Ads Manager generates a pixel that you can paste into your site or deploy through Google Tag Manager. You can also send events from your server through the Conversions API. If you use both, send the same event ID from each so OpenAI can remove duplicates.

Keep the `oppref` click parameter intact through every redirect, because attribution depends on it. Add UTM parameters to your landing page URLs too, for example `utm_source=chatgpt` and `utm_medium=paid`, so the traffic is visible in GA4.

### Step 5: Choose a campaign objective

The objective cannot be changed after you create the campaign. To switch, create a new one.

- Reach bills per 1,000 impressions (CPM). It suits awareness.
- Clicks bills per valid click (CPC). Most guides recommend it for a first test.
- Conversions optimizes toward an event such as a lead or purchase. It needs working conversion tracking and enough volume. OpenAI's help center describes billing options for conversion campaigns, so check which ones Ads Manager offers you.

### Step 6: Set budget, schedule, location and platform

Choose a total budget or a daily budget. India's minimum is ₹725 a day. Daily spend can reach twice the daily budget on a single day and seven times it over a week, so read the budget as an average. Set a start date. The end date is optional.

Select India as the location and choose the surfaces you want: web, iOS, Android, or any mix. Granular city or PIN-code targeting may not be available, so check the location picker.

### Step 7: Build ad groups around context hints

Context hints are plain-language descriptions of a situation or need. They are guidance for the system. They are not exact-match rules, and they do not guarantee delivery.

Write one theme per ad group. A running-shoe brand might use one group for people comparing shoes for flat feet and another for people planning their first 10K. Start with two to four clusters, each with its own hints, ads and landing page.

### Step 8: Create your ads

Each ad includes your advertiser name and favicon, a title, a description, a square image and a landing page URL. Write three to five ads per group that make different promises, not small word swaps. Keep within these limits:

| Element | Recommended | Maximum |
| --- | --- | --- |
| Title | 16 to 24 characters | 50 characters |
| Description | 32 to 48 characters | 100 characters |
| Image | Square PNG or JPG | 1200 × 1200 pixels |
| Landing page | A public URL that loads and is not blocked by robots.txt | n/a |

These specs come from third-party guides that read OpenAI's documentation. Confirm them in Ads Manager before you upload.

### Step 9: Set bids, launch and review

For CPC campaigns, OpenAI's guidance has been to start with a maximum bid of $3 to $5, roughly ₹260 to ₹440. One guide suggests starting lower in India and watching the bid-strength indicator. You set bids at the ad group level.

Launch, then give the campaign time. Reporting can lag by up to seven hours, according to one guide, so avoid changing bids in the first afternoon. Ads Manager reports impressions, clicks, spend, CTR, average CPC, average CPM and conversions. Your numbers in GA4 will differ from Ads Manager because the two use different attribution windows and methods.

## How much do ChatGPT ads cost in India?

The floor is ₹725 a day, about ₹22,000 over a 30-day month. Beyond that, there is no published India benchmark for CPC or CPM. OpenAI itself says it does not yet provide industry-wide performance benchmarks, and the Indian agencies that publish numbers disagree with one another. One Indian agency reported launch-period CPMs far above current rates, so older figures can mislead.

A floor budget will not generate enough clicks to judge a campaign. One agency recommends testing at ₹2,500 to ₹5,000 a day for a controlled first run. Treat that as one opinion and size the test to your cost per lead or sale.

## Which businesses can and cannot advertise?

OpenAI prohibits adult content, alcohol, tobacco, gambling, recreational drugs, political advertising and weapons. Guides to the India launch also say financial services, regulated healthcare services and legal services are generally off limits outside the US. Policies change, so read the current list in Ads Manager before you plan a campaign.

OpenAI's early focus is on lifestyle and household goods, local services, travel and experiences, digital products and education.

## How do custom audiences and measurement work?

You can upload emails, phone numbers or other supported identifiers to include, exclude or adjust bids for existing customers. Inclusion and bid adjustments need at least 25,000 matched users, and about 100,000 works better. Exclusions work with smaller lists.

The pixel counts sales on your own website. It does not count sales on Amazon or Flipkart. For mobile apps, OpenAI documents integrations with attribution partners including AppsFlyer, Branch, Kochava, Airbridge and Tenjin, and reporting through those can take 24 to 48 hours.

## ChatGPT ads vs Google Ads vs Meta ads

| | ChatGPT ads | Google Search ads | Meta ads |
| --- | --- | --- | --- |
| How you target | Context hints describing a situation | Keywords | Audiences and interests |
| Where the ad sits | Below a ChatGPT answer | Alongside search results | In feeds and stories |
| Maturity | Early, with no official benchmarks | Mature, with deep benchmarks | Mature, with deep benchmarks |
| Best first use | Research-stage, comparison-style demand | Ready-to-buy demand | Discovery and retargeting |

Most Indian agencies suggest keeping Google and Meta as the base and carving out a small test budget for ChatGPT. If you need help with the base channels, we run [Google Ads](/google-ads-management/) and [Facebook and Instagram ads](/facebook-ads-management/) for small businesses.

## What mistakes should you avoid?

1. Judging the channel from a ₹725 a day test. The data will be too thin to read.
2. Writing context hints like keyword lists. Describe the customer's situation in a sentence.
3. Mixing several themes in one ad group, which makes it impossible to see what worked.
4. Skipping tracking. Install the pixel, and the Conversions API if you can, before the first rupee goes out.
5. Pointing ads at a page that is slow, blocked to crawlers, or unrelated to the conversation that triggered the ad.

## Do ChatGPT ads make ChatGPT recommend your brand?

No. Ads and answers run separately. Paying for an ad does not change whether ChatGPT mentions your brand in an answer. Appearing in answers depends on clear, well-structured content and on other sites that describe your brand accurately. Ads and that organic work add up, but one does not replace the other.

## Frequently asked questions

### Can I run ads on ChatGPT from India?

Yes. ChatGPT ads went live for Indian users in late August 2026, and self-serve Ads Manager opened to Indian advertisers on 4 September 2026 at ads.openai.com.

### How much do ChatGPT ads cost in India?

The minimum is ₹725 a day. You pay per 1,000 impressions or per click, set by auction. No official India CPC or CPM benchmark has been published.

### What is the minimum budget for ChatGPT ads in India?

₹725 per day, about $8.

### Where do I create ChatGPT ads?

In ChatGPT Ads Manager at ads.openai.com. Large advertisers can also buy through OpenAI's ads team or agency partners such as WPP and Omnicom.

### Can I target keywords on ChatGPT?

No. You write context hints at the ad group level. They describe a customer situation in plain language.

### Who sees ChatGPT ads?

Logged-in adults on the Free and Go plans. Plus, Pro, Business, Enterprise and Education users do not see ads.

### Do ads change ChatGPT's answers?

OpenAI says no. Ads are separate from answers and are labelled as ads.

### Can ChatGPT ads optimize for leads or sales?

Yes. Conversion campaigns optimize toward an event you define, as long as the OpenAI Pixel or Conversions API is sending data.

### Can Dey Studio run my ChatGPT ads?

Yes. Message us on WhatsApp or email with your website and what you sell. We reply with a fixed quote and a start date. Details are on our [ChatGPT ads management](/chatgpt-ads-management/) page.

## Sources

- [OpenAI Help Center: Conversion-optimized campaigns](https://help.openai.com/en/articles/20001412-conversion-optimized-campaigns)
- [OpenAI Help Center: Measure conversions](https://help.openai.com/en/articles/20001409)
- [OpenAI Help Center: Create campaigns in Ads Manager](https://help.openai.com/articles/20001209)
- [TechCrunch: OpenAI to start showing ads on ChatGPT's Free and Go tiers in India](https://techcrunch.com/2026/08/27/openai-to-start-showing-ads-on-chatgpts-free-and-go-tiers-in-india/)
- [Forbes: India becomes ChatGPT's largest market as OpenAI sells ads to Indian brands](https://www.forbes.com/sites/jonmarkman/2026/11/05/india-becomes-chatgpts-largest-market-as-openai-sells-ads-to-indian-brands/)

This guide was last checked on 13 November 2026. ChatGPT ads are new and the rules are changing, so confirm current details with OpenAI before you spend.
