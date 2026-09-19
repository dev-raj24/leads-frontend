(async function() {
  const scripts = document.getElementsByTagName('script');
  let siteKey = null;
  let apiBase = null;
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].getAttribute('data-site-key')) {
      siteKey = scripts[i].getAttribute('data-site-key');
      apiBase = (scripts[i].getAttribute('data-api') || '').replace(/\/+$/, '');
      break;
    }
  }

  if (!siteKey) {
    console.error('Leadworks Widget: Missing data-site-key attribute on script tag.');
    return;
  }

  if (!apiBase) {
    console.error('Leadworks Widget: Missing data-api attribute on script tag.');
    return;
  }

  // Offer text comes from the owner's dashboard — never inject it as raw HTML.
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Fetch dynamic config
  let config = null;
  try {
    const res = await fetch(`${apiBase}/api/public/widget-config?siteKey=${encodeURIComponent(siteKey)}`);
    if (res.ok) {
      config = await res.json();
    }
  } catch (e) {
    console.error('Leadworks Widget: Failed to fetch config', e);
  }

  const offer = config?.offer || null;

  // Inject styles
  const style = document.createElement('style');
  style.innerHTML = `
    #lw-widget-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      font-family: system-ui, -apple-system, sans-serif;
    }
    #lw-bubble {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #155eef;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: transform 0.2s;
    }
    #lw-bubble:hover {
      transform: scale(1.05);
    }
    #lw-chat {
      display: none;
      width: 320px;
      height: 400px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      flex-direction: column;
      overflow: hidden;
      border: 1px solid #e4e7ec;
      margin-bottom: 16px;
    }
    #lw-chat.open {
      display: flex;
    }
    .lw-header {
      background: #155eef;
      color: white;
      padding: 16px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .lw-close {
      cursor: pointer;
      font-weight: normal;
      opacity: 0.8;
    }
    .lw-close:hover { opacity: 1; }
    .lw-body {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      font-size: 14px;
      color: #475467;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .lw-msg-bot {
      background: #f2f4f7;
      padding: 10px 14px;
      border-radius: 12px;
      border-bottom-left-radius: 4px;
      align-self: flex-start;
      max-width: 85%;
    }
    .lw-footer {
      padding: 12px;
      border-top: 1px solid #e4e7ec;
    }
    .lw-input-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .lw-input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #e4e7ec;
      border-radius: 8px;
      font-size: 14px;
      box-sizing: border-box;
    }
    .lw-btn {
      width: 100%;
      padding: 10px;
      background: #14161a;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }
    .lw-btn:hover { background: #344054; }
    .lw-success { display: none; text-align: center; margin-top: 40px; color: #155eef; font-weight: bold; }

    /* Dynamic Banner Styles */
    #lw-banner {
      position: fixed;
      z-index: 999998;
      font-family: system-ui, -apple-system, sans-serif;
      box-sizing: border-box;
      display: none; /* hidden by default */
    }

    #lw-banner.lw-banner-top {
      top: 0;
      left: 0;
      width: 100%;
      background-color: var(--lw-banner-color, #14161a);
      color: white;
      text-align: center;
      padding: 12px 20px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
    }

    #lw-banner.lw-banner-bottom-left {
      bottom: 24px;
      left: 24px;
      width: auto;
      max-width: 320px;
      background-color: var(--lw-banner-color, #14161a);
      color: white;
      padding: 16px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      display: flex;
      flex-direction: column;
      gap: 12px;
      border: 1px solid #344054;
    }

    .lw-banner-text {
      line-height: 1.4;
    }
    .lw-banner-btn {
      background: white;
      color: #14161a;
      border: none;
      border-radius: 6px;
      padding: 8px 14px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      transition: background 0.15s;
      width: fit-content;
      white-space: nowrap;
    }
    .lw-banner-btn:hover {
      background: #f2f4f7;
    }
  `;
  document.head.appendChild(style);

  // Inject Chat UI
  const container = document.createElement('div');
  container.id = 'lw-widget-container';
  container.innerHTML = `
    <div id="lw-chat">
      <div class="lw-header">
        <span>Chat with us</span>
        <span class="lw-close" id="lw-close-btn">✕</span>
      </div>
      <div class="lw-body" id="lw-chat-body">
        <div class="lw-msg-bot">Hi there! 👋 How can we help you today?</div>
        <div class="lw-success" id="lw-success-msg">Thanks! We'll be in touch soon.</div>
        <div class="lw-input-group" id="lw-input-form">
          <input type="text" id="lw-name" class="lw-input" placeholder="Your Name" />
          <input type="text" id="lw-contact" class="lw-input" placeholder="Email or Phone" />
          <textarea id="lw-message" class="lw-input" placeholder="Message..." rows="3"></textarea>
          <button class="lw-btn" id="lw-send-btn">Send Message</button>
        </div>
      </div>
    </div>
    <div id="lw-bubble">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
    </div>
  `;
  document.body.appendChild(container);

  // Inject Banner UI if an offer exists
  const banner = document.createElement('div');
  banner.id = 'lw-banner';
  if (offer && offer.displayMode !== 'none') {
    banner.style.setProperty('--lw-banner-color', offer.color || '#14161a');
    
    if (offer.displayMode === 'top') {
      banner.className = 'lw-banner-top';
      // Push the body down so it sits perfectly above the header without hiding content
      document.body.style.paddingTop = '52px'; // approximate height of the top banner
      
      banner.innerHTML = `
        <span class="lw-banner-text">🎉 <b>${esc(offer.title)}</b> ${esc(offer.body)}</span>
        <button class="lw-banner-btn" id="lw-banner-claim-btn">${esc(offer.actionText)}</button>
        <span class="lw-close" id="lw-banner-close" style="font-size: 14px; cursor: pointer; margin-left: 8px;">✕</span>
      `;
    } else if (offer.displayMode === 'bottom-left') {
      banner.className = 'lw-banner-bottom-left';
      banner.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
          <span class="lw-banner-text">🎉 <b>${esc(offer.title)}</b><br/>${esc(offer.body)}</span>
          <span class="lw-close" id="lw-banner-close" style="font-size: 12px; margin-top: 2px; cursor: pointer;">✕</span>
        </div>
        <button class="lw-banner-btn" id="lw-banner-claim-btn">${esc(offer.actionText)}</button>
      `;
    }
    
    document.body.appendChild(banner);
  }

  // Event Listeners
  const bubble = document.getElementById('lw-bubble');
  const chat = document.getElementById('lw-chat');
  const closeBtn = document.getElementById('lw-close-btn');
  const sendBtn = document.getElementById('lw-send-btn');
  const claimBtn = document.getElementById('lw-banner-claim-btn');
  const bannerCloseBtn = document.getElementById('lw-banner-close');
  const msgInput = document.getElementById('lw-message');
  
  function openChat(presetMessage = '') {
    chat.classList.add('open');
    bubble.style.display = 'none';
    if (banner && banner.style.display !== 'none') {
      banner.style.display = 'none';
      if (offer?.displayMode === 'top') {
        document.body.style.paddingTop = '0'; // reset body padding when closed
      }
    }
    if (presetMessage) {
      msgInput.value = presetMessage;
      msgInput.focus();
    }
  }

  bubble.addEventListener('click', () => openChat());

  if (claimBtn) {
    claimBtn.addEventListener('click', () => {
      openChat(`Hi, I want to claim: ${offer?.title}`);
    });
  }

  if (bannerCloseBtn) {
    bannerCloseBtn.addEventListener('click', () => {
      banner.style.display = 'none';
      if (offer?.displayMode === 'top') {
        document.body.style.paddingTop = '0';
      }
    });
  }

  closeBtn.addEventListener('click', () => {
    chat.classList.remove('open');
    bubble.style.display = 'flex';
  });

  sendBtn.addEventListener('click', async () => {
    const name = document.getElementById('lw-name').value;
    const contact = document.getElementById('lw-contact').value;
    const message = document.getElementById('lw-message').value;

    if (!contact) {
      alert("Please enter your email or phone number.");
      return;
    }

    sendBtn.innerText = "Sending...";
    sendBtn.disabled = true;

    try {
      const res = await fetch(apiBase + '/api/ingest/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site_key: siteKey, name, contact, message })
      });

      if (res.ok) {
        document.getElementById('lw-input-form').style.display = 'none';
        document.getElementById('lw-success-msg').style.display = 'block';
      } else {
        throw new Error('Failed');
      }
    } catch (e) {
      alert("Error sending message. Please try again.");
      sendBtn.innerText = "Send Message";
      sendBtn.disabled = false;
    }
  });

})();
