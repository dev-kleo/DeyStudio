// Usage: node build.mjs  -> builds articles/*, tools/*, sitemap.xml, robots.txt from content/*.md and tools-src/*.html
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
// Content hash appended to CSS links so browsers and the CDN never serve a stale stylesheet.
const ver = f => createHash('md5').update(readFileSync(f)).digest('hex').slice(0,8);
const SITE = 'https://deystudio.dev';
const MAIL = 'hello.deyabhishek@gmail.com';
const FOOTER_MAIL = 'hello@deystudio.dev';
// Organization entity (home page graph; referenced by Article/WebApplication on other pages).
// Add the studio's real profile URLs (LinkedIn company page, X, etc.) to SAME_AS when they exist.
const SAME_AS = [];
const ORG_ID = SITE + '/#organization';
const ORG_REF = {"@type":"Organization","@id":ORG_ID,name:"Dey Studio",url:SITE+"/"};
const ORG = {"@type":"Organization","@id":ORG_ID,name:"Dey Studio",url:SITE+"/",
  logo:{"@type":"ImageObject",url:SITE+"/logo.png",width:512,height:512},
  description:"Dey Studio designs and builds websites and online shops and runs Google, Facebook and ChatGPT ads for small businesses that want more customers.",
  email:MAIL,
  contactPoint:{"@type":"ContactPoint",contactType:"customer support",email:MAIL,availableLanguage:"English"},
  location:[{"@type":"Place",name:"Dey Studio Moscow",address:{"@type":"PostalAddress",streetAddress:"Tverskaya Street, Building 15",addressLocality:"Moscow",postalCode:"125009",addressCountry:"RU"}},{"@type":"Place",name:"Dey Studio Kolkata",address:{"@type":"PostalAddress",streetAddress:"17 SN Paul Road",addressLocality:"Kolkata",addressRegion:"West Bengal",postalCode:"700057",addressCountry:"IN"}}],
  knowsAbout:["Website design","Website development","Ecommerce websites","Google Ads","Facebook ads","ChatGPT ads"],
  ...(SAME_AS.length?{sameAs:SAME_AS}:{})};
const WEBSITE = {"@type":"WebSite","@id":SITE+"/#website",url:SITE+"/",name:"Dey Studio",inLanguage:"en",publisher:{"@id":ORG_ID}};

// Free tools. To add one: add an entry here and a body fragment at tools-src/<slug>.html
const TOOLS = [
  {slug:'free-domain-age-checker',name:'Free domain age checker',blurb:'Check how old any domain or website is, when it expires and who registered it.',
   title:'Free Domain Age Checker: Check Website Age',
   description:'Free domain age checker. Check domain age, registration date, expiry date, registrar and first Wayback snapshot for any website. No sign-up.',
   date:'2026-11-12',img:'/og/free-domain-age-checker.png',
   alt:['Website Age Checker','Domain Age Checker','Check Domain Age'],
   faq:[
    ['Is this domain age checker really free?','Yes. It is free to use, with no sign-up and no email address needed.'],
    ['How do I check the age of a domain?','Type the domain into the box and press Check age. You get the age, registration date, expiry date, registrar and the first date the site was archived.'],
    ['How old is a website?','The registration date shows how old the domain is. The first archived date shows when the site first had content that the Internet Archive saved. Together they give a good estimate of how old the website is.'],
    ['Does WHOIS privacy hide the domain creation date?','No. Privacy services hide the owner\'s contact details, not the registration date, so the age can still be checked.'],
    ['Why is the registration date missing for some domains?','Some country-code registries do not publish creation dates through RDAP. In that case we show the earliest Wayback Machine snapshot, which gives a minimum age.'],
    ['Why is the first archived date later than the registration date?','A domain is often registered long before a site is built on it, and the Wayback Machine only saves pages it has crawled. The first archived date is therefore a later, approximate date.'],
    ['Is a new domain a sign of a scam?','Not on its own. Many scam sites use recently registered domains, but so do plenty of honest new businesses. Check the age together with reviews, contact details and the payment method.'],
    ['Which domains can I check?','Most domain extensions, including .com, .net, .org, .io and many country domains. If you enter a subdomain, we check the main domain it belongs to.']
   ]}
];

// Service pages. Body fragment at pages-src/<slug>.html; <!--FAQ--> is replaced by the FAQ list, {{MAIL}} by MAIL.
const SERVICES = [
 {slug:'website-design-and-development',name:'Website design and development',short:'Website design and development',serviceType:'Website design and development',
  title:'Website Design and Development for Small Businesses | Dey Studio',
  description:'Dey Studio designs and builds fast business websites, landing pages and web apps for small businesses. Fixed quote in writing and support after launch.',
  faq:[
   ['How much does a business website cost?','A landing page starts at ₹8,000, a business website of 5 to 10 pages at ₹20,000, and a custom web app at ₹1,50,000. The final price depends on pages, features and content, and you get a fixed written quote before work starts.'],
   ['How long does it take to build a website?','A landing page takes about 3 to 7 days and a business website 2 to 3 weeks. Delays usually come from waiting for text, photos and approvals, so sending these early shortens the project.'],
   ['Which platforms do you build on?','We use WordPress and WooCommerce, Shopify, fast static sites and custom JavaScript apps. We recommend the simplest option that fits your budget and your plans for growth.'],
   ['Do I own my website?','Yes. Your domain and content are registered in your name, and you receive the website files when the project is complete.'],
   ['Do you offer support after launch?','Yes. Monthly maintenance starts at ₹2,000 and covers updates, backups, security checks and small changes.']
  ]},
 {slug:'ecommerce-website-development',name:'Ecommerce website development',short:'Ecommerce websites',serviceType:'Ecommerce website development',
  title:'Ecommerce Website Development: Shopify and WooCommerce | Dey Studio',
  description:'Dey Studio builds online shops on Shopify and WooCommerce with UPI and card payments, shipping and tax set up. Online shops from ₹50,000.',
  faq:[
   ['How much does an online shop cost?','An online shop starts at ₹50,000. The price depends on the number of products, payment and shipping setup, and design. You get a fixed written quote before work starts.'],
   ['How long does it take to build an online shop?','About 4 to 6 weeks. The main delays are product photos, descriptions and prices arriving late.'],
   ['Should I choose Shopify or WooCommerce?','Shopify is hosted and quick to launch, with a monthly fee paid to Shopify. WooCommerce runs on WordPress and gives more control, but you manage hosting and updates. We recommend the one that fits your budget and plans.'],
   ['Can customers pay by UPI and card?','Yes. We connect payment gateways such as Razorpay so customers can pay by UPI and card. Each gateway charges a fee per payment, so check the rate before you choose.'],
   ['Can I add products myself?','Yes. Both platforms have an admin area where you add products, change prices and manage orders without a developer.']
  ]},
 {slug:'google-ads-management',name:'Google Ads management',short:'Google Ads',serviceType:'Google Ads management',
  title:'Google Ads Management for Small Businesses | Dey Studio',
  description:'Dey Studio sets up and manages Google Ads for small businesses: keyword research, ad copy, landing pages, conversion tracking and monthly reports.',
  faq:[
   ['How much does Google Ads management cost?','Our fee is a fixed amount quoted in writing before work starts. Google charges your ad spend separately to your own account, and you set the budget.'],
   ['How soon will I get enquiries?','Search ads can start sending visitors within days of launch. How many become enquiries depends on your offer, your website and the competition, so nobody can honestly promise a number of customers.'],
   ['Do I need a website before running Google Ads?','You need a page for visitors to land on. If your site is slow or unclear, we fix it or build a landing page first, because ad spend on a weak page is wasted.'],
   ['Will the ad account be in my name?','We recommend it. You own the account, the data and the billing, and you can leave at any time.'],
   ['How do you measure results?','We set up conversion tracking for calls, form submissions and sales, then report what each enquiry costs.']
  ]},
 {slug:'facebook-ads-management',name:'Facebook and Instagram ads management',short:'Facebook and Instagram ads',serviceType:'Facebook and Instagram ads management',
  title:'Facebook and Instagram Ads Management | Dey Studio',
  description:'Dey Studio runs Facebook and Instagram ads for small businesses: audiences, creative, WhatsApp and lead campaigns, tracking and clear reporting.',
  faq:[
   ['How much does it cost to run Facebook ads?','Meta charges your ad spend to your own ad account, and you set the budget. Our management fee is a fixed amount quoted in writing before work starts.'],
   ['Can Facebook ads send customers to WhatsApp?','Yes. Click-to-WhatsApp ads open a chat with your business, which suits shops, restaurants and service businesses that sell by conversation.'],
   ['Do you create the ad images and text?','Yes. We write the ad text and prepare the creative, and we ask for your own photos and offers so the ads look like your business.'],
   ['How do you track results?','We install the Meta pixel and, where it fits, the Conversions API, then report enquiries, messages or sales against your spend.'],
   ['Facebook or Google Ads: which should I start with?','Google Ads reaches people already searching for what you sell. Facebook and Instagram ads reach people who may not be searching yet. Many businesses start with one and add the other once tracking works.']
  ]},
 {slug:'chatgpt-ads-management',name:'ChatGPT ads management',short:'ChatGPT ads',serviceType:'ChatGPT ads management',
  title:'ChatGPT Ads Management for Small Businesses | Dey Studio',
  description:'Dey Studio sets up and manages ChatGPT ads where available: tracking, landing pages, ad text and reporting. Starts with a small, measured test.',
  faq:[
   ['Are ChatGPT ads available in India?','Yes. OpenAI launched ChatGPT ads in India on 27 August 2026, with a minimum daily budget of ₹725 for rupee-billed accounts. Availability and rules differ by country, so we check before planning a campaign.'],
   ['Can any business run ChatGPT ads?','No. Alcohol, tobacco, gambling and political content are barred, and outside the US, financial, health and legal services ads are generally prohibited. We tell you before you spend if your category is not allowed.'],
   ['Do ChatGPT ads make ChatGPT recommend my business?','No. OpenAI says ads do not influence ChatGPT answers. The ad appears in a labelled block below the answer.'],
   ['Should I start with a test?','Yes. We start with one offer, one landing page, working tracking and a small budget, then compare your cost per enquiry with other channels.'],
   ['Where can I read more?','See our guide to a ChatGPT ads agency in India for costs, rules and how to choose one.']
  ]}
];
const toolsNav = `<div class="cell tdd"><a class="tdd-t" href="/tools/">Tools<svg viewBox="0 0 12 8" width="12" height="8" aria-hidden="true"><path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></a><div class="tdd-m">${TOOLS.map(t=>`<a href="/tools/${t.slug}/"><b>${t.name}</b><small>${t.blurb}</small></a>`).join('')}<a class="tdd-all" href="/tools/"><b>All tools &rarr;</b></a></div></div>`;
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const inline = s => esc(s)
  .replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<img src="$2" alt="$1" loading="lazy">')
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>')
  .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
  .replace(/\*([^*]+)\*/g,'<em>$1</em>')
  .replace(/`([^`]+)`/g,'<code>$1</code>');
const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function md(src){
  const out=[], lines=src.split('\n'); let i=0;
  while(i<lines.length){
    const l=lines[i];
    if(!l.trim()){i++;continue}
    let m;
    if((m=l.match(/^(#{2,3}) (.+)/))){const n=m[1].length;out.push(`<h${n} id="${slugify(m[2])}">${inline(m[2])}</h${n}>`);i++;continue}
    if(l.startsWith('|')&&/^\|[\s:|-]+\|$/.test((lines[i+1]||'').trim())){const row=r=>r.trim().replace(/^\||\|$/g,'').split('|').map(c=>c.trim());const h=row(l);i+=2;const body=[];while(i<lines.length&&lines[i].startsWith('|'))body.push(row(lines[i++]));out.push(`<div class="tbl"><table><thead><tr>${h.map(c=>`<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${body.map(r=>`<tr>${r.map(c=>`<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);continue}
    if(/^[-*] /.test(l)){const it=[];while(i<lines.length&&/^[-*] /.test(lines[i]))it.push(`<li>${inline(lines[i++].slice(2))}</li>`);out.push(`<ul>${it.join('')}</ul>`);continue}
    if(/^\d+\. /.test(l)){const it=[];while(i<lines.length&&/^\d+\. /.test(lines[i]))it.push(`<li>${inline(lines[i++].replace(/^\d+\. /,''))}</li>`);out.push(`<ol>${it.join('')}</ol>`);continue}
    if(l.startsWith('> ')){const q=[];while(i<lines.length&&lines[i].startsWith('> '))q.push(lines[i++].slice(2));out.push(`<blockquote><p>${inline(q.join(' '))}</p></blockquote>`);continue}
    const p=[];while(i<lines.length&&lines[i].trim()&&!/^(#{2,3} |[-*] |\d+\. |> |\|)/.test(lines[i]))p.push(lines[i++]);
    const one=p.join(' ').trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    out.push(one?`<figure><img src="${esc(one[2])}" alt="${esc(one[1])}" loading="lazy"><figcaption>${esc(one[1])}</figcaption></figure>`:`<p>${inline(p.join(' '))}</p>`);
  }
  return out.join('\n');
}
function parse(file){
  const raw=readFileSync('content/'+file,'utf8');
  const m=raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if(!m) throw new Error(file+': missing frontmatter');
  const meta={}; m[1].split('\n').forEach(x=>{const k=x.indexOf(':');if(k>0)meta[x.slice(0,k).trim()]=x.slice(k+1).trim().replace(/^"|"$/g,'')});
  for(const k of ['title','description','date']) if(!meta[k]) throw new Error(file+': missing '+k);
  meta.slug=meta.slug||file.replace(/\.md$/,'');
  const body=m[2].trim();
  meta.minutes=Math.max(1,Math.round(body.split(/\s+/).length/220));
  meta.body=body;
  meta.toc=[...body.matchAll(/^## (.+)$/gm)].map(m=>[slugify(m[1]),m[1]]);
  meta.html=md(body);
  return meta;
}
const fmt=d=>new Date(d+'T00:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
const head=(title,desc,path,extra='',img='')=>`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${path}">
<meta name="theme-color" content="#faf9f5">
<meta property="og:site_name" content="Dey Studio">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}${path}">
<meta name="twitter:card" content="${img?'summary_large_image':'summary'}">${img?`\n<meta property="og:image" content="${SITE}${img}">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta name="twitter:image" content="${SITE}${img}">`:''}
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/source-serif-4-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/styles.css?v=${ver('styles.css')}">
<link rel="stylesheet" href="/articles.css?v=${ver('articles.css')}">
${extra}</head>
<body class="art-page">
<header class="bar abar">
  <a class="brand cell" href="/" aria-label="Dey Studio home">
    <svg class="mark" viewBox="0 0 32 32" width="26" height="26" aria-hidden="true"><path d="M7 5h7.5a11 11 0 0 1 0 22H7z" fill="none" stroke="currentColor" stroke-width="3.6"/><circle class="dot" cx="25.5" cy="6.5" r="3"/></svg>
    <span>Dey Studio</span>
  </a>
  <a class="cell" href="/#services">Services</a>
  <a class="cell" href="/articles/">Articles</a>
  ${toolsNav}
  <a class="bar-cta" href="mailto:${MAIL}">Grow my business</a>
</header>
`;
const wa = 'https://wa.me/79507453399?text=Hi%20Dey%20Studio%2C%20I%27d%20like%20to%20grow%20my%20business.';
// Shared site footer. siteFooterEl(true) is the home-page version (with the big wordmark); siteFooter() adds the closing tags for generated pages.
const siteFooterEl = (home=false) => {
  const latest = (typeof posts!=='undefined'?posts:[]).slice(0,3);
  const li = (h,t,ext) => `<li><a href="${h}"${ext?' target="_blank" rel="noopener"':''}>${t}</a></li>`;
  return `<footer class="foot sf" data-nav="dark">
  <div class="sf-in">
    ${home?'<p class="giant" data-letters aria-hidden="true">Dey Studio</p>':''}
    <div class="sf-top">
      <div class="sf-brand">
        <a class="sf-logo" href="/" aria-label="Dey Studio home"><svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><path d="M7 5h7.5a11 11 0 0 1 0 22H7z" fill="none" stroke="currentColor" stroke-width="3.6"/><circle cx="25.5" cy="6.5" r="3" fill="#6C9BFF"/></svg><span>Dey Studio</span></a>
        <p>Websites and ads for small businesses that want more customers.</p>
      </div>
      <a class="sf-cta" href="mailto:${MAIL}?subject=Grow%20my%20business">Grow my business</a>
    </div>
    <nav class="sf-grid" aria-label="Footer">
      <div class="sf-col sf-svc"><p class="sf-h">Services</p><ul>
        ${SERVICES.map(x=>li('/'+x.slug+'/',x.short)).join('\n        ')}
        ${li('/web-development-company-kolkata/','Web development in Kolkata')}
      </ul></div>
      <div class="sf-col sf-art"><p class="sf-h">Articles</p><ul>
        ${latest.map(x=>li('/articles/'+x.slug+'/',esc(x.title))).join('\n        ')}
        ${li('/articles/','All articles &rarr;')}
      </ul></div>
      <div class="sf-col sf-abt"><p class="sf-h">About</p><ul>
        ${li('/#about','About Dey Studio')}
        ${li('/#process','How we work')}
        ${li('/#faq','Questions')}
        ${li('/tools/','Free tools')}
        ${li('https://github.com/dev-kleo','GitHub',true)}
      </ul></div>
      <div class="sf-col sf-con"><p class="sf-h">Contact</p>
        <ul>
          ${li('mailto:'+FOOTER_MAIL,FOOTER_MAIL)}
          ${li(wa,'WhatsApp',true)}
        </ul>
        <address class="sf-addr"><span>Kolkata</span>17 SN Paul Road, 700057<span>Moscow</span>Tverskaya Street, Building 15, 125009</address>
      </div>
    </nav>
    <div class="sf-bot"><span>&copy; 2026 Dey Studio</span><a href="#top">Back to top &uarr;</a></div>
  </div>
</footer>`;
};
const siteFooter = () => siteFooterEl(false)+`\n</body>\n</html>\n`;
const files=existsSync('content')?readdirSync('content').filter(f=>f.endsWith('.md')&&!f.startsWith('_')):[];
const posts=files.map(parse).sort((a,b)=>b.date.localeCompare(a.date));
rmSync('articles',{recursive:true,force:true});
mkdirSync('articles',{recursive:true});
for(const p of posts){
  const path=`/articles/${p.slug}/`;
  const ld={"@context":"https://schema.org","@type":"Article",headline:p.title,description:p.description,datePublished:p.date,dateModified:p.updated||p.date,mainEntityOfPage:SITE+path,author:ORG_REF,publisher:ORG_REF,...(p.image?{image:SITE+p.image}:{})};
  // FAQPage schema from a "## Frequently asked questions" section: each "### Question" plus its paragraphs is one Q&A.
  const fm=p.body.match(/^## Frequently asked questions\n([\s\S]*?)(?=^## |$(?![\s\S]))/m);
  const plain=t=>t.replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/\*\*?([^*]+)\*\*?/g,'$1').replace(/`/g,'').replace(/\s+/g,' ').trim();
  const faqQs=fm?fm[1].split(/^### /m).slice(1).map(b=>{const [q,...a]=b.split('\n');return [q.trim(),plain(a.join(' '))]}).filter(x=>x[0]&&x[1]):[];
  const faqLd=faqQs.length?{"@context":"https://schema.org","@type":"FAQPage",mainEntity:faqQs.map(([q,a])=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}}))}:null;
  const bc={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:SITE+"/"},{"@type":"ListItem",position:2,name:"Articles",item:SITE+"/articles/"},{"@type":"ListItem",position:3,name:p.title,item:SITE+path}]};
  const extra=[ld,bc,faqLd].filter(Boolean).map(o=>`<script type="application/ld+json">${JSON.stringify(o)}</script>\n`).join('');
  const html=head(`${p.title} | Dey Studio`,p.description,path,extra,p.image||'').replace('<meta name="twitter:card"',`<meta property="og:type" content="article">\n<meta property="article:published_time" content="${p.date}">\n<meta name="twitter:card"`)
   +`<main class="awrap art" id="main">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/articles/">Articles</a></nav>
<article>
<h1>${esc(p.title)}</h1>
<p class="meta"><time datetime="${p.date}">${fmt(p.date)}</time>${p.updated&&p.updated!==p.date?` · Updated <time datetime="${p.updated}">${fmt(p.updated)}</time>`:''} · ${p.minutes} min read</p>
<p class="lede">${esc(p.description)}</p>
${p.toc.length>=4?`<nav class="toc" aria-label="On this page"><p class="toc-t">On this page</p><ol>${p.toc.map(([id,t])=>`<li><a href="#${id}">${inline(t)}</a></li>`).join('')}</ol></nav>`:''}
<div class="prose">
${p.html}
</div>
<aside class="acta"><h2>Want this working for your business?</h2><p>Tell us what you sell and where customers are slipping away. We reply to every message.</p><a class="btn" href="mailto:${MAIL}?subject=Grow%20my%20business">Grow my business</a></aside>
</article>
</main>
`+siteFooter();
  mkdirSync(`articles${path.slice(9)}`,{recursive:true});
  writeFileSync(`articles${path.slice(9)}index.html`,html);
}
// Local service pages. Body fragment at pages-src/<slug>.html; <!--FAQ--> is replaced by the FAQ list, {{MAIL}} by MAIL.
const KOL_ID = SITE + '/web-development-company-kolkata/#localbusiness';
const KOL_ADDR = {"@type":"PostalAddress",streetAddress:"17 SN Paul Road",addressLocality:"Kolkata",addressRegion:"West Bengal",postalCode:"700057",addressCountry:"IN"};
const PAGES = [{slug:'web-development-company-kolkata',url:'/web-development-company-kolkata/',name:'Web development company in Kolkata',
  title:'Web Development Company in Kolkata | Dey Studio',
  description:'Dey Studio builds fast business websites, online shops and web apps for Kolkata businesses. Prices in rupees, fixed quotes and support after launch.',
  date:'2026-11-12',
  faq:[
   ['How much does a website cost in Kolkata?','A landing page starts at ₹8,000, a business website of 5 to 10 pages at ₹20,000, and an online shop at ₹50,000. Custom web apps start at ₹1,50,000. The final price depends on pages, features and content, and you get a fixed written quote before work starts.'],
   ['How long does it take to build a website?','A landing page takes about 3 to 7 days, a business website 2 to 3 weeks and an online shop 4 to 6 weeks. Delays usually come from waiting for text, photos and approvals, so sending these early shortens the project.'],
   ['Which is the best web development company in Kolkata?','There is no single best company for every business. Choose by checking for a real address, prices in rupees, live examples you can open, reviews you can verify and clear support after launch. We aim to meet every one of those checks.'],
   ['Do you work with businesses that are not in Kolkata?','Yes. We work with clients across India and abroad by WhatsApp, video call and email, and we have offices listed in Kolkata and Moscow.'],
   ['Will my new website appear on Google?','We build every site with the basics Google needs: fast loading, mobile layout, a sitemap, clean page titles and structured data. Rankings take weeks or months and depend on competition, so nobody can honestly promise a position. We can also run Google Ads for faster results.'],
   ['What do I need to give you to start?','Your logo, a short description of your business, your services or products, and any photos you have. If you do not have text or photos, tell us and we will help arrange them.'],
   ['Do I own my website?','Yes. Your domain and content are registered in your name, and you receive the website files when the project is complete.'],
   ['Do you offer maintenance and support after launch?','Yes. Monthly maintenance starts at ₹2,000 and covers updates, backups, security checks and small changes.'],
   ['Which platforms do you build on?','We use WordPress and WooCommerce, Shopify, fast static sites and custom JavaScript apps. We recommend the simplest option that fits your budget and your plans for growth.'],
   ['How do I get started?','Message us on WhatsApp or email and describe your business and what you want the website to do. We reply with a fixed quote and a delivery date.']
  ]}];
const list=[...posts,...PAGES].sort((a,b)=>b.date.localeCompare(a.date)).map(p=>`<li><a href="${p.url||`/articles/${p.slug}/`}"><time datetime="${p.date}">${fmt(p.date)}</time><h2>${esc(p.title)}</h2><p>${esc(p.description)}</p><span>Read article &rarr;</span></a></li>`).join('\n');
writeFileSync('articles/index.html',head('Articles: websites, ads and getting customers | Dey Studio','Plain-language guides on websites, online shops and ads (Google, Facebook, ChatGPT) for small business owners who want more customers.','/articles/',`<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"CollectionPage",name:"Dey Studio Articles",url:SITE+"/articles/"})}</script>\n`)
 +`<main class="awrap" id="main">
<h1 class="idx-h">Articles</h1>
<p class="lede">Plain-language guides on websites, online shops and ads for owners who want more customers.</p>
${posts.length?`<ul class="idx">\n${list}\n</ul>`:'<p>First articles coming soon.</p>'}
</main>
`+siteFooter());
// Tools: /tools/ index and one page per tool (body fragment from tools-src/<slug>.html)
mkdirSync('tools',{recursive:true});
for(const t of TOOLS){
  const path=`/tools/${t.slug}/`;
  const ld={"@context":"https://schema.org","@type":"WebApplication",name:t.name,alternateName:t.alt,url:SITE+path,description:t.description,applicationCategory:"UtilitiesApplication",operatingSystem:"Any",isAccessibleForFree:true,offers:{"@type":"Offer",price:"0",priceCurrency:"USD"},creator:ORG_REF,publisher:ORG_REF};
  const bc={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:SITE+"/"},{"@type":"ListItem",position:2,name:"Tools",item:SITE+"/tools/"},{"@type":"ListItem",position:3,name:t.name,item:SITE+path}]};
  const faq=t.faq?{"@context":"https://schema.org","@type":"FAQPage",mainEntity:t.faq.map(([q,a])=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}}))}:null;
  const faqHtml=t.faq?`<h2>Frequently asked questions</h2>\n`+t.faq.map(([q,a])=>`<h3>${esc(q)}</h3>\n<p>${esc(a)}</p>`).join('\n'):'';
  const extra=[ld,bc,faq].filter(Boolean).map(o=>`<script type="application/ld+json">${JSON.stringify(o)}</script>\n`).join('');
  mkdirSync(`tools/${t.slug}`,{recursive:true});
  writeFileSync(`tools/${t.slug}/index.html`,head(`${t.title} | Dey Studio`,t.description,path,extra,t.img)
   +`<main class="awrap art tool" id="main">\n<nav class="crumbs" aria-label="Breadcrumb"><a href="/tools/">Tools</a></nav>\n${readFileSync(`tools-src/${t.slug}.html`,'utf8').replace('<!--FAQ-->',faqHtml)}\n</main>\n`+siteFooter());
}
const toolList=TOOLS.map(t=>`<li><a href="/tools/${t.slug}/"><h2>${esc(t.name)}</h2><p>${esc(t.blurb)}</p><span>Open tool &rarr;</span></a></li>`).join('\n');
writeFileSync('tools/index.html',head('Free tools for small business websites | Dey Studio','Free tools from Dey Studio, including a free domain age checker. No sign-up needed.','/tools/',`<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"CollectionPage",name:"Dey Studio Tools",url:SITE+"/tools/"})}</script>\n`,TOOLS[0].img)
 +`<main class="awrap" id="main">
<h1 class="idx-h">Tools</h1>
<p class="lede">Free tools for business owners. No sign-up needed.</p>
<ul class="idx">
${toolList}
</ul>
</main>
`+siteFooter());
for(const pg of PAGES){
  const path=`/${pg.slug}/`;
  const svc={"@context":"https://schema.org","@graph":[
    {"@type":"ProfessionalService","@id":KOL_ID,name:"Dey Studio Kolkata",url:SITE+path,image:SITE+"/logo.png",description:pg.description,email:MAIL,priceRange:"₹₹",address:KOL_ADDR,areaServed:[{"@type":"City",name:"Kolkata"},{"@type":"State",name:"West Bengal"}],parentOrganization:ORG_REF,knowsAbout:["Web development","Website design","Ecommerce websites","Landing pages","Google Ads"]},
    {"@type":"Service",name:"Web development in Kolkata",serviceType:"Web development",provider:{"@id":KOL_ID},areaServed:{"@type":"City",name:"Kolkata"},url:SITE+path,description:pg.description,offers:[
      {"@type":"Offer",name:"Landing page",priceSpecification:{"@type":"PriceSpecification",priceCurrency:"INR",minPrice:8000,maxPrice:20000}},
      {"@type":"Offer",name:"Business website",priceSpecification:{"@type":"PriceSpecification",priceCurrency:"INR",minPrice:20000,maxPrice:60000}},
      {"@type":"Offer",name:"Online shop",priceSpecification:{"@type":"PriceSpecification",priceCurrency:"INR",minPrice:50000,maxPrice:150000}}]}]};
  const bc={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:SITE+"/"},{"@type":"ListItem",position:2,name:pg.name,item:SITE+path}]};
  const faq={"@context":"https://schema.org","@type":"FAQPage",mainEntity:pg.faq.map(([q,a])=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}}))};
  const faqHtml=`<h2>Frequently asked questions</h2>\n`+pg.faq.map(([q,a])=>`<h3>${esc(q)}</h3>\n<p>${esc(a)}</p>`).join('\n');
  const extra=[svc,bc,faq].map(o=>`<script type="application/ld+json">${JSON.stringify(o)}</script>\n`).join('');
  mkdirSync(`${pg.slug}`,{recursive:true});
  writeFileSync(`${pg.slug}/index.html`,head(pg.title,pg.description,path,extra)
   +`<main class="awrap art tool" id="main">\n${readFileSync(`pages-src/${pg.slug}.html`,'utf8').replace('<!--FAQ-->',faqHtml).replaceAll('{{MAIL}}',MAIL)}\n</main>\n`+siteFooter());
}
// Service pages
for(const sv of SERVICES){
  const path=`/${sv.slug}/`;
  const svc={"@context":"https://schema.org","@type":"Service",name:sv.name,serviceType:sv.serviceType,url:SITE+path,description:sv.description,provider:ORG_REF,areaServed:{"@type":"Country",name:"India"}};
  const bc={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:SITE+"/"},{"@type":"ListItem",position:2,name:sv.name,item:SITE+path}]};
  const faq={"@context":"https://schema.org","@type":"FAQPage",mainEntity:sv.faq.map(([q,a])=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}}))};
  const faqHtml=`<h2>Frequently asked questions</h2>\n`+sv.faq.map(([q,a])=>`<h3>${esc(q)}</h3>\n<p>${esc(a)}</p>`).join('\n');
  const extra=[svc,bc,faq].map(o=>`<script type="application/ld+json">${JSON.stringify(o)}</script>\n`).join('');
  mkdirSync(sv.slug,{recursive:true});
  writeFileSync(`${sv.slug}/index.html`,head(sv.title,sv.description,path,extra)
   +`<main class="awrap art tool" id="main">\n${readFileSync(`pages-src/${sv.slug}.html`,'utf8').replace('<!--FAQ-->',faqHtml).replaceAll('{{MAIL}}',MAIL)}\n</main>\n`+siteFooter());
}
const urls=[['/',null],['/articles/',posts[0]?.date],...posts.map(p=>[`/articles/${p.slug}/`,p.updated||p.date]),...PAGES.map(p=>[`/${p.slug}/`,p.date]),...SERVICES.map(x=>[`/${x.slug}/`,'2026-11-13']),['/tools/',TOOLS[0]?.date],...TOOLS.map(t=>[`/tools/${t.slug}/`,t.date])];
writeFileSync('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u,d])=>`  <url><loc>${SITE}${u}</loc>${d?`<lastmod>${d}</lastmod>`:''}</url>`).join('\n')}\n</urlset>\n`);
writeFileSync('robots.txt',['*','OAI-SearchBot','ChatGPT-User','GPTBot','Googlebot','Bingbot'].map(a=>`User-agent: ${a}\nAllow: /\n`).join('\n')+`\nSitemap: ${SITE}/sitemap.xml\n`);
// Home page: Organization + WebSite graph between the <!--ld--> markers
{const h=readFileSync('index.html','utf8');const blk=`<!--ld--><script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@graph":[ORG,WEBSITE]})}</script><!--/ld-->`;const n=h.replace(/<!--ld-->[\s\S]*?<!--\/ld-->/,()=>blk);if(n!==h)writeFileSync('index.html',n)}
// Home page: shared footer between the <!--foot--> markers
{const h=readFileSync('index.html','utf8');const n=h.replace(/<!--foot-->[\s\S]*?<!--\/foot-->/,()=>`<!--foot-->${siteFooterEl(true)}<!--/foot-->`);if(n!==h)writeFileSync('index.html',n)}
// Keep the home page's stylesheet link in step with styles.css
{const h=readFileSync('index.html','utf8');const n=h.replace(/href="\/?styles\.css(\?v=[a-f0-9]+)?"/,`href="/styles.css?v=${ver('styles.css')}"`);if(n!==h)writeFileSync('index.html',n)}
console.log(`built ${posts.length} article(s)`);
