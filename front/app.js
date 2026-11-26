const app = document.getElementById('app');

// ---------- État ----------
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let token = localStorage.getItem('token');
let promoCode = '';

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  const count = cart.reduce((n, i) => n + i.quantity, 0);
  document.getElementById('cart-count').textContent = count ? `(${count})` : '';
}

function updateNav() {
  document.getElementById('nav-login').hidden = !!token;
  document.getElementById('nav-orders').hidden = !token;
  document.getElementById('nav-logout').hidden = !token;
}

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`/api${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erreur');
  return data;
}

function message(text, type = 'ok') {
  return `<div class="msg ${type}">${text}</div>`;
}

// ---------- Catalogue ----------
async function catalogue(page = 1, search = '') {
  const data = await api(`/products?page=${page}&search=${encodeURIComponent(search)}`);
  app.innerHTML = `
    <h1>Catalogue</h1>
    <form class="search" id="search-form">
      <input id="search" placeholder="Rechercher un produit" value="${search}">
      <button>Rechercher</button>
    </form>
    <div class="grid">
      ${data.products.map(p => `
        <div class="card">
          <h3><a href="#/produit/${p.id}">${p.name}</a></h3>
          <div class="price">${p.price} €</div>
          <div class="stock">${p.stock} en stock</div>
        </div>`).join('')}
    </div>
    <div class="pager">
      <button class="secondary" id="prev" ${page <= 1 ? 'disabled' : ''}>Précédent</button>
      <span>Page ${data.page} / ${data.totalPages}</span>
      <button class="secondary" id="next" ${page >= data.totalPages ? 'disabled' : ''}>Suivant</button>
    </div>`;
  document.getElementById('search-form').onsubmit = e => {
    e.preventDefault();
    catalogue(1, document.getElementById('search').value);
  };
  document.getElementById('prev').onclick = () => catalogue(page - 1, search);
  document.getElementById('next').onclick = () => catalogue(page + 1, search);
}

// ---------- Fiche produit ----------
async function produit(id) {
  const p = await api(`/products/${id}`);
  const paragraphs = p.description.split('\n').map(l => `<p>${l}</p>`).join('');
  app.innerHTML = `
    <a href="#/">← Retour au catalogue</a>
    <h1>${p.name}</h1>
    ${paragraphs}
    <p class="price">${p.price} €</p>
    <p class="stock">${p.stock} en stock · Catégorie : ${p.category}</p>
    <input type="number" id="qty" value="1" min="1" style="width:70px">
    <button id="add">Ajouter au panier</button>
    <div id="feedback"></div>`;
  document.getElementById('add').onclick = () => {
    const quantity = parseInt(document.getElementById('qty').value);
    const line = cart.find(i => i.productId === p.id);
    if (line) line.quantity += quantity;
    else cart.push({ productId: p.id, name: p.name, price: p.price, quantity });
    saveCart();
    document.getElementById('feedback').innerHTML = message('Ajouté au panier');
  };
}

// ---------- Panier ----------
async function panier(feedback = '') {
  if (cart.length === 0) {
    app.innerHTML = `<h1>Panier</h1>${feedback}<p>Votre panier est vide.</p>`;
    return;
  }
  const totals = await api('/cart/total', {
    method: 'POST',
    body: JSON.stringify({ items: cart, promoCode }),
  });
  app.innerHTML = `
    <h1>Panier</h1>
    ${feedback}
    <table>
      <tr><th>Produit</th><th>Prix</th><th>Quantité</th><th></th></tr>
      ${cart.map((i, idx) => `
        <tr>
          <td>${i.name}</td><td>${i.price} €</td><td>${i.quantity}</td>
          <td><button class="secondary" data-remove="${idx}">Retirer</button></td>
        </tr>`).join('')}
    </table>
    <div class="search" style="margin-top:16px">
      <input id="promo" placeholder="Code promo" value="${promoCode}">
      <button class="secondary" id="apply-promo">Appliquer</button>
    </div>
    <div class="totals">
      <div>Sous-total : ${totals.subtotal} €</div>
      <div>Remise : -${totals.discount} €</div>
      <div>Livraison : ${totals.shipping} €</div>
      <div class="total">Total : ${totals.total} €</div>
      <button id="order">Commander</button>
    </div>`;
  document.querySelectorAll('[data-remove]').forEach(b => {
    b.onclick = () => { cart.splice(b.dataset.remove, 1); saveCart(); panier(); };
  });
  document.getElementById('apply-promo').onclick = () => {
    promoCode = document.getElementById('promo').value;
    panier();
  };
  document.getElementById('order').onclick = commander;
}

async function commander() {
  if (!token) { location.hash = '#/connexion'; return; }
  try {
    await api('/orders', {
      method: 'POST',
      body: JSON.stringify({ items: cart, promoCode }),
    });
    cart = [];
    promoCode = '';
    saveCart();
    location.hash = '#/commandes';
  } catch (err) {
    panier(message(err.message, 'err'));
  }
}

// ---------- Connexion ----------
function connexion() {
  app.innerHTML = `
    <h1>Connexion</h1>
    <p class="stock">Compte de test : alice@boutique.test / alice123</p>
    <form id="login-form">
      <p><input id="email" placeholder="Email" size="30"></p>
      <p><input id="password" type="password" placeholder="Mot de passe" size="30"></p>
      <button>Se connecter</button>
    </form>
    <div id="feedback"></div>`;
  document.getElementById('login-form').onsubmit = async e => {
    e.preventDefault();
    try {
      const data = await api('/login', {
        method: 'POST',
        body: JSON.stringify({
          email: document.getElementById('email').value,
          password: document.getElementById('password').value,
        }),
      });
      token = data.token;
      localStorage.setItem('token', token);
      updateNav();
      location.hash = '#/';
    } catch (err) {
      document.getElementById('feedback').innerHTML = message(err.message, 'err');
    }
  };
}

// ---------- Commandes ----------
function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
}

async function commandes() {
  if (!token) { location.hash = '#/connexion'; return; }
  const orders = await api('/orders');
  app.innerHTML = `
    <h1>Mes commandes</h1>
    <table>
      <tr><th>N°</th><th>Date</th><th>Total</th><th>Statut</th><th></th></tr>
      ${orders.map(o => `
        <tr>
          <td>${o.id}</td><td>${formatDate(o.created_at)}</td><td>${o.total} €</td><td>${o.status}</td>
          <td>${o.status === 'confirmee' ? `<button class="secondary" data-cancel="${o.id}">Annuler</button>` : ''}</td>
        </tr>`).join('')}
    </table>`;
  document.querySelectorAll('[data-cancel]').forEach(b => {
    b.onclick = async () => {
      await api(`/orders/${b.dataset.cancel}/cancel`, { method: 'POST' });
      commandes();
    };
  });
}

// ---------- Routeur ----------
async function route() {
  const hash = location.hash || '#/';
  try {
    if (hash === '#/') await catalogue();
    else if (hash.startsWith('#/produit/')) await produit(hash.split('/')[2]);
    else if (hash === '#/panier') await panier();
    else if (hash === '#/connexion') connexion();
    else if (hash === '#/commandes') await commandes();
  } catch (err) {
    console.error(err);
  }
}

document.getElementById('nav-logout').onclick = e => {
  e.preventDefault();
  token = null;
  localStorage.removeItem('token');
  updateNav();
  location.hash = '#/';
};

window.addEventListener('hashchange', route);
saveCart();
updateNav();
route();
