/* Interactive models for the added reference questions. */
(() => {
 'use strict';
 const styles = `
 .activity:has(.ref-shell){gap:clamp(4px,1vh,10px);padding-block:clamp(5px,1.3vh,14px)}
 .ref-shell{min-height:0;display:grid;grid-template-rows:minmax(0,1fr) auto auto;gap:5px}
 .ref-board{display:grid;min-height:0;min-width:0;gap:clamp(4px,1vw,14px)}
 .ref-card{border:1px solid #accbc1;border-radius:12px;background:#fffefa;padding:clamp(4px,.8vw,12px);min-height:0;min-width:0}
 .ref-card h2{font-size:clamp(12px,1.6vw,23px);margin:0;color:#24544e;line-height:1.16}
 .ref-card h3{font-size:clamp(12px,1.2vw,17px);margin:0;text-align:center}
 .ref-board button,.ref-actions button,.ref-select{font:inherit;color:#214c47;border:1px solid #7caaa1;border-radius:7px;background:#f5faf5}
 .ref-board button{padding:2px;min-width:0;min-height:0}
 .ref-board button:focus-visible,.ref-select:focus-visible,.ref-actions button:focus-visible{outline:3px solid #8155b2;outline-offset:1px}
 .ref-select{width:min(100%,310px);min-height:36px;padding:2px 6px;font-weight:bold;background:#fff4d1}
 .ref-select[data-checked="right"]{border:2px solid #287755;background:#e0f5e6}
 .ref-select[data-checked="try"]{border:2px solid #a34938;background:#fff1db}
 .ref-doubles{grid-template-columns:minmax(0,.72fr) minmax(0,1.28fr);grid-template-rows:minmax(0,1fr)}
 .ref-double-coach{display:grid;grid-template-rows:minmax(0,1fr) auto;gap:5px;background:#eaf7ef}
 .ref-double-coach img{display:block;width:100%;height:100%;min-height:0;min-width:0;object-fit:cover;object-position:35% 38%;border-radius:9px}
 .ref-thought{position:relative;display:grid;gap:4px;padding:clamp(5px,1vw,15px);border:1px solid #a18452;border-radius:14px;background:#fff4cd;font-size:clamp(14px,1.7vw,24px);line-height:1.18}
 .ref-thought::before,.ref-thought::after{content:"";position:absolute;left:21%;bottom:100%;margin-bottom:3px;border:1px solid #a18452;border-radius:50%;width:13px;height:13px;background:#fff4cd}
 .ref-thought::after{left:17%;margin-bottom:17px;width:8px;height:8px}
 .ref-double-steps{display:grid;grid-template-rows:auto repeat(5,minmax(0,1fr));gap:clamp(2px,.7vh,8px);padding:0;min-height:0;min-width:0}
 .ref-double-row{display:grid;grid-template-columns:clamp(32px,4.8vw,63px) repeat(2,minmax(0,1fr));align-items:center;gap:clamp(3px,.8vw,10px);min-height:0;padding:clamp(3px,.62vh,8px) clamp(3px,.75vw,10px);border:1px solid #a7c7be;border-radius:9px;background:#fffefa}
 .ref-double-row:first-child{background:#e4f3ed}
 .ref-double-row:not(:first-child){container-type:size}
 .ref-double-row:has(button[aria-pressed="true"]){border-color:#438b7b;background:#e1f3ec}
 .ref-double-row h2{margin:0;font-size:clamp(13px,1.65vw,24px);line-height:1.1}
 .ref-double-row>button{height:clamp(24px,6.3vh,44px);max-height:100%;font-weight:800;font-size:clamp(15px,1.75vw,25px);cursor:pointer}
 .ref-double-row>button:focus-visible{outline-offset:-3px}
 .ref-double-row>button[aria-pressed="true"]{background:#176859;color:#fff;border-color:#155a4d}
 .ref-double-part{display:grid;grid-template-columns:max-content minmax(0,1fr);align-items:center;justify-content:start;gap:clamp(2px,.65vw,8px);position:relative;min-width:0;font-size:clamp(14px,2.18vw,34px);font-weight:800;font-variant-numeric:tabular-nums;white-space:nowrap}
 .ref-double-part .ref-select{height:min(100cqh,clamp(28px,7.8vh,52px));min-height:0;padding:0 4px;font-size:clamp(14px,1.7vw,26px);line-height:1;max-width:140px}
 .ref-double-mark{display:grid;place-items:center;position:absolute;right:0;top:-.36em;border-radius:50%;width:1.2em;height:1.2em;font-size:.64em;background:#167344;color:white;box-shadow:0 0 7px #41c778;pointer-events:none}
 .ref-double-mark[data-ok="false"]{background:#974321;box-shadow:none}
 .ref-double-steps[data-checked="true"] .ref-double-mark[data-ok="true"]{animation:ref-double-spin .54s ease-out both}
 @keyframes ref-double-spin{from{transform:rotate(-1turn) scale(.35)}to{transform:rotate(0) scale(1)}}
 @media(prefers-reduced-motion:reduce){.ref-double-steps[data-checked="true"] .ref-double-mark{animation:none}}
 @media(max-width:740px),(orientation:portrait){
  .ref-doubles{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,.47fr) minmax(0,1fr)}
  .ref-double-coach{grid-template-columns:minmax(0,.62fr) minmax(0,1.38fr);grid-template-rows:minmax(0,1fr);align-items:center}
  .ref-thought{padding:clamp(5px,1.3vw,12px);gap:2px}
  .ref-thought::before,.ref-thought::after{display:none}
 }
 @media(max-height:460px) and (orientation:landscape){
  .ref-double-coach{padding:4px}.ref-thought{padding:4px;gap:2px}
  .ref-double-part .ref-select{height:min(100cqh,clamp(23px,7vh,33px))}
 }
 .ref-answer,.ref-actions{display:flex;align-items:center;justify-content:space-between;gap:6px;font-size:clamp(12px,1.33vw,19px);font-weight:bold}
 .ref-answer{justify-content:flex-start}
 .ref-actions button{white-space:nowrap;min-height:34px;padding:3px 8px}
 .ref-status{min-width:0}
 .ref-compare{grid-template-columns:minmax(0,.64fr) minmax(0,1.2fr) minmax(0,1fr)}
 .ref-bank,.ref-pad,.ref-graph,.ref-pieces{display:grid;grid-template-rows:auto minmax(0,1fr);gap:4px}
 .ref-pad{border:2px dashed #67a798;background:#e9f5f0}
 .ref-pad[data-over]{outline:2px solid #8961bc;background:#f0e7ff}
 .ref-pad[data-model-check="right"]{border-color:#287755}
 .ref-pad[data-model-check="try"]{border-color:#a34938}
 .ref-bank-grid,.ref-pad-grid{display:flex;flex-wrap:wrap;align-items:flex-start;align-content:flex-start;gap:4px;min-height:0;min-width:0;container-type:size}
 .ref-bank-grid{--block-unit:clamp(3px,min(calc((100cqw - 52px)/8.8),calc((100cqh - 30px)/10.2)),15px)}
 .ref-pad-grid{--block-unit:clamp(3px,min(calc((100cqw - 49px)/15.2),calc((100cqh - 30px)/11.8)),15px)}
 .ref-bank-grid button,.ref-pad-grid button{display:grid;justify-items:center;gap:2px;padding:3px;line-height:1.1;font-size:clamp(11px,1.25vw,17px);font-weight:bold;touch-action:none}
 .ref-bank-grid button{cursor:grab;background:#fff4cf}
 .ref-glyph{width:calc(var(--glyph-cols) * var(--block-unit,14px));height:calc(var(--glyph-rows) * var(--block-unit,14px));display:block}
 .ref-glyph svg{width:100%;height:100%;display:block;pointer-events:none}
 .ref-pad-grid button{cursor:pointer}
 .ref-pad-grid .ref-placeholder{margin:auto;align-self:center;text-align:center;font-size:clamp(12px,1.4vw,20px)}
 .ref-graph{grid-template-rows:auto repeat(2,minmax(0,1fr));align-items:stretch}
 .ref-bar-row{display:grid;align-content:center;gap:5px;min-height:0;font-size:clamp(12px,1.45vw,21px);font-weight:bold}
 .ref-track{height:clamp(13px,4.3vh,39px);display:flex;overflow:hidden;border:1px solid #749993;border-radius:5px;background:#f1f5f2}
 .ref-track span{height:100%;flex:none;background:#58a9e8}
 .ref-track .ref-added{background:#f4be4c}
 .ref-track .ref-added[data-level="match"],.ref-track .ref-dana{background:#65b650}
 .ref-track .ref-added[data-level="over"]{background:#d88462}
 .ref-subtract{grid-template-columns:minmax(0,1fr) minmax(0,1.15fr)}
 .ref-subtract .ref-pieces{container-type:size}
 .ref-rods,.ref-ones{display:grid;gap:4px;min-width:0;min-height:0;place-content:start}
 .ref-rods{--block-unit:clamp(3px,min(calc((100cqh - 50px)/10.2),calc((100cqw - 52px)/4.8)),16px);grid-template-columns:repeat(var(--tens),max-content)}
 .ref-ones{
  --tile:clamp(10px,min(calc((100cqw - (var(--ones-cols) - 1)*4px)/var(--ones-cols)),calc((100cqh - 46px - (var(--ones-rows) - 1)*4px)/var(--ones-rows))),60px);
  --block-unit:calc(var(--tile)*.72);grid-template-columns:repeat(var(--ones-cols),var(--tile));grid-auto-rows:var(--tile);
 }
 .ref-rods button,.ref-ones button{display:grid;place-items:center;font-weight:bold}
 .ref-rods button{background:#ffe3de;color:#7c2922;padding:4px}
 .ref-rods button[data-compact-ten]{width:clamp(28px,20cqw,56px);aspect-ratio:1}
 .ref-rods button[aria-pressed="true"]{opacity:.53}
 .ref-ones button[aria-pressed="true"]{opacity:.42;text-decoration:line-through}
 .ref-tenframes,.ref-bond{grid-template-columns:repeat(2,minmax(0,1fr))}
 .ref-tenframes-illustrated{grid-template-columns:repeat(2,minmax(0,1fr)) minmax(0,.62fr)}
 .ref-tenframes .ref-card,.ref-illustrated{display:grid;grid-template-rows:auto minmax(0,1fr);gap:5px}
 .ref-ten-area{display:grid;place-items:center;min-height:0;container-type:size}
 .ref-ten-illustration{display:grid;place-items:center;min-width:0;min-height:0;margin:0;container-type:size}
 .ref-ten-illustration img{display:block;width:min(100%,100cqh);aspect-ratio:1;object-fit:cover;border-radius:12px}
 .ref-ten-grid{width:min(100%,650px,250cqh);aspect-ratio:5/2;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr));border:1px solid #73918b;background:#fdfdf8}
 .ref-ten-grid button{display:grid;place-items:center;border:1px solid #73918b;border-radius:0;background:#fdfdf8;padding:0;touch-action:none}
 .ref-ten-grid button:has(.ref-disc){cursor:grab}
 .ref-ten-grid button[aria-pressed="true"],.ref-ten-grid button[data-counter-over]{outline:3px solid #8155b2;outline-offset:-3px;background:#efebff}
 .ref-disc{display:block;width:62%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 38% 33%,#fff1a2,#e3a427 69%,#9c6710);box-shadow:0 2px 3px #8c652467;pointer-events:none}
 .ref-disc[data-colour="2"]{background:radial-gradient(circle at 38% 33%,#f6f9fa,#acbfcc 68%,#627886)}
 .ref-ghost.ref-counter-ghost{width:46px;height:46px}
 .ref-counter-ghost .ref-disc{width:100%}
 .ref-frame-equations{display:flex;flex-wrap:wrap;align-items:center;gap:4px clamp(10px,2vw,28px);font-size:clamp(18px,2.5vw,34px);font-weight:700;line-height:1.12;font-variant-numeric:tabular-nums}
 .ref-frame-equations .ref-answer{font-size:inherit}
 .ref-frame-equations .ref-select{width:clamp(54px,2.8em,76px);min-height:36px;padding:1px 4px;font-size:.8em;line-height:1.1}
 .ref-patterns{grid-template-rows:repeat(2,minmax(0,1fr))}
 .ref-patterns .ref-card{display:grid;grid-template-rows:auto minmax(0,1fr);gap:5px}
 .ref-terms{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:clamp(2px,.35vw,6px);align-content:center;min-height:0}
 .ref-term{display:grid;justify-items:center;gap:3px;min-width:0}
 .ref-term .ref-select{width:100%;min-height:32px;font-size:clamp(10px,1.26vw,19px);padding:1px}
 .ref-term small{font-size:clamp(9px,1.05vw,14px)}
 .ref-term .ref-marker{width:clamp(22px,3vw,36px);aspect-ratio:1;border:2px solid #427889;border-radius:50%;background:#e8f8fc;font-weight:bold}
 .ref-term .ref-marker[aria-pressed="true"]{background:#146e75;color:#fff}
 .ref-term .ref-marker{position:relative;display:grid;place-items:center}
 .ref-term .ref-marker .ref-beacon{width:100%}
 .ref-marker-check{position:absolute;inset:0;display:grid;place-items:center;text-shadow:0 1px 3px #124850}
 .ref-stamps{display:grid;place-items:center;min-height:0}
 .ref-stamp-grid{width:min(98%,560px);height:100%;max-height:410px;display:grid;grid-template-columns:repeat(var(--cols),minmax(0,1fr));grid-template-rows:repeat(var(--rows),minmax(0,1fr));gap:4px;min-height:0}
 .ref-stamp-grid button{border:2px dotted #588b88;background:linear-gradient(#a9e8f4 61%,#f5db95 61%);display:grid;place-items:center}
 .ref-stamp-grid img{width:78%;height:88%;min-height:0;object-fit:contain;pointer-events:none}
 .ref-stamp-grid button[aria-pressed="true"]{outline:2px solid #168b57;outline-offset:-2px;background:#baf0c7}
 .ref-card-colours{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px}
 .ref-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr));gap:4px;min-height:0}
 .ref-playing-card{display:grid;place-items:center;border:3px double #184c71;border-radius:7px;background:linear-gradient(145deg,#eef6ff,#69a7e4);color:#154d78;font-size:clamp(17px,4vw,55px)}
 .ref-playing-card.green{border-color:#24673f;background:linear-gradient(145deg,#eff9e7,#80c98c);color:#2b7547}
 .ref-bond-fields{display:grid;align-content:center;gap:clamp(3px,1.5vh,12px);text-align:center}
 .ref-bond-fields label{display:grid;gap:3px;justify-items:center;font-size:clamp(12px,1.25vw,18px);font-weight:bold}
 .ref-bond-parts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
 .ref-bond-lines{width:65%;height:clamp(13px,5vh,45px);justify-self:center}
 .ref-bond-equation{font-weight:bold}
 .ref-ghost{--block-unit:6px;position:fixed;z-index:10;pointer-events:none;transform:translate(-50%,-50%);width:50px;height:65px;display:grid;place-items:center}
 .ref-lab{grid-template-columns:minmax(0,1fr) minmax(0,2fr);container-type:size}
 .ref-scene{min-width:0;min-height:0;border-radius:14px;background-color:#183b4d;background-position:center;background-size:cover}
 .ref-scene.ref-triptych{background-size:auto 100%;aspect-ratio:1;max-width:100%;width:auto;max-height:100%;justify-self:center}
 .ref-lab[data-kind="missing-number-story"] .ref-scene{background-size:300% auto;width:min(100%,100cqh);align-self:center}
 .ref-lab-panel{display:grid;align-content:center;gap:clamp(4px,1.4cqh,13px);overflow:visible}
 .ref-lab-panel h2{font-size:clamp(14px,2vw,24px)}
 .ref-lab-row{display:grid;gap:4px;font-size:clamp(13px,1.8vw,23px);font-weight:700}
 .ref-cells{display:grid;grid-template-columns:repeat(var(--cols),minmax(0,1fr));gap:clamp(2px,.45vw,8px);align-items:stretch}
 .ref-cell{min-width:0;display:grid;place-items:center;min-height:clamp(28px,9cqh,75px);background:#edf5fa;border:1px solid #b0c5cd;border-radius:7px;text-align:center;font-variant-numeric:tabular-nums}
 .ref-cell sub{font-size:.62em}
 .ref-cell .ref-select{width:100%;min-height:100%;padding:1px 2px;font-size:inherit}
 .ref-cell.ref-core{background:#fff2bc;border-color:#a78d4e}
 .ref-beacon-term{display:grid;grid-template-rows:auto minmax(0,1fr);gap:3px;min-width:0}
 .ref-beacon{position:relative;display:block;justify-self:center;width:min(86%,clamp(22px,14cqh,66px));aspect-ratio:1}
 .ref-beacon::before,.ref-beacon::after,.ref-beacon i{content:"";position:absolute}
 .ref-beacon::before{inset:0 0 16%;border-radius:50%;background:radial-gradient(ellipse,#ffc34bba,transparent 72%)}
 .ref-beacon i{inset:13% 27% 29%;border:1px solid #95511a;border-radius:50% 50% 20% 20%;background:radial-gradient(circle at 37% 32%,#fffbd9 2%,#ffe483 28%,#ffb02e 62%,#df721b 88%)}
 .ref-beacon::after{inset:66% 16% 9%;border:1px solid #234653;border-radius:5px 5px 3px 3px;background:linear-gradient(#88b0b6,#497583 49%,#2a4c5a 51%,#345c6a);box-shadow:0 1px 2px #233e5355}
 .ref-lab label:not(.ref-cell){display:flex;align-items:center;flex-wrap:wrap;gap:4px 10px;min-width:0;font-size:clamp(13px,1.53vw,20px);font-weight:700}
 .ref-lab label:not(.ref-cell) .ref-select{width:auto;max-width:100%;flex:1 1 125px}
 .ref-lab-equation{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:clamp(4px,1vw,15px);font-size:clamp(25px,4vw,60px);font-weight:800}
 .ref-lab-equation .ref-select{width:auto;font-size:clamp(16px,2.4vw,33px);padding:5px}
 .ref-lab-pair-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
 .ref-lab-pair{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;margin-block:5px}
 .ref-bug-seat{min-width:0;display:flex;justify-content:center;gap:2px;padding:2px;background:#fbf4d9;border:1px dashed #a58b54;border-radius:9px}
 .ref-bug-seat[data-paired]{background:#d9f1e7;border:1px solid #418574}
 .ref-lab-pair .ref-bug{display:grid;place-items:center;aspect-ratio:1;width:min(100%,56px);cursor:pointer}
 .ref-bug[aria-pressed="true"]{outline:2px solid #723c97;background:#edd4fc}
 .ref-bug svg{width:100%;max-height:46px;pointer-events:none}
 .ref-lab-pair-cards .ref-card{padding:clamp(3px,.75vw,10px)}
 .ref-lab-small{font-size:clamp(11px,1.1vw,17px);line-height:1.17}
 .ref-shape{width:min(90%,55px);height:min(10cqh,54px);min-height:20px;overflow:visible;vertical-align:middle}
 .ref-square-figure{display:grid;grid-template-columns:repeat(5,1fr);grid-template-rows:repeat(4,1fr);width:min(100%,29cqh,126px);aspect-ratio:5/4;gap:1px;padding:3px}
 .ref-square-figure i,.ref-build button{border:1px solid #a4b9c2;border-radius:2px;background:#edf5f8}
 .ref-square-figure i.on,.ref-build button[aria-pressed="true"]{border-color:#3d7064;background:linear-gradient(145deg,#98f2ce,#33a889 74%,#197966)}
 .ref-square-figure i.new{border-color:#785134;background:linear-gradient(145deg,#ffeb9c,#e79535)}
 .ref-build{grid-template-columns:repeat(5,1fr);grid-template-rows:repeat(4,1fr);width:min(54cqh,100%,240px);height:min(45cqh,180px);margin-inline:auto}
 .ref-ttable{width:min(100%,420px);margin-inline:auto;text-align:center;border-collapse:collapse;font-size:clamp(12px,1.65vw,24px)}
 .ref-ttable td,.ref-ttable th{border:1px solid #9ab5b6;padding:1px 5px}
 .ref-ttable th{background:#e6f4ed}
 .ref-ttable .ref-select{min-height:29px;max-width:130px}
 .ref-five-quiz{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(4px,1cqh,10px)}
 .ref-five-quiz label{justify-content:space-between;padding:4px 7px;border:1px solid #b0c5cd;border-radius:8px;background:#edf5fa}
 .ref-lab .ref-five-quiz label .ref-select{flex:0 1 110px}
 .ref-five-packs{display:grid;grid-template-columns:repeat(var(--trays),minmax(0,1fr));gap:clamp(3px,.75vw,9px)}
 .ref-lab .ref-tray{background:#e5f2fa;border:1px solid #769cab;border-radius:9px;display:grid;align-content:center;gap:3px;padding:4px;min-height:clamp(43px,18cqh,130px);color:#204956}
 .ref-lab button.ref-tray{cursor:pointer;box-shadow:0 3px 0 #607b81}
 .ref-lab .ref-tray[aria-pressed="true"]{background:#d9f2e7;border-color:#4b8477}
 .ref-tray small{text-align:center;font-size:clamp(10px,1.05vw,17px);line-height:1.1;font-weight:700}
 .ref-parcel-row{display:flex;align-items:center;justify-content:center;gap:1px;min-width:0}
 .ref-parcel{display:block;width:min(19%,49px);min-width:0;height:auto;filter:drop-shadow(0 1px 1px #87522485)}
 .ref-parcel-empty{border-radius:50%;border:1px dashed #527b89;width:min(17%,40px);aspect-ratio:1;margin:1%}
 .ref-five-arrays{display:grid;grid-template-columns:repeat(var(--arrays),minmax(0,1fr));gap:6px}
 .ref-five-array{display:grid;align-content:center;justify-items:center;gap:3px;background:#e5f2fa;border:1px solid #769cab;border-radius:9px;padding:4px}
 .ref-five-array .ref-parcel-row{width:min(100%,40cqh,270px)}
 .ref-five-array .ref-parcel{width:min(19%,7cqh,49px)}
 .ref-five-tags{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}
 .ref-lab .ref-tag{border:1px solid #ad9550;border-radius:20px 11px 11px 20px;background:linear-gradient(155deg,#fff3b8,#f5cf74);font-weight:800;font-size:clamp(17px,2.5vw,31px);min-height:clamp(32px,12cqh,65px);cursor:pointer}
 .ref-lab .ref-tag[aria-pressed="true"]{border-color:#3a7264;background:#d9f1e7;outline:2px solid #4a806f;outline-offset:-3px}
 .ref-lab .ref-tag[data-checked="right"]{box-shadow:inset 0 0 0 2px #238251}
 .ref-lab .ref-tag[data-checked="try"]{box-shadow:inset 0 0 0 2px #a34938;background:#fff0de}
 @media(max-width:740px) and (orientation:portrait){
  .ref-lab{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(44px,.44fr) minmax(0,1fr)}
  .ref-lab[data-kind="missing-number-story"] .ref-scene{height:100%;width:auto;background-size:300% auto}
  .ref-lab-panel{align-content:safe center}
  .ref-build{width:min(38cqh,100%,220px);height:min(31cqh,155px)}
  .ref-square-figure{width:min(100%,22cqh,106px)}
  .ref-lab[data-kind="five-lab"]:has(.ref-five-arrays){grid-template-rows:minmax(44px,.34fr) minmax(0,1fr)}
  .ref-five-array .ref-parcel{width:min(18%,5.5cqh,39px)}
 }
 @media(max-height:500px){
  .ref-lab-panel{gap:4px}
  .ref-lab .ref-select{min-height:29px}
  .ref-lab-pair .ref-bug{width:min(100%,42px)}
  .ref-bug svg{max-height:38px}
 }
 @media(max-width:650px) and (orientation:portrait){
  .ref-compare{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,.75fr) minmax(0,1fr) minmax(0,.75fr)}
  .ref-graph{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:auto minmax(0,1fr)}
  .ref-graph h2{grid-column:1/-1}
  .ref-track{height:16px}
  .ref-tenframes,.ref-bond{grid-template-columns:minmax(0,1fr);grid-template-rows:repeat(2,minmax(0,1fr))}
  .ref-terms{grid-template-columns:repeat(6,minmax(0,1fr))}
  .ref-ones{--ones-cols:var(--narrow-cols);--ones-rows:var(--narrow-rows)}
 }
 @media(max-height:450px){
  .ref-select{min-height:29px}
  .ref-actions button{min-height:29px}
 }
 @media(orientation:portrait){
  .ref-tenframes-illustrated{grid-template-columns:minmax(0,1fr) minmax(0,.57fr);grid-template-rows:repeat(2,minmax(0,1fr))}
  .ref-ten-illustration{grid-column:2;grid-row:1/-1}
 }
 @media print{
  .activity:has(.ref-shell){height:166mm;overflow:hidden;break-inside:avoid}
  .ref-actions button{visibility:hidden}
 }
 `;
 function boot() {
  const cfg=window.ML_CONFIG, task=cfg.task, root=document.querySelector('.activity');
  const key='math-landing:november-addition:'+cfg.student+':'+cfg.id+':'+cfg.revision;
  let saved={};
  if(!cfg.cataloguePreview){try{saved=JSON.parse(localStorage.getItem(key))||{};}catch{}}
  const state=Object.assign({answer:'',counts:{},traded:[],taken:[],terms:{},marked:{},counted:[],parts:{},pairs:{},squares:[],checked:false,done:false},saved);
  const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const range=(length,start=0)=>Array.from({length},(_,i)=>i+start);
  const initialFrames=()=>range(20).map(i=>i<10 ? (i<task.first?1:0) : (i<10+task.second?2:0));
  if(task.kind==='ten-frames'){
   const cells=state.frameCells;
   if(!Array.isArray(cells)||cells.length!==20||cells.some(cell=>![0,1,2].includes(cell))||
    cells.filter(cell=>cell===1).length!==task.first||cells.filter(cell=>cell===2).length!==task.second)state.frameCells=initialFrames();
  }
  const signal=type=>{if(!cfg.cataloguePreview)parent.postMessage({id:cfg.id,type},'*');};
  function persist(){if(!cfg.cataloguePreview){try{localStorage.setItem(key,JSON.stringify(state));}catch{}}}
  const mark=(field,label,actual,expected)=>({field,id:field,label,actual,expected,
   entered:actual!==''&&actual!=null,counted:true,checked:state.checked,correct:actual===expected});
  const optionsFor=value=>[value-1,value,value+1,value+2,value+10].sort((a,b)=>a-b);
  const choice=(field,label,options,value,expected,placeholder=field.startsWith('cell-')?'–':field.startsWith('double-')?'□':'Choose')=>
   '<select class="ref-select" data-ref-select="'+field+'" aria-label="'+escape(label)+'"'+
   (state.checked&&expected!=null&&value!==''?' data-checked="'+(value===String(expected)?'right':'try')+'"':'')+'><option value="">'+placeholder+'</option>'+
   options.map(option=>'<option value="'+escape(option)+'"'+(value===String(option)?' selected':'')+'>'+escape(option)+'</option>').join('')+'</select>';
  const answerLine=(label,options,expected,placeholder)=>'<label class="ref-answer">'+escape(label)+choice('answer',label,options,state.answer,expected,placeholder)+'</label>';
  function toggle(values,value){const index=values.indexOf(value);if(index<0)values.push(value);else values.splice(index,1);}
  function glyph(value,variant='blue',count=1){
   const columns=value===50?5:1, rows=value===50?10:value;
   const colors={blue:'#60ade7',red:'#e97064',green:'#7acc96'};
   const cells=range(value).map(i=>'<rect x="'+(i%columns*10)+'" y="'+(Math.floor(i/columns)*10)+'" width="10" height="10"/>').join('');
   const extra=Math.min(16,(count-1)*4);
   const shift=count>1?extra/(count-1):0;
   const width=columns*10+extra+2,height=rows*10+extra+2;
   const blocks=range(count).map(i=>'<g transform="translate('+i*shift+' '+i*shift+')">'+cells+'</g>').join('');
   return '<span class="ref-glyph" style="--glyph-cols:'+width/10+';--glyph-rows:'+height/10+'" aria-hidden="true">'+
    '<svg viewBox="-1 -1 '+width+' '+height+'" fill="'+colors[variant]+'" stroke="#355875" stroke-width="1">'+blocks+'</svg></span>';
  }
  const difference=()=>task.second-task.first;
  const blockTotal=()=>task.values.reduce((sum,value)=>sum+value*(state.counts[value]||0),0);
  function comparison(){
   const added=blockTotal(),max=Math.max(task.second,task.first+added),percent=amount=>100*amount/max;
   const bank=task.values.map(value=>'<button type="button" data-bank="'+value+'" aria-label="Add a block of '+value+'">'+glyph(value)+'<b>'+value+'</b></button>').join('');
   const placed=task.values.filter(value=>state.counts[value]).map(value=>{
    const count=state.counts[value];
    return '<button type="button" data-remove="'+value+'" aria-label="Remove one of '+count+' blocks of '+value+'">'+
     glyph(value,'blue',Math.min(count,20))+(count>5?'<b>'+count+' blocks</b>':'')+'</button>';
   }).join('');
   const graph='<section class="ref-card ref-graph"><h2>Block bar graph</h2><div class="ref-bar-row"><span>Mike · '+task.first+(added?' + '+added+' = '+(task.first+added):'')+'</span>'+
    '<div class="ref-track" aria-hidden="true"><span style="width:'+percent(task.first)+'%"></span><span class="ref-added" data-level="'+(added===difference()?'match':added>difference()?'over':'below')+
    '" style="width:'+percent(added)+'%"></span></div></div><div class="ref-bar-row"><span>Dana · '+task.second+'</span>'+
    '<div class="ref-track" aria-hidden="true"><span class="ref-dana" style="width:'+percent(task.second)+'%"></span></div></div></section>';
   const modelCheck=state.checked?' data-model-check="'+(added===difference()?'right':'try')+'"':'';
   return {html:'<div class="ref-board ref-compare"><section class="ref-card ref-bank"><h2>Block bank</h2><div class="ref-bank-grid">'+bank+
    '</div></section><section class="ref-card ref-pad" data-drop'+modelCheck+'><h2>Landing pad · '+added+'</h2><div class="ref-pad-grid">'+(placed||'<p class="ref-placeholder">Drag the difference here.</p>')+
    '</div></section>'+graph+'</div>',answer:answerLine('How many more blocks?',task.choices,difference()),
    marks:[mark('model','Blocks on the landing pad',added||'',difference()),mark('answer','Difference selected',state.answer,String(difference()))]};
  }
  function subtract(){
   const tens=Math.floor(task.first/10), originalOnes=task.first%10, expected=task.first-task.second;
   const rods=range(tens).map(i=>'<button type="button" data-trade="'+i+'"'+(task.compactTens?' data-compact-ten':'')+' aria-pressed="'+state.traded.includes(i)+'" aria-label="'+
    (state.traded.includes(i)?'Undo trade of ten ':'Trade ten ')+(i+1)+'">'+(task.compactTens?'10':glyph(10,'red'))+'</button>').join('');
   const originals=range(originalOnes).map(i=>['original-'+i,'green']);
   const newOnes=state.traded.flatMap(i=>range(10).map(n=>['trade-'+i+'-'+n,'blue']));
   const blocks=[...originals,...newOnes];
   const columns=Math.max(1,Math.min(8,blocks.length)),narrowColumns=Math.min(4,columns);
   const rows=Math.max(1,Math.ceil(blocks.length/columns)),narrowRows=Math.max(1,Math.ceil(blocks.length/narrowColumns));
   const onesLayout='--ones-cols:'+columns+';--ones-rows:'+rows+';--narrow-cols:'+narrowColumns+';--narrow-rows:'+narrowRows;
   const ones=blocks.map(([id,color],index)=>{
    const removed=state.taken.includes(id);
    return '<button type="button" data-one="'+id+'" aria-pressed="'+removed+'" aria-label="'+(removed?'Put back one ':'Take away one ')+(index+1)+'">'+glyph(1,color)+'</button>';
   }).join('');
   return {html:'<div class="ref-board ref-subtract"><section class="ref-card ref-pieces"><h2>Red tens · select to trade or undo</h2><div class="ref-rods" style="--tens:'+tens+'">'+rods+
    '</div></section><section class="ref-card ref-pieces"><h2>Green original ones · blue traded ones</h2><div class="ref-ones" style="'+onesLayout+'">'+ones+'</div></section></div>',
    answer:answerLine('Current: '+(task.first-state.taken.length)+' · Taken away: '+state.taken.length+' of '+task.second,optionsFor(expected),expected),
    marks:[mark('model','Ones taken away',state.taken.length||'',task.second),mark('answer','Difference selected',state.answer,String(expected))]};
  }
  let selectedCounter=null;
  const frameCounts=()=>[state.frameCells.slice(0,10),state.frameCells.slice(10)].map(frame=>frame.filter(Boolean).length);
  const disc=colour=>'<i class="ref-disc" data-colour="'+colour+'" aria-hidden="true"></i>';
  function frames(){
   const expected=task.first+task.second;
   const counts=frameCounts();
   const panels=counts.map((amount,index)=>{
    const name=['First','Second'][index]+' ten frame';
    const cells=range(10).map(i=>{
     const slot=index*10+i, colour=state.frameCells[slot];
     const label=(colour===1?'Gold counter':colour===2?'Silver counter':'Empty space')+', '+name.toLowerCase()+', space '+(i+1);
     const pressed=colour?' aria-pressed="'+(selectedCounter===slot)+'"':'';
     return '<button type="button" data-ten-cell="'+slot+'" aria-label="'+label+'"'+pressed+'>'+(colour?disc(colour):'')+'</button>';
    }).join('');
    return '<section class="ref-card"><h2>'+name+' · '+amount+' counters</h2><div class="ref-ten-area"><div class="ref-ten-grid" role="group" aria-label="'+name+'">'+
     cells+'</div></div></section>';
   });
   const original='<p data-original-equation>Original · '+task.first+' + '+task.second+' = '+escape(state.answer||'□')+'</p>';
   const current=answerLine('Now · '+counts.join(' + ')+' =',optionsFor(expected),expected,'□');
   const marks=[mark('answer','Sum selected',state.answer,String(expected))];
   if(task.requireFullTen)marks.unshift(mark('model','Counters in the fuller frame',Math.max(...counts),10));
   const picture=task.image&&task.picture?'<figure class="ref-ten-illustration"><img src="'+escape(task.picture)+'" alt="'+escape(task.alt)+'"></figure>':'';
   return {html:'<div class="ref-board ref-tenframes'+(picture?' ref-tenframes-illustrated':'')+'">'+panels.join('')+picture+'</div>',
    answer:'<div class="ref-frame-equations">'+original+current+'</div>',marks};
  }
  function patterns(){
   const sequences=task.patterns.map(rule=>range(task.length).map(i=>rule.start+i*rule.step));
   const shared=sequences[0].filter(number=>sequences[1].includes(number));
   const max=Math.max(...sequences.flat());
   const marks=[];
   const panels=task.patterns.map((rule,row)=>{
    const terms=sequences[row].map((expected,i)=>{
     const id=row+'-'+i,value=state.terms[id]||'';
     marks.push(mark('term-'+id,rule.name+' term '+(i+1),value,String(expected)));
     return '<div class="ref-term"><button type="button" class="ref-marker" data-mark-term="'+id+
      '" aria-pressed="'+Boolean(state.marked[id])+'" aria-label="Mark '+escape(rule.name)+' term '+(i+1)+' as shared">'+beacon+(state.marked[id]?'<span class="ref-marker-check" aria-hidden="true">✓</span>':'')+'</button>'+
      choice('term-'+id,rule.name+' term '+(i+1),range(max,1),value,expected)+'<small>Term '+(i+1)+'</small></div>';
    });
    const expectedMarks=sequences[row].map((n,i)=>shared.includes(n)?i+1:null).filter(Boolean).join(', ');
    const actualMarks=range(task.length).filter(i=>state.marked[row+'-'+i]).map(i=>i+1).join(', ');
    marks.push(mark('shared-'+row,rule.name+' · shared terms',actualMarks,expectedMarks));
    return '<section class="ref-card"><h2>'+escape(rule.name)+' · Start at '+rule.start+', add '+rule.step+'</h2><div class="ref-terms">'+terms.join('')+'</div></section>';
   });
   return {html:'<div class="ref-board ref-patterns">'+panels.join('')+'</div>',answer:'',marks};
  }
  function stamps(){
   const {rows,columns}=task,total=rows*columns;
   const expected=rows+' × '+columns+' = '+total;
   const options=[columns+' × '+rows+' = '+total,rows+' × '+columns+' = '+total,rows+' + '+columns+' = '+(rows+columns),rows+' × '+(columns-1)+' = '+rows*(columns-1)];
   const stamp=range(total).map(i=>'<button type="button" data-stamp="'+i+'" aria-pressed="'+state.counted.includes(i)+
    '" aria-label="Stamp, row '+(Math.floor(i/columns)+1)+', position '+(i%columns+1)+'"><img src="'+escape(task.picture)+'" alt="" draggable="false"></button>');
   return {html:'<div class="ref-board"><section class="ref-card ref-stamps" aria-label="Stamp array"><div class="ref-stamp-grid" style="--rows:'+rows+';--cols:'+columns+'">'+
    stamp.join('')+'</div></section></div>',answer:answerLine('Multiplication sentence',options,expected),
    marks:[mark('answer','Multiplication sentence',state.answer,expected)]};
  }
  function bond(){
   const choices=task.choices, expected=task.first+task.second;
   const parts=[['first','Blue cards',task.first,'◆','blue'],['second','Green cards',task.second,'♣','green']];
   const model=parts.map(([,label,n,symbol,color])=>'<section class="ref-card ref-illustrated"><h3>'+label+'</h3><div class="ref-cards" role="img" aria-label="'+n+' '+label.toLowerCase()+'">'+
    ('<span class="ref-playing-card '+color+'" aria-hidden="true">'+symbol+'</span>').repeat(n)+'</div></section>').join('');
   const field=(id,label,n)=>'<label>'+label+choice(id,label,choices,state.parts[id]||'',n)+'</label>';
   const equation=['first','second','whole'].map(id=>escape(state.parts[id]||'□'));
   return {html:'<div class="ref-board ref-bond"><div class="ref-card-colours">'+model+'</div><section class="ref-card ref-bond-fields" aria-label="Number bond">'+
    field('whole','Whole',expected)+'<svg class="ref-bond-lines" viewBox="0 0 120 22" preserveAspectRatio="none" aria-hidden="true"><path d="M60 1L3 21 M60 1L117 21" stroke="#528c84" stroke-width="2" fill="none"/></svg>'+
    '<div class="ref-bond-parts">'+field('first','Blue part',task.first)+field('second','Green part',task.second)+'</div><div class="ref-bond-equation">'+
    equation[0]+' + '+equation[1]+' = '+equation[2]+'</div></section></div>',answer:'',
    marks:[...parts.map(([id,label,n])=>mark(id,label,state.parts[id]||'',String(n))),mark('whole','Whole',state.parts.whole||'',String(expected))]};
  }
  const labView=(body,marks)=>{
   const style='background-image:url(&quot;'+escape(task.picture)+'&quot;);background-position:'+escape(task.imagePosition||'center')+' center';
   return {html:'<div class="ref-board ref-lab" data-kind="'+task.kind+'"><div class="ref-scene'+
    (task.imagePosition?' ref-triptych':'')+'" style="'+style+'" role="img" aria-label="'+escape(task.alt)+'"></div>'+
    '<section class="ref-card ref-lab-panel">'+body+'</section></div>',answer:'',marks};
  };
  function labFields(marks){
   return (id,label,options,expected)=>{
    const value=state.parts[id]||'';
    marks.push(mark(id,label,value,String(expected)));
    return choice(id,label,options,value,expected);
   };
  }
  const labelled=(label,field)=>'<label>'+escape(label)+field+'</label>';
  function missingStory(){
   const marks=[], field=labFields(marks), values=task.values, n=values[task.blank];
   const choices=[n-2,n-1,n,n+1,n+2,n+10];
   const cells=values.map((value,index)=>index===task.blank?field('answer-value','Missing number',choices,n):'<span>'+value+'</span>');
   const inverse=state.checked&&marks[0].correct&&state.parts.operation==='−'?
    '<p>Check with addition: '+values[1]+' + '+values[2]+' = '+values[0]+'</p>':'';
   return labView('<h2>Write the equation</h2><div class="ref-lab-equation">'+cells[0]+field('operation','Operation',['+','−'],'−')+cells[1]+
    '<span>=</span>'+cells[2]+'</div>'+inverse,marks);
  }
  const intChoices=(answer)=>[...new Set([Math.max(0,answer-2),Math.max(0,answer-1),answer,answer+1,answer+2])];
  const evenOdd=n=>n%2?'Odd':'Even';
  const cell=(value,core=false)=>'<span class="ref-cell'+(core?' ref-core':'')+'">'+value+'</span>';
  const cells=values=>'<div class="ref-cells" style="--cols:'+values.length+'">'+values.join('')+'</div>';
  const beacon='<span class="ref-beacon" aria-hidden="true"><i></i></span>';
  const numberTerm=value=>typeof value==='number'||typeof value?.answer==='number';
  function row(label,content,beacons=false){
   const terms=beacons?content.map(term=>'<div class="ref-beacon-term">'+beacon+term+'</div>'):content;
   return '<div class="ref-lab-row"><span>'+escape(label)+'</span>'+cells(terms)+'</div>';
  }
  let selectedBug=null;
  function bugDrawing(){
   return '<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="14" cy="21" rx="9" ry="10" fill="#a8d8f7" stroke="#537bab"/>'+
    '<ellipse cx="34" cy="21" rx="9" ry="10" fill="#a8d8f7" stroke="#537bab"/><ellipse cx="24" cy="30" rx="10" ry="13" fill="#ffc342" stroke="#7c4d25" stroke-width="2"/>'+
    '<ellipse cx="22" cy="32" rx="5" ry="7" fill="#fff58f"/><circle cx="24" cy="15" r="10" fill="#60422e"/><circle cx="20" cy="14" r="2" fill="#fff"/>'+
    '<circle cx="28" cy="14" r="2" fill="#fff"/><path d="M21 19 Q24 22 27 19" fill="none" stroke="#fff" stroke-width="1.5"/></svg>';
  }
  function parityPairs(){
   const marks=[], field=labFields(marks);
   const sections=task.groups.map((n,g)=>{
    const pairs=state.pairs[g]||[], paired=pairs.flat(), free=range(n).filter(i=>!paired.includes(i));
    const button=i=>'<button class="ref-bug" type="button" data-bug="'+g+':'+i+'" aria-label="Group '+(g+1)+', firefly '+(i+1)+
     (paired.includes(i)?', paired':'')+'" aria-pressed="'+(selectedBug===g+':'+i)+'">'+bugDrawing()+'</button>';
    const seats=[...pairs.map(p=>'<div class="ref-bug-seat" data-paired>'+p.map(button).join('')+'</div>'),
     ...range(Math.ceil(free.length/2)).map(i=>'<div class="ref-bug-seat">'+free.slice(i*2,i*2+2).map(button).join('')+'</div>')].join('');
    marks.push(mark('pairs-'+g,'Pairs in group '+(g+1),pairs.length||'',Math.floor(n/2)));
    return '<section class="ref-card"><h2>'+n+' fireflies</h2><div class="ref-lab-pair">'+seats+'</div><p class="ref-lab-small" aria-live="polite">'+pairs.length+
     ' paired groups · '+free.length+' unpaired</p>'+labelled(n+' is',field('parity-'+g,n+' is even or odd',['Even','Odd'],evenOdd(n)))+'</section>';
   });
   return labView('<h2>Fill the seats two at a time</h2><div class="ref-lab-pair-cards">'+sections.join('')+'</div>',marks);
  }
  function parityDigits(){
   const marks=[], field=labFields(marks);
   return labView(task.rows.map((numbers,g)=>row((g?'Odd':'Even')+' cars',numbers.map((n,i)=>{
    const digit=n%10;
    return cell('<div>'+n+'</div><sub>ones</sub>'+(task.blanks.includes(i)?field('cell-'+g+'-'+i,'Ones digit of '+n,range(10),digit):'<b>'+digit+'</b>'));
   }),true)).join(''),marks);
  }
  function paritySort(){
   const marks=[], field=labFields(marks);
   const rows=range(Math.ceil(task.numbers.length/4)).map(i=>{
    const values=task.numbers.slice(i*4,i*4+4).map(n=>
     cell('<b>'+n+'</b>'+field('cell-sort-'+n,'Is '+n+' even or odd?',['Even','Odd'],evenOdd(n))));
    return row(i?'More cars':'First cars',values);
   });
   return labView(rows.join(''),marks);
  }
  function parityNeighbours(){
   const marks=[], field=labFields(marks);
   return labView(task.numbers.map(n=>row(evenOdd(n)+' cars',[
    cell('Before'+field('cell-before-'+n,evenOdd(n)+' number before '+n,intChoices(n-2),n-2)),cell(n,true),
    cell('After'+field('cell-after-'+n,evenOdd(n)+' number after '+n,intChoices(n+2),n+2))],true)).join(''),marks);
  }
  const colors={a:['#f9d875','#be711c'],b:['#82d7db','#226d7e'],c:['#eea8d9','#883d85'],d:['#abe37a','#3f7956']};
  const icons={o:['Circle','<circle cx="24" cy="24" r="17"/>'],q:['Square','<rect x="8" y="8" width="32" height="32" rx="6"/>'],
   d:['Diamond','<path d="M24 4L43 24L24 44L5 24Z"/>'],s:['Star','<path d="M24 4L30 17L44 19L34 29L37 43L24 36L11 43L14 29L4 19L18 17Z"/>'],
   t:['Triangle','<path d="M24 5L43 40H5Z"/>'],r:['Arrow','<path d="M5 16H24V7L44 24L24 41V32H5Z"/>']};
  function tokenName(value){
   if(typeof value==='string'&&value.startsWith('@')){
    const [symbol,color,size,turn]=value.slice(1);
    return (size==='s'?'Small ':'')+({a:'Gold',b:'Teal',c:'Pink',d:'Green'}[color])+' '+icons[symbol][0].toLowerCase()+
     (turn?({1:' down',2:' left',3:' up'}[turn]||''):'');
   }
   if(Array.isArray(value))return value.length+' squares';
   return String(value);
  }
  function renderToken(value,i){
   if(Array.isArray(value))return '<span class="ref-square-figure" role="img" aria-label="'+tokenName(value)+'">'+range(20).map(n=>
    '<i'+(value.includes(n)?' class="on'+(task.newSquares?.[i]?.includes(n)?' new':'')+'"':'')+'></i>').join('')+'</span>';
   if(typeof value!=='string'||!value.startsWith('@'))return escape(value);
   const [symbol,color,size,turn]=value.slice(1);
   const [light,dark]=colors[color], scale=size==='s'?.63:1;
   return '<svg viewBox="0 0 48 48" class="ref-shape" role="img" aria-label="'+escape(tokenName(value))+'"><g transform="translate(24 24) rotate('+
    (Number(turn)||0)*90+') scale('+scale+') translate(-24 -24)" fill="'+light+'" stroke="'+dark+'" stroke-width="2.8" stroke-linejoin="round">'+
    icons[symbol][1]+'<path d="M13 18Q17 11 25 11" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2.7" stroke-linecap="round"/></g></svg>';
  }
  function patternLab(){
   const marks=[],field=labFields(marks);
   const model=(task.rows||[]).map((r,g)=>row(r.label,r.values.map((value,i)=>{
    if(value&&typeof value==='object'&&!Array.isArray(value)){
     const options=value.options||intChoices(value.answer);
     return cell(field('cell-'+g+'-'+i,r.label+', position '+(i+1),options.map(tokenName),tokenName(value.answer)));
    }
    return cell(renderToken(value,i),r.core>i);
   }),r.values.every(numberTerm))).join('');
   const table=task.table?'<table class="ref-ttable"><thead><tr><th>'+escape(task.table.head[0])+'</th><th>'+escape(task.table.head[1])+
    '</th></tr></thead><tbody>'+task.table.values.map(([index,value])=>'<tr><th scope="row">'+index+'</th><td>'+
     (typeof value==='object'?field('cell-table-'+index,task.table.head[1]+' for '+index,intChoices(value.answer),value.answer):value)+'</td></tr>').join('')+'</tbody></table>':'';
   const followups=(task.questions||[]).map((q,i)=>labelled(q.label,field('question-'+i,q.label,(q.options||intChoices(q.answer)).map(tokenName),tokenName(q.answer)))).join('');
   const picked=state.squares.slice().sort((a,b)=>a-b).join(',');
   const expected=task.build?.slice().sort((a,b)=>a-b).join(',');
   if(task.build)marks.push(mark('build','Squares in the next figure',picked,expected));
   const build=task.build?'<div class="ref-build ref-cells" role="group" aria-label="Build the next figure">'+range(20).map(i=>
    '<button type="button" aria-pressed="'+state.squares.includes(i)+'" data-square="'+i+'" aria-label="Row '+(Math.floor(i/5)+1)+', column '+(i%5+1)+'"></button>').join('')+'</div>':'';
   return labView(model+table+build+followups,marks);
  }
  function fiveLab(){
   const fives=task.fives, marks=[],field=labFields(marks);
   const choices=q=>q.options||intChoices(q.answer);
   const star='<svg class="ref-parcel" viewBox="0 0 45 44" aria-hidden="true"><path d="M22.5 3 28 15 41 17 32 27 34 40 22.5 34 11 40 13 27 4 17 17 15Z" fill="#ffcc57" stroke="#a96726" stroke-width="2.8" stroke-linejoin="round"/><path d="M22.5 8 26 18 35 19 27 23 23 32 20 24 11 19 19 18Z" fill="#ffe8a1"/><path d="m10 17 10 6-4 12" fill="none" stroke="#f7a94b" stroke-width="2" stroke-linecap="round"/></svg>';
   const parcelRow=(size,filled=true)=>'<span class="ref-parcel-row" aria-hidden="true">'+(filled?star:'<span class="ref-parcel-empty"></span>').repeat(size)+'</span>';
   const rows=(fives.rows||[]).map((r,g)=>row(r.label,r.values.map((value,i)=>cell(
    typeof value==='object'?field('cell-'+g+'-'+i,r.label+', position '+(i+1),value.options,value.answer):value)),true)).join('');
   let packs='';
   if(fives.pack){
    const active=range(fives.pack.slots).filter(i=>state.parts['tray-'+i]==='full').length;
    const selected=range(fives.pack.slots).map(i=>{
     const on=state.parts['tray-'+i]==='full';
     const label='Tray '+(i+1)+(on?', five parcels, select to empty':', empty, select to pack');
     return '<button type="button" class="ref-tray" data-five-tray="'+i+'" aria-pressed="'+on+'" aria-label="'+label+'">'+parcelRow(5,on)+'<small>Tray '+(i+1)+'</small></button>';
    }).join('');
    marks.push(mark('pack','Trays filled',active||'',fives.pack.groups));
    packs='<div class="ref-five-packs" style="--trays:'+Math.min(4,fives.pack.slots)+'">'+selected+'</div><p class="ref-lab-small" aria-live="polite">'+active+' full '+(active===1?'tray':'trays')+'</p>';
   }
   const arrays=fives.models?'<div class="ref-five-arrays" style="--arrays:'+fives.models.length+'">'+fives.models.map(([height,width],i)=>
    '<section class="ref-five-array" aria-label="Array '+(i?'B':'A')+': '+height+' rows of '+width+' parcels"><h3>'+(fives.models.length>1?'Array '+(i?'B':'A'):'Parcel trays')+'</h3>'+parcelRow(width).repeat(height)+'</section>').join('')+'</div>':'';
   const quiz=fives.quiz?'<div class="ref-five-quiz">'+fives.quiz.map((q,i)=>labelled(q.label+(q.label.includes('=')?'':' ='),
    field('quiz-'+i,q.label,choices(q),q.answer))).join('')+'</div>':'';
   const questions=(fives.questions||[]).map((q,i)=>labelled(q.label,field('question-'+i,q.label,choices(q),q.answer))).join('');
   const tags=fives.hunt?'<div class="ref-five-tags" role="group" aria-label="Number tags">'+fives.hunt.map(n=>{
    const field='tag-'+n,selected=state.parts[field]==='yes',expected=n%5===0&&n<=50;
    marks.push(mark(field,'Number tag '+n,state.parts.huntStarted?(selected?'Selected':'Not selected'):'',expected?'Selected':'Not selected'));
    return '<button type="button" class="ref-tag" data-five-tag="'+n+'" aria-pressed="'+selected+
     '" aria-label="Number tag '+n+'"'+(state.checked?' data-checked="'+(selected===expected?'right':'try')+'"':'')+'>'+n+'</button>';
   }).join('')+'</div>':'';
   const reflection=fives.reflection?labelled('How did this feel? (optional)',choice('reflection','How did this feel?',['I can explain it','I need more practice','I would like help'],state.parts.reflection||'',null)):'';
   return labView(rows+packs+arrays+quiz+questions+tags+reflection,marks);
  }
  let doubleExample=0;
  function doubleThinking(){
   const {small,extra}=task.problems[doubleExample], large=small+extra;
   return '<p>I want to know <strong>'+small+' + '+large+'</strong>.</p>'+
    '<p>The smaller number is <strong>'+small+'</strong>. I split <strong>'+large+'</strong> into <strong>'+small+' + '+extra+'</strong>.</p>'+
    '<p>So <strong>'+small+' + '+large+' = '+small+' + '+small+' + '+extra+'</strong>.</p>';
  }
  function doublesPractice(){
   const marks=[],field=labFields(marks);
   function part(slot,name,a,b){
    const total=a+b,id='double-'+slot+'-'+name,label='Problem '+(slot+1)+': '+a+' plus '+b;
    const max={1:20,2:50,3:1000}[cfg.grade], offset=(slot+(name==='sum'?2:0)+task.problems[0].small)%5;
    const start=Math.max(0,Math.min(max-4,total-offset));
    const input=field(id,label,range(5,start),total), result=marks.at(-1);
    const feedback=result.checked&&result.entered?'<span class="ref-double-mark" data-ok="'+result.correct+
     '" role="img" aria-label="'+(result.correct?'Correct':'Try again')+'">'+(result.correct?'✓':'!')+'</span>':'';
    return '<label class="ref-double-part"><span>'+a+' + '+b+' =</span>'+input+feedback+'</label>';
   }
   const rows=task.problems.map(({small,extra},i)=>'<div class="ref-double-row"><button type="button" data-double-example="'+i+
    '" aria-pressed="'+(i===doubleExample)+'" aria-label="Show thinking for problem '+(i+1)+'">'+(i+1)+'</button>'+
    part(i,'known',small,small)+part(i,'sum',small,small+extra)+'</div>').join('');
   return {html:'<div class="ref-board ref-doubles"><section class="ref-card ref-double-coach" aria-label="Student thinking">'+
    '<img src="'+escape(task.picture)+'" alt="'+escape(task.alt)+'"><div class="ref-thought" aria-live="polite">'+doubleThinking()+'</div></section>'+
    '<section class="ref-double-steps" aria-label="Five doubles problems" data-checked="'+state.checked+'"><div class="ref-double-row">'+
    '<span></span><h2>I know that…</h2><h2>This helps me solve…</h2></div>'+rows+'</section></div>',answer:'',marks};
  }
  const activity={'compare-blocks':comparison,'subtract-blocks':subtract,'ten-frames':frames,'shared-patterns':patterns,'stamp-array':stamps,'number-bond':bond,
   'missing-number-story':missingStory,'parity-pair':parityPairs,'parity-digits':parityDigits,'parity-sort':paritySort,'parity-neighbours':parityNeighbours,
   'pattern-lab':patternLab,'five-lab':fiveLab,'doubles-practice':doublesPractice}[task.kind];
  const signature=()=>JSON.stringify([state.answer,state.counts,state.traded,state.taken,state.terms,state.marked,
   Object.fromEntries(Object.entries(state.parts).filter(([id])=>id!=='reflection')),state.pairs,state.squares,
   ...(task.kind==='ten-frames'?[state.frameCells]:[])]);
  let marks=[], status='', drag=null, suppressClick=false;
  function snapshot(){
   const score=marks.filter(item=>item.correct).length,complete=marks.every(item=>item.entered),correct=complete&&score===marks.length;
   const modelNeedsWork=marks.some(item=>item.field==='model'&&!item.correct);
   const termsCorrect=task.kind==='shared-patterns'&&marks.filter(item=>item.field.startsWith('term-')).every(item=>item.correct);
   const modelHint={'compare-blocks':'Check the blocks on the landing pad.','ten-frames':'Move the discs to fill one ten frame.',
    'subtract-blocks':'Check how many ones you took away.'}[task.kind];
   const message=correct?'Correct. All parts match.':modelNeedsWork?modelHint:termsCorrect?'Check which terms you marked as shared.':
    !complete?'Complete each part, then check again.':'Review the marked choices and check again.';
   const answers=Object.fromEntries(marks.map(item=>[item.label,item.actual]));
   if(task.kind==='ten-frames'){
    answers['Original addends']=task.first+' + '+task.second;
    answers['Current addends']=frameCounts().join(' + ');
   }
   if(task.fives?.reflection&&state.parts.reflection)answers['Student reflection']=state.parts.reflection;
   return {done:state.done,response:{answers,marks},
    assessment:{signature:signature(),checked:state.checked,complete,correct:state.checked&&correct,answerCorrect:correct,message,
     score,total:marks.length,answerChecks:marks,partAssessment:{version:2,checked:state.checked,correct:state.checked?score:0,total:marks.length,items:marks}}};
  }
  function paint(focus=''){
   const view=activity();
   marks=view.marks;
   root.innerHTML='<h1>'+escape(task.title)+'</h1><p class="prompt">'+escape(task.prompt)+'</p><div class="ref-shell">'+view.html+view.answer+
    '<div class="ref-actions"><p class="ref-status" role="status">'+escape(status||(state.checked?snapshot().assessment.message:task.directions))+
    '</p>'+(task.kind==='stamp-array'?'<button type="button" data-clear-count>Clear counting</button>':'')+
    '<button type="button" data-reset-ref>Reset</button></div></div>';
   if(focus)root.querySelector(focus)?.focus({preventScroll:true});
  }
  function change(focus='',message='',type='ml-state'){
   state.checked=false;state.done=false;status=message;persist();paint(focus);signal(type);
  }
  function addBlock(value){
   state.counts[value]=(state.counts[value]||0)+1;
   change('[data-bank="'+value+'"]','Landing pad total: '+blockTotal()+'.');
  }
  function moveCounter(from,to){
   state.frameCells[to]=state.frameCells[from];
   state.frameCells[from]=0;
   selectedCounter=null;
   change('[data-ten-cell="'+to+'"]','Now '+frameCounts().join(' + ')+'. The total stays the same.');
  }
  root.addEventListener('change',event=>{
   const field=event.target.dataset.refSelect;
   if(!field)return;
   const value=event.target.value;
   if(field==='reflection'){state.parts[field]=value;persist();signal('ml-state');return;}
   if(field==='answer')state.answer=value;
   else if(field.startsWith('term-')){
    const term=field.slice(5);state.terms[term]=value;
    if(!value)delete state.marked[term];
   }else state.parts[field]=value;
   if(field.startsWith('double-'))doubleExample=Number(field.split('-')[1]);
   change('[data-ref-select="'+field+'"]');
  });
  root.addEventListener('click',event=>{
   const button=event.target.closest('button');
   if(!button)return;
   if(suppressClick&&event.detail!==0){suppressClick=false;return;}
   const {bank,remove,trade,one,markTerm,stamp}=button.dataset;
   if(button.dataset.doubleExample!==undefined){
    doubleExample=Number(button.dataset.doubleExample);
    root.querySelector('.ref-thought').innerHTML=doubleThinking();
    root.querySelectorAll('[data-double-example]').forEach(example=>example.setAttribute('aria-pressed',String(example===button)));
    return;
   }
   if(button.dataset.tenCell!==undefined){
    const slot=Number(button.dataset.tenCell);
    if(state.frameCells[slot]){
     selectedCounter=selectedCounter===slot?null:slot;
     status=selectedCounter===null?'Select a counter to move it.':'Select an empty space to move the counter.';
     return paint('[data-ten-cell="'+slot+'"]');
    }
    if(selectedCounter!==null)return moveCounter(selectedCounter,slot);
   }
   if(button.dataset.fiveTray!==undefined||button.dataset.fiveTag!==undefined){
    const tray=button.dataset.fiveTray,tag=button.dataset.fiveTag;
    const id=tray!==undefined?'tray-'+tray:'tag-'+tag;
    if(state.parts[id])delete state.parts[id];
    else state.parts[id]=tray!==undefined?'full':'yes';
    if(tag!==undefined)state.parts.huntStarted=true;
    return change(tray!==undefined?'[data-five-tray="'+tray+'"]':'[data-five-tag="'+tag+'"]');
   }
   if(button.dataset.bug){
    const [group,i]=button.dataset.bug.split(':').map(Number), id=button.dataset.bug;
    const pairs=state.pairs[group]||=[];
    const paired=pairs.findIndex(p=>p.includes(i));
    if(paired>=0){pairs.splice(paired,1);selectedBug=null;}
    else if(selectedBug===id)selectedBug=null;
    else if(selectedBug?.startsWith(group+':')){pairs.push([Number(selectedBug.split(':')[1]),i]);selectedBug=null;}
    else selectedBug=id;
    return change('[data-bug="'+id+'"]');
   }
   if(button.dataset.square!==undefined){
    toggle(state.squares,Number(button.dataset.square));
    return change('[data-square="'+button.dataset.square+'"]');
   }
   if(bank)return addBlock(Number(bank));
   if(remove){
    state.counts[remove]--;
    return change(state.counts[remove]?'[data-remove="'+remove+'"]':'[data-bank="'+remove+'"]','Landing pad total: '+blockTotal()+'.');
   }
   if(trade!==undefined){
    const index=Number(trade);
    toggle(state.traded,index);state.traded.sort((a,b)=>a-b);
    if(!state.traded.includes(index))state.taken=state.taken.filter(id=>!id.startsWith('trade-'+index+'-'));
    return change('[data-trade="'+trade+'"]',state.traded.includes(index)?'Traded a ten for ten ones.':'Put the ten back.');
   }
   if(one){toggle(state.taken,one);state.taken.sort();return change('[data-one="'+one+'"]');}
   if(markTerm){
    state.marked[markTerm]=!state.marked[markTerm];
    return change('[data-mark-term="'+markTerm+'"]');
   }
   if(stamp!==undefined){
    toggle(state.counted,Number(stamp));status='Stamps counted: '+state.counted.length+'.';persist();return paint('[data-stamp="'+stamp+'"]');
   }
   if(button.hasAttribute('data-clear-count')){
    state.counted=[];status='';persist();return paint('[data-clear-count]');
   }
   if(button.hasAttribute('data-reset-ref')){
    selectedBug=null;
    selectedCounter=null;
    doubleExample=0;
    if(task.kind==='ten-frames')state.frameCells=initialFrames();
    Object.assign(state,{answer:'',counts:{},traded:[],taken:[],terms:{},marked:{},counted:[],parts:{},pairs:{},squares:[]});
    change('[data-reset-ref]','','ml-reset');
   }
  });
  root.addEventListener('pointerdown',event=>{
   const button=event.target.closest('[data-bank],[data-ten-cell]');
   suppressClick=false;
   if(!button||event.button!==0||drag)return;
   const counter=button.hasAttribute('data-ten-cell')?Number(button.dataset.tenCell):null;
   if(counter!==null&&!state.frameCells[counter])return;
   drag={id:event.pointerId,counter,value:Number(button.dataset.bank),x:event.clientX,y:event.clientY};
   button.setPointerCapture(event.pointerId);
  });
  function dropTarget(event,counter){
   const hit=document.elementFromPoint(event.clientX,event.clientY);
   if(counter===null)return hit?.closest('[data-drop]')||null;
   const cell=hit?.closest('[data-ten-cell]');
   return cell&&!state.frameCells[Number(cell.dataset.tenCell)]?cell:null;
  }
  function showDropTarget(target){
   const old=root.querySelector('[data-over],[data-counter-over]');
   if(old===target)return;
   old?.removeAttribute('data-over');
   old?.removeAttribute('data-counter-over');
   if(target)target.setAttribute(target.hasAttribute('data-ten-cell')?'data-counter-over':'data-over','');
  }
  root.addEventListener('pointermove',event=>{
   if(drag?.id!==event.pointerId)return;
   if(!drag.ghost&&Math.hypot(event.clientX-drag.x,event.clientY-drag.y)>5){
    const movingCounter=drag.counter!==null;
    drag.ghost=document.createElement('span');
    drag.ghost.className='ref-ghost'+(movingCounter?' ref-counter-ghost':'');
    drag.ghost.innerHTML=movingCounter?disc(state.frameCells[drag.counter]):glyph(drag.value);
    root.append(drag.ghost);
   }
   if(!drag.ghost)return;
   drag.ghost.style.left=event.clientX+'px';drag.ghost.style.top=event.clientY+'px';
   showDropTarget(dropTarget(event,drag.counter));
  });
  function endDrag(event,cancelled=false){
   if(drag?.id!==event.pointerId)return;
   const {value,ghost,counter}=drag;drag=null;ghost?.remove();
   showDropTarget(null);
   if(ghost&&!cancelled){
    suppressClick=true;
    setTimeout(()=>{suppressClick=false;},0);
    const target=dropTarget(event,counter);
    if(!target)return;
    if(counter===null)addBlock(value);
    else moveCounter(counter,Number(target.dataset.tenCell));
   }
  }
  root.addEventListener('pointerup',event=>endDrag(event));
  for(const event of ['pointercancel','lostpointercapture'])root.addEventListener(event,e=>endDrag(e,true));
  window.ML_ENGINE={get:snapshot,check(){state.checked=true;status='';persist();paint();return snapshot();},setDone(value){state.done=value;persist();}};
  document.title=task.title;
  paint();
  signal('ml-ready');
 }
 window.ML_NOVEMBER_REFERENCE_ENGINE={styles,boot};
})();
