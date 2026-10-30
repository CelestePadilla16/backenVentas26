import {getUserList} from './components/UserList.js';

const app = document.getElementById('app');
const money = new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' });
const USERS_KEY = 'abarrotesUsers';
const SESSION_KEY = 'abarrotesSession';
const REPORTS_KEY = 'ventasGuardadas';
const PRODUCTS_KEY = 'abarrotesProducts';
const SALES_KEY = 'abarrotesSales';
const ACTIVITY_KEY = 'abarrotesActivity';
const LOGIN_RESET_FLAG = 'abarrotesLoginReset';

function clearStoredLoginData() {
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(SESSION_KEY);
}

function resetLoginDataOnce() {
    if (localStorage.getItem(LOGIN_RESET_FLAG) === 'done') return;
    clearStoredLoginData();
    localStorage.setItem(LOGIN_RESET_FLAG, 'done');
}

resetLoginDataOnce();

let currentUser = getCurrentUser();

const defaultProducts = [
    {
        id: 1,
        name: 'Arroz blanco',
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
        image: './src/assets/azucar.svg',
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

const products = readStorage(PRODUCTS_KEY, defaultProducts);

if (!localStorage.getItem(PRODUCTS_KEY)) {
    writeStorage(PRODUCTS_KEY, products);
}

const sales = [];

function readStorage(key, fallback = []) {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
}

function writeStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function saveProducts() {
    writeStorage(PRODUCTS_KEY, products);
}

function logActivity(tipo, detalle, extra = {}) {
    const activity = readStorage(ACTIVITY_KEY);
    activity.push({
        id: Date.now() + Math.random(),
        fecha: new Date().toLocaleString('es-BO'),
        tipo,
        detalle,
        usuario: currentUser?.name || 'Sin usuario',
        usuarioId: currentUser?.id || null,
        rol: currentUser?.role || null,
        adminCode: currentUser?.adminCode || null,
        ...extra,
    });
    writeStorage(ACTIVITY_KEY, activity);
}

function saveSale(soldProducts, total, time) {
    const history = readStorage(SALES_KEY);
    history.push({
        id: time.getTime(),
        fecha: time.toISOString().slice(0, 10),
        hora: time.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' }),
        trabajador: currentUser?.name || 'Sin usuario',
        trabajadorId: currentUser?.id || null,
        adminCode: currentUser?.adminCode || null,
        productos: soldProducts.map(product => ({ id: product.id, nombre: product.name, precio: product.price })),
        total,
    });
    writeStorage(SALES_KEY, history);
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
        <div class="auth-shell">
            <section class="auth-hero">
                <span class="auth-orb auth-orb-a"></span>
                <span class="auth-orb auth-orb-b"></span>
                <span class="auth-orb auth-orb-c"></span>

                <div class="auth-hero-body">
                    <span class="auth-badge">Acceso al sistema</span>
                    <h1>Inventario de <em>Abarrotes</em></h1>
                    <p class="auth-hero-copy">Administra tus productos, controla el inventario y registra las ventas del dia desde un solo lugar.</p>

                    <ul class="auth-features">
                        <li>Control de productos y stock en tiempo real</li>
                        <li>Registro de ventas por trabajador</li>
                        <li>Reportes y cierres por administrador</li>
                    </ul>

                    <div class="auth-roles">
                        <span class="auth-role-pill">
                            <strong>Administrador</strong>
                            <small>Control total</small>
                        </span>
                        <span class="auth-role-pill">
                            <strong>Trabajador</strong>
                            <small>Solo ventas</small>
                        </span>
                    </div>
                </div>
            </section>

            <section class="auth-card">
                <article class="auth-panel" data-login-panel>
                    <header class="auth-panel-head">
                        <span class="auth-panel-icon">
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </span>
                        <div>
                            <p class="eyebrow">Ingreso</p>
                            <h2>Iniciar sesion</h2>
                        </div>
                    </header>
                    <p class="auth-panel-sub">Ingresa con tu correo y contrasena para continuar.</p>
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
                    <p class="auth-switch">
                        Aun no tienes cuenta?
                        <button type="button" data-show-register>Registrate</button>
                    </p>
                </article>

                <article class="auth-panel is-hidden" data-register-panel>
                    <header class="auth-panel-head">
                        <span class="auth-panel-icon">
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M19 8v6"></path>
                                <path d="M22 11h-6"></path>
                            </svg>
                        </span>
                        <div>
                            <p class="eyebrow">Registro</p>
                            <h2>Crear cuenta</h2>
                        </div>
                    </header>
                    <p class="auth-panel-sub">Completa tus datos y elige el tipo de cuenta.</p>
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
                    <p class="auth-switch">
                        Ya tienes cuenta?
                        <button type="button" data-show-login>Inicia sesion</button>
                    </p>
                </article>
            </section>
        </div>
    `;

    initAuthView();
}

function initAuthView() {
    const registerForm = document.querySelector('[data-register-form]');
    const loginForm = document.querySelector('[data-login-form]');
    const loginPanel = document.querySelector('[data-login-panel]');
    const registerPanel = document.querySelector('[data-register-panel]');
    const showRegisterButton = document.querySelector('[data-show-register]');
    const showLoginButton = document.querySelector('[data-show-login]');
    const roleSelect = document.querySelector('[data-role-select]');
    const adminCodeField = document.querySelector('[data-admin-code-field]');
    const registerMessage = document.querySelector('[data-register-message]');
    const loginMessage = document.querySelector('[data-login-message]');

    const toggleAdminCode = () => {
        adminCodeField.classList.toggle('is-hidden', roleSelect.value === 'admin');
    };

    roleSelect.addEventListener('change', toggleAdminCode);
    toggleAdminCode();

    showRegisterButton.addEventListener('click', () => {
        loginPanel.classList.add('is-hidden');
        registerPanel.classList.remove('is-hidden');
    });

    showLoginButton.addEventListener('click', () => {
        registerPanel.classList.add('is-hidden');
        loginPanel.classList.remove('is-hidden');
    });

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

function productCreateForm() {
    return `
        <form class="product-create is-hidden" data-product-create>
            <p class="eyebrow">Nuevo producto</p>
            <label>Nombre
                <input name="name" type="text" required>
            </label>
            <label>Categoria
                <input name="category" type="text" required>
            </label>
            <label>Precio
                <input name="price" type="number" step="0.01" min="0" required>
            </label>
            <label>Stock
                <input name="stock" type="number" min="0" required>
            </label>
            <label>Descripcion
                <input name="description" type="text" required>
            </label>
            <label>Imagen (URL)
                <input name="image" type="url" placeholder="Opcional">
            </label>
            <button class="primary-action" type="submit">Guardar producto</button>
            <p class="auth-message" data-create-message></p>
        </form>
    `;
}

function showProductDetail(product) {
    const detail = document.querySelector('[data-product-detail]');
    if (!detail) return;

    if (!product) {
        detail.innerHTML = `
            <div>
                <p class="eyebrow">Catalogo</p>
                <h2>Sin productos</h2>
                <p>No hay productos en el catalogo. Crea uno nuevo para empezar.</p>
                <div class="product-actions">
                    <button class="primary-action" type="button" data-add-product>Agregar producto</button>
                </div>
                ${productCreateForm()}
            </div>
        `;
        return;
    }

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
            <div class="product-actions">
                <button class="primary-action" type="button" data-add-product="${product.id}">Agregar producto</button>
                <button class="danger-action" type="button" data-delete-id="${product.id}">Eliminar producto</button>
            </div>
            ${productCreateForm()}
        </div>
    `;
}

function initProductsView() {
    renderProductCards();
    showProductDetail(products[0]);

    const detail = document.querySelector('[data-product-detail]');
    const search = document.querySelector('[data-product-search]');
    const saveButton = document.querySelector('[data-save-products]');
    const productsMessage = document.querySelector('[data-products-message]');

    saveButton?.addEventListener('click', () => {
        saveProducts();
        showSalesMessage(productsMessage, 'Cambios guardados correctamente.');
    });

    search?.addEventListener('input', event => {
        const query = event.target.value.trim().toLowerCase();
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );
        renderProductCards(filtered);
        showProductDetail(filtered[0]);
    });

    detail?.addEventListener('click', event => {
        const addButton = event.target.closest('[data-add-product]');
        if (addButton) {
            const productId = addButton.dataset.addProduct;
            if (!productId) {
                detail.querySelector('[data-product-create]')?.classList.toggle('is-hidden');
                return;
            }

            const product = products.find(item => item.id === Number(productId));
            if (!product) return;

            product.stock += 1;
            saveProducts();
            logActivity('Aumento de cantidad', `${product.name}: ${product.stock} unidades`);
            const query = search?.value.trim().toLowerCase() || '';
            const filtered = query
                ? products.filter(item =>
                    item.name.toLowerCase().includes(query) ||
                    item.category.toLowerCase().includes(query) ||
                    item.description.toLowerCase().includes(query)
                )
                : products;
            renderProductCards(filtered);
            showProductDetail(product);
            document.querySelectorAll('.product-card').forEach(card => {
                card.classList.toggle('active', Number(card.dataset.productId) === product.id);
            });
            return;
        }

        const deleteButton = event.target.closest('[data-delete-id]');
        if (deleteButton) {
            const id = Number(deleteButton.dataset.deleteId);
            const index = products.findIndex(product => product.id === id);
            if (index === -1) return;
            if (!confirm(`Eliminar "${products[index].name}" del catalogo?`)) return;
            const deletedName = products[index].name;
            products.splice(index, 1);
            saveProducts();
            logActivity('Eliminacion de producto', deletedName);
            renderProductCards();
            showProductDetail(products[0]);
        }
    });

    detail?.addEventListener('submit', event => {
        if (!event.target.matches('[data-product-create]')) return;
        event.preventDefault();
        const data = new FormData(event.target);
        const product = {
            id: Date.now(),
            name: data.get('name').toString().trim(),
            category: data.get('category').toString().trim(),
            price: Number(data.get('price')),
            stock: Number(data.get('stock')),
            image: data.get('image').toString().trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
            description: data.get('description').toString().trim(),
        };
        products.unshift(product);
        saveProducts();
        logActivity('Registro de producto', `${product.name} (${product.stock} unidades)`);
        renderProductCards();
        showProductDetail(product);
        document.querySelectorAll('.product-card').forEach(card => {
            card.classList.toggle('active', Number(card.dataset.productId) === product.id);
        });
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
        saveProducts();
        logActivity('Registro de producto', `${product.name} (${product.stock} unidades)`);
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
    logActivity('Cierre de caja', `${report.cantidadVentas} ventas - ${money.format(report.total)}`, { total: report.total });
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

function renderAdminSales() {
    const container = document.querySelector('[data-admin-sales]');
    if (!container || !currentUser) return;

    const history = readStorage(SALES_KEY)
        .filter(sale => currentUser.role === 'admin' && sale.adminCode === currentUser.adminCode)
        .sort((a, b) => b.id - a.id);

    if (!history.length) {
        container.innerHTML = '<tr><td colspan="4">Sin ventas registradas</td></tr>';
        return;
    }

    container.innerHTML = history.map(sale => `
        <tr>
            <td>${sale.fecha} ${sale.hora}</td>
            <td>${sale.trabajador}</td>
            <td>${sale.productos.map(product => product.nombre).join(', ')}</td>
            <td>${money.format(sale.total)}</td>
        </tr>
    `).join('');
}

function renderAdminActivity() {
    const container = document.querySelector('[data-admin-activity]');
    if (!container || !currentUser) return;

    const activity = readStorage(ACTIVITY_KEY)
        .filter(item => currentUser.role === 'admin' && item.adminCode === currentUser.adminCode)
        .sort((a, b) => b.id - a.id);

    if (!activity.length) {
        container.innerHTML = '<tr><td colspan="4">Sin modificaciones registradas</td></tr>';
        return;
    }

    container.innerHTML = activity.map(item => `
        <tr>
            <td>${item.fecha}</td>
            <td>${item.usuario}</td>
            <td>${item.tipo}</td>
            <td>${item.detalle}</td>
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
        saveProducts();
        saveSale(soldProducts, total, time);
        logActivity('Venta', `${soldProducts.map(product => product.name).join(', ')} - ${money.format(total)}`, { total });

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
        renderAdminSales();
        renderAdminActivity();
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
