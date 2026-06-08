const GIF_URL = 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTZyYWl4bWxpMzJmNnhyZWlsaGt1NmVraDZtNjE1azY3NHRpZ29hMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/SmYqlOh9GtnuAe4SwB/giphy.gif';
const SYSTEM = `You are LightSaber AI — a razor-sharp, darkly powerful AI assistant with the presence of a seasoned Force wielder. You are brilliant, direct, and commanding. Answer questions with precision and depth. You may occasionally reference the Force or Star Wars themes if it fits naturally, but primarily you are an elite, capable AI assistant who gets things done.`;

/* ─────────────────────────────────────────────
   BACKGROUND PARTICLE CANVAS
───────────────────────────────────────────── */
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
        this.kind='ember'; this.vx=(Math.random()-0.5)*0.35; this.vy=-(0.08+Math.random()*0.28);
        this.size=0.6+Math.random()*1.4; this.maxLife=250+Math.random()*450;
      } else if (roll < 0.78) {
        this.kind='spark'; this.vx=(Math.random()-0.5)*1.2; this.vy=-(0.4+Math.random()*1.0);
        this.size=1.2+Math.random()*2.2; this.maxLife=80+Math.random()*160;
      } else if (roll < 0.92) {
        this.kind='dust'; this.vx=(Math.random()-0.5)*0.15; this.vy=-(0.05+Math.random()*0.12);
        this.size=0.3+Math.random()*0.6; this.maxLife=400+Math.random()*600;
      } else {
        this.kind='orb'; this.x=Math.random()*W; this.y=rand?Math.random()*H:H+20;
        this.vx=(Math.random()-0.5)*0.2; this.vy=-(0.04+Math.random()*0.1);
        this.size=4+Math.random()*7; this.maxLife=600+Math.random()*800;
      }
      this.life=0; this.wobble=Math.random()*Math.PI*2; this.wobbleS=0.015+Math.random()*0.03;
    }
    update() {
      this.wobble += this.wobbleS;
      this.x += this.vx + Math.sin(this.wobble)*0.18;
      this.y += this.vy;
      this.life++;
      if (this.life > this.maxLife || this.y < -20 || this.x < -20 || this.x > W+20) this.reset(false);
    }
    draw() {
      const t=this.life/this.maxLife, alpha=Math.sin(t*Math.PI);
      ctx.save();
      switch(this.kind) {
        case 'ember':
          ctx.shadowBlur=8; ctx.shadowColor=`rgba(255,40,0,0.8)`;
          ctx.fillStyle=`rgba(255,${50+Math.floor(t*30)},0,${alpha*0.65})`;
          ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2); ctx.fill(); break;
        case 'spark':
          ctx.shadowBlur=14; ctx.shadowColor=`rgba(255,0,0,1)`;
          ctx.fillStyle=`rgba(255,${80+Math.floor(alpha*60)},${Math.floor(alpha*40)},${alpha*0.9})`;
          ctx.translate(this.x,this.y); ctx.rotate(Math.atan2(this.vy,this.vx)+Math.PI/2);
          ctx.fillRect(-this.size*0.35,-this.size*1.4,this.size*0.7,this.size*2.8); break;
        case 'dust':
          ctx.shadowBlur=0; ctx.fillStyle=`rgba(90,10,10,${alpha*0.35})`;
          ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2); ctx.fill(); break;
        case 'orb':
          const r=this.size, grd=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,r);
          grd.addColorStop(0,`rgba(255,60,0,${alpha*0.28})`);
          grd.addColorStop(0.5,`rgba(180,10,0,${alpha*0.12})`);
          grd.addColorStop(1,'rgba(0,0,0,0)');
          ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(this.x,this.y,r,0,Math.PI*2); ctx.fill(); break;
      }
      ctx.restore();
    }
  }

  const TOTAL = 180;
  const particles = Array.from({length:TOTAL}, ()=>new Particle(true));
  let gridT = 0;
  function drawGrid() {
    gridT += 0.002;
    const spacing=90;
    ctx.strokeStyle='rgba(255,26,26,0.022)'; ctx.lineWidth=1;
    for(let x=0;x<W;x+=spacing){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=spacing){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    const sy=((Math.sin(gridT)*0.5+0.5)*H*1.4)-H*0.2;
    const grad=ctx.createLinearGradient(0,sy-70,0,sy+70);
    grad.addColorStop(0,'transparent'); grad.addColorStop(0.5,'rgba(255,26,26,0.03)'); grad.addColorStop(1,'transparent');
    ctx.fillStyle=grad; ctx.fillRect(0,sy-70,W,140);
  }
  function loop() {
    ctx.clearRect(0,0,W,H); drawGrid(); ctx.shadowBlur=0;
    particles.forEach(p=>{p.update();p.draw();});
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ─────────────────────────────────────────────
   LIGHTSABER FIGHT CANVAS
───────────────────────────────────────────── */
(function initFight() {
  const canvas = document.getElementById('fightCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Sparks emitted on clash ──
  const sparks = [];
  function emitSparks(x, y, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      sparks.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.03 + Math.random() * 0.05,
        size: 1 + Math.random() * 2.5,
        color: Math.random() > 0.4 ? '#ff4400' : '#ffffff',
      });
    }
  }

  // ── Draw one saber ──
  // base: {x,y}  tip: {x,y}  color1/color2: glow colors  width: blade px
  function drawSaber(base, tip, color1, color2, width = 7) {
    const dx = tip.x - base.x, dy = tip.y - base.y;
    const len = Math.hypot(dx, dy);
    const nx = dx/len, ny = dy/len;

    // Hilt (from base, extending away from tip, 40px)
    const hiltLen = 40;
    const hx = base.x - nx * hiltLen;
    const hy = base.y - ny * hiltLen;

    // Hilt draw
    const hiltGrad = ctx.createLinearGradient(hx, hy, base.x, base.y);
    hiltGrad.addColorStop(0, '#555');
    hiltGrad.addColorStop(0.45, '#ccc');
    hiltGrad.addColorStop(0.55, '#999');
    hiltGrad.addColorStop(1, '#444');
    ctx.save();
    ctx.strokeStyle = hiltGrad;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.lineTo(base.x, base.y);
    ctx.stroke();

    // Guard crosspiece
    const perpX = -ny * 16, perpY = nx * 16;
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(base.x - perpX, base.y - perpY);
    ctx.lineTo(base.x + perpX, base.y + perpY);
    ctx.stroke();
    ctx.restore();

    // Outer glow
    ctx.save();
    ctx.shadowBlur  = 40;
    ctx.shadowColor = color1;
    ctx.strokeStyle = color1;
    ctx.lineWidth   = width + 8;
    ctx.globalAlpha = 0.18;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(base.x, base.y); ctx.lineTo(tip.x, tip.y); ctx.stroke();

    // Mid glow
    ctx.shadowBlur  = 22;
    ctx.shadowColor = color1;
    ctx.strokeStyle = color2;
    ctx.lineWidth   = width;
    ctx.globalAlpha = 0.55;
    ctx.beginPath(); ctx.moveTo(base.x, base.y); ctx.lineTo(tip.x, tip.y); ctx.stroke();

    // Core white
    ctx.shadowBlur  = 10;
    ctx.shadowColor = '#fff';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth   = width * 0.32;
    ctx.globalAlpha = 0.9;
    ctx.beginPath(); ctx.moveTo(base.x, base.y); ctx.lineTo(tip.x, tip.y); ctx.stroke();
    ctx.restore();
  }

  // ── Clash flash ──
  function drawClashFlash(x, y, intensity) {
    if (intensity <= 0) return;
    const r = ctx.createRadialGradient(x, y, 0, x, y, 80 * intensity);
    r.addColorStop(0,   `rgba(255,255,200,${intensity * 0.85})`);
    r.addColorStop(0.3, `rgba(255,100,0,${intensity * 0.45})`);
    r.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.save();
    ctx.fillStyle = r;
    ctx.beginPath();
    ctx.arc(x, y, 80 * intensity, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ── Fighter state ──
  // Fighter A: red saber (villain), comes from bottom-left
  // Fighter B: blue saber (hero), comes from bottom-right
  // Each has a "base" (shoulder), "angle", and moves in an arc
  let t = 0;

  // Two fighters, each with shoulder position and blade angle
  // They perform a choreographed sequence: approach, clash multiple times, rebound, repeat
  const SEQ_DUR = 360; // frames per full sequence

  function getFighterA(t) {
    // Bottom left, lunging right and up
    const phase = (t % SEQ_DUR) / SEQ_DUR;
    const cx = W * 0.22, cy = H * 0.82;
    // lunge animation: ease in/out toward clash point
    const lunge = Math.sin(phase * Math.PI * 2);
    const bx = cx + lunge * W * 0.12;
    const by = cy - Math.abs(lunge) * H * 0.15;
    // Blade angle: pointing upper-right, oscillates
    const angle = -Math.PI * 0.28 + Math.sin(phase * Math.PI * 4) * 0.35;
    const bladeLen = Math.min(W * 0.28, 260);
    return {
      base: { x: bx, y: by },
      tip:  { x: bx + Math.cos(angle) * bladeLen, y: by + Math.sin(angle) * bladeLen },
      color1: '#ff1a1a',
      color2: '#ff4400',
    };
  }

  function getFighterB(t) {
    // Bottom right, lunging left and up
    const phase = (t % SEQ_DUR) / SEQ_DUR;
    const cx = W * 0.78, cy = H * 0.82;
    const lunge = -Math.sin(phase * Math.PI * 2);
    const bx = cx + lunge * W * 0.12;
    const by = cy - Math.abs(lunge) * H * 0.15;
    // Blade angle: pointing upper-left
    const angle = Math.PI - (-Math.PI * 0.28 + Math.sin(phase * Math.PI * 4 + 0.15) * 0.35);
    const bladeLen = Math.min(W * 0.28, 260);
    return {
      base: { x: bx, y: by },
      tip:  { x: bx + Math.cos(angle) * bladeLen, y: by + Math.sin(angle) * bladeLen },
      color1: '#1a6aff',
      color2: '#44aaff',
    };
  }

  // Clash detection: distance between tips < threshold
  let clashFlash = 0;
  let lastClash  = false;

  function segmentClosestPoint(ax,ay,bx,by,cx,cy,dx,dy) {
    // midpoint approximation — close enough for visual
    return {
      x: (ax+bx+cx+dx)/4,
      y: (ay+by+cy+dy)/4,
      dist: Math.hypot((ax+bx)/2-(cx+dx)/2, (ay+by)/2-(cy+dy)/2),
    };
  }

  function fightLoop() {
    ctx.clearRect(0, 0, W, H);

    const A = getFighterA(t);
    const B = getFighterB(t);

    // Check clash (tips close)
    const tipDist = Math.hypot(A.tip.x - B.tip.x, A.tip.y - B.tip.y);
    const clashing = tipDist < 60;

    // Detect new clash onset
    if (clashing && !lastClash) {
      clashFlash = 1;
      const mx = (A.tip.x + B.tip.x) / 2;
      const my = (A.tip.y + B.tip.y) / 2;
      emitSparks(mx, my, 28);
    } else if (clashing) {
      // continuous sparks while locked
      if (Math.random() < 0.18) {
        const mx = (A.tip.x + B.tip.x) / 2;
        const my = (A.tip.y + B.tip.y) / 2;
        emitSparks(mx, my, 4);
      }
    }
    lastClash = clashing;
    clashFlash = Math.max(0, clashFlash - 0.04);

    // Update & draw sparks
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx; s.y += s.vy;
      s.vy += 0.18; // gravity
      s.life -= s.decay;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = s.life * 0.9;
      ctx.shadowBlur  = 8;
      ctx.shadowColor = s.color;
      ctx.fillStyle   = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Draw sabers
    drawSaber(A.base, A.tip, A.color1, A.color2);
    drawSaber(B.base, B.tip, B.color1, B.color2);

    // Clash flash at contact point
    if (clashing || clashFlash > 0) {
      const mx = (A.tip.x + B.tip.x) / 2;
      const my = (A.tip.y + B.tip.y) / 2;
      drawClashFlash(mx, my, clashFlash);
    }

    t++;
    requestAnimationFrame(fightLoop);
  }

  fightLoop();

  // Expose so loader can fade it in
  window._showFight = function() {
    canvas.classList.add('visible');
  };
})();

/* ─────────────────────────────────────────────
   LOADER STARS
───────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────
   APP INIT
───────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('out');
    setTimeout(() => {
      loader.style.display = 'none';
      const app = document.getElementById('app');
      app.classList.add('visible');
      document.getElementById('input').focus();
      // Show fight canvas after app appears
      if (window._showFight) window._showFight();
    }, 1000);
  }, 4600);
});

/* ─────────────────────────────────────────────
   CHAT LOGIC  (Anthropic API — no CORS issues)
───────────────────────────────────────────── */
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
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system:     SYSTEM,
        messages:   messages,
      }),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    const reply = data.content.find(b => b.type === 'text')?.text || '';
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
