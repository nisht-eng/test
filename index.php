<?php $page_title = 'Simple News — খবর'; include __DIR__ . '/header.php'; ?>

<main class="wrap site-main">
  <h1 class="category-heading" id="category-heading" style="display:none"></h1>

  <section class="top-grid" id="top-grid">
    <!-- featured post + 2x2 grid filled by JS -->
  </section>

  <section class="more-stories">
    <h2 class="section-label">Latest</h2>
    <div class="more-stories-layout">
      <div class="more-stories-main">
        <div id="more-stories-list">
          <!-- story rows filled by JS -->
        </div>
        <p id="empty-state" style="display:none;color:var(--muted)">কোনো পোস্ট পাওয়া যায়নি।</p>
        <nav class="pagination" id="pagination" aria-label="Pagination">
          <!-- pagination filled by JS -->
        </nav>
      </div>
      <aside class="home-sidebar" id="home-sidebar">
        <!-- sidebar filled by JS -->
      </aside>
    </div>
  </section>
</main>

<?php include __DIR__ . '/footer.php'; ?>
