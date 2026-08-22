(function () {
  const scripts = document.getElementsByTagName('script');
  let siteKey = null;
  let scriptUrl = null;
  let currentScript = null;
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].getAttribute('data-site-key') && scripts[i].src.indexOf('blog.js') !== -1) {
      siteKey = scripts[i].getAttribute('data-site-key');
      scriptUrl = scripts[i].src;
      currentScript = scripts[i];
      break;
    }
  }

  if (!siteKey) {
    console.error('Leadworks Blog: Missing data-site-key attribute on script tag.');
    return;
  }

  const srcHost = new URL(scriptUrl).origin;

  const style = document.createElement('style');
  style.innerHTML = `
    .lw-blog-root { font-family: system-ui, -apple-system, sans-serif; max-width: 760px; margin: 0 auto; color: #14161a; }
    .lw-blog-list { display: flex; flex-direction: column; gap: 18px; }
    .lw-blog-card { border: 1px solid #e4e7ec; border-radius: 12px; padding: 20px; cursor: pointer; transition: box-shadow 0.15s, transform 0.15s; }
    .lw-blog-card:hover { box-shadow: 0 6px 18px rgba(0,0,0,0.08); transform: translateY(-1px); }
    .lw-blog-title { font-size: 18px; font-weight: 700; margin: 0 0 6px; }
    .lw-blog-excerpt { font-size: 14px; color: #475467; line-height: 1.5; margin: 0 0 8px; }
    .lw-blog-date { font-size: 12px; color: #98a2b3; }
    .lw-blog-empty { font-size: 14px; color: #98a2b3; padding: 24px 0; text-align: center; }
    .lw-blog-back { background: none; border: none; color: #155eef; font-weight: 700; font-size: 13px; cursor: pointer; padding: 0 0 18px; font-family: inherit; }
    .lw-blog-post-title { font-size: 26px; font-weight: 800; margin: 0 0 8px; line-height: 1.25; }
    .lw-blog-post-date { font-size: 13px; color: #98a2b3; margin-bottom: 22px; }
    .lw-blog-post-body { font-size: 15px; line-height: 1.75; color: #344054; white-space: pre-wrap; }
  `;
  document.head.appendChild(style);

  const root = document.createElement('div');
  root.className = 'lw-blog-root';
  root.innerHTML = '<div class="lw-blog-empty">Loading posts…</div>';

  if (currentScript && currentScript.parentNode) {
    currentScript.parentNode.insertBefore(root, currentScript.nextSibling);
  } else {
    document.body.appendChild(root);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : str;
    return div.innerHTML;
  }

  function formatDate(iso) {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return '';
    }
  }

  function renderList(posts) {
    if (!posts.length) {
      root.innerHTML = '<div class="lw-blog-empty">No posts published yet.</div>';
      return;
    }
    const list = document.createElement('div');
    list.className = 'lw-blog-list';
    posts.forEach((post) => {
      const card = document.createElement('div');
      card.className = 'lw-blog-card';
      card.innerHTML =
        '<div class="lw-blog-title">' + escapeHtml(post.title) + '</div>' +
        '<p class="lw-blog-excerpt">' + escapeHtml(post.excerpt || '') + '</p>' +
        '<div class="lw-blog-date">' + formatDate(post.publishedAt || post.createdAt) + '</div>';
      card.addEventListener('click', () => openPost(post.slug));
      list.appendChild(card);
    });
    root.innerHTML = '';
    root.appendChild(list);
  }

  function renderPost(post) {
    root.innerHTML =
      '<button class="lw-blog-back" id="lw-blog-back-btn">← Back to all posts</button>' +
      '<h1 class="lw-blog-post-title">' + escapeHtml(post.title) + '</h1>' +
      '<div class="lw-blog-post-date">' + formatDate(post.publishedAt || post.createdAt) + '</div>' +
      '<div class="lw-blog-post-body">' + escapeHtml(post.content) + '</div>';
    const backBtn = document.getElementById('lw-blog-back-btn');
    if (backBtn) backBtn.addEventListener('click', loadList);
  }

  async function loadList() {
    root.innerHTML = '<div class="lw-blog-empty">Loading posts…</div>';
    try {
      const res = await fetch(srcHost + '/api/blog-embed?siteKey=' + encodeURIComponent(siteKey));
      const data = await res.json();
      renderList(data.posts || []);
    } catch (e) {
      root.innerHTML = '<div class="lw-blog-empty">Could not load posts.</div>';
    }
  }

  async function openPost(slug) {
    root.innerHTML = '<div class="lw-blog-empty">Loading…</div>';
    try {
      const res = await fetch(srcHost + '/api/blog-embed/' + encodeURIComponent(slug) + '?siteKey=' + encodeURIComponent(siteKey));
      const data = await res.json();
      if (data.post) renderPost(data.post);
      else root.innerHTML = '<div class="lw-blog-empty">Post not found.</div>';
    } catch (e) {
      root.innerHTML = '<div class="lw-blog-empty">Could not load post.</div>';
    }
  }

  loadList();
})();
