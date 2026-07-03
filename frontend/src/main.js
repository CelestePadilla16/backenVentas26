import {getUserList} from './components/UserList.js';

const app = document.getElementById('app');
const money = new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' });

const products = [
    {
        id: 1,
        name: 'Arroz grano largo',
        category: 'Granos',
        price: 7.5,
        stock: 28,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
        description: 'Arroz seleccionado para venta por kilo o bolsa familiar.',
    },
    {
        id: 2,
        name: 'Aceite vegetal',
        category: 'Cocina',
        price: 13,
        stock: 14,
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
        description: 'Aceite de cocina de uso diario, botella sellada de 900 ml.',
    },
    {
        id: 3,
        name: 'Azucar blanca',
        category: 'Basicos',
        price: 6,
        stock: 6,
        image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=800&q=80',
        description: 'Azucar blanca granulada para consumo familiar y reposteria.',
    },
    {
        id: 4,
        name: 'Fideo tallarin',
        category: 'Pastas',
        price: 5.5,
        stock: 21,
        image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=800&q=80',
        description: 'Fideo seco tipo tallarin, paquete para comidas rapidas.',
    },
    {
        id: 5,
        name: 'Leche evaporada',
        category: 'Lacteos',
        price: 8,
        stock: 0,
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80',
        description: 'Lata de leche evaporada. Producto temporalmente agotado.',
    },
    {
        id: 6,
        name: 'Galletas surtidas',
        category: 'Snacks',
        price: 4,
        stock: 35,
        image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80',
        description: 'Galletas dulces para venta individual o por paquete.',
    },
];

const sales = [];

function statusLabel(stock) {
    return stock > 0 ? `Disponible: ${stock}` : 'Agotado';
}

function renderProductCards(list = products) {
    const grid = document.querySelector('[data-product-grid]');
    if (!grid) return;

    grid.innerHTML = list.map(product => `
        <button class="product-card" type="button" data-product-id="${product.id}">
            <img src="${product.image}" alt="${product.name}">
            <span class="stock-badge ${product.stock === 0 ? 'is-empty' : ''}">${statusLabel(product.stock)}</span>
            <strong>${product.name}</strong>
            <small>${product.category}</small>
            <span class="price">${money.format(product.price)}</span>
        </button>
    `).join('');
}

