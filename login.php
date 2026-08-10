<?php
$page_title  = 'Login — Admin';
$header_mode = 'simple';
$body_style  = 'background:var(--surface)';
include __DIR__ . '/header.php';
?>

<main class="wrap" style="max-width:440px;margin:80px auto">
  <div class="auth-card">
    <h1>Admin Login</h1>
    <p>এই পাতা কেবল ডেমো ব্যবহারের জন্য। নিরাপত্তা নেই — প্রোডাকশনে ব্যবহার করবেন না।</p>
    <form id="login-form">
      <label>Username <input id="username" required></label>
      <label>Password <input id="password" type="password" required></label>
      <button type="submit">Log in</button>
      <div id="msg" style="margin-top:12px;color:var(--accent-dark)"></div>
    </form>
  </div>
</main>

<script src="config.js"></script>
<script>
  const form = document.getElementById('login-form');
  const msg = document.getElementById('msg');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value;
    if (u === ADMIN_CREDENTIALS.username && p === ADMIN_CREDENTIALS.password) {
      // simple token
      localStorage.setItem('admin_token', btoa(u + ':' + Date.now()));
      location.href = 'admin.php';
    } else {
      msg.textContent = 'Invalid credentials';
    }
  });
</script>

<?php include __DIR__ . '/footer.php'; ?>
