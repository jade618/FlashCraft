import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import apiAdmin from '../../services/apiAdmin';
import './AdminUsuarios.css';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await apiAdmin.get('/usuarios');
        setUsuarios(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <AdminLayout>
      <div className="admin-usuarios">
        <h1>Usuários</h1>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Criado em</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario._id}>
                <td>{usuario.nome}</td>
                <td>{usuario.email}</td>
                <td>{new Date(usuario.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminUsuarios;
