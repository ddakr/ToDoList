// ── Data ─────────────────────────────────────────────

let prio = 'high';
let filter = 'vse';
let items = [];

// ── Local Storage ─────────────────────────────────────

function uloz() {
    localStorage.setItem('todoItems', JSON.stringify(items));
}

function nacti() {
    const data = localStorage.getItem('todoItems');
    if (data) items = JSON.parse(data);
    else items = [
        { text: 'Odevzdat projekt', prio: 'high', done: false, time: 'Dnes 9:00' },
        { text: 'Nakoupit potraviny', prio: 'mid', done: false, time: 'Dnes 10:15' },
        { text: 'Přečíst knihu', prio: 'low', done: true, time: 'Včera' },
    ];
}

// ── Pomocná funkce pro čas ────────────────────────────

function now() {
    const d = new Date();
    const minuty = String(d.getMinutes()).padStart(2, '0');
    return 'Dnes ' + d.getHours() + ':' + minuty;
}

// ── Render ────────────────────────────────────────────

function render() {
    const done = items.filter(i => i.done).length;
    const pct = items.length ? Math.round(done / items.length * 100) : 0;

    document.getElementById('count').textContent = done + '/' + items.length;
    document.getElementById('pct-label').textContent = pct + '%';
    document.getElementById('line-fill').style.width = pct + '%';

    // Filtrování
    let visible = [...items];
    if (filter === 'done') visible = visible.filter(i => i.done);
    else if (filter !== 'vse') visible = visible.filter(i => i.prio === filter);

    const el = document.getElementById('list');

    if (!visible.length) {
        el.innerHTML = '<div class="empty">Žádné úkoly</div>';
        return;
    }

    el.innerHTML = visible.map(it => {
        const i = items.indexOf(it);
        return `
            <div class="object ${it.done ? 'done-item' : ''}">
                <div class="vertikal v-${it.prio}"></div>
                <div class="square ${it.done ? 'checked' : ''}" onclick="toggle(${i})"></div>
                <div class="object-body">
                    <div class="object-inner">
                        <h4 class="${it.done ? 'done-text' : ''}">${it.text}</h4>
                        <div class="time">${it.time}</div>
                    </div>
                    <span class="badge ${it.prio}">${it.prio}</span>
                    <button class="del-btn" onclick="remove(${i})">🗑</button>
                </div>
            </div>
        `;
    }).join('');
}

// ── Přidat úkol ───────────────────────────────────────

function add() {
    const hodnota = document.getElementById('inp').value.trim();
    if (!hodnota) return;
    items.unshift({ text: hodnota, prio: prio, done: false, time: now() });
    document.getElementById('inp').value = '';
    uloz();
    render();
}

// ── Přepnout hotovo ───────────────────────────────────

function toggle(i) {
    items[i].done = !items[i].done;
    uloz();
    render();
}

// ── Smazat úkol ───────────────────────────────────────

function remove(i) {
    items.splice(i, 1);
    uloz();
    render();
}

// ── Nastavit prioritu ─────────────────────────────────

function setPrio(p, btn) {
    prio = p;
    document.querySelectorAll('.btn-prio').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// ── Nastavit filtr ────────────────────────────────────

function setFilter(f, btn) {
    filter = f;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
}

// ── Enter pro přidání ─────────────────────────────────

document.getElementById('inp').addEventListener('keydown', e => {
    if (e.key === 'Enter') add();
});

// ── Spuštění ──────────────────────────────────────────

nacti();
render();