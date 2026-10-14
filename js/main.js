/**
 * Lumen Estates - Interactive Application Logic
 */

// Seeded PRNG helper for procedural skyline generation
function rng(seed = 1) {
  let s = seed >>> 0;
  return function() {
    let t = s += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Image asset references (separated from inline base64 data)
const IMG = {
  homes: 'images/homes.jpg',
  villa: 'images/villa.jpg',
  apartments: 'images/apartments.jpg',
  townhouses: 'images/townhouses.jpg',
  living: 'images/living.jpg',
  bedroom: 'images/bedroom.jpg',
  kitchen: 'images/kitchen.jpg',
  amenities: 'images/amenities.jpg',
  floorplan: 'images/floorplan.jpg'
};

(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const narrow = () => innerWidth <= 860;

$$('img[data-img]').forEach(i => { i.src = IMG[i.dataset.img]; });
$('.hero').style.setProperty('--bg', `url(${IMG.villa})`);

/* ---------- decorative contour lines ---------- */
$$('[data-contours]').forEach(h => {
  const [cx, cy, gap, n, seed] = h.dataset.contours.split(',').map(Number);
  let d = '';
  for (let k = 1; k <= n; k++) {
    let p = '';
    for (let i = 0; i <= 90; i++) {
      const a = i / 90 * Math.PI * 2, r = k * gap * (1 + .09 * Math.sin(a * 3 + seed + k * .35) + .05 * Math.sin(a * 5 - seed * 1.3 + k * .2));
      p += (i ? 'L' : 'M') + (cx + Math.cos(a) * r * 1.35).toFixed(1) + ' ' + (cy + Math.sin(a) * r).toFixed(1);
    }
    d += `<path d="${p}Z"/>`;
  }
  h.insertAdjacentHTML('afterbegin', `<svg class="contours" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1">${d}</svg>`);
});
$$('.stars').forEach(s => { s.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.500l2.600 5.600 6 .7-4.500 4.100 1.200 6L10 14.900 4.700 17.900l1.200-6L1.400 7.800l6-.7z"/></svg>'.repeat(5); });

/* ---------- properties ---------- */
const WORK = [
  { name:'Halcyon Villa', type:'Villas', loc:'Palm Bay', price:1950000, img:'villa', alt:'Sea-view villa with an infinity pool and loungers at sunset',
    desc:'A wide villa above the sea. Floor-to-ceiling glass opens the living area to the terrace, and the infinity pool looks out over the bay at sunset.',
    specs:[['Bedrooms','5'],['Plot','1,100 m²'],['Prices from','$1.95M']], tags:['Infinity pool','Sea views','Private terrace'] },
  { name:'Aurelia Residences', type:'Apartments', loc:'Skyline District', price:420000, img:'apartments', alt:'Modern apartment building with glass balconies at dusk',
    desc:'Modern apartments with deep glass balconies and warm evening light. Corner homes catch both sunrise and sunset, and every floor looks over a landscaped courtyard.',
    specs:[['Homes','48'],['Sizes','1–3 bed'],['Prices from','$420,000']], tags:['Glass balconies','Courtyard garden','Resident parking'] },
  { name:'Larch Row', type:'Townhouses', loc:'Old Mill Quarter', price:735000, img:'townhouses', alt:'Row of townhouses with pitched roofs and timber details',
    desc:'Pitched roofs, timber details and a tree-lined street that lights up at dusk. Each home has a front garden, a private yard and a loft room under the roof.',
    specs:[['Homes left','2'],['Bedrooms','3–4'],['Prices from','$735,000']], tags:['Front gardens','Loft rooms','Street parking'] },
  { name:'Maple Court Residence', type:'Homes', loc:'Greenfield Hills', price:585000, img:'homes', alt:'Two-storey modern family home at dusk with a garage and landscaped garden',
    desc:'A two-storey family home with a double garage, a landscaped garden and large windows that light up the street in the evening.',
    specs:[['Bedrooms','4'],['Plot','520 m²'],['Prices from','$585,000']], tags:['Double garage','Landscaped garden','Quiet street'] }
];
const props = $('#props');
WORK.forEach((w, i) => {
  const s = document.createElement('section');
  s.className = 'prop' + (i % 2 ? ' flip' : '');
  s.setAttribute('aria-label', w.name);
  s.innerHTML = `<span class="num" aria-hidden="true">0${i + 1}</span><div class="prop-inner">
    <div class="txt">
      <span class="chip">${w.type}</span><span class="matchtag">Matches your search</span>
      <h3>${w.name}</h3><span class="loc">${w.loc}</span>
      <p class="desc">${w.desc}</p>
      <dl class="specs">${w.specs.map(x => `<div><dt>${x[0]}</dt><dd>${x[1]}</dd></div>`).join('')}</dl>
      <div class="tags">${w.tags.map(t => `<span>${t}</span>`).join('')}</div>
      <a class="btn primary" href="#contact" data-pick="${w.name}">Book a viewing</a>
    </div>
    <figure class="pimg" role="button" tabindex="0" aria-label="Enlarge photo of ${w.name}" data-i="${i}">
      <img src="${IMG[w.img]}" alt="${w.alt}" draggable="false">
      <span class="zoom" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M11 2h5v5M7 16H2v-5M16 2l-5.500 5.500M2 16l5.500-5.500"/></svg></span>
    </figure></div>`;
  props.appendChild(s);
});

/* ---------- navigation ---------- */
const menu = $('#menu'), burger = $('#burger');
function setMenu(o) { menu.hidden = !o; burger.setAttribute('aria-expanded', o); }
burger.addEventListener('click', () => setMenu(menu.hidden));
function goTo(el) { el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const t = $(a.getAttribute('href')); if (!t) return; e.preventDefault(); setMenu(false); goTo(t); }));
$$('[data-pick]').forEach(b => b.addEventListener('click', () => { $('#fpick').value = b.dataset.pick; }));

/* ---------- reveal on scroll + counters ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
$$('.reveal').forEach(el => io.observe(el));
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; cio.unobserve(e.target);
  const el = e.target, end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || '';
  if (reduce) { el.textContent = end.toFixed(dec) + suf; return; }
  const t0 = performance.now(), dur = 1400;
  (function tick(n) { const p = clamp((n - t0) / dur), v = end * (1 - Math.pow(1 - p, 3)); el.textContent = v.toFixed(dec) + suf; if (p < 1) requestAnimationFrame(tick); })(t0);
}), { threshold: .6 });
$$('[data-count]').forEach(el => cio.observe(el));

/* ---------- lightbox ---------- */
const lb = $('#lb'), lbimg = $('#lbimg'), lbcap = $('#lbcap'); let lastFocus = null;
function openLB(src, alt, cap) { lastFocus = document.activeElement; lbimg.src = src; lbimg.alt = alt; lbcap.textContent = cap; lb.hidden = false; $('.lbx').focus(); document.body.style.overflow = 'hidden'; }
function closeLB() { lb.hidden = true; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
lb.addEventListener('click', closeLB);
addEventListener('keydown', e => { if (e.key === 'Escape') { if (!lb.hidden) closeLB(); setMenu(false); } });
$$('.pimg').forEach(el => {
  const open = () => { const w = WORK[el.dataset.i]; openLB(IMG[w.img], w.alt, `${w.name}, ${w.loc}`); };
  el.addEventListener('click', open);
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
});

/* ---------- interior coverflow ---------- */
const INSIDE = [
  { img:'living', title:'Living room', text:'Floor-to-ceiling glass and a clear view across the city.' },
  { img:'bedroom', title:'Bedroom', text:'Quiet tones, soft lighting and a balcony view.' },
  { img:'kitchen', title:'Kitchen', text:'A stone island, full-height storage and pendant lighting.' },
  { img:'amenities', title:'Amenities', text:'A rooftop pool and loungers that face the sunset.' },
  { img:'floorplan', title:'3D floor plan', text:'See how every room connects before you visit.' }
];
const flow = $('#flow'), cap = $('#cap'); let cur = 0, dragX = null, moved = false;
const figs = INSIDE.map((it, i) => {
  const f = document.createElement('figure');
  f.innerHTML = `<img src="${IMG[it.img]}" alt="${it.title}" draggable="false"><figcaption>${it.title}</figcaption>`;
  f.addEventListener('click', () => { if (moved) return; if (i === cur) openLB(IMG[it.img], it.title, `${it.title}: ${it.text}`); else go(i); });
  flow.appendChild(f); return f;
});
function layoutFlow() {
  figs.forEach((f, i) => {
    const o = i - cur, a = Math.abs(o), w = f.offsetWidth;
    f.style.transform = `translateX(${(-w / 2 + o * w * .6).toFixed(1)}px) translateZ(${-a * 150}px) rotateY(${-o * 34}deg)`;
    f.style.zIndex = 10 - a; f.style.opacity = a > 2 ? 0 : 1 - a * .25; f.style.filter = a ? `brightness(${1 - a * .2})` : 'none';
    f.style.pointerEvents = a > 2 ? 'none' : 'auto'; f.setAttribute('aria-hidden', a > 2);
  });
  cap.textContent = `${INSIDE[cur].title}: ${INSIDE[cur].text}`;
}
function go(i) { cur = clamp(i, 0, INSIDE.length - 1); layoutFlow(); }
$('#prev').addEventListener('click', () => go(cur - 1));
$('#next').addEventListener('click', () => go(cur + 1));
flow.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); } if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); } });
flow.addEventListener('pointerdown', e => { dragX = e.clientX; moved = false; });
flow.addEventListener('pointermove', e => { if (dragX !== null && Math.abs(e.clientX - dragX) > 8) moved = true; });
flow.addEventListener('pointerup', e => { if (dragX === null) return; const d = e.clientX - dragX; dragX = null; if (Math.abs(d) > 45) go(cur + (d < 0 ? 1 : -1)); setTimeout(() => { moved = false; }, 0); });
flow.addEventListener('pointercancel', () => { dragX = null; });
addEventListener('resize', layoutFlow); layoutFlow();

