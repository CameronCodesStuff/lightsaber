const GIF_URL = 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTZyYWl4bWxpMzJmNnhyZWlsaGt1NmVraDZtNjE1azY3NHRpZ29hMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/SmYqlOh9GtnuAe4SwB/giphy.gif';
const API_KEY  = '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';
const SYSTEM   = `You are LightSaber AI — a razor-sharp, darkly powerful AI assistant with the presence of a seasoned Force wielder. You are brilliant, direct, and commanding. Answer questions with precision and depth. You may occasionally reference the Force or Star Wars themes if it fits naturally, but primarily you are an elite, capable AI assistant who gets things done.`;

(function initBg() {
  const canvas = document.getElementById('bgCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H;

  
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  
  class Particle {
    constructor(forceRandom) { this.reset(forceRandom); }

    reset(rand = false) {
      
      this.x = Math.random() * W;
      this.y = rand ? Math.random() * H : H + 10;

      
      const roll = Math.random();
      if (roll < 0.55) {
        
        this.kind   = 'ember';
        this.vx     = (Math.random() - 0.5) * 0.35;
        this.vy     = -(0.08 + Math.random() * 0.28);
        this.size   = 0.6 + Math.random() * 1.4;
        this.maxLife = 250 + Math.random() * 450;
      } else if (roll < 0.78) {
        
        this.kind   = 'spark';
        this.vx     = (Math.random() - 0.5) * 1.2;
        this.vy     = -(0.4 + Math.random() * 1.0);
        this.size   = 1.2 + Math.random() * 2.2;
        this.maxLife = 80 + Math.random() * 160;
      } else if (roll < 0.92) {
        
        this.kind   = 'dust';
        this.vx     = (Math.random() - 0.5) * 0.15;
        this.vy     = -(0.05 + Math.random() * 0.12);
        this.size   = 0.3 + Math.random() * 0.6;
        this.maxLife = 400 + Math.random() * 600;
      } else {
        
        this.kind   = 'orb';
        this.x      = Math.random() * W;
        this.y      = rand ? Math.random() * H : H + 20;
        this.vx     = (Math.random() - 0.5) * 0.2;
        this.vy     = -(0.04 + Math.random() * 0.1);
        this.size   = 4 + Math.random() * 7;
        this.maxLife = 600 + Math.random() * 800;
      }

      this.life    = 0;
      
      this.wobble  = Math.random() * Math.PI * 2;
      this.wobbleS = 0.015 + Math.random() * 0.03;
    }

    update() {
      this.wobble += this.wobbleS;
      this.x += this.vx + Math.sin(this.wobble) * 0.18;
      this.y += this.vy;
      this.life++;
      if (this.life > this.maxLife || this.y < -20 || this.x < -20 || this.x > W + 20) {
        this.reset(false);
      }
    }

    draw() {
      const t     = this.life / this.maxLife;
      const alpha = Math.sin(t * Math.PI);   

      ctx.save();
      switch (this.kind) {
        case 'ember':
          ctx.shadowBlur  = 8;
          ctx.shadowColor = `rgba(255,40,0,0.8)`;
          ctx.fillStyle   = `rgba(255,${50 + Math.floor(t * 30)},0,${alpha * 0.65})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'spark':
          ctx.shadowBlur  = 14;
          ctx.shadowColor = `rgba(255,0,0,1)`;
          ctx.fillStyle   = `rgba(255,${80 + Math.floor(alpha * 60)},${Math.floor(alpha * 40)},${alpha * 0.9})`;
          
          ctx.translate(this.x, this.y);
          ctx.rotate(Math.atan2(this.vy, this.vx) + Math.PI / 2);
          ctx.fillRect(-this.size * 0.35, -this.size * 1.4, this.size * 0.7, this.size * 2.8);
          break;

        case 'dust':
          ctx.shadowBlur  = 0;
          ctx.fillStyle   = `rgba(90,10,10,${alpha * 0.35})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'orb':
          const r  = this.size;
          const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r);
          grd.addColorStop(0,   `rgba(255,60,0,${alpha * 0.28})`);
          grd.addColorStop(0.5, `rgba(180,10,0,${alpha * 0.12})`);
          grd.addColorStop(1,   'rgba(0,0,0,0)');
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
          ctx.fill();
          break;
      }
      ctx.restore();
    }
  }

  
  const TOTAL = 180;
  const particles = Array.from({ length: TOTAL }, () => new Particle(true));

  
  let gridT = 0;
  function drawGrid() {
    gridT += 0.002;
    const spacing = 90;

    ctx.strokeStyle = 'rgba(255,26,26,0.022)';
    ctx.lineWidth   = 1;

    for (let x = 0; x < W; x += spacing) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += spacing) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    
    const sy   = ((Math.sin(gridT) * 0.5 + 0.5) * H * 1.4) - H * 0.2;
    const grad = ctx.createLinearGradient(0, sy - 70, 0, sy + 70);
    grad.addColorStop(0,   'transparent');
    grad.addColorStop(0.5, 'rgba(255,26,26,0.03)');
    grad.addColorStop(1,   'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, sy - 70, W, 140);
  }

  
  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    ctx.shadowBlur = 0;
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

(function initStars() {
  const container = document.getElementById('loaderStars');
  for (let i = 0; i < 130; i++) {
    const s = document.createElement('div');
    s.className = 'lstar';
    const big = Math.random() > 0.88;
    s.style.cssText = `
      left:    ${Math.random() * 100}%;
      top:     ${Math.random() * 100}%;
      --d:     ${1.4 + Math.random() * 4}s;
      --delay: -${Math.random() * 4}s;
      opacity: ${0.08 + Math.random() * 0.5};
      width:   ${big ? 3 : 1.5}px;
      height:  ${big ? 3 : 1.5}px;
    `;
    container.appendChild(s);
  }
})();

window.addEventListener('load', () => {
  
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('out');
    setTimeout(() => {
      loader.style.display = 'none';
      const app = document.getElementById('app');
      app.classList.add('visible');
      document.getElementById('input').focus();
    }, 1000);
  }, 4600);
});

