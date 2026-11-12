// Usage: node build.mjs  -> builds articles/*, tools/*, sitemap.xml, robots.txt from content/*.md and tools-src/*.html
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, existsSync } from 'node:fs';
const SITE = 'https://deystudio.dev';
const MAIL = 'hello.deyabhishek@gmail.com';
// Free tools. To add one: add an entry here and a body fragment at tools-src/<slug>.html
const TOOLS = [
  {slug:'website-age-checker',name:'Website age checker',blurb:'See how old any domain is, when it expires and who registered it.',
   title:'Website Age Checker: How Old Is Any Domain?',
   description:'Free website age checker. Enter any domain to see its exact age, registration date, expiry date, registrar and first appearance on the Wayback Machine.',
   date:'2026-11-12'}
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
    if(/^[-*] /.test(l)){const it=[];while(i<lines.length&&/^[-*] /.test(lines[i]))it.push(`<li>${inline(lines[i++].slice(2))}</li>`);out.push(`<ul>${it.join('')}</ul>`);continue}
    if(/^\d+\. /.test(l)){const it=[];while(i<lines.length&&/^\d+\. /.test(lines[i]))it.push(`<li>${inline(lines[i++].replace(/^\d+\. /,''))}</li>`);out.push(`<ol>${it.join('')}</ol>`);continue}
    if(l.startsWith('> ')){const q=[];while(i<lines.length&&lines[i].startsWith('> '))q.push(lines[i++].slice(2));out.push(`<blockquote><p>${inline(q.join(' '))}</p></blockquote>`);continue}
    const p=[];while(i<lines.length&&lines[i].trim()&&!/^(#{2,3} |[-*] |\d+\. |> )/.test(lines[i]))p.push(lines[i++]);
    out.push(`<p>${inline(p.join(' '))}</p>`);
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
  meta.html=md(body);
  return meta;
}
const fmt=d=>new Date(d+'T00:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
const head=(title,desc,path,extra='')=>`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${path}">
<meta name="theme-color" content="#F5F5F2">
<meta property="og:site_name" content="Dey Studio">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}${path}">
<meta name="twitter:card" content="summary">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/source-serif-4-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/styles.css">
<link rel="stylesheet" href="/articles.css">
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
const foot=`<footer class="afoot"><div class="awrap"><span>&copy; 2026 Dey Studio</span><a href="/">Home</a><a href="/articles/">Articles</a><a href="/tools/">Tools</a><a href="mailto:${MAIL}">${MAIL}</a></div></footer>
</body>
</html>
`;
const files=existsSync('content')?readdirSync('content').filter(f=>f.endsWith('.md')&&!f.startsWith('_')):[];
const posts=files.map(parse).sort((a,b)=>b.date.localeCompare(a.date));
rmSync('articles',{recursive:true,force:true});
mkdirSync('articles',{recursive:true});
for(const p of posts){
  const path=`/articles/${p.slug}/`;
  const ld={"@context":"https://schema.org","@type":"Article",headline:p.title,description:p.description,datePublished:p.date,dateModified:p.updated||p.date,mainEntityOfPage:SITE+path,author:{"@type":"Organization",name:"Dey Studio",url:SITE},publisher:{"@type":"Organization",name:"Dey Studio",url:SITE}};
  const bc={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:SITE+"/"},{"@type":"ListItem",position:2,name:"Articles",item:SITE+"/articles/"},{"@type":"ListItem",position:3,name:p.title,item:SITE+path}]};
  const extra=`<script type="application/ld+json">${JSON.stringify(ld)}</script>\n<script type="application/ld+json">${JSON.stringify(bc)}</script>\n`;
  const html=head(`${p.title} | Dey Studio`,p.description,path,extra).replace('<meta name="twitter:card"',`<meta property="og:type" content="article">\n<meta property="article:published_time" content="${p.date}">\n<meta name="twitter:card"`)
   +`<main class="awrap art" id="main">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/articles/">Articles</a></nav>
<article>
<h1>${esc(p.title)}</h1>
<p class="meta"><time datetime="${p.date}">${fmt(p.date)}</time> · ${p.minutes} min read</p>
<p class="lede">${esc(p.description)}</p>
<div class="prose">
${p.html}
</div>
<aside class="acta"><h2>Want this working for your business?</h2><p>Tell us what you sell and where customers are slipping away. We reply to every message.</p><a class="btn" href="mailto:${MAIL}?subject=Grow%20my%20business">Grow my business</a></aside>
</article>
</main>
`+foot;
  mkdirSync(`articles${path.slice(9)}`,{recursive:true});
  writeFileSync(`articles${path.slice(9)}index.html`,html);
}
const list=posts.map(p=>`<li><a href="/articles/${p.slug}/"><time datetime="${p.date}">${fmt(p.date)}</time><h2>${esc(p.title)}</h2><p>${esc(p.description)}</p><span>Read article &rarr;</span></a></li>`).join('\n');
writeFileSync('articles/index.html',head('Articles: websites, ads and getting customers | Dey Studio','Plain-language guides on websites, online shops and ads (Google, Facebook, ChatGPT) for small business owners who want more customers.','/articles/',`<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"CollectionPage",name:"Dey Studio Articles",url:SITE+"/articles/"})}</script>\n`)
 +`<main class="awrap" id="main">
<h1 class="idx-h">Articles</h1>
<p class="lede">Plain-language guides on websites, online shops and ads for owners who want more customers.</p>
${posts.length?`<ul class="idx">\n${list}\n</ul>`:'<p>First articles coming soon.</p>'}
</main>
`+foot);
// Tools: /tools/ index and one page per tool (body fragment from tools-src/<slug>.html)
mkdirSync('tools',{recursive:true});
for(const t of TOOLS){
  const path=`/tools/${t.slug}/`;
  const ld={"@context":"https://schema.org","@type":"WebApplication",name:t.name,url:SITE+path,description:t.description,applicationCategory:"UtilitiesApplication",operatingSystem:"Any",offers:{"@type":"Offer",price:"0",priceCurrency:"USD"},creator:{"@type":"Organization",name:"Dey Studio",url:SITE}};
  const bc={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:SITE+"/"},{"@type":"ListItem",position:2,name:"Tools",item:SITE+"/tools/"},{"@type":"ListItem",position:3,name:t.name,item:SITE+path}]};
  const extra=`<script type="application/ld+json">${JSON.stringify(ld)}</script>\n<script type="application/ld+json">${JSON.stringify(bc)}</script>\n`;
  mkdirSync(`tools/${t.slug}`,{recursive:true});
  writeFileSync(`tools/${t.slug}/index.html`,head(`${t.title} | Dey Studio`,t.description,path,extra)
   +`<main class="awrap art tool" id="main">\n<nav class="crumbs" aria-label="Breadcrumb"><a href="/tools/">Tools</a></nav>\n${readFileSync(`tools-src/${t.slug}.html`,'utf8')}\n</main>\n`+foot);
}
const toolList=TOOLS.map(t=>`<li><a href="/tools/${t.slug}/"><h2>${esc(t.name)}</h2><p>${esc(t.blurb)}</p><span>Open tool &rarr;</span></a></li>`).join('\n');
writeFileSync('tools/index.html',head('Free tools for small business websites | Dey Studio','Free tools from Dey Studio: check how old a website is and more. No sign-up needed.','/tools/',`<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"CollectionPage",name:"Dey Studio Tools",url:SITE+"/tools/"})}</script>\n`)
 +`<main class="awrap" id="main">
<h1 class="idx-h">Tools</h1>
<p class="lede">Free tools for business owners. No sign-up needed.</p>
<ul class="idx">
${toolList}
</ul>
</main>
`+foot);
const urls=[['/',null],['/articles/',posts[0]?.date],...posts.map(p=>[`/articles/${p.slug}/`,p.updated||p.date]),['/tools/',TOOLS[0]?.date],...TOOLS.map(t=>[`/tools/${t.slug}/`,t.date])];
writeFileSync('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u,d])=>`  <url><loc>${SITE}${u}</loc>${d?`<lastmod>${d}</lastmod>`:''}</url>`).join('\n')}\n</urlset>\n`);
writeFileSync('robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`built ${posts.length} article(s)`);
