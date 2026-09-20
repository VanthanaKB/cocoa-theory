/* =========================================================
   Cocoa Theory — script.js
   Menu data, category filtering, and cart logic
========================================================= */

// ---------- MENU DATA ----------
// icon = a simple emoji placeholder. Swap for a real photo by
// changing the item-media <div> in renderMenu() to an <img>.
const MENU = [
  // Brownies
  { id:'b1', name:'Chocolate Brownie', category:'brownies', price:180, image:'chocolate-brownie.jpg',
    desc:'Our classic, dense and fudgy. Add a scoop of vanilla ice cream for ₹50.' },
  { id:'b2', name:'Double Chocolate Brownie', category:'brownies', price:190, image:'double-chocolate-brownie.jpg',
    desc:'Chocolate batter, chocolate chunks. Add a scoop of vanilla ice cream for ₹50.' },
  { id:'b3', name:'Nutella Brownie', category:'brownies', price:200, image:'nutella-brownie.jpg',
    desc:'Swirled through with Nutella. Add a scoop of vanilla ice cream for ₹50.' },
  { id:'b4', name:'Peanut Butter Brownie', category:'brownies', price:200, image:'peanut-butter-brownie.jpg',
    desc:'Salty-sweet peanut butter ribboned through. Add a scoop of vanilla ice cream for ₹50.' },

  // Cakes & Pastry
  { id:'c1', name:'Dream Cake', category:'cakes', price:300, image:'dream-cake.jpg',
    desc:'Five layers of chocolate cake, mousse, and ganache, dusted with cocoa. Small box ₹300 / Medium box ₹500.' },
  { id:'c2', name:'Chocolate Pastry', category:'cakes', price:250, image:'chocolate-pastry.jpg',
    desc:'A neat single slice, rich and not too sweet.' },
  { id:'c3', name:'Chocolate Lava Cake', category:'cakes', price:150, image:'chocolate-lava-cake.jpg',
    desc:'Warm, with a molten centre. Best eaten the moment it arrives.' },
  { id:'c4', name:'Chocolate Truffle Pastry', category:'cakes', price:250, image:'chocolate-truffle-pastry.jpg',
    desc:'Layered truffle cream over soft chocolate sponge.' },

  // Cold & Frozen
  { id:'f1', name:'Chocolate Ice Cream Cone', category:'cold', price:100, image:'chocolate-ice-cream-cone.jpg',
    desc:'A classic cone, made properly.' },
  { id:'f2', name:'Belgian Chocolate Ice Cream Scoop', category:'cold', price:90, image:'belgian-chocolate-ice-cream-scoop.jpg',
    desc:'One generous scoop of Belgian chocolate.' },
  { id:'f3', name:'Cookie & Ice Cream Sandwich', category:'cold', price:115, image:'cookie-and-ice-cream-sandwich.jpg',
    desc:'A scoop pressed between two warm chocolate cookies.' },

  // Shakes & Drinks
  { id:'s1', name:'Nutella Thick Shake', category:'shakes', price:240, image:'nutella-thick-shake.jpg',
    desc:'Thick, cold, and properly Nutella-forward.' },
  { id:'s2', name:'Chocolate Thick Shake', category:'shakes', price:220, image:'chocolate-thick-shake.jpg',
    desc:'Our classic shake, no shortcuts.' },
  { id:'s3', name:'Belgian Chocolate Milkshake', category:'shakes', price:180, image:'belgian-chocolate-milkshake.jpg',
    desc:'Made with real Belgian chocolate.' },
  { id:'s4', name:'Cocoa Boba Milk Tea', category:'shakes', price:280, image:'cocoa-boba-milk-tea.jpg',
    desc:'Milk tea with a cocoa base and chewy boba pearls.' },
  { id:'s5', name:'Classic Hot Chocolate', category:'shakes', price:200, image:'classic-hot-chocolate.jpg',
    desc:'Rich, warm, and unapologetically simple.' },

  // Classics & Trending
  { id:'t1', name:'Chocolate Cheesecake', category:'classics', price:300, image:'chocolate-cheesecake.jpg',
    desc:'Dense and creamy, with a chocolate biscuit base.' },
  { id:'t2', name:'Tiramisu', category:'classics', price:350, image:'tiramisu.jpg',
    desc:'Coffee-soaked layers with a cocoa dusted top.' },
  { id:'t3', name:'Dubai Chocolate Bar', category:'classics', price:350, image:'dubai-chocolate-bar.jpg',
    desc:'Pistachio and knafeh filling wrapped in chocolate, the viral favourite.' },
  { id:'t4', name:'Dubai Chocolate Tart', category:'classics', price:280, image:'dubai-chocolate-tart.jpg',
    desc:'The same pistachio-knafeh filling, in tart form.' },
  { id:'t5', name:'Chocolate Covered Strawberries', category:'classics', price:400, image:'chocolate-covered-strawberries.jpg',
    desc:'200g of fresh strawberries, hand-dipped in chocolate.' },
  { id:'t6', name:"S'mores Brownie", category:'classics', price:280, image:'s-mores-brownie.jpg',
    desc:'Toasted marshmallow and graham crumble over a fudgy brownie.' },
  { id:'t7', name:'Chocolate Stuffed Cookie', category:'classics', price:200, image:'chocolate-stuffed-cookie.jpg',
    desc:'Two to three cookies, stuffed with a molten chocolate centre.' },
  { id:'t8', name:'Belgian Chocolate Bar', category:'classics', price:200, image:'belgian-chocolate-bar.jpg',
    desc:'A straightforward bar of Belgian chocolate, done right.' },
];

// ---------- STATE ----------
let cart = {}; // { id: qty }
let activeCategory = 'all';

// ---------- DOM refs ----------
const menuGrid = document.getElementById('menuGrid');
const tabs = document.querySelectorAll('.tab');
const cartToggle = document.getElementById('cartToggle');
const cartClose = document.getElementById('cartClose');
const cartOverlay = document.getElementById('cartOverlay');
const cartDrawer = document.getElementById('cartDrawer');
const cartItemsEl = document.getElementById('cartItems');
const cartEmptyEl = document.getElementById('cartEmpty');
const cartTotalEl = document.getElementById('cartTotal');
const cartCountEl = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const toastEl = document.getElementById('toast');
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

// ---------- RENDER MENU ----------
function renderMenu(){
  const items = activeCategory === 'all'
    ? MENU
    : MENU.filter(i => i.category === activeCategory);

  menuGrid.innerHTML = items.map(item => `
    <article class="item-card">
      <div class="item-media"><img src="${item.image}" alt="${item.name}"></div>
      <div class="item-body">
        <h3>${item.name}</h3>
        <p class="desc">${item.desc}</p>
        <div class="item-footer">
          <span class="price">₹${item.price}</span>
          <button class="add-btn" data-id="${item.id}" aria-label="Add ${item.name} to cart">+</button>
        </div>
      </div>
    </article>
  `).join('');
}

// ---------- TABS ----------
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeCategory = tab.dataset.category;
    renderMenu();
  });
});

// ---------- ADD TO CART (event delegation) ----------
menuGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('.add-btn');
  if(!btn) return;
  const id = btn.dataset.id;
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  showToast(`${MENU.find(i => i.id === id).name} added`);
});

// ---------- CART RENDER ----------
function renderCart(){
  const ids = Object.keys(cart).filter(id => cart[id] > 0);

  cartCountEl.textContent = ids.reduce((sum, id) => sum + cart[id], 0);

  if(ids.length === 0){
    cartItemsEl.innerHTML = '';
    cartEmptyEl.style.display = 'block';
    cartItemsEl.appendChild(cartEmptyEl);
    cartTotalEl.textContent = '₹0';
    return;
  }

  cartEmptyEl.style.display = 'none';
  let total = 0;

  cartItemsEl.innerHTML = ids.map(id => {
    const item = MENU.find(i => i.id === id);
    const qty = cart[id];
    total += item.price * qty;
    return `
      <div class="cart-row">
        <div class="cr-icon">${item.icon}</div>
        <div class="cr-info">
          <div class="name">${item.name}</div>
          <div class="unit">₹${item.price} each</div>
        </div>
        <div class="cr-qty">
          <button data-action="dec" data-id="${id}" aria-label="Decrease quantity">&minus;</button>
          <span>${qty}</span>
          <button data-action="inc" data-id="${id}" aria-label="Increase quantity">+</button>
        </div>
      </div>
    `;
  }).join('');

  cartTotalEl.textContent = `₹${total}`;
}

cartItemsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if(!btn) return;
  const id = btn.dataset.id;
  if(btn.dataset.action === 'inc') cart[id]++;
  if(btn.dataset.action === 'dec') {
    cart[id]--;
    if(cart[id] <= 0) delete cart[id];
  }
  renderCart();
});

// ---------- CART DRAWER OPEN/CLOSE ----------
function openCart(){
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
}
function closeCart(){
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
}
cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// ---------- CHECKOUT (demo only) ----------
checkoutBtn.addEventListener('click', () => {
  const ids = Object.keys(cart).filter(id => cart[id] > 0);
  if(ids.length === 0){
    showToast('Your cart is empty');
    return;
  }
  showToast('Checkout is a demo — wire this up to your backend');
});

// ---------- TOAST ----------
let toastTimer;
function showToast(msg){
  clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1800);
}

// ---------- MOBILE NAV ----------
navToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});
mainNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mainNav.classList.remove('open'));
});

// ---------- INIT ----------
document.getElementById('year').textContent = new Date().getFullYear();
renderMenu();
renderCart();
