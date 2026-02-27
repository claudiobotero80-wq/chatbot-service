(function(){
  'use strict';

  // Config from script tag
  var script = document.currentScript;
  var cfg = {
    botName: script.getAttribute('data-bot-name') || 'Asistente',
    color: script.getAttribute('data-color') || '#6C5CE7',
    greeting: script.getAttribute('data-greeting') || '¡Hola! ¿En qué puedo ayudarte?',
    webhookUrl: script.getAttribute('data-webhook-url') || '',
    faqs: []
  };
  try { cfg.faqs = JSON.parse(script.getAttribute('data-faqs') || '[]'); } catch(e) { cfg.faqs = []; }

  // Session ID
  var sessionId = 'ws_' + Math.random().toString(36).substr(2,9);

  // Styles
  var style = document.createElement('style');
  style.textContent = [
    '#jpw-widget *{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}',
    '#jpw-toggle{position:fixed;bottom:20px;right:20px;width:60px;height:60px;border-radius:50%;background:'+cfg.color+';border:none;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.3);z-index:99999;display:flex;align-items:center;justify-content:center;transition:transform .2s}',
    '#jpw-toggle:hover{transform:scale(1.1)}',
    '#jpw-toggle svg{width:28px;height:28px;fill:#fff}',
    '#jpw-chat{position:fixed;bottom:90px;right:20px;width:380px;max-width:calc(100vw - 32px);height:520px;max-height:calc(100vh - 120px);background:#1a1a2e;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,.4);z-index:99999;display:none;flex-direction:column;overflow:hidden;border:1px solid rgba(255,255,255,.08)}',
    '#jpw-chat.open{display:flex}',
    '#jpw-header{background:'+cfg.color+';padding:16px;display:flex;align-items:center;gap:10px;flex-shrink:0}',
    '#jpw-header .dot{width:10px;height:10px;background:#4ade80;border-radius:50%;flex-shrink:0}',
    '#jpw-header .name{color:#fff;font-size:15px;font-weight:600;flex:1}',
    '#jpw-header .close{background:none;border:none;color:rgba(255,255,255,.7);font-size:20px;cursor:pointer;padding:4px 8px}',
    '#jpw-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px}',
    '#jpw-messages::-webkit-scrollbar{width:4px}#jpw-messages::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:2px}',
    '.jpw-msg{max-width:85%;padding:10px 14px;border-radius:14px;font-size:14px;line-height:1.5;word-wrap:break-word;animation:jpw-fade .2s}',
    '.jpw-msg.bot{background:#16213e;color:#e2e8f0;align-self:flex-start;border-bottom-left-radius:4px}',
    '.jpw-msg.user{background:'+cfg.color+';color:#fff;align-self:flex-end;border-bottom-right-radius:4px}',
    '.jpw-msg.typing{opacity:.6}',
    '#jpw-faqs{padding:0 16px 12px;display:flex;flex-wrap:wrap;gap:6px}',
    '.jpw-faq{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:#a5b4fc;padding:6px 12px;border-radius:20px;font-size:12px;cursor:pointer;transition:background .15s}',
    '.jpw-faq:hover{background:rgba(255,255,255,.12)}',
    '#jpw-input-area{display:flex;padding:12px;gap:8px;border-top:1px solid rgba(255,255,255,.06);flex-shrink:0}',
    '#jpw-input{flex:1;background:#16213e;border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:10px 16px;color:#e2e8f0;font-size:14px;outline:none}',
    '#jpw-input::placeholder{color:rgba(255,255,255,.35)}',
    '#jpw-input:focus{border-color:'+cfg.color+'}',
    '#jpw-send{background:'+cfg.color+';border:none;border-radius:50%;width:40px;height:40px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .15s}',
    '#jpw-send:disabled{opacity:.4;cursor:default}',
    '#jpw-send svg{width:18px;height:18px;fill:#fff}',
    '@keyframes jpw-fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}',
    '@media(max-width:480px){#jpw-chat{bottom:0;right:0;width:100vw;height:100vh;max-height:100vh;border-radius:0}#jpw-toggle{bottom:16px;right:16px;width:56px;height:56px}}'
  ].join('\n');
  document.head.appendChild(style);

  // DOM
  var root = document.createElement('div');
  root.id = 'jpw-widget';
  root.innerHTML = [
    '<button id="jpw-toggle" aria-label="Abrir chat"><svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg></button>',
    '<div id="jpw-chat">',
      '<div id="jpw-header"><span class="dot"></span><span class="name">'+cfg.botName+'</span><button class="close" aria-label="Cerrar">&times;</button></div>',
      '<div id="jpw-messages"></div>',
      '<div id="jpw-faqs"></div>',
      '<div id="jpw-input-area"><input id="jpw-input" placeholder="Escribe tu mensaje..." autocomplete="off"><button id="jpw-send" disabled aria-label="Enviar"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button></div>',
    '</div>'
  ].join('');
  document.body.appendChild(root);

  var toggle = document.getElementById('jpw-toggle');
  var chat = document.getElementById('jpw-chat');
  var msgs = document.getElementById('jpw-messages');
  var faqsEl = document.getElementById('jpw-faqs');
  var input = document.getElementById('jpw-input');
  var sendBtn = document.getElementById('jpw-send');
  var isOpen = false;

  // Toggle
  toggle.onclick = function(){ isOpen = !isOpen; chat.classList.toggle('open', isOpen); if(isOpen) input.focus(); };
  chat.querySelector('.close').onclick = function(){ isOpen = false; chat.classList.remove('open'); };

  // Messages
  function addMsg(text, type) {
    var el = document.createElement('div');
    el.className = 'jpw-msg ' + type;
    el.textContent = text;
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    return el;
  }

  // Greeting
  addMsg(cfg.greeting, 'bot');

  // FAQs
  if (cfg.faqs.length) {
    cfg.faqs.forEach(function(faq) {
      var btn = document.createElement('button');
      btn.className = 'jpw-faq';
      btn.textContent = faq.q || faq;
      btn.onclick = function(){ sendMessage(typeof faq === 'string' ? faq : faq.q); faqsEl.style.display='none'; };
      faqsEl.appendChild(btn);
    });
  }

  // Input handling
  input.oninput = function(){ sendBtn.disabled = !input.value.trim(); };
  input.onkeydown = function(e){ if(e.key==='Enter' && !sendBtn.disabled) send(); };
  sendBtn.onclick = send;

  function send() {
    var text = input.value.trim();
    if(!text) return;
    input.value = '';
    sendBtn.disabled = true;
    sendMessage(text);
  }

  function sendMessage(text) {
    addMsg(text, 'user');
    var typing = addMsg('Escribiendo...', 'bot typing');

    if (!cfg.webhookUrl) {
      typing.textContent = 'Widget en modo demo — configura data-webhook-url para conectar al backend.';
      typing.classList.remove('typing');
      return;
    }

    fetch(cfg.webhookUrl, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ message: text, sessionId: sessionId, botName: cfg.botName })
    })
    .then(function(r){ return r.json(); })
    .then(function(data){
      typing.remove();
      addMsg(data.reply || data.output || data.text || data.message || JSON.stringify(data), 'bot');
    })
    .catch(function(err){
      typing.textContent = 'Error al conectar. Intenta de nuevo.';
      typing.classList.remove('typing');
    });
  }
})();
