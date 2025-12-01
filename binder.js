function getQueryUser() {
  const p = new URLSearchParams(window.location.search);
  return p.get('user') || '';
}

function setStatus(msg) {
  document.getElementById('status').textContent = msg || '';
}

async function loadUserFile(username) {
  if (!username) {
    setStatus('Enter username or use ?user=name');
    return;
  }

  const url = `users/${encodeURIComponent(username)}.txt`;
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
  grid.innerHTML = ''; // clear

  lines.forEach(line => {
    const parts = line.split('*');
    const path = parts[0].trim();
    const qty = parseInt(parts[1]) || 0;

    const wrap = document.createElement('div');
    wrap.className = 'card-wrap' + (qty > 0 ? '' : ' dim');

    const img = document.createElement('img');
    img.src = path;
    img.alt = path;

    const badge = document.createElement('div');
    badge.className = 'badge';
    badge.textContent = 'x' + qty;

    const caption = document.createElement('div');
    caption.className = 'caption';
    // optional: show filename or strip folder
    caption.textContent = path.split('/').pop();

    wrap.appendChild(img);
    wrap.appendChild(badge);
    wrap.appendChild(caption);
    grid.appendChild(wrap);
  });
}

// --- wire UI ---
document.getElementById('goBtn').addEventListener('click', () => {
  const u = document.getElementById('userInput').value.trim();
  if (u) {
    history.replaceState(null, '', '?user=' + encodeURIComponent(u));
    loadUserFile(u);
  }
});

// on load: maybe load from query param
const initialUser = getQueryUser();
if (initialUser) {
  document.getElementById('userInput').value = initialUser;
  loadUserFile(initialUser);
} else {
  setStatus('Enter username or open with ?user=aden');
}