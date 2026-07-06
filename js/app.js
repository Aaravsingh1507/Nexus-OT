/* =========================================================
   NEXUS-OT — Application Logic
   Navigation, retrieval engine, copilot chat, knowledge
   graph renderer, compliance table, source drawer.

   Depends on: js/data.js (DOCS, NODES, EDGES, NODE_COLORS,
   COMPLIANCE_ROWS must be loaded first)
========================================================= */

/* =========================================================
   NAV
========================================================= */
document.querySelectorAll('.nav-item').forEach(item=>{
  item.addEventListener('click', ()=>{
    document.querySelectorAll('.nav-item').forEach(i=>i.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
    item.classList.add('active');
    document.getElementById('view-'+item.dataset.view).classList.add('active');
  });
});


/* =========================================================
   RETRIEVAL — simple keyword overlap scoring across chunks
========================================================= */
const STOPWORDS = new Set(['the','is','a','an','and','or','of','to','in','on','for','with','was','were','are','it','at','by','be','as','that','this','has','have','did','does','do','what','why','when','which','our','we','current','currently']);

function tokenize(str){
  return str.toLowerCase().replace(/[^a-z0-9\-]+/g,' ').split(' ').filter(w=>w.length>1 && !STOPWORDS.has(w));
}

function retrieve(query, topN=4){
  const qTokens = tokenize(query);
  const scored = [];
  DOCS.forEach(doc=>{
    doc.chunks.forEach((chunk, idx)=>{
      const cTokens = tokenize(chunk);
      let score = 0;
      qTokens.forEach(qt=>{
        if(cTokens.includes(qt)) score += 1;
        if(doc.tag && doc.tag.toLowerCase().replace('-','') === qt.replace('-','')) score += 3;
      });
      if(score>0) scored.push({doc, chunk, idx, score});
    });
  });
  scored.sort((a,b)=>b.score-a.score);
  return scored.slice(0, topN);
}


/* =========================================================
   CHAT
========================================================= */
const chatLog = document.getElementById('chat-log');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');

function addMessage(role, html, meta){
  const wrap = document.createElement('div');
  wrap.className = 'msg '+role;
  wrap.innerHTML = `${meta?`<div class="msg-meta">${meta}</div>`:''}<div class="msg-bubble">${html}</div>`;
  chatLog.appendChild(wrap);
  chatLog.scrollTop = chatLog.scrollHeight;
  return wrap;
}

function nowTime(){
  const d = new Date();
  return d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
}

async function askCopilot(question){
  addMessage('user', escapeHtml(question), 'YOU · '+nowTime());
  const typingWrap = addMessage('bot', '<div class="typing"><span></span><span></span><span></span></div>', 'NEXUS COPILOT · retrieving sources…');
  chatSend.disabled = true;

  const hits = retrieve(question, 4);
  const contextBlock = hits.map((h,i)=>`[Source ${i+1}: ${h.doc.title} (${h.doc.type})]\n${h.chunk}`).join('\n\n');

  const systemPrompt = `You are NEXUS-OT, an industrial knowledge copilot for a steel plant's coke oven battery unit. Answer ONLY using the provided source excerpts below — do not invent facts not present in them. Be concise (3-6 sentences), operational, and direct, as if speaking to a safety or maintenance engineer. If the sources reveal a safety or compliance gap, state it plainly. At the end, do not repeat citations in text — they will be shown separately.

SOURCE EXCERPTS:
${contextBlock || 'No matching sources found in the corpus.'}`;

  try{
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: question }]
      })
    });
    const data = await response.json();
    const textBlocks = (data.content||[]).filter(b=>b.type==='text').map(b=>b.text).join('\n');
    const answer = textBlocks || "I couldn't generate a grounded answer from the available sources.";

    const citeHtml = hits.length ? `<div class="citations">${hits.map((h,i)=>{
      const flagged = h.doc.id==='doc-incident' || h.doc.id==='doc-inspection';
      return `<span class="cite ${flagged?'flagged':''}" data-doc="${h.doc.id}">[${i+1}] ${h.doc.title}</span>`;
    }).join('')}</div>` : '';

    typingWrap.querySelector('.msg-bubble').innerHTML = escapeHtml(answer).replace(/\n/g,'<br>') + citeHtml;
    typingWrap.querySelector('.msg-meta').textContent = 'NEXUS COPILOT · '+nowTime()+' · '+hits.length+' source(s) retrieved';

    typingWrap.querySelectorAll('.cite').forEach(el=>{
      el.addEventListener('click', ()=>openDrawer(el.dataset.doc));
    });
  }catch(err){
    typingWrap.querySelector('.msg-bubble').innerHTML = "Connection to the reasoning engine failed. This can happen if the network sandbox blocks api.anthropic.com — the retrieval layer above still found "+hits.length+" relevant source(s), shown below.";
    const citeHtml = hits.length ? `<div class="citations">${hits.map((h,i)=>`<span class="cite" data-doc="${h.doc.id}">[${i+1}] ${h.doc.title}</span>`).join('')}</div>` : '';
    typingWrap.querySelector('.msg-bubble').innerHTML += citeHtml;
    typingWrap.querySelectorAll('.cite').forEach(el=>{
      el.addEventListener('click', ()=>openDrawer(el.dataset.doc));
    });
  }finally{
    chatSend.disabled = false;
  }
}

function escapeHtml(s){
  const d = document.createElement('div'); d.textContent = s; return d.innerHTML;
}

chatSend.addEventListener('click', ()=>{
  const q = chatInput.value.trim();
  if(!q) return;
  chatInput.value='';
  askCopilot(q);
});
chatInput.addEventListener('keydown', e=>{
  if(e.key==='Enter'){ e.preventDefault(); chatSend.click(); }
});
document.querySelectorAll('.sugg').forEach(s=>{
  s.addEventListener('click', ()=>askCopilot(s.dataset.q));
});

/* seed with welcome message on load */
window.addEventListener('DOMContentLoaded', ()=>{
  addMessage('bot', 'Ask me anything about equipment history, incidents, procedures or compliance across the indexed corpus — try one of the suggestions below, or ask your own question.', 'NEXUS COPILOT · '+nowTime());
});


/* =========================================================
   SOURCE DRAWER
========================================================= */
const drawer = document.getElementById('drawer');
function openDrawer(docId){
  const doc = DOCS.find(d=>d.id===docId);
  if(!doc) return;
  document.getElementById('drawer-title').textContent = doc.title;
  document.getElementById('drawer-sub').textContent = doc.type.toUpperCase()+' · TAG: '+doc.tag;
  document.getElementById('drawer-body').innerHTML = doc.chunks.map(c=>`<p>${escapeHtml(c)}</p>`).join('');
  drawer.classList.add('open');
}
document.getElementById('drawer-close').addEventListener('click', ()=>drawer.classList.remove('open'));


/* =========================================================
   GRAPH RENDER
========================================================= */
const svg = document.getElementById('graph-svg');
const svgNS = 'http://www.w3.org/2000/svg';

function nodeById(id){ return NODES.find(n=>n.id===id); }

function renderGraph(){
  svg.innerHTML='';
  // edges first
  EDGES.forEach(e=>{
    const a = nodeById(e.from), b = nodeById(e.to);
    const line = document.createElementNS(svgNS,'line');
    line.setAttribute('x1', a.x); line.setAttribute('y1', a.y);
    line.setAttribute('x2', b.x); line.setAttribute('y2', b.y);
    line.setAttribute('class', 'gedge'+(e.gap?' gap':''));
    svg.appendChild(line);
    if(e.label){
      const mx = (a.x+b.x)/2, my = (a.y+b.y)/2;
      const t = document.createElementNS(svgNS,'text');
      t.setAttribute('x', mx+8); t.setAttribute('y', my-4);
      t.setAttribute('class','gedge-label'); t.textContent = e.label;
      svg.appendChild(t);
    }
  });
  // nodes
  NODES.forEach(n=>{
    const g = document.createElementNS(svgNS,'g');
    g.setAttribute('class','gnode');
    g.setAttribute('transform', `translate(${n.x},${n.y})`);

    if(n.type==='incident'){
      const ring = document.createElementNS(svgNS,'circle');
      ring.setAttribute('class','pulse-ring'); ring.setAttribute('r','14');
      g.appendChild(ring);
    }

    const circle = document.createElementNS(svgNS,'circle');
    circle.setAttribute('r', n.type==='facility' ? 20 : 16);
    circle.setAttribute('fill', NODE_COLORS[n.type]+'33');
    circle.setAttribute('stroke', NODE_COLORS[n.type]);
    g.appendChild(circle);

    const label = document.createElementNS(svgNS,'text');
    label.setAttribute('x', 0); label.setAttribute('y', n.type==='facility'?36:32);
    label.setAttribute('text-anchor','middle');
    label.textContent = n.label;
    g.appendChild(label);

    const sub = document.createElementNS(svgNS,'text');
    sub.setAttribute('x', 0); sub.setAttribute('y', n.type==='facility'?48:44);
    sub.setAttribute('text-anchor','middle');
    sub.setAttribute('class','sub');
    sub.textContent = n.sub;
    g.appendChild(sub);

    g.addEventListener('click', ()=>selectNode(n.id));
    svg.appendChild(g);
  });
}

function selectNode(id){
  const n = nodeById(id);
  const connected = EDGES.filter(e=>e.from===id||e.to===id).map(e=>{
    const otherId = e.from===id ? e.to : e.from;
    return {node: nodeById(otherId), gap: e.gap};
  });
  const detail = document.getElementById('graph-detail');
  detail.innerHTML = `
    <h3>${n.label}</h3>
    <div class="type-tag">${n.sub}</div>
    <div class="desc">${n.desc}</div>
    <div class="links">
      <h4>Linked entities (${connected.length})</h4>
      ${connected.map(c=>`<div class="link-item" data-node="${c.node.id}">${c.gap?'⚠ ':''}${c.node.label} <span style="color:var(--text-dimmer);float:right">${c.node.sub}</span></div>`).join('')}
    </div>
    <div class="links">
      <h4>Source documents</h4>
      ${n.sources.map(sid=>{
        const d = DOCS.find(x=>x.id===sid);
        return `<div class="link-item" data-doc="${sid}">${d.title}</div>`;
      }).join('')}
    </div>
  `;
  detail.querySelectorAll('.link-item[data-node]').forEach(el=>{
    el.addEventListener('click', ()=>selectNode(el.dataset.node));
  });
  detail.querySelectorAll('.link-item[data-doc]').forEach(el=>{
    el.addEventListener('click', ()=>openDrawer(el.dataset.doc));
  });
}

renderGraph();


/* =========================================================
   COMPLIANCE TABLE
========================================================= */
const compTable = document.getElementById('comp-table');
compTable.innerHTML = `
  <thead><tr><th>Procedure</th><th>Regulatory Requirement</th><th>Status</th><th>Evidence</th></tr></thead>
  <tbody>
    ${COMPLIANCE_ROWS.map(r=>`
      <tr>
        <td class="proc">${r.proc}</td>
        <td>${r.req}</td>
        <td><span class="status-chip ${r.status}">${r.status==='gap'?'GAP':'COMPLIANT'}</span></td>
        <td>${r.evidence}</td>
      </tr>
    `).join('')}
  </tbody>
`;
