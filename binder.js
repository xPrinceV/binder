function getQueryParam(name) {
  const p = new URLSearchParams(window.location.search);
  return p.get(name) || '';
}

function setStatus(msg) {
  document.getElementById('status').textContent = msg || '';
}

async function loadUserFile(setName, username) {
  if (!setName || !username) {
    setStatus('Use ?set=set1&user=name');
    document.getElementById('grid').innerHTML = '';
    return;
  }

  const url = `sets/${encodeURIComponent(setName)}/${encodeURIComponent(username)}.txt`;
  setStatus('Loading ' + url + ' ...');

  try {
    const res = await fetch(url);
    if (!res.ok) {
      setStatus('File not found: ' + url);
      document.getElementById('grid').innerHTML = '';
      return;
    }
    const text = await res.text();
    setStatus('');
    renderFromText(text);
  } catch (err) {
    console.error(err);
    setStatus('Error loading file');
  }
}

function renderFromText(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  lines.forEach(line => {
    const [path, qtyStr] = line.split('*');
    const qty = parseInt(qtyStr) || 0;

    const wrap = document.createElement('div');
    wrap.className = 'card-wrap' + (qty > 0 ? '' : ' dim');

    const img = document.createElement('img');
    img.src = `cards/${setName}/${path.trim()}`;

    const badge = document.createElement('div');
    badge.className = 'badge';
    badge.textContent = 'x' + qty;

    const caption = document.createElement('div');
    caption.className = 'caption';
    caption.textContent = path.split('/').pop();

    wrap.appendChild(img);
    wrap.appendChild(badge);
    wrap.appendChild(caption);
    grid.appendChild(wrap);
  });
}

// --- Search button ---
document.getElementById("goBtn").addEventListener("click", () => {
  const setName = document.getElementById("setSelect").value; // <-- this
  const username = document.getElementById("userInput").value.trim();

  if (username && setName) {
    // update URL
    history.replaceState(
      null,
      "",
      `?set=${encodeURIComponent(setName)}&user=${encodeURIComponent(username)}`
    );

    // load file
    loadUserFile(setName, username);
  }
});

// --- Auto-load from URL ---
const initialSet = getQueryParam('set');
const initialUser = getQueryParam('user');

if (initialSet) document.getElementById('setSelect').value = initialSet;
if (initialUser) document.getElementById('userInput').value = initialUser;

if (initialSet && initialUser) {
  loadUserFile(initialSet, initialUser);
} else {
  setStatus('Select set and enter username');
}