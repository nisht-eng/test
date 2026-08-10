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

const PAGE_SIZE = 10;
let latestPostsCache = [];
let currentPage = 1;

function renderMoreStories(posts){
  const list = document.getElementById('more-stories-list');
  list.innerHTML = '';
  if(posts.length === 0){ list.innerHTML = '<p style="color:var(--muted)">আর কোনো পোস্ট নেই।</p>'; return; }
  posts.forEach(p => list.appendChild(createStoryRow(p)));
}

function getPageNumbers(current, total){
  const delta = 2;
  const range = [];
  const withDots = [];
  let last;
  for(let i=1;i<=total;i++){
    if(i===1 || i===total || (i>=current-delta && i<=current+delta)) range.push(i);
  }
  range.forEach(i => {
    if(last){
      if(i - last === 2) withDots.push(last+1);
      else if(i - last > 2) withDots.push('…');
    }
    withDots.push(i);
    last = i;
  });
  return withDots;
}

function renderPagination(totalItems){
  const nav = document.getElementById('pagination');
  if(!nav) return;
  nav.innerHTML = '';
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  if(totalPages <= 1) return;

  const makeBtn = (label, page, {active=false, disabled=false, isNav=false} = {}) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label;
    btn.className = 'page-btn' + (active ? ' active' : '') + (isNav ? ' page-nav' : '');
    if(disabled) btn.disabled = true;
    else btn.addEventListener('click', () => goToPage(page));
    return btn;
  };

  nav.appendChild(makeBtn('‹ আগের', currentPage-1, {disabled: currentPage===1, isNav:true}));

  getPageNumbers(currentPage, totalPages).forEach(p => {
    if(p === '…'){
      const dots = document.createElement('span');
      dots.className = 'page-dots';
      dots.textContent = '…';
      nav.appendChild(dots);
    }else{
      nav.appendChild(makeBtn(String(p), p, {active: p===currentPage}));
    }
  });

  nav.appendChild(makeBtn('পরের ›', currentPage+1, {disabled: currentPage===totalPages, isNav:true}));
}

function goToPage(page){
  const totalPages = Math.ceil(latestPostsCache.length / PAGE_SIZE);
  if(page < 1 || page > totalPages) return;
  currentPage = page;
  const start = (page-1) * PAGE_SIZE;
  renderMoreStories(latestPostsCache.slice(start, start + PAGE_SIZE));
  renderPagination(latestPostsCache.length);
  document.querySelector('.more-stories')?.scrollIntoView({behavior:'smooth', block:'start'});
}

function renderHomeSidebar(allPosts, shownPosts){
  const sidebar = document.getElementById('home-sidebar');
  if(!sidebar) return;

  const shownIds = new Set(shownPosts.map(p => String(p.id)));
  const popular = allPosts.filter(p => !shownIds.has(String(p.id))).slice(0,5);
  const source = popular.length ? popular : allPosts.slice(0,5);
  const categories = [...new Set(allPosts.map(p => p.category).filter(Boolean))];

  const popularHtml = source.map(p => `
    <li>
      <a class="sidebar-post" href="post.html?id=${encodeURIComponent(p.id)}">
        <img src="${p.image||'https://via.placeholder.com/160x160?text=No+Image'}" alt="${escapeHtml(p.title)}">
        <div>
          <div class="kicker">${escapeHtml(p.category||'')}</div>
          <h4>${escapeHtml(p.title)}</h4>
        </div>
      </a>
    </li>
  `).join('');

  const categoriesHtml = categories.map(c => `
    <li><a href="index.html?category=${encodeURIComponent(c)}">${escapeHtml(c)}</a></li>
  `).join('');

  sidebar.innerHTML = `
    <div class="sidebar-widget">
      <h3>জনপ্রিয় পোস্ট</h3>
      <ul class="sidebar-recent">${popularHtml || '<li>কোনো পোস্ট নেই</li>'}</ul>
    </div>
    <div class="sidebar-widget">
      <h3>ক্যাটাগরি</h3>
      <ul class="sidebar-categories">${categoriesHtml || '<li>কোনো ক্যাটাগরি নেই</li>'}</ul>
    </div>
  `;
}

function renderAll(posts){
  const empty = document.getElementById('empty-state');
  if(posts.length === 0){
    document.getElementById('top-grid').innerHTML = '';
    document.getElementById('more-stories-list').innerHTML = '';
    document.getElementById('pagination').innerHTML = '';
    const sidebar = document.getElementById('home-sidebar');
    if(sidebar) sidebar.innerHTML = '';
    if(empty) empty.style.display = 'block';
    return;
  }
  if(empty) empty.style.display = 'none';
  renderTopGrid(posts.slice(0,5));

  latestPostsCache = posts.slice(5);
  currentPage = 1;
  renderMoreStories(latestPostsCache.slice(0, PAGE_SIZE));
  renderPagination(latestPostsCache.length);

  renderHomeSidebar(posts, posts.slice(0,5));
}

function getCategoryParam(){
  const u = new URL(location.href);
  return (u.searchParams.get('category') || '').trim();
}

function applyFilters(){
  const term = (document.getElementById('search-term')?.value || '').trim().toLowerCase();
  const cat = getCategoryParam();
  fetchPosts().then(posts => {
    let filtered = posts;
    if(cat) filtered = filtered.filter(p => (p.category||'').toLowerCase() === cat.toLowerCase());
    if(term) filtered = filtered.filter(p => (p.title||'').toLowerCase().includes(term) || (p.excerpt||'').toLowerCase().includes(term) || (p.content||'').toLowerCase().includes(term));
    renderAll(filtered.slice().sort((a,b) => new Date(b.date) - new Date(a.date)));
  });
}

function filterPosts(){ applyFilters(); }

function highlightActiveNav(){
  const cat = getCategoryParam();
  document.querySelectorAll('#main-nav a[data-cat]').forEach(a => {
    a.classList.toggle('active', a.dataset.cat.toLowerCase() === cat.toLowerCase());
  });
  const heading = document.getElementById('category-heading');
  if(heading){
    if(cat){ heading.textContent = cat; heading.style.display = 'block'; }
    else{ heading.style.display = 'none'; }
  }
}

(async function init(){
  highlightActiveNav();
  applyFilters();
  const searchInput = document.getElementById('search-term');
  if(searchInput) searchInput.addEventListener('input', debounce(filterPosts, 250));
})();

function debounce(fn, ms){ let t; return (...a)=>{ clearTimeout(t); t = setTimeout(()=>fn(...a), ms); }; }
