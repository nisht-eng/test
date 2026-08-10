// scripts.js — fetch posts, render hero / secondary grid / more-stories list, search
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

function timeAgo(dateStr){
  if(!dateStr) return '';
  const d = new Date(dateStr);
  if(isNaN(d)) return escapeHtml(dateStr);
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs/60000);
  if(mins < 60) return `${mins} মিনিট আগে`;
  const hrs = Math.floor(mins/60);
  if(hrs < 24) return `${hrs} ঘণ্টা আগে`;
  const days = Math.floor(hrs/24);
  if(days < 7) return `${days} দিন আগে`;
  return d.toLocaleDateString('bn-BD', { year:'numeric', month:'long', day:'numeric' });
}

function dek(post){
  return post.excerpt || stripHtml(post.content).slice(0,140) + '...';
}

function createFeaturedCard(post){
  const el = document.createElement('a');
  el.className = 'featured-card';
  el.href = `post.html?id=${encodeURIComponent(post.id)}`;
  el.innerHTML = `
    <div class="card-media">
      <span class="cat-badge">${escapeHtml(post.category||'Top')}</span>
      <img loading="lazy" src="${post.image||'https://via.placeholder.com/1200x700?text=No+Image'}" alt="${escapeHtml(post.title)}">
    </div>
    <h1>${escapeHtml(post.title)}</h1>
    <div class="card-byline">${escapeHtml(post.author||'অপরিচিত')}</div>
  `;
  return el;
}

function createGridCard(post){
  const el = document.createElement('a');
  el.className = 'grid-card';
  el.href = `post.html?id=${encodeURIComponent(post.id)}`;
  el.innerHTML = `
    <div class="card-media">
      <span class="cat-badge">${escapeHtml(post.category||'')}</span>
      <img loading="lazy" src="${post.image||'https://via.placeholder.com/600x320?text=No+Image'}" alt="${escapeHtml(post.title)}">
    </div>
    <h3>${escapeHtml(post.title)}</h3>
    <div class="card-byline">${escapeHtml(post.author||'অপরিচিত')}</div>
  `;
  return el;
}

function renderTopGrid(posts){
  const section = document.getElementById('top-grid');
  section.innerHTML = '';
  if(!posts.length) return;

  const featured = posts[0];
  const rest = posts.slice(1,5);

  section.appendChild(createFeaturedCard(featured));

  const grid = document.createElement('div');
  grid.className = 'grid-4';
  rest.forEach(p => grid.appendChild(createGridCard(p)));
  section.appendChild(grid);
}

function createStoryRow(post){
  const el = document.createElement('a');
  el.className = 'story-row';
  el.href = `post.html?id=${encodeURIComponent(post.id)}`;
  el.innerHTML = `
    <img loading="lazy" src="${post.image||'https://via.placeholder.com/400x260?text=No+Image'}" alt="${escapeHtml(post.title)}">
    <div>
      <div class="meta"><span class="kicker">${escapeHtml(post.category||'')}</span>By ${escapeHtml(post.author||'অপরিচিত')} • ${timeAgo(post.date)}</div>
      <h3>${escapeHtml(post.title)}</h3>
      <p class="dek">${escapeHtml(dek(post))}</p>
    </div>
  `;
  return el;
}

function renderMoreStories(posts){
  const list = document.getElementById('more-stories-list');
  list.innerHTML = '';
  if(posts.length === 0){ list.innerHTML = '<p style="color:var(--muted)">আর কোনো পোস্ট নেই।</p>'; return; }
  posts.forEach(p => list.appendChild(createStoryRow(p)));
}

function renderAll(posts){
  const empty = document.getElementById('empty-state');
  if(posts.length === 0){
    document.getElementById('top-grid').innerHTML = '';
    document.getElementById('more-stories-list').innerHTML = '';
    if(empty) empty.style.display = 'block';
    return;
  }
  if(empty) empty.style.display = 'none';
  renderTopGrid(posts.slice(0,5));
  renderMoreStories(posts.slice(5));
}

function filterPosts(){
  const term = document.getElementById('search-term').value.trim().toLowerCase();
  fetchPosts().then(posts => {
    let filtered = posts;
    if(term) filtered = posts.filter(p => (p.title||'').toLowerCase().includes(term) || (p.excerpt||'').toLowerCase().includes(term) || (p.content||'').toLowerCase().includes(term));
    renderAll(filtered);
  });
}

(async function init(){
  const posts = await fetchPosts();
  // newest first
  const sorted = posts.slice().sort((a,b) => new Date(b.date) - new Date(a.date));
  renderAll(sorted);
  const searchInput = document.getElementById('search-term');
  if(searchInput) searchInput.addEventListener('input', debounce(filterPosts, 250));
})();

function debounce(fn, ms){ let t; return (...a)=>{ clearTimeout(t); t = setTimeout(()=>fn(...a), ms); }; }
