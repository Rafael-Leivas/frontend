import React, { useState } from 'react';
import Sidebar from '../../Components/SideBar/Sidebar';
import './Users.css';

const Users = () => {
  const [selectedSetor, setSelectedSetor] = useState(null);

  // Dados mocados do JSON fornecido
  const colaboradoresData = [
    {
      id_administrador: 1,
      nome_completo: 'Rafa',
      email: 'ainda',
      data_nascimento: '2024-12-01T00:46:38.284000',
      senha: 'string',
      setor: 'Tecnologia',
    },
    {
      id_administrador: 2,
      nome_completo: 'Rafa',
      email: 'das',
      data_nascimento: '2024-12-01T00:46:38.284000',
      senha: 'string',
      setor: 'Administração',
    },
    {
      id_administrador: 3,
      nome_completo: 'Carlos',
      email: 'email3@example.com',
      data_nascimento: '2024-12-01T00:46:38.284000',
      senha: 'string',
      setor: 'Suporte',
    },
    {
        id_administrador: 4,
        nome_completo: 'Ainda',
        email: 'ainda',
        data_nascimento: '2024-12-01T00:46:38.284000',
        senha: 'string',
        setor: 'Tecnologia',
      },
  ];

  // Organizar usuários por setor
  const setores = colaboradoresData.reduce((acc, colaborador) => {
    const { setor } = colaborador;
    if (!acc[setor]) {
      acc[setor] = [];
    }
    acc[setor].push(colaborador);
    return acc;
  }, {});

  const handleSetorClick = (setor) => {
    setSelectedSetor(selectedSetor === setor ? null : setor);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar
        currentPage="users"
        name="Nome do Usuário"
      />
      <main className="colaboradores-main">
        <h1>Colaboradores</h1>
        <div className="button-container">
          <button className="btn-add">+ Adicionar administrador</button>
          <button className="btn-add">+ Adicionar colaborador</button>
        </div>
        <div className="content-section">
          {/* Container de setores */}
          <div className="setores-container">
            <h2 className="setores-title">Setores</h2>
            {Object.keys(setores).map((setor) => (
              <div key={setor} className="setor">
                <button
                  className="setor-btn"
                  onClick={() => handleSetorClick(setor)}
                >
                  {setor}
                </button>
                {selectedSetor === setor && (
                  <div className="setor-users">
                    {setores[setor].map((user) => (
                      <div key={user.id_administrador} className="setor-user-card">
                        {user.nome_completo}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Lista de todos os colaboradores */}
          <div className="colaboradores-list">
            <h3>Todos os colaboradores</h3>
            {colaboradoresData.map((colaborador) => (
              <div
                key={colaborador.id_administrador}
                className="colaborador-card"
              >
                {colaborador.nome_completo}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Users;