function showProductDetail(product) {
    const detail = document.querySelector('[data-product-detail]');
    if (!detail || !product) return;

    detail.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div>
            <p class="eyebrow">${product.category}</p>
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <div class="detail-row">
                <strong>${money.format(product.price)}</strong>
                <span class="${product.stock === 0 ? 'text-danger' : 'text-ok'}">${statusLabel(product.stock)}</span>
            </div>
        </div>
    `;
}

function initProductsView() {
    renderProductCards();
    showProductDetail(products[0]);

    document.querySelector('[data-product-search]')?.addEventListener('input', event => {
        const query = event.target.value.trim().toLowerCase();
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );
        renderProductCards(filtered);
        showProductDetail(filtered[0]);
    });
}

function initInventoryView() {
    const form = document.querySelector('[data-product-form]');
    const preview = document.querySelector('[data-photo-preview]');
    const list = document.querySelector('[data-published-list]');
    const fileInput = document.querySelector('[data-photo-input]');
    if (!form || !list) return;

    fileInput?.addEventListener('change', event => {
        const file = event.target.files?.[0];
        if (file && preview) {
            preview.src = URL.createObjectURL(file);
            preview.hidden = false;
        }
    });

    form.addEventListener('submit', event => {
        event.preventDefault();
        const data = new FormData(form);
        const image = preview?.src && !preview.hidden ? preview.src : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';
        const product = {
            id: Date.now(),
            name: data.get('name').toString(),
            category: data.get('category').toString(),
            price: Number(data.get('price')),
            stock: Number(data.get('stock')),
            image,
            description: data.get('description').toString(),
        };
        products.unshift(product);
        list.insertAdjacentHTML('afterbegin', `
            <article class="published-item">
                <img src="${product.image}" alt="${product.name}">
                <div>
                    <strong>${product.name}</strong>
                    <span>${product.category} - ${money.format(product.price)} - ${statusLabel(product.stock)}</span>
                    <p>${product.description}</p>
                </div>
            </article>
        `);
        form.reset();
        if (preview) {
            preview.hidden = true;
            preview.removeAttribute('src');
        }
    });
}

function renderSalesProducts() {
    const list = document.querySelector('[data-sale-products]');
    if (!list) return;
    list.innerHTML = products.map(product => `
        <label class="sale-option">
            <input type="checkbox" value="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>
            <span>
                <strong>${product.name}</strong>
                <small>${money.format(product.price)} - ${statusLabel(product.stock)}</small>
            </span>
        </label>
    `).join('');
}

function updateSalesSummary() {
    const income = sales.reduce((total, sale) => total + sale.total, 0);
    const goal = 1500;
    const percent = Math.min(Math.round((income / goal) * 100), 100);
    document.querySelector('[data-daily-income]').textContent = money.format(income);
    document.querySelector('[data-sale-count]').textContent = sales.length;
    document.querySelector('[data-income-percent]').textContent = `${percent}%`;
    document.querySelector('[data-income-bar]').style.width = `${percent}%`;
}

function initSalesView() {
    renderSalesProducts();
    updateSalesSummary();
    const form = document.querySelector('[data-sales-form]');
    const log = document.querySelector('[data-sales-log]');
    const message = document.querySelector('[data-sale-message]');
    if (!form || !log) return;

    form.addEventListener('submit', event => {
        event.preventDefault();
        const selected = [...form.querySelectorAll('input[type="checkbox"]:checked')].map(input => Number(input.value));
        if (!selected.length) {
            message.textContent = 'Seleccione al menos un producto disponible.';
            message.classList.add('is-visible');
            return;
        }

        const soldProducts = selected.map(id => products.find(product => product.id === id)).filter(Boolean);
        soldProducts.forEach(product => product.stock = Math.max(product.stock - 1, 0));
        const total = soldProducts.reduce((sum, product) => sum + product.price, 0);
        sales.unshift({ total, names: soldProducts.map(product => product.name), time: new Date() });

        message.textContent = `Venta realizada correctamente. Total: ${money.format(total)}.`;
        message.classList.add('is-visible');
        log.insertAdjacentHTML('afterbegin', `
            <article class="sale-log-item">
                <span>${new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}</span>
                <strong>${soldProducts.map(product => product.name).join(', ')}</strong>
                <em>${money.format(total)}</em>
            </article>
        `);
        renderSalesProducts();
        updateSalesSummary();
    });
}

const views = {
    home: async () => {
        const res = await fetch('./src/views/home.html');
        app.innerHTML = await res.text();
    },
    user: async () => {
        const res = await fetch('./src/views/user.html');
        app.innerHTML = await res.text();
        await getUserList();
    },
    products: async () => {
        const res = await fetch('./src/views/products.html');
        app.innerHTML = await res.text();
        initProductsView();
    },
    inventory: async () => {
        const res = await fetch('./src/views/inventory.html');
        app.innerHTML = await res.text();
        initInventoryView();
    },
    sales: async () => {
        const res = await fetch('./src/views/sales.html');
        app.innerHTML = await res.text();
        initSalesView();
    },
    clients: async () => {
        const res = await fetch('./src/views/clients.html');
        app.innerHTML = await res.text();
    },
    orders: async () => {
        const res = await fetch('./src/views/orders.html');
        app.innerHTML = await res.text();
    },
};

document.addEventListener('click', async (event) => {
    const productCard = event.target.closest('[data-product-id]');
    if (productCard) {
        const product = products.find(item => item.id === Number(productCard.dataset.productId));
        showProductDetail(product);
        document.querySelectorAll('.product-card').forEach(card => {
            card.classList.toggle('active', card === productCard);
        });
        return;
    }

    const link = event.target.closest('[data-view]');
    if (!link) {
        return;
    }

    event.preventDefault();
    const view = link.dataset.view;
    if (views[view]) {
        await views[view]();
        document.querySelectorAll('.nav-link').forEach(item => {
            item.classList.toggle('active', item.dataset.view === view);
        });
    }
});

views.home();
