import {getUserList} from './components/UserList.js';

const app = document.getElementById('app');
const money = new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' });
const USERS_KEY = 'abarrotesUsers';
const SESSION_KEY = 'abarrotesSession';
const REPORTS_KEY = 'ventasGuardadas';

let currentUser = getCurrentUser();

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

function readStorage(key, fallback = []) {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
}

function writeStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function createAdminCode(name) {
    const cleanName = name.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4) || 'ADMIN';
    return `${cleanName}-${Date.now().toString().slice(-4)}`;
}

function getCurrentUser() {
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) return null;

    return readStorage(USERS_KEY).find(user => String(user.id) === String(sessionId)) || null;
}

function getAllowedViews() {
    if (!currentUser) return [];
    return currentUser.role === 'admin'
        ? ['home', 'products', 'inventory', 'sales', 'user']
        : ['sales'];
}

function isAllowedView(view) {
    return getAllowedViews().includes(view);
}

function getDefaultView() {
    return currentUser?.role === 'trabajador' ? 'sales' : 'home';
}

function setSession(user) {
    localStorage.setItem(SESSION_KEY, user.id);
    currentUser = user;
}

function clearSession() {
    localStorage.removeItem(SESSION_KEY);
    currentUser = null;
}

function updateShell() {
    document.body.classList.toggle('is-auth', !currentUser);
    const allowedViews = new Set(getAllowedViews());

    document.querySelectorAll('.nav-link, .side-link').forEach(link => {
        const view = link.dataset.view;
        link.classList.toggle('is-hidden', Boolean(currentUser) && !allowedViews.has(view));
    });

    const sessionLabel = document.querySelector('[data-session-label]');
    if (sessionLabel && currentUser) {
        sessionLabel.textContent = currentUser.role === 'admin'
            ? `${currentUser.name} - Administrador (${currentUser.adminCode})`
            : `${currentUser.name} - Trabajador`;
    }
}

function renderAuthView() {
    updateShell();
    app.innerHTML = `
        <section class="hero-panel">
            <div>
                <p class="eyebrow">Acceso al sistema</p>
                <h1>Inventario de Abarrotes</h1>
                <p class="hero-copy">Crea una cuenta como administrador o trabajador. El trabajador debe usar el codigo del administrador para quedar vinculado.</p>
            </div>
            <div class="hero-card">
                <span>Roles</span>
                <strong>Admin / Trabajador</strong>
                <small>Permisos separados</small>
            </div>
        </section>

        <section class="auth-layout">
            <article class="work-panel">
                <div class="panel-heading">
                    <div>
                        <p class="eyebrow">Registro</p>
                        <h2>Crear cuenta</h2>
                    </div>
                </div>
                <form class="auth-form" data-register-form>
                    <label>Nombre
                        <input name="name" type="text" required>
                    </label>
                    <label>Email
                        <input name="email" type="email" required>
                    </label>
                    <label>Contrasena
                        <input name="password" type="password" required minlength="4">
                    </label>
                    <label>Tipo de cuenta
                        <select name="role" data-role-select>
                            <option value="admin">Administrador</option>
                            <option value="trabajador">Trabajador</option>
                        </select>
                    </label>
                    <label data-admin-code-field>Codigo del administrador
                        <input name="adminCode" type="text" placeholder="Ej: JUAN-1234">
                    </label>
                    <button class="primary-action" type="submit">Registrarse</button>
                    <p class="auth-message" data-register-message></p>
                </form>
            </article>

            <article class="work-panel">
                <div class="panel-heading">
                    <div>
                        <p class="eyebrow">Ingreso</p>
                        <h2>Iniciar sesion</h2>
                    </div>
                </div>
                <form class="auth-form" data-login-form>
                    <label>Email
                        <input name="email" type="email" required>
                    </label>
                    <label>Contrasena
                        <input name="password" type="password" required>
                    </label>
                    <button class="secondary-action" type="submit">Entrar</button>
                    <p class="auth-message" data-login-message></p>
                </form>
            </article>
        </section>
    `;

    initAuthView();
}

