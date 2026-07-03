import {api} from '../utils/api.js';

export const getUserList = async () => {
    const container = document.getElementById('userTableList');
    container.innerHTML = '<tr><td colspan="4">Cargando...</td></tr>';

    try {
        const users = await api.get('/users');
        container.innerHTML = users.map(user =>`
            <tr> 
                <td>${user.id}</td>
                <td>${user.nombre ?? user.name ?? ''}</td>
                <td>${user.email ?? user.apellido ?? ''}</td>
                <td>${user.password ?? user.passwor ?? ''}</td>
            </tr>
        `).join('');
    } catch (error) {
        container.innerHTML = '<tr><td colspan="4">Error al cargar la lista de usuarios</td></tr>';
    }
};
