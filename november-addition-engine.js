/* Inline activities use the Math Landing frame, answer check and trail ID. */
(() => {
 'use strict';
 const style = `
 *{box-sizing:border-box}
 html,body{height:100%;margin:0;overflow:hidden}
 body{font:clamp(17px,2vw,26px)/1.22 "Andika","Trebuchet MS",sans-serif;color:#163a45;background:#f2faf7}
 h1,p,figure{margin:0}
 .activity{height:100%;display:grid;align-content:start;grid-template-rows:auto auto minmax(0,1fr);gap:clamp(5px,1.75vh,16px);padding:clamp(8px,2.5vh,22px) clamp(6px,1.05vw,20px) 14px}
 h1{font-size:clamp(23px,3.6vw,48px);line-height:1.08;color:#174e4f}
 .prompt{flex:1;min-width:0}
 .story-art{display:block;width:clamp(76px,17vh,176px);height:clamp(70px,17vh,176px);object-fit:contain;margin:auto}
 .instructions{font-weight:bold;color:#34575f;font-size:clamp(14px,1.45vw,21px)}
 .work{min-height:0;display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(7px,1.4vw,22px);align-items:center}
 .work.regroup{grid-template-columns:minmax(0,1fr);grid-template-rows:auto auto minmax(0,1fr) auto;align-items:stretch;gap:clamp(5px,1.25vh,12px)}
 .regroup-equations{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(7px,1.5vw,20px);text-align:center}
 .regroup-equation-label{display:block;font-size:clamp(12px,1.3vw,17px);font-weight:700;color:#34575f}
 .regroup-equation{font-size:clamp(17px,3.4vw,44px);line-height:1.1;font-weight:900;font-variant-numeric:tabular-nums;white-space:nowrap}
 .regroup-pads{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:minmax(0,1fr);gap:clamp(7px,1.5vw,20px);min-height:0}
 .work.regroup-numbered{grid-template-rows:auto minmax(0,1fr) auto}
 .regroup-numbered .regroup-pads{grid-template-columns:minmax(0,1fr) clamp(132px,16vw,270px) minmax(0,1fr)}
 .regroup-numbered .regroup-equations{grid-template-columns:minmax(0,1fr);align-content:center;gap:clamp(12px,4vh,42px);min-width:0;container-type:inline-size}
 .regroup-numbered .regroup-equation{font-size:clamp(20px,15cqi,44px)}
 .regroup-pad{display:grid;grid-template-rows:auto minmax(0,1fr);min-width:0;min-height:0;border:2px dashed #548981;border-radius:14px;background:#e7f4f0;padding:clamp(4px,1vw,12px);gap:5px}
 .regroup-pad[data-target="1"]{background:#ebe7fa;border-color:#8072ad}
 .regroup-pad.is-over{background:#ded0ff;border-color:#6840ba}
 .regroup-pad .drop{background:transparent;border:0;box-shadow:none;font-weight:bold}
 .regroup-objects{display:grid;grid-template-columns:repeat(var(--picture-columns,1),var(--picture-size,44px));justify-content:center;align-content:center;gap:clamp(3px,.55vw,6px);min-width:0;min-height:0}
 .regroup-objects .tile{height:var(--picture-size,44px);min-height:0;padding:2px;border-color:#6e9d9a}
 .regroup-pad[data-target="1"] .tile{border-color:#988abd;background:#f5f0ff}
 .regroup-objects .object-number{min-width:0;min-height:0}
 .regroup-objects .object-number b{font-size:clamp(13px,calc(var(--picture-size,44px) * .34),56px)}
 .regroup-response{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) auto;gap:4px 12px;align-items:center}
 .regroup-answer{display:flex;align-items:center;gap:8px;font-size:clamp(13px,1.4vw,19px);font-weight:bold}
 .regroup-answer select{min-width:0;min-height:44px;flex:1;padding:4px 8px;border:1px solid #56867c;border-radius:8px;color:#163a45;background:#fffefa;font:inherit}
 .regroup-result{font-size:clamp(13px,1.35vw,19px);font-weight:bold}
 .regroup-result:empty{visibility:hidden}
 .regroup-reset{grid-column:-2;grid-row:1;min-height:44px;padding:4px 12px;border:1px solid #56867c;border-radius:8px;background:#fffefa;font-size:clamp(13px,1.4vw,19px);font-weight:bold;white-space:nowrap}
 .work.regroup-erasers{gap:clamp(4px,1vh,8px)}
 .regroup-erasers .regroup-pad{padding:clamp(4px,.65vw,9px);gap:4px}
 .regroup-erasers .regroup-pad .drop{min-height:34px}
 .regroup-erasers .regroup-objects{gap:clamp(2px,.35vw,5px)}
 .regroup-erasers .eraser-tile{padding:1px;background:#fffefa;box-shadow:0 1px 0 #65938d}
 .eraser-picture{display:block;width:100%;height:100%;min-height:0;object-fit:contain;pointer-events:none}
 .regroup-erasers .eraser-tile.is-moved{background:#e2f6ff;border-color:#28789b}
 .regroup-objects .number-tile.is-moved{background:#e2f6ff;border-color:#28789b}
 .is-moved .eraser-picture,.is-moved .object-number img{filter:hue-rotate(225deg) saturate(1.18)}
 @media(max-width:620px) and (orientation:portrait){
  .regroup-numbered .regroup-pads{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:auto minmax(0,1fr);gap:8px}
  .regroup-numbered .regroup-equations{grid-column:1/-1;grid-row:1;gap:6px}
  .regroup-numbered .regroup-equation{font-size:clamp(20px,6vw,32px)}
 }
 @media(max-width:570px){
  .regroup-response{grid-template-columns:minmax(0,1fr) auto;column-gap:6px}
  .regroup-result:not(:empty){grid-column:1/-1;grid-row:2}
  .regroup-result:empty{display:none}
  .regroup-answer{gap:4px}
  .regroup-reset{padding-inline:6px}
 }
 @media(max-height:515px){.regroup-equation{font-size:clamp(17px,5.8vh,33px)}}
 .work.comparison{align-items:stretch}
 .comparison .model{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,2.1fr) minmax(0,1fr);min-height:0}
 .comparison .model svg,.comparison .story-art{display:block;width:100%;height:100%;min-height:0;max-height:none}
 .comparison:not(.difference) .answer-area{align-self:center}
 .difference .answer-area{grid-template-rows:auto auto minmax(0,1fr) auto;min-height:0}
 .surface{display:grid;align-content:center;min-width:0;padding:clamp(6px,1.1vw,18px);border-radius:16px;border:1px solid #b9d4cc;background:#fffefa}
 .model{grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:clamp(3px,.6vw,10px)}
 .model svg{width:100%;height:auto;max-height:clamp(115px,43vh,320px)}
 .growing-bar{fill:#f5cd48}
 .bar-overflow{stroke:#b12b31}
 .growing-bar[data-state=at]{fill:#299b5e}
 .growing-bar[data-state=over]{fill:#d44349}
 .running-amount{paint-order:stroke;stroke:#fffefa;stroke-width:4px;stroke-linejoin:round}
 .answer-area{min-width:0;display:grid;gap:clamp(6px,1.4vh,12px)}
 .equation-panel{gap:clamp(5px,1.5vh,13px);text-align:center;background:#e7f4f0}
 .equation{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr) auto minmax(0,1fr);gap:clamp(2px,1vw,8px);align-items:center}
 .sign{font-size:clamp(18px,4.5vh,36px);font-weight:bold}
 button{font:inherit;color:inherit;cursor:pointer;-webkit-user-select:none;user-select:none}
 button:focus-visible{outline:3px solid #7044ba;outline-offset:2px}
 .drop{position:relative;width:100%;min-height:44px;padding:2px 3px;border:2px dashed #548981;border-radius:10px;background:#fffefd;touch-action:none}
 .equation .drop{display:grid;align-content:center;justify-items:center;gap:1px;min-height:clamp(48px,11vh,88px)}
 .drop small{font-size:clamp(12px,1.3vw,19px);font-weight:bold;line-height:1.07}
 .slot-value{font-size:clamp(24px,5vh,46px);font-weight:900}
 .drop.filled{border-style:solid}
 .drop.is-over{border-color:#6840ba;background:#eee5ff}
 .bank{display:grid;grid-template-columns:repeat(var(--tile-count,6),minmax(0,1fr));gap:clamp(3px,.85vw,9px);padding:0 2px}
 .tile{position:relative;display:grid;place-items:center;min-width:0;min-height:44px;gap:2px;padding:4px;border:1px solid #26766e;border-radius:10px;background:linear-gradient(155deg,#fff,#caeee4);color:#124b48;box-shadow:0 2px 0 #468a80;font-weight:900;touch-action:none;cursor:grab;text-align:center}
 .tile span,.tile small{pointer-events:none}
 .tile[aria-pressed=true],.drop[aria-pressed=true]{outline:3px solid #7044ba;outline-offset:1px}
 .tile:active{cursor:grabbing}
 .object-number{position:relative;display:grid;place-items:center;isolation:isolate;min-width:36px;min-height:36px;width:100%;height:100%;pointer-events:none}
 .object-number img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;z-index:-1;pointer-events:none}
 .object-number b{padding:0 3px;border-radius:7px;background:#153528bf;color:#ffffffed;text-shadow:0 1px 2px #102922;font-size:clamp(15px,1.8vw,24px);line-height:1.15;font-variant-numeric:tabular-nums}
 .tile.number-tile{padding:1px 2px;background:#fffefa;min-height:clamp(44px,8vh,64px)}
 .slot-value .object-number{height:38px}
 .landing{position:relative;isolation:isolate;align-content:start;min-height:100px;text-align:center;background:#e7f4f0;border:2px dashed #548981}
 .landing.is-over,.landing:focus-within{background:#eee5ff;border-color:#6840ba}
 .landing .drop{position:absolute;inset:0;z-index:-1;height:100%;background:none;border:0;box-shadow:none}
 .jump-result{font-weight:bold;font-size:clamp(15px,1.45vw,21px);color:#174e4f}
 .jump-result:empty{display:none}
 .jump-list{position:relative;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px;pointer-events:none}
 .jump-list .tile{pointer-events:auto;box-shadow:none;min-height:44px;height:clamp(44px,7vh,56px);background:#cde8ff;border-color:#537ca0}
 .jump-list .stack-count{position:absolute;left:1px;bottom:-2px;padding:0 3px;border-radius:4px;background:#164c43;color:white;font-size:12px;line-height:1.2}
 .bank.reusable-bank{grid-template-columns:repeat(7,minmax(0,1fr));gap:5px}
 .bank.reusable-bank .tile{min-height:44px;height:clamp(44px,7vh,56px)}
 [data-mark=correct]{border-color:#328360!important}
 [data-mark=retry]{border-color:#b65434!important}
 .choice-mark{position:absolute;z-index:3;top:-7px;right:-5px;display:grid;place-items:center;width:clamp(19px,2vw,28px);aspect-ratio:1;border-radius:50%;color:white;background:#9b431e;font:bold 14px/1 system-ui;pointer-events:none}
 [data-mark=correct] .choice-mark{background:#167747;box-shadow:0 0 8px 2px #41d97b;animation:mark-spin .65s cubic-bezier(.19,1,.35,1) both}
 @keyframes mark-spin{from{transform:rotate(-360deg) scale(.35);opacity:0}to{transform:rotate(0) scale(1);opacity:1}}
 @media(prefers-reduced-motion:reduce){[data-mark=correct] .choice-mark{animation:none}}
 .ghost{position:fixed;z-index:9;width:auto;padding-inline:10px;pointer-events:none;transform:translate(-50%,-65%);opacity:.92}
 .sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
 @media(max-width:670px) and (orientation:portrait){
  .work{grid-template-columns:1fr;align-content:start;gap:6px}
  .model{grid-template-columns:minmax(0,1fr) minmax(70px,.38fr)}
  .story-art{width:clamp(58px,13vw,105px);height:clamp(58px,13vw,105px)}
  .model svg{max-height:145px}
  .equation-panel{padding:5px}
 }
 @media(max-width:850px) and (orientation:portrait){
  .work.comparison{grid-template-columns:minmax(0,1fr);grid-template-rows:clamp(108px,min(31vw,30vh),300px) minmax(0,1fr);align-content:stretch;gap:6px}
  .comparison .model{grid-template-columns:minmax(0,3.8fr) minmax(0,1fr);grid-template-rows:minmax(0,1fr)}
  .comparison:not(.difference) .answer-area{align-self:start}
 }
 @media(max-width:360px) and (orientation:portrait){
  .bank.many-tiles{grid-template-columns:repeat(4,minmax(0,1fr))}
  .model svg{max-height:105px}
  .landing{padding:4px}
 }
 @media(max-height:515px){.landing{min-height:100px;padding:4px}.jump-list .tile,.bank.reusable-bank .tile{height:44px}}
 @media(max-width:500px) and (orientation:portrait){
  .work.comparison{grid-template-rows:clamp(101px,29vw,145px) minmax(0,1fr)}
  .difference .answer-area{gap:5px}
  .landing{padding:4px}
  .jump-list .tile,.bank.reusable-bank .tile{height:44px}
 }
 @media(max-height:415px){
  .activity{gap:4px;padding:5px 8px 10px}
  .surface{padding:5px}
  .story-art{width:56px;height:56px}
  .work .surface{padding:4px}
 }
 @media print{@page{size:landscape;margin:10mm}html,body{height:auto;overflow:visible}body{print-color-adjust:exact;-webkit-print-color-adjust:exact}.activity{height:166mm}.activity:has(.regroup,.comparison){contain:layout;overflow:clip;break-inside:avoid}.regroup-objects{contain:layout;overflow:clip}}
 `;
 function boot() {
  const cfg = window.ML_CONFIG;
  const task = cfg.task;
  const regroup = task.layout === 'regroup';
  const difference = task.layout === 'difference';
  const tileMap = new Map(task.tiles.map(tile => [tile.id, tile]));
  const storagePrefix = 'math-landing:november-addition:' + cfg.student + ':' + cfg.id + ':';
  const storageKey = storagePrefix + cfg.revision;
  let saved = {};
  if (!cfg.cataloguePreview) {
   try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    if (stored) saved = stored;
    else if (regroup && cfg.revision === 'regroup-v2') {
     const previous = JSON.parse(localStorage.getItem(storagePrefix + 'regroup-v1'));
     if (previous?.sides?.length === task.tiles.length) saved.sides = previous.sides;
    }
   } catch {}
  }
  let slots = task.answer?.map((_, i) => tileMap.has(saved.slots?.[i]) ? saved.slots[i] : null) || [];
  const jumps = difference && Array.isArray(saved.jumps) ? saved.jumps.filter(jump => /^[1-9]\d{0,2}$/.test(jump?.tile)) : [];
  // Older saved pads can contain a number that was offered only on that question.
  for (const {tile} of jumps) if (!tileMap.has(tile)) tileMap.set(tile,{id:tile,label:tile});
  const sides = regroup ? task.tiles.map(tile => [0,1].includes(saved.sides?.[tile.id]) ? saved.sides[tile.id] : tile.side) : [];
  let groupAnswer = regroup && Number.isInteger(saved.groupAnswer) ? saved.groupAnswer : null;
  let done = saved.done === true;
  let checked = saved.checked || '';
  let checkedMarks = saved.checkedMarks || {};
  let selection = null;
  let pointer = null;
  let suppressClick = false;
  const root = document.querySelector('.activity');
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
  const announce = text => { document.getElementById('activity-status').textContent = text; };
  const choiceText = tile => regroup ? tile.value === 1 ? 'One ' + task.art.item.slice(0,-1) : tile.value + ' ' + task.art.item : tile.label;
  const picturedNumber = number => '<span class="object-number"><img src="' + escape(task.picture) +
   '" alt="" draggable="false"><b>' + escape(number) + '</b></span>';
  const instruction = task.directions + ' Or tap a tile, then a space.';
  document.title = task.title;
  const artwork = '<img class="story-art" src="' + escape(task.picture) + '" alt="">';
  root.innerHTML = '<h1>' + escape(task.title) + '</h1><p class="prompt">' + escape(task.prompt) +
   '</p><div class="work' + (regroup ? ' regroup' : '') + (task.individualErasers ? ' regroup-erasers' : '') +
   (task.numberedGroups ? ' regroup-numbered' : '') + (task.art.type === 'bars' ? ' comparison' : '') +
   (difference ? ' difference' : '') + '"></div><div id="activity-status" class="sr-only" role="status"></div>';
  const work = root.querySelector('.work');
  const bank = document.createElement('div');
  bank.className = 'bank';
  bank.classList.toggle('many-tiles',task.tiles.length>6);
  bank.classList.toggle('reusable-bank',difference);
  bank.style.setProperty('--tile-count',task.tiles.length);
  bank.setAttribute('aria-label','Tile bank');
  bank.dataset.target = 'bank';
  function model() {
   const art = task.art;
   const isBars = art.type === 'bars';
   const ratio = isBars ? art.first / (art.first + art.extra) : art.first / art.total;
   const width = isBars ? 340 : 270;
   const same = Math.round(width * ratio);
   const extra = width - same;
   const x = isBars ? 14 : 119, end = x + width, split = x + same;
   const firstY = 40, secondY = 116, barHeight = isBars ? 38 : 26;
   const bar = (start, y, size, fill) => '<rect x="' + start + '" y="' + y + '" width="' + size + '" height="' + barHeight + '" rx="6" fill="' + fill + '"/>';
   const label = (x, y, text, anchor = 'middle', size = 22) => '<text x="' + x + '" y="' + y + '" text-anchor="' + anchor + '" font-size="' + size + '">' + escape(text) + '</text>';
   const ruler = (from, to, y) => '<path d="M' + from + ' ' + (y-6) + 'v6H' + to + 'v-6" fill="none" stroke="#285558" stroke-width="2"/>';
   const extension = difference
    ? '<rect x="' + split + '" y="' + firstY + '" width="' + extra + '" height="' + barHeight + '" rx="6" fill="#eee9fa" stroke="#8a74af" stroke-dasharray="4 3"/>' +
     '<rect class="growing-bar" x="' + split + '" y="' + firstY + '" width="0" height="' + barHeight + '" rx="6" data-target-width="' + extra + '"/>' +
     '<path class="bar-overflow" d="M' + (end + 18) + ' 50l9 9-9 9" fill="none" stroke-width="3" visibility="hidden"/>' +
     '<path d="M' + end + ' 35v125" fill="none" stroke="#533986" stroke-width="2" stroke-dasharray="4 3"/>'
    : bar(split, secondY, extra, '#a48ae3');
   const description = isBars
    ? art.labels[0] + ' has ' + art.first + '. ' + (art.difference ? art.labels[1] + ' has ' + (art.first + art.extra) + '. Find the difference.' : art.labels[1] + ' has ' + art.extra + ' more. Find the total.')
    : (art.missing ? 'The whole is ' + art.total + '. One part is ' + art.first + '. Find the other part.' : 'The parts are ' + art.first + ' and ' + art.extra + '. Find the whole.');
   const drawing = isBars
    ? label(x, 31, art.labels[0], 'start', 23) + label(x, 107, art.labels[1], 'start', 23) +
      bar(x, firstY, same, '#eea243') + bar(x, secondY, difference ? width : same, '#5cc7d3') + extension +
      '<path d="M' + split + ' 35v125" stroke="#385665" stroke-dasharray="4 3"/>' +
      label(x + same * .58, 31, art.first, 'middle', 26) + (difference
       ? '<text class="running-amount" x="' + split + '" y="31" text-anchor="middle" font-size="26" visibility="hidden">' + art.first + '</text>'
       : label(split + extra/2, 107, art.extra, 'middle', 26)) +
      ruler(x, end, 170) + label(x + width/2, 199, art.difference ? art.first + art.extra : '?', 'middle', 26)
    : label(x - 12, 70, 'Whole', 'end') + label(x - 12, 126, 'Parts', 'end') +
      bar(x, 50, width, '#5cc7d3') + label(x + width/2, 43, art.missing ? art.total : '?') +
      bar(x, 106, same, '#eea243') + bar(split, 106, extra, '#a48ae3') +
      label(x + same/2, 100, art.first) + label(split + extra/2, 100, art.missing ? '?' : art.extra);
   const viewBox = isBars ? '0 0 405 207' : '0 0 405 175';
   return '<figure class="surface model"><svg viewBox="' + viewBox + '" role="img" aria-label="' + escape(description) +
    '" fill="#163a45" font-weight="700">' + drawing + '</svg>' + artwork + '</figure>';
  }
  if (regroup) {
   const pads = ['Left pad', 'Right pad'].map((label, side) =>
    '<section class="regroup-pad" aria-label="' + label + '" data-target="' + side + '">' +
    '<button type="button" class="drop" data-target="' + side + '">' + label + '</button><div class="regroup-objects"></div></section>');
   const equations = '<div class="regroup-equations">' +
    '<div><span class="regroup-equation-label">Original equation</span><p class="regroup-equation">' + groupEquation(task.addends[0]) + '</p></div>' +
    '<div><span class="regroup-equation-label">New equation</span><p class="regroup-equation" data-current-equation></p></div></div>';
   const board = task.numberedGroups ? pads[0] + equations + pads[1] : pads.join('');
   work.innerHTML = '<p class="instructions">' + escape(instruction) + '</p>' + (task.numberedGroups ? '' : equations) +
    '<div class="regroup-pads">' + board + '</div><div class="regroup-response">' +
    '<label class="regroup-answer">Match the pads <select id="group-answer"></select></label>' +
    '<p class="regroup-result" role="status"></p><button type="button" class="regroup-reset">Reset page</button></div>';
  } else if (difference) {
   work.innerHTML = model() + '<section class="answer-area"><p class="instructions">' + escape(instruction) +
    '</p><div class="surface landing" data-target="jumps"><button type="button" class="drop" data-target="jumps" aria-label="Place selected tile on the landing pad"></button>' +
    '<div class="jump-list" aria-label="Numbers on the pad"></div></div><p class="jump-result" role="status"></p></section>';
  } else {
   const pads = task.labels.map((label, i) => '<button type="button" class="drop" data-target="' + i +
    '" data-slot="' + i + '"><small>' + escape(label) + '</small><span class="slot-value"></span></button>');
   work.innerHTML = model() + '<section class="answer-area"><div class="surface equation-panel" aria-label="Equation"><div class="equation">' +
    pads[0] + '<span class="sign">' + task.operator + '</span>' + pads[1] + '<span class="sign">=</span>' + pads[2] +
    '</div><p class="instructions">' + escape(instruction) + '</p></div></section>';
  }
  if (difference) work.querySelector('.landing').before(bank);
  else if (!regroup) work.querySelector('.answer-area').append(bank);
  const groupTrays = [...work.querySelectorAll('.regroup-objects')];
  const groupAnswerSelect = work.querySelector('#group-answer');
  function sizeGroupPictures() {
   // Use the same size on both pads and fit the larger group in the available rows.
   const count = Math.max(1,...groupTrays.map(tray => tray.childElementCount));
   const width = Math.min(...groupTrays.map(tray => tray.clientWidth));
   const height = Math.min(...groupTrays.map(tray => tray.clientHeight));
   if (!width || !height) return;
   const gap = parseFloat(getComputedStyle(groupTrays[0]).columnGap);
   let best = 0;
   let bestColumns = 1;
   for (let columns = 1; columns <= count; columns++) {
    const rows = Math.ceil(count / columns);
    const size = Math.min((width - gap * (columns - 1)) / columns, (height - gap * (rows - 1)) / rows);
    if (size > best) {
     best = size;
     bestColumns = columns;
    }
   }
   work.style.setProperty('--picture-size', Math.max(1,Math.floor(best - 2)) + 'px');
   for (const tray of groupTrays) {
    tray.style.setProperty('--picture-columns', Math.max(1,Math.min(bestColumns,tray.childElementCount)));
   }
  }
  if (regroup) {
   const observer = new ResizeObserver(sizeGroupPictures);
   groupTrays.forEach(tray => observer.observe(tray));
   // Refit at the dimensions of the printed page, then restore the screen layout.
   matchMedia('print').addEventListener('change',sizeGroupPictures);
   window.addEventListener('beforeprint',sizeGroupPictures);
   work.querySelector('.regroup-reset').addEventListener('click',() => {
    stopDrag();
    selection = null;
    task.tiles.forEach(tile => { sides[tile.id] = tile.side; });
    groupAnswer = null;
    checked = '';
    done = false;
    persist();
    paint();
    signal('ml-reset');
    announce('Page reset. ' + groupEquation() + '.');
   });
   groupAnswerSelect.addEventListener('change',() => {
    groupAnswer = groupAnswerSelect.value === '' ? null : Number(groupAnswerSelect.value);
    checked = ''; done = false;
    work.querySelector('.regroup-result').textContent = '';
    persist();
    signal('ml-state');
   });
  }
  const growingBar = work.querySelector('.growing-bar');
  const overflowArrow = work.querySelector('.bar-overflow');
  const runningAmount = work.querySelector('.running-amount');
  const barDescription = growingBar?.ownerSVGElement.getAttribute('aria-label');
  function paintGrowingBar() {
   const total = jumpTotal(), gap = task.target - task.start;
   const targetWidth = Number(growingBar.dataset.targetWidth);
   const width = total * targetWidth / gap;
   const maxWidth = targetWidth + 22;
   const visibleWidth = Math.min(width, maxWidth);
   growingBar.setAttribute('width', visibleWidth);
   growingBar.dataset.state = total === gap ? 'at' : total > gap ? 'over' : 'below';
   runningAmount.textContent = task.start + total;
   runningAmount.setAttribute('x', Number(growingBar.getAttribute('x')) + visibleWidth);
   runningAmount.setAttribute('visibility', total ? 'visible' : 'hidden');
   overflowArrow.setAttribute('visibility', width > maxWidth ? 'visible' : 'hidden');
   const position = total === gap ? ' The growing bar reaches the larger amount.' :
    total > gap ? ' The growing bar extends past the larger amount.' : ' The growing bar ends before the larger amount.';
   growingBar.ownerSVGElement.setAttribute('aria-label', barDescription + ' The current amount is ' + (task.start + total) + '.' + position);
  }
  function markBadge(element, key, answer, baseLabel, spin, mark = checkedMarks[key]) {
   element.querySelector('.choice-mark')?.remove();
   delete element.dataset.mark;
   if (answer === null || mark?.answer !== answer) {
    element.setAttribute('aria-label', baseLabel);
    return;
   }
   element.dataset.mark = mark.correct ? 'correct' : 'retry';
   const badge = document.createElement('span');
   badge.className = 'choice-mark';
   badge.setAttribute('aria-hidden','true');
   badge.textContent = mark.correct ? '✓' : '×';
   if (!spin) badge.style.animation = 'none';
   element.append(badge);
   element.setAttribute('aria-label', baseLabel + (mark.correct ? '. Correct.' : '. Try again.'));
  }
  function eraserPicture() {
   return '<img class="eraser-picture" src="' + escape(task.picture) + '" alt="" draggable="false">';
  }
  function showsAsMoved(tile, origin) {
   return (task.individualErasers || task.numberedGroups) && tile.side !== Number(origin);
  }
  function tileButton(tile, origin = 'bank', count = 1) {
   const moved = showsAsMoved(tile, origin);
   const content = task.individualErasers ? eraserPicture() : picturedNumber(tile.label);
   const classes = (task.individualErasers ? 'tile eraser-tile' : 'tile number-tile') + (moved ? ' is-moved' : '');
   return '<button type="button" class="' + classes + '" data-tile="' + tile.id + '" data-origin="' + origin +
    '" aria-label="' + escape(origin.startsWith('jump-') ? (count > 1 ? count + ' tiles of ' : '') + tile.label + '. Select to remove one' :
     choiceText(tile) + (moved ? ', moved from the other pad' : '')) +
    '" aria-pressed="false">' + content +
    (count > 1 ? '<span class="stack-count" data-count="' + count + '">×' + count + '</span>' : '') + '</button>';
  }
  function padTiles() {
   if (jumps.length <= 14) return jumps.map(({tile},index) => ({tile,index,count:1}));
   const stacks = new Map();
   jumps.forEach(({tile},index) => {
    const count = (stacks.get(tile)?.count || 0) + 1;
    stacks.set(tile,{tile,index,count});
   });
   return [...stacks.values()];
  }
  function paint(spin = false) {
   if (regroup) {
    paintGroups();
    showSelection();
    return;
   }
   bank.innerHTML = task.tiles.map(tile => tileButton(tile)).join('');
   if (difference) {
    work.querySelector('.jump-list').innerHTML = padTiles().map(({tile,index,count}) => tileButton(tileMap.get(tile),'jump-'+index,count)).join('');
    paintGrowingBar();
    paintJumpTotal();
   } else {
    for (const pad of work.querySelectorAll('[data-slot]')) {
     const i = Number(pad.dataset.slot), value = slots[i];
     pad.classList.toggle('filled', value !== null);
     pad.querySelector('.slot-value').innerHTML = value === null ? '□' : picturedNumber(value);
     pad.setAttribute('aria-label', task.labels[i] + ': ' + (value ?? 'empty'));
     if (value === null) { delete pad.dataset.tile; delete pad.dataset.origin; }
     else { pad.dataset.tile = value; pad.dataset.origin = String(i); }
    }
   }
   showSelection();
   paintMarks(spin);
  }
  function leftTotal() {
   return task.tiles.reduce((total,tile) => total + (sides[tile.id] === 0 ? tile.value : 0),0);
  }
  function groupEquation(left = leftTotal()) {
   return left + ' + ' + (task.sum - left) + ' = ' + task.sum;
  }
  function paintGroups() {
   const left = leftTotal();
   work.querySelector('[data-current-equation]').textContent = groupEquation(left);
   for (const pad of work.querySelectorAll('.regroup-pad')) {
    const side = Number(pad.dataset.target);
    pad.querySelector('.regroup-objects').innerHTML = task.tiles
     .filter(tile => sides[tile.id] === side).map(tile => tileButton(tile,pad.dataset.target)).join('');
   }
   const choices = new Set([left,task.addends[0],task.sum-left]);
   for (let distance = 1; choices.size < 6; distance++) {
    if (left - distance >= 0) choices.add(left - distance);
    if (choices.size < 6 && left + distance <= task.sum) choices.add(left + distance);
   }
   const ordered = [...choices].sort((a,b)=>a-b);
   const offset = task.choiceOffset % ordered.length;
   const options = ordered.slice(offset).concat(ordered.slice(0,offset));
   groupAnswerSelect.replaceChildren(new Option('Choose an equation',''),...options.map(value=>new Option(groupEquation(value),value)));
   groupAnswerSelect.value = groupAnswer === null ? '' : String(groupAnswer);
   work.querySelector('.regroup-result').textContent = checked === signature() ? regroupFeedback(left) : '';
   sizeGroupPictures();
  }
  function regroupFeedback(left) {
   if (left === task.addends[0]) return 'Move some pictures to make a different equation.';
   if (groupAnswer === null) return 'Choose an equation that matches the pads.';
   if (groupAnswer !== left) return 'Try again. Count the left pad, then the right pad.';
   return 'Correct. The two groups still make ' + task.sum + '.';
  }
  function paintJumpTotal() {
   const result = work.querySelector('.jump-result');
   const total = jumpTotal(), differenceValue = task.target - task.start;
   if (checked !== signature() || !jumps.length) { result.textContent = ''; return; }
   const equation = jumps.length > 10 ? 'Total: ' + total : jumps.length > 1 ? jumps.map(jump=>jump.tile).join(' + ') + ' = ' + total : String(total);
   result.textContent = equation + (total === differenceValue ? ' ✓ Correct difference' : total > differenceValue ? ' · Too high' : ' · Keep adding');
  }
  function paintMarks(spin = false) {
   if (difference) return;
   for (const pad of work.querySelectorAll('[data-slot]')) {
     const i = Number(pad.dataset.slot), value = slots[i];
     markBadge(pad, i, value, task.labels[i] + ': ' + (value ?? 'empty'), spin === true || spin === i);
   }
  }
  function showSelection() {
   root.querySelectorAll('button[data-tile],button[data-slot]').forEach(el => {
    el.setAttribute('aria-pressed', String(selection !== null && selection.tile === el.dataset.tile && selection.origin === el.dataset.origin));
   });
  }
  function persist() {
   if (!cfg.cataloguePreview) {
    try { localStorage.setItem(storageKey, JSON.stringify({slots, jumps, sides, groupAnswer, checked, checkedMarks, done})); } catch {}
   }
  }
  function jumpTotal() { return jumps.reduce((sum,jump) => sum + Number(jump.tile),0); }
  function signature() { return JSON.stringify(difference ? jumps : regroup ? [sides,groupAnswer] : slots); }
  function snapshot() {
   if (regroup) {
    const left = leftTotal(), complete = left !== task.addends[0] && groupAnswer !== null, current = signature();
    const correct = complete && groupAnswer === left;
    const isChecked = current === checked;
    return {done,response:{answers:{Original:groupEquation(task.addends[0]),Equation:groupEquation(left),
     Selected:groupAnswer === null ? null : groupEquation(groupAnswer)}},
     assessment:{signature:current,checked:isChecked,complete,correct:isChecked&&correct,answerCorrect:correct,
      message:regroupFeedback(left),score:Number(correct),total:1}};
   }
   if (difference) {
    const current = signature(), total = jumpTotal(), reached = task.start + total;
    const complete = reached >= task.target, correct = reached === task.target;
    const marks = [{label:'Difference',answer:jumps.length ? total : null,expected:task.target-task.start,correct}];
    const message = correct ? 'You found the difference!' : complete ? 'The tiles add to too much. Try a different combination.' : 'The tiles add to too little. Try adding more.';
    return {done,response:{answers:jumps.length ? {Tiles:jumps.map(({tile})=>tile).join(' + '),Difference:total} : {},marks},assessment:{signature:current,checked:current===checked,complete,
     correct:current===checked&&correct,answerCorrect:correct,message,score:Number(correct),total:1}};
   }
   const entries = task.labels.map((label, i) => ({label, expected: task.answer[i], answer: slots[i]}));
   const marks = entries.map(entry => ({...entry, correct: entry.expected === entry.answer}));
   const complete = marks.every(mark => mark.answer !== null);
   const score = marks.filter(mark => mark.correct).length;
   const current = signature(), isChecked = current === checked;
   const allRight = score === marks.length;
   const message = allRight ? 'You got it!' : !complete ? 'Keep going. Some choices are still open.' : 'Try the marked choices again.';
   const answers = Object.fromEntries(marks.filter(mark => mark.answer !== null).map(mark => [mark.label, mark.answer]));
   return {done, response: {answers, marks}, assessment: {signature: current, checked: isChecked, complete,
    correct: isChecked && allRight, answerCorrect: allRight, message, score, total: marks.length,
    partAssessment:{checked:isChecked, correct:score, total:marks.length}}};
  }
  function signal(type) { if (!cfg.cataloguePreview) parent.postMessage({type, id: cfg.id}, '*'); }
  function put(piece, target, restoreFocus = false) {
   if (!piece || target === undefined || target === null) return;
   const {tile, origin} = piece;
   const before = signature();
   let added = null;
   if (difference) {
    if (origin.startsWith('jump-') && target === 'bank') jumps.splice(Number(origin.slice(5)),1);
    else if (origin === 'bank' && target === 'jumps') jumps.push({tile});
   } else if (regroup) {
    if (origin !== target) groupAnswer = null;
    sides[tile] = Number(target);
   }
   else if (target === 'bank') {
    if (origin !== 'bank') slots[Number(origin)] = null;
   } else if (target !== origin) {
    const old = slots[Number(target)];
    slots[Number(target)] = tile;
    if (origin !== 'bank') slots[Number(origin)] = old;
   }
   selection = null;
   if (before !== signature()) {
    if (!difference && !regroup) {
     for (const key of Object.keys(checkedMarks)) if (slots[key] !== checkedMarks[key].answer) delete checkedMarks[key];
     for (const i of new Set([Number(target),Number(origin)])) if (Number.isInteger(i) && slots[i] !== null) {
      checkedMarks[i] = {answer:slots[i],correct:slots[i] === task.answer[i]};
     }
     added = target === 'bank' ? null : Number(target);
    }
    checked = ''; done = false; persist(); signal('ml-state');
   }
   paint(added);
   const verdict = added === null || difference ? '' :
    checkedMarks[added]?.correct ? ' Correct.' : ' Try again.';
   announce(choiceText(tileMap.get(tile)) + (target === 'bank' ? ' returned to the tile bank.' : difference ?
    ' added to the landing pad.' : regroup ? ' on the ' + (target === '0' ? 'left' : 'right') + ' pad. ' + groupEquation() + '.' :
    ' placed in ' + task.labels[Number(target)] + '.') + verdict);
   if (restoreFocus) {
    const dest = difference && target === 'jumps' ? work.querySelector('.landing .drop') :
     target === 'bank' || regroup ? root.querySelector('[data-tile="' + tile + '"][data-origin="' + target + '"]') :
     work.querySelector('[data-slot="' + target + '"]');
    dest?.focus({preventScroll:true});
   }
  }
  function choose(element) {
   const piece = {tile: element.dataset.tile, origin: element.dataset.origin};
   selection = selection?.tile === piece.tile && selection.origin === piece.origin ? null : piece;
   showSelection();
   if (selection) announce(choiceText(tileMap.get(piece.tile)) + ' picked up. Choose a space.');
  }
  root.addEventListener('click', event => {
   if (suppressClick && event.detail !== 0) { suppressClick = false; return; }
   const element = event.target.closest('[data-tile],[data-target]');
   if (!element) return;
   if (difference && element.dataset.origin?.startsWith('jump-')) {
    if (selection) put(selection,'jumps',event.detail===0);
    else put({tile:element.dataset.tile,origin:element.dataset.origin},'bank',event.detail===0);
    return;
   }
   const target = element.dataset.target;
   if (selection && target !== undefined && (target !== selection.origin || !element.dataset.tile)) put(selection, target, event.detail === 0);
   else if (element.dataset.tile !== undefined) {
    if (selection && regroup && element.dataset.origin !== selection.origin) put(selection, element.dataset.origin, event.detail === 0);
    else choose(element);
   }
  });
  root.addEventListener('keydown', event => {
   if (event.key === 'Escape') { selection = null; showSelection(); return; }
   const tile = event.target.closest('[data-tile]');
   if (!regroup && tile && tile.dataset.origin !== 'bank' && (event.key === 'Delete' || event.key === 'Backspace')) {
    event.preventDefault(); put({tile: tile.dataset.tile, origin: tile.dataset.origin}, 'bank', true);
   }
  });
  function hovered(x, y) { return document.elementFromPoint(x, y)?.closest('[data-target]'); }
  function stopDrag() {
   const active = pointer;
   if (!active) return;
   pointer = null;
   active.ghost?.remove();
   root.querySelectorAll('.is-over').forEach(el => el.classList.remove('is-over'));
   if (active.element.hasPointerCapture(active.id)) active.element.releasePointerCapture(active.id);
  }
  root.addEventListener('pointerdown', event => {
   suppressClick = false;
   const element = event.target.closest('[data-tile]');
   if (!element || pointer || event.button !== 0 || !event.isPrimary) return;
   pointer = {element, id: event.pointerId, x: event.clientX, y: event.clientY, tile: element.dataset.tile, origin: element.dataset.origin};
   element.setPointerCapture(event.pointerId);
  });
  root.addEventListener('pointermove', event => {
   if (pointer?.id !== event.pointerId) return;
   if (!pointer.ghost) {
    if (Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) < 6) return;
    pointer.ghost = document.createElement('span');
    pointer.ghost.className = 'tile ghost';
    pointer.ghost.setAttribute('aria-hidden', 'true');
    const tile = tileMap.get(pointer.tile);
    pointer.ghost.classList.add(task.individualErasers ? 'eraser-tile' : 'number-tile');
    if (showsAsMoved(tile, pointer.origin)) pointer.ghost.classList.add('is-moved');
    pointer.ghost.style.width = '60px';
    pointer.ghost.style.height = '60px';
    pointer.ghost.innerHTML = task.individualErasers ? eraserPicture() : picturedNumber(tile.label);
    document.body.append(pointer.ghost);
   }
   pointer.ghost.style.left = event.clientX + 'px';
   pointer.ghost.style.top = event.clientY + 'px';
   root.querySelectorAll('.is-over').forEach(el => el.classList.remove('is-over'));
   hovered(event.clientX, event.clientY)?.classList.add('is-over');
  });
  root.addEventListener('pointerup', event => {
   if (pointer?.id !== event.pointerId) return;
   const active = pointer;
   const target = active.ghost ? hovered(event.clientX, event.clientY)?.dataset.target : null;
   stopDrag();
   suppressClick = Boolean(active.ghost);
   if (target != null) put(active, target);
  });
  for (const type of ['pointercancel', 'lostpointercapture']) root.addEventListener(type, e => { if (pointer?.id === e.pointerId) stopDrag(); });
  window.ML_ENGINE = {
   get: snapshot,
   check() {
    checked = signature();
    persist();
    if (difference) paintJumpTotal();
    if (regroup) work.querySelector('.regroup-result').textContent = regroupFeedback(leftTotal());
    return snapshot();
   },
   setDone(value) { done = Boolean(value); persist(); }
  };
  paint();
  signal('ml-ready');
 }
 const activities = {
  'strategy-lesson':window.ML_NOVEMBER_STRATEGY_ENGINE,
  'vertical-addition':window.ML_NOVEMBER_VERTICAL_ENGINE,
  'pattern-position':window.ML_NOVEMBER_PATTERN_POSITION_ENGINE,
  'car-groups':window.ML_NOVEMBER_CAR_GROUPS_ENGINE,
  'reference-activity':window.ML_NOVEMBER_REFERENCE_ENGINE
 };
 const activityBoots = Object.entries(activities).map(([layout,activity])=>JSON.stringify(layout)+':'+activity.boot.toString()).join(',');
 ML_ENGINES['november-addition'] = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>' +
  style + Object.values(activities).map(activity=>activity.styles).join('') + window.ML_NOVEMBER_BORROWING().styles + window.ML_NOVEMBER_SUBTRACTION().styles + '</style></head><body><main class="activity"></main><script>' +
  'window.ML_BORROWING=('+window.ML_NOVEMBER_BORROWING.toString()+')();'+
  'window.ML_SUBTRACTION=('+window.ML_NOVEMBER_SUBTRACTION.toString()+')();'+
  '(({'+activityBoots+'})[window.ML_CONFIG.task.layout]||('+boot.toString()+'))();</' + 'script></body></html>';
})();
