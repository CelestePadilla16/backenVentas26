export const getUserList = async () => {
    const container = document.getElementById('userTableList');
    if (!container) return;

    const users = JSON.parse(localStorage.getItem('abarrotesUsers') || '[]');
    const sessionId = localStorage.getItem('abarrotesSession');
    const currentUser = users.find(user => String(user.id) === String(sessionId));
    const visibleUsers = currentUser?.role === 'admin'
        ? users.filter(user => user.id === currentUser.id || user.adminCode === currentUser.adminCode)
        : users.filter(user => user.id === currentUser?.id);

    if (!visibleUsers.length) {
        container.innerHTML = '<tr><td colspan="5">Sin usuarios registrados</td></tr>';
        return;
    }

    container.innerHTML = visibleUsers.map(user => {
        const canDelete = String(user.id) !== String(currentUser?.id);
        return `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.role === 'admin' ? 'Administrador' : 'Trabajador'}</td>
                <td>${user.adminCode || '-'}</td>
                <td>
                    ${canDelete
                        ? `<button class="danger-action" type="button" data-delete-user="${user.id}">Eliminar</button>`
                        : '<span>-</span>'}
                </td>
            </tr>
        `;
    }).join('');

    if (!container.dataset.deleteBound) {
        container.addEventListener('click', event => {
            const button = event.target.closest('[data-delete-user]');
            if (!button) return;

            const id = button.dataset.deleteUser;
            const storedUsers = JSON.parse(localStorage.getItem('abarrotesUsers') || '[]');
            const target = storedUsers.find(user => String(user.id) === String(id));
            if (!target) return;

            if (String(id) === String(localStorage.getItem('abarrotesSession'))) {
                alert('No puedes eliminar al usuario con la sesion activa.');
                return;
            }

            if (!confirm(`Eliminar al usuario "${target.name}"?`)) return;

            const remaining = storedUsers.filter(user => String(user.id) !== String(id));
            localStorage.setItem('abarrotesUsers', JSON.stringify(remaining));
            getUserList();
        });
        container.dataset.deleteBound = 'true';
    }
};
