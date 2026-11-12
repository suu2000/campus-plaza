
'use strict';
const sliders = Array.from(document.querySelectorAll('.slider'), (slider) => {
  const slides = Array.from(slider.querySelectorAll('li'));
  const controls = document.createElement('div');
  controls.className = 'indicator';
  const dots = slides.map((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot';
    dot.setAttribute('aria-label', '写真 ' + (index + 1));
    dot.addEventListener('click', () => { show(index); restart(); });
    controls.append(dot);
    return dot;
  });
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'toggle';
  toggle.addEventListener('click', () => { playing = !playing; restart(); });
  controls.append(toggle);
  slider.append(controls);
  slider.classList.add('ready');
  return { slides, dots, toggle };
});
let current = 0;
let timer;
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let playing = !motion.matches;

function show(index) {
  current = index;
  sliders.forEach(({ slides, dots }) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('current', i === current);
      slide.setAttribute('aria-hidden', String(i !== current));
      dots[i].setAttribute('aria-pressed', String(i === current));
    });
  });
}

function restart() {
  clearInterval(timer);
  sliders.forEach(({ toggle }) => { toggle.textContent = playing ? '一時停止' : '再生'; });
  if (sliders.length && playing && !document.hidden) {
    timer = setInterval(() => show((current + 1) % sliders[0].slides.length), Number(document.body.dataset.interval));
  }
}

show(0);
restart();
document.addEventListener('visibilitychange', restart);
motion.addEventListener('change', () => { playing = !motion.matches; restart(); });
for (const prefix of ['g', 'f']) {
  const button = document.querySelector('#' + prefix + 'navSpBtn button');
  const menu = document.querySelector('.' + prefix + 'navSp');
  button.addEventListener('click', () => {
    menu.hidden = !menu.hidden;
    button.setAttribute('aria-expanded', String(!menu.hidden));
  });
}
