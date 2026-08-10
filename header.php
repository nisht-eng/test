<?php
// $page_title  : <title> text
// $header_mode : 'full' (default, public pages with nav+search) | 'simple' (logo only) | 'admin' (logo + Home + Logout)
// $body_style  : optional inline style for <body>
$header_mode = $header_mode ?? 'full';
?>
<!doctype html>
<html lang="bn">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title><?php echo isset($page_title) ? $page_title : 'Simple News'; ?></title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700;800&family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body<?php echo isset($body_style) ? ' style="' . htmlspecialchars($body_style) . '"' : ''; ?>>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="logo" href="index.php" aria-label="Home">
      <img src="assets/logo.svg" alt="" />
      <span class="logo-text">Simple News</span>
    </a>
    <?php if ($header_mode === 'full'): ?>
    <nav class="main-nav" id="main-nav">
      <a href="index.php?category=Domain" data-cat="Domain">Domain</a>
      <a href="index.php?category=Hosting" data-cat="Hosting">Hosting</a>
      <a href="index.php?category=Website" data-cat="Website">Website</a>
      <a href="index.php?category=Mobile" data-cat="Mobile">Mobile</a>
      <a href="index.php?category=Computer" data-cat="Computer">Computer</a>
      <a href="index.php?category=Freelancing" data-cat="Freelancing">Freelancing</a>
      <a href="index.php?category=SEO" data-cat="SEO">SEO</a>
    </nav>
    <form class="search" onsubmit="event.preventDefault(); document.getElementById('search-term').blur(); filterPosts();">
      <input id="search-term" placeholder="Search…" aria-label="Search" />
    </form>
    <?php elseif ($header_mode === 'admin'): ?>
    <nav class="main-nav">
      <a href="index.php">Home</a>
      <a href="#" id="logout">Logout</a>
    </nav>
    <?php endif; ?>
  </div>
</header>
