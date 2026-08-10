// scripts.js — rendering, fetching posts, hero and grid
const POSTS_PATH = 'posts.json';

async function fetchPosts(){
  try{
    const res = await fetch(POSTS_PATH, {cache: 'no-store'});
    if(!res.ok) throw new Error('no posts');
    return await res.json();
  }catch(e){
    const raw = localStorage.getItem('blog_posts');
    if(raw) return JSON.parse(raw);
    return [];
  }
}

function stripHtml(html){ return String(html||'').replace(/<[^>]*>/g, ''); }

function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function createCard(post){
  const el = document.createElement('article');
  el.className = 'card';
  el.innerHTML = `
    <img loading="lazy" src="${post.image||'https://via.placeholder.com/800x400?text=No+Image'}" alt="${escapeHtml(post.title)}">
    <div class="card-body">
      <div class="kicker-small">${escapeHtml(post.category||'')}</div>
      <h3>${escapeHtml(post.title)}</h3>
      <p>${escapeHtml(post.excerpt||stripHtml(post.content).slice(0,140)+'...')}</p>
      <div style="margin-top:8px;color:var(--muted);font-size:13px">${escapeHtml(post.author||'অপরিচিত')} • ${escapeHtml(post.date||'')}</div>
    </div>`;
  return el;
}

function renderHero(post){
  const hero = document.getElementById('hero');
  hero.innerHTML = '';
  if(!post) return;
  const card = document.createElement('div');
  card.className = 'hero-card';
  card.innerHTML = `
    <img loading="lazy" src="${post.image||'https://via.placeholder.com/1200x520?text=No+Image'}" alt="${escapeHtml(post.title)}">
    <div class="kicker">${escapeHtml(post.category||'Top')}</div>
    <h2>${escapeHtml(post.title)}</h2>
    <div style="padding:0 12px 12px;color:var(--muted)">${escapeHtml(post.excerpt||stripHtml(post.content).slice(0,180)+'...')}</div>
  `;
  hero.appendChild(card);
}

function renderGrid(posts){
  const grid = document.getElementById('article-grid'); grid.innerHTML = '';
  posts.forEach(p=> grid.appendChild(createCard(p)));
}

function renderTrending(posts){
  const t = document.getElementById('trending'); t.innerHTML = '';
  posts.slice(0,5).forEach(p=>{ const li = document.createElement('li'); li.innerHTML = `<a href="#">${escapeHtml(p.title)}</a>`; t.appendChild(li); });
}

(async function init(){
  const posts = await fetchPosts();
  if(posts.length>0){
    renderHero(posts[0]);
    renderGrid(posts.slice(1));
    renderTrending(posts);
  } else {
    document.getElementById('hero').innerHTML = '<p>No posts yet.</p>';
    document.getElementById('article-grid').innerHTML = '<p>No posts yet.</p>';
  }
})();