/* ---------- budget planner ---------- */
const money = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
function calc() {
  const price = +$('#cPrice').value, dp = +$('#cDown').value, rate = +$('#cRate').value, yrs = +$('#cYears').value;
  const down = price * dp / 100, loan = price - down, r = rate / 100 / 12, n = yrs * 12;
  const m = r ? loan * r / (1 - Math.pow(1 + r, -n)) : loan / n, total = m * n, interest = total - loan;
  $('#oPrice').textContent = money(price); $('#oDown').textContent = dp + '% (' + money(down) + ')'; $('#oRate').textContent = rate.toFixed(1) + '%'; $('#oYears').textContent = yrs + ' years';
  $('#rMonthly').textContent = money(m); $('#rDown').textContent = money(down); $('#rLoan').textContent = money(loan); $('#rInt').textContent = money(interest); $('#rTot').textContent = money(total);
  $('#bP').style.width = (loan / total * 100).toFixed(1) + '%'; $('#bI').style.width = (interest / total * 100).toFixed(1) + '%';
}
$$('#budget input[type=range]').forEach(i => i.addEventListener('input', calc)); calc();

/* ---------- form ---------- */
$('#form').addEventListener('submit', e => {
  e.preventDefault();
  const n = $('#fname').value.trim(), m = $('#femail').value.trim(), ok = $('#ok');
  ok.className = 'show';
  if (!n || !/^\S+@\S+\.\S+$/.test(m)) { ok.textContent = 'Add your name and a valid email address so we can reply.'; return; }
  ok.textContent = `Thanks, ${n}. We will email ${m} within one working day with viewing times for ${$('#fpick').value}.`;
  e.target.reset();
});