function initAuthView() {
    const registerForm = document.querySelector('[data-register-form]');
    const loginForm = document.querySelector('[data-login-form]');
    const roleSelect = document.querySelector('[data-role-select]');
    const adminCodeField = document.querySelector('[data-admin-code-field]');
    const registerMessage = document.querySelector('[data-register-message]');
    const loginMessage = document.querySelector('[data-login-message]');

    const toggleAdminCode = () => {
        adminCodeField.classList.toggle('is-hidden', roleSelect.value === 'admin');
    };

    roleSelect.addEventListener('change', toggleAdminCode);
    toggleAdminCode();

    registerForm.addEventListener('submit', async event => {
        event.preventDefault();
        const data = new FormData(registerForm);
        const users = readStorage(USERS_KEY);
        const email = data.get('email').toString().trim().toLowerCase();
        const role = data.get('role').toString();
        const adminCode = data.get('adminCode').toString().trim().toUpperCase();

        if (users.some(user => user.email === email)) {
            registerMessage.textContent = 'Ese email ya esta registrado.';
            return;
        }

        if (role === 'trabajador' && !users.some(user => user.role === 'admin' && user.adminCode === adminCode)) {
            registerMessage.textContent = 'El codigo del administrador no existe.';
            return;
        }

        const user = {
            id: Date.now(),
            name: data.get('name').toString().trim(),
            email,
            password: data.get('password').toString(),
            role,
            adminCode: role === 'admin' ? createAdminCode(data.get('name').toString()) : adminCode,
        };

        users.push(user);
        writeStorage(USERS_KEY, users);
        setSession(user);
        updateShell();
        await navigateTo(getDefaultView());
    });

    loginForm.addEventListener('submit', async event => {
        event.preventDefault();
        const data = new FormData(loginForm);
        const email = data.get('email').toString().trim().toLowerCase();
        const password = data.get('password').toString();
        const user = readStorage(USERS_KEY).find(item => item.email === email && item.password === password);

        if (!user) {
            loginMessage.textContent = 'Email o contrasena incorrectos.';
            return;
        }

        setSession(user);
        updateShell();
        await navigateTo(getDefaultView());
    });
}

function statusLabel(stock) {
    return stock > 0 ? `Disponible: ${stock}` : 'Agotado';
}

function updateHomeSummary() {
    const homeSaleCount = document.querySelector('[data-home-sale-count]');
    const homeIncome = document.querySelector('[data-home-income]');
    const income = sales.reduce((total, sale) => total + sale.total, 0);

    if (homeSaleCount) {
        homeSaleCount.textContent = sales.length;
    }

    if (homeIncome) {
        homeIncome.textContent = money.format(income);
    }
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

function showSalesMessage(messageElement, text) {
    if (!messageElement) return;

    messageElement.textContent = text;
    messageElement.classList.add('is-visible');
}

function renderEmptySalesLog(log) {
    if (!log) return;

    log.innerHTML = `
        <article class="sale-log-item muted">
            <span>--:--</span>
            <strong>Sin ventas registradas</strong>
            <em>Bs 0.00</em>
        </article>
    `;
}

function downloadDailySales(report) {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ventas-${report.fecha}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
}

function saveDailySales(log, message) {
    if (!sales.length) {
        showSalesMessage(message, 'No hay ventas registradas para guardar.');
        return;
    }

    const now = new Date();
    const report = {
        id: now.getTime(),
        fecha: now.toISOString().slice(0, 10),
        guardado: now.toLocaleString('es-BO'),
        trabajador: currentUser?.name || 'Sin usuario',
        trabajadorId: currentUser?.id || null,
        adminCode: currentUser?.adminCode || null,
        total: sales.reduce((sum, sale) => sum + sale.total, 0),
        cantidadVentas: sales.length,
        ventas: sales.map(sale => ({
            hora: sale.time.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' }),
            productos: sale.names,
            total: sale.total,
        })),
    };

    const savedReports = readStorage(REPORTS_KEY);
    savedReports.push(report);
    writeStorage(REPORTS_KEY, savedReports);
    downloadDailySales(report);

    sales.length = 0;
    renderEmptySalesLog(log);
    updateSalesSummary();
    renderSalesProducts();
    showSalesMessage(message, 'Ventas guardadas. El registro quedo listo para el proximo dia.');
}

function renderAdminReports() {
    const container = document.querySelector('[data-admin-reports]');
    if (!container || !currentUser) return;

    const reports = readStorage(REPORTS_KEY)
        .filter(report => currentUser.role === 'admin' && report.adminCode === currentUser.adminCode)
        .sort((a, b) => b.id - a.id);

    if (!reports.length) {
        container.innerHTML = '<tr><td colspan="4">Sin cierres guardados</td></tr>';
        return;
    }

    container.innerHTML = reports.map(report => `
        <tr>
            <td>${report.guardado}</td>
            <td>${report.trabajador}</td>
            <td>${report.cantidadVentas}</td>
            <td>${money.format(report.total)}</td>
        </tr>
    `).join('');
}

function initSalesView() {
    renderSalesProducts();
    updateSalesSummary();
    const form = document.querySelector('[data-sales-form]');
    const log = document.querySelector('[data-sales-log]');
    const message = document.querySelector('[data-sale-message]');
    const saveDayButton = document.querySelector('[data-save-day]');
    if (!form || !log) return;

    form.addEventListener('submit', event => {
        event.preventDefault();
        const selected = [...form.querySelectorAll('input[type="checkbox"]:checked')].map(input => Number(input.value));
        if (!selected.length) {
            showSalesMessage(message, 'Seleccione al menos un producto disponible.');
            return;
        }

        const soldProducts = selected.map(id => products.find(product => product.id === id)).filter(Boolean);
        soldProducts.forEach(product => product.stock = Math.max(product.stock - 1, 0));
        const total = soldProducts.reduce((sum, product) => sum + product.price, 0);
        const time = new Date();
        sales.unshift({ total, names: soldProducts.map(product => product.name), time });

        showSalesMessage(message, `Venta realizada correctamente. Total: ${money.format(total)}.`);
        if (log.querySelector('.muted')) {
            log.innerHTML = '';
        }
        log.insertAdjacentHTML('afterbegin', `
            <article class="sale-log-item">
                <span>${time.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}</span>
                <strong>${soldProducts.map(product => product.name).join(', ')}</strong>
                <em>${money.format(total)}</em>
            </article>
        `);
        form.reset();
        renderSalesProducts();
        updateSalesSummary();
    });

    saveDayButton?.addEventListener('click', () => saveDailySales(log, message));
}

const views = {
    home: async () => {
        const res = await fetch('./src/views/home.html');
        app.innerHTML = await res.text();
        updateHomeSummary();
    },
    user: async () => {
        const res = await fetch('./src/views/user.html');
        app.innerHTML = await res.text();
        await getUserList();
        renderAdminReports();
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

async function navigateTo(view) {
    if (!currentUser) {
        renderAuthView();
        return;
    }

    const targetView = isAllowedView(view) ? view : getDefaultView();
    if (views[targetView]) {
        await views[targetView]();
        document.querySelectorAll('.nav-link, .side-link').forEach(item => {
            item.classList.toggle('active', item.dataset.view === targetView);
        });
    }
}

document.addEventListener('click', async (event) => {
    const logoutButton = event.target.closest('[data-logout]');
    if (logoutButton) {
        clearSession();
        renderAuthView();
        return;
    }

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
    await navigateTo(view);
});

if (currentUser) {
    updateShell();
    navigateTo(getDefaultView());
} else {
    renderAuthView();
}