let messages = [];
let busy     = false;

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 180) + 'px';
}

function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function escHtml(t) {
  return t
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmt(text) {
  text = text.replace(/```(\w+)?\n?([\s\S]*?)```/g,
    (_, _l, c) => `<pre><code>${escHtml(c.trim())}</code></pre>`);
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  text = text.replace(/\n/g, '<br>');
  return text;
}

function addMsg(role, content, typing = false) {
  
  const empty = document.getElementById('emptyState');
  if (empty) empty.remove();

  const inner = document.getElementById('chatInner');
  const wrap  = document.createElement('div');
  wrap.className = `message ${role}`;

  const avatarHtml = role === 'assistant'
    ? `<div class="msg-avatar"><img src="${GIF_URL}" alt="AI" class="ai-avatar-gif"></div>`
    : `<div class="msg-avatar">YOU</div>`;

  const lineHtml  = `<div class="msg-label-line"></div>`;
  const labelHtml = role === 'assistant'
    ? `<div class="msg-label">${lineHtml} LightSaber AI</div>`
    : `<div class="msg-label">You ${lineHtml}</div>`;

  const bubbleContent = typing
    ? `<div class="typing-indicator">
         <div class="typing-dot"></div>
         <div class="typing-dot"></div>
         <div class="typing-dot"></div>
       </div>`
    : (role === 'assistant' ? fmt(content) : escHtml(content));

  wrap.innerHTML = `
    ${avatarHtml}
    <div class="msg-body">
      ${labelHtml}
      <div class="msg-bubble">${bubbleContent}</div>
    </div>
  `;

  if (typing) wrap.id = 'typingMsg';
  inner.appendChild(wrap);
  wrap.scrollIntoView({ behavior: 'smooth', block: 'end' });
  return wrap;
}

async function sendMessage() {
  if (busy) return;

  const inp  = document.getElementById('input');
  const text = inp.value.trim();
  if (!text) return;

  inp.value = '';
  inp.style.height = 'auto';
  document.getElementById('sendBtn').disabled = true;
  busy = true;

  addMsg('user', text);
  messages.push({ role: 'user', content: text });

  const typingEl = addMsg('assistant', '', true);

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model:       'gpt-4o',
        messages:    [{ role: 'system', content: SYSTEM }, ...messages],
        max_tokens:  1024,
        temperature: 0.72,
      }),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    const reply = data.choices[0].message.content;
    messages.push({ role: 'assistant', content: reply });
    typingEl.remove();
    addMsg('assistant', reply);

  } catch (err) {
    typingEl.remove();
    addMsg('assistant', `⚠ The Force connection was disrupted: ${err.message}`);
  }

  busy = false;
  document.getElementById('sendBtn').disabled = false;
  inp.focus();
}