/* ---------- scroll + pointer depth effects ---------- */
const nav = $('#nav'), rig = $('#rig'), crig = $('#crig'), collage = $('#collage'), pics = $$('.pic'), chapters = $$('.prop');
const ptr = { x: 0, y: 0, sx: 0, sy: 0 }, cp = { x: 0, y: 0, sx: 0, sy: 0, on: false }; const t0 = performance.now();
addEventListener('pointermove', e => { ptr.x = e.clientX / innerWidth - .5; ptr.y = e.clientY / innerHeight - .5; });
collage.addEventListener('pointermove', e => { const r = collage.getBoundingClientRect(); cp.x = (e.clientX - r.left) / r.width - .5; cp.y = (e.clientY - r.top) / r.height - .5; cp.on = true; });
collage.addEventListener('pointerleave', () => { cp.x = 0; cp.y = 0; });

/* ---------- hero: animated topographic field, skyline, ticker, search ---------- */
(function heroScene() {
  const host = $('.hero'), cv = $('#bgc'), ctx = cv.getContext('2d');
  /* ticker */
  const places = ['Palm Bay', 'Skyline District', 'Old Mill Quarter', 'Greenfield Hills', 'Harbour Point', 'Lake Verna'];
  const half = places.map(p => `<span>${p}</span>`).join('');
  $('#track').innerHTML = half + half;
  /* skyline line art */
  (function sky() {
    const r = rng(9), W = 1440, H = 120; let x = 0, d = `M0 ${H}`, win = '';
    while (x < W) {
      const w = 34 + r() * 70, h = 26 + r() * 84, top = H - h;
      d += ` L${x.toFixed(0)} ${top.toFixed(0)} L${(x + w).toFixed(0)} ${top.toFixed(0)}`;
      if (r() < .3) { const sx = x + w / 2; d += ` L${(sx - 2).toFixed(0)} ${top.toFixed(0)} L${sx.toFixed(0)} ${(top - 14).toFixed(0)} L${(sx + 2).toFixed(0)} ${top.toFixed(0)}`; }
      for (let wy = top + 8; wy < H - 8; wy += 10) for (let wx = x + 7; wx < x + w - 7; wx += 11)
        if (r() < .26) win += `<path d="M${wx.toFixed(0)} ${wy.toFixed(0)}v4" style="animation-delay:${(3.5 + r() * 6).toFixed(1)}s"/>`;
      x += w;
    }
    d += ` L${W} ${H}`;
    $('#sky .outline').setAttribute('d', d); $('#sky .win').innerHTML = win;
  })();

  /* value noise */
  const h3 = (x, y, z) => { let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1442695041); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
  function noise(x, y, z) {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), u = fade(x - xi), v = fade(y - yi), w = fade(z - zi);
    const a = h3(xi, yi, zi), b = h3(xi + 1, yi, zi), c = h3(xi, yi + 1, zi), d = h3(xi + 1, yi + 1, zi), e = h3(xi, yi, zi + 1), f = h3(xi + 1, yi, zi + 1), g = h3(xi, yi + 1, zi + 1), k = h3(xi + 1, yi + 1, zi + 1);
    const x1 = a + (b - a) * u, x2 = c + (d - c) * u, x3 = e + (f - e) * u, x4 = g + (k - g) * u, y1 = x1 + (x2 - x1) * v, y2 = x3 + (x4 - x3) * v;
    return y1 + (y2 - y1) * w;
  }
  let W = 0, H = 0, dpr = 1, cs = 24, cols = 0, rows = 0, F = null, running = false, visible = true, last = 0;
  const motes = Array.from({ length: 38 }, (_, i) => ({ x: Math.random(), y: Math.random(), r: .6 + Math.random() * 1.6, v: .004 + Math.random() * .012, p: Math.random() * 6.28 }));
  const mp = { x: -999, y: -999 };
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 1.5); W = host.clientWidth; H = host.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cs = W < 700 ? 30 : 22; cols = Math.ceil(W / cs); rows = Math.ceil(H / cs); F = new Float32Array((cols + 1) * (rows + 1));
    if (!running || reduce) draw(0);
  }
  const LV = []; for (let i = 0; i < 15; i++) LV.push(.26 + i * .034);
  function draw(t) {
    const z = t * .00007, sc = .0034, rect = host.getBoundingClientRect();
    const tx = (ptr.sx + .5) * innerWidth - rect.left, ty = (ptr.sy + .5) * innerHeight - rect.top;
    mp.x += (tx - mp.x) * .12; mp.y += (ty - mp.y) * .12;
    for (let j = 0, p = 0; j <= rows; j++) for (let i = 0; i <= cols; i++, p++) {
      const px = i * cs, py = j * cs; let f = .64 * noise(px * sc, py * sc, z) + .36 * noise(px * sc * 2.1 + 7, py * sc * 2.1 + 3, z * 1.4);
      if (!reduce) { const dx = px - mp.x, dy = py - mp.y; f += .2 * Math.exp(-(dx * dx + dy * dy) / 72000); }
      F[p] = f;
    }
    ctx.clearRect(0, 0, W, H); const st = cols + 1;
    LV.forEach((l, li) => {
      const idx = li % 5 === 2; ctx.beginPath(); ctx.lineWidth = idx ? 1.4 : 1; ctx.strokeStyle = idx ? 'rgba(214,167,92,.5)' : 'rgba(156,196,174,.24)';
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const p = j * st + i, a = F[p], b = F[p + 1], d = F[p + st], c = F[p + st + 1];
        const m = (a >= l ? 8 : 0) | (b >= l ? 4 : 0) | (c >= l ? 2 : 0) | (d >= l ? 1 : 0);
        if (m === 0 || m === 15) continue;
        const x = i * cs, y = j * cs;
        const tx = x + (l - a) / (b - a) * cs, ry = y + (l - b) / (c - b) * cs, bx = x + (l - d) / (c - d) * cs, ly = y + (l - a) / (d - a) * cs, x1 = x + cs, y1 = y + cs;
        switch (m) {
          case 1: case 14: ctx.moveTo(x, ly); ctx.lineTo(bx, y1); break;
          case 2: case 13: ctx.moveTo(bx, y1); ctx.lineTo(x1, ry); break;
          case 3: case 12: ctx.moveTo(x, ly); ctx.lineTo(x1, ry); break;
          case 4: case 11: ctx.moveTo(tx, y); ctx.lineTo(x1, ry); break;
          case 5: ctx.moveTo(tx, y); ctx.lineTo(x, ly); ctx.moveTo(bx, y1); ctx.lineTo(x1, ry); break;
          case 6: case 9: ctx.moveTo(tx, y); ctx.lineTo(bx, y1); break;
          case 7: case 8: ctx.moveTo(tx, y); ctx.lineTo(x, ly); break;
          case 10: ctx.moveTo(tx, y); ctx.lineTo(x1, ry); ctx.moveTo(x, ly); ctx.lineTo(bx, y1); break;
        }
      }
      ctx.stroke();
    });
    if (!reduce) motes.forEach(m => {
      m.y -= m.v * .016; if (m.y < -.05) { m.y = 1.05; m.x = Math.random(); } const a = .25 + .5 * Math.sin(t * .0012 + m.p) ** 2;
      ctx.fillStyle = `rgba(255,224,170,${a.toFixed(2)})`; ctx.beginPath(); ctx.arc(m.x * W + Math.sin(t * .0003 + m.p) * 14, m.y * H, m.r, 0, 6.283); ctx.fill();
    });
  }
  function loop(now) {
    if (!running) return;
    if (now - last > 30) { last = now; draw(now); }
    requestAnimationFrame(loop);
  }
  function setRun(on) { const go = on && visible && !document.hidden && !reduce; if (go && !running) { running = true; requestAnimationFrame(loop); } else if (!go) running = false; }
  new ResizeObserver(size).observe(host); size();
  new IntersectionObserver(e => { visible = e[0].isIntersecting; setRun(true); }).observe(host);
  document.addEventListener('visibilitychange', () => setRun(true));
  setRun(true);

  /* search */
  $('#search').addEventListener('submit', e => {
    e.preventDefault();
    const type = $('#sType').value, max = +$('#sBudget').value, res = $('#sRes');
    const hits = WORK.map((w, i) => ({ w, i })).filter(({ w }) => (type === 'All' || w.type === type) && (!max || w.price <= max));
    $$('.prop').forEach((p, i) => p.classList.toggle('match', hits.some(h => h.i === i)));
    if (!hits.length) { res.textContent = 'No homes match yet. Try another type or a higher budget.'; return; }
    res.textContent = `${hits.length} ${hits.length > 1 ? 'homes match' : 'home matches'}. Showing ${hits[0].w.name} first.`;
    setTimeout(() => goTo(chapters[hits[0].i]), 350);
  });
})();

