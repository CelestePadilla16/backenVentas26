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
        container.innerHTML = '<tr><td colspan="4">Sin usuarios registrados</td></tr>';
        return;
    }

    container.innerHTML = visibleUsers.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.role === 'admin' ? 'Administrador' : 'Trabajador'}</td>
            <td>${user.role === 'admin' ? user.adminCode : user.adminCode}</td>
        </tr>
    `).join('');
};