function frame(now) {
  const y = scrollY, vh = innerHeight, t = (now - t0) / 1000;
  nav.classList.toggle('solid', y > 40);
  if (!reduce) {
    ptr.sx += (ptr.x - ptr.sx) * .06; ptr.sy += (ptr.y - ptr.sy) * .06;
    if (y < vh * 1.3) {
      rig.style.setProperty('--ry', (-12 + ptr.sx * 14 + Math.sin(t * .5) * 2).toFixed(2) + 'deg');
      rig.style.setProperty('--rx', (4 - ptr.sy * 8 + Math.cos(t * .4) * 1.2).toFixed(2) + 'deg');
      pics.forEach(p => p.style.setProperty('--sy', (-y * parseFloat(p.dataset.depth)).toFixed(1) + 'px'));
    }
    cp.sx += (cp.x - cp.sx) * .08; cp.sy += (cp.y - cp.sy) * .08;
    crig.style.setProperty('--ry', (-8 + cp.sx * 16).toFixed(2) + 'deg'); crig.style.setProperty('--rx', (3 - cp.sy * 10).toFixed(2) + 'deg');
    if (!narrow()) chapters.forEach((c, i) => {
      const r = c.getBoundingClientRect(), img = c.querySelector('.pimg'), inner = c.querySelector('.prop-inner');
      const enter = clamp(1 - r.top / vh), flip = c.classList.contains('flip') ? 1 : -1;
      img.style.transform = `perspective(1300px) rotateY(${((1 - enter) * 16 * flip).toFixed(2)}deg) translateY(${((1 - enter) * 50).toFixed(1)}px)`;
      const nx = chapters[i + 1], q = nx ? 1 - clamp(nx.getBoundingClientRect().top / vh) : 0;
      inner.style.transform = `scale(${(1 - q * .06).toFixed(4)})`; inner.style.opacity = (1 - q * .55).toFixed(3);
    });
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
})();
