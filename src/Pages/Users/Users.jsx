import React, { useState, useEffect } from 'react';
import Sidebar from '../../Components/SideBar/Sidebar';
import './Users.css';
import axios from 'axios';

const Users = () => {
  const [colaboradoresData, setColaboradoresData] = useState([]);
  const [selectedSetor, setSelectedSetor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newColaborador, setNewColaborador] = useState({
    nome_completo: '',
    email: '',
    setor: '', // Vai receber a seleção ou o valor digitado
    data_nascimento: '',
    senha: '',
    id_administrador: 1, // Exemplo: ID do administrador atual (ajuste conforme necessário)
  });
  const [novoSetor, setNovoSetor] = useState(''); // Estado para o novo setor digitado

  // Estado para setores dinâmicos
  const [availableSetores, setAvailableSetores] = useState([]);

  useEffect(() => {
    const fetchColaboradores = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/colaborador/all');
        setColaboradoresData(response.data);

        // Extrair setores únicos do JSON recebido
        const setores = [...new Set(response.data.map((colaborador) => colaborador.setor))];
        setAvailableSetores(setores);
      } catch (error) {
        console.error('Erro ao buscar colaboradores:', error);
      }
    };

    fetchColaboradores();
  }, []);

  const handleSetorClick = (setor) => {
    setSelectedSetor(selectedSetor === setor ? null : setor);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewColaborador({
      nome_completo: '',
      email: '',
      setor: '',
      data_nascimento: '',
      senha: '',
      id_administrador: 1,
    });
    setNovoSetor(''); // Limpar o campo de novo setor ao fechar o modal
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewColaborador({ ...newColaborador, [name]: value });
  };

  const handleNovoSetorChange = (e) => {
    setNovoSetor(e.target.value); // Atualizar o texto do novo setor
  };

  const handleAddColaborador = async (e) => {
    e.preventDefault();
    try {
      // Se o setor for "outro", substitui com o texto digitado
      const colaboradorData = {
        ...newColaborador,
        setor: newColaborador.setor === 'outro' ? novoSetor : newColaborador.setor,
      };
      const response = await axios.post('http://127.0.0.1:8000/colaborador', colaboradorData);
      setColaboradoresData((prevData) => [...prevData, response.data]);
      alert('Colaborador adicionado com sucesso!');
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao adicionar colaborador:', error);
      alert('Erro ao adicionar colaborador. Verifique os dados e tente novamente.');
    }
  };

  const handleSetorChange = (e) => {
    const { value } = e.target;
    if (value === 'outro') {
      // Quando o setor for "outro", mostra o campo de texto
      setNewColaborador({ ...newColaborador, setor: value });
    } else {
      // Caso contrário, seleciona o setor normalmente
      setNewColaborador({ ...newColaborador, setor: value });
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar currentPage="users" name="Nome do Usuário" />
      <main className="colaboradores-main">
        <h1>Colaboradores</h1>
        <div className="button-container">
          <button className="btn-add" onClick={handleOpenModal}>
            + Adicionar colaborador
          </button>
        </div>
        <div className="content-section">
          <div className="setores-container">
            <h2 className="setores-title">Setores</h2>
            {Object.keys(
              colaboradoresData.reduce((acc, colaborador) => {
                const { setor } = colaborador;
                if (!acc[setor]) acc[setor] = [];
                acc[setor].push(colaborador);
                return acc;
              }, {})
            ).map((setor) => (
              <div key={setor} className="setor">
                <button
                  className="setor-btn"
                  onClick={() => handleSetorClick(setor)}
                >
                  {setor}
                </button>
                {selectedSetor === setor && (
                  <div className="setor-users">
                    {colaboradoresData
                      .filter((colaborador) => colaborador.setor === setor)
                      .map((user) => (
                        <div key={user.id_colaborador} className="setor-user-card">
                          {user.nome_completo}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="colaboradores-list">
            <h3>Todos os colaboradores</h3>
            <div className='subtitle-all-colaborators'>
              <span className="nome">Nome</span>
              <span className="setor">Setor</span>
            </div>
            {colaboradoresData.map((colaborador) => (
              <div key={colaborador.id_colaborador} className="colaborador-card">
                <span className="nome">{colaborador.nome_completo}</span>
                <span className="setor">{colaborador.setor}</span>
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Adicionar Colaborador</h2>
            <form onSubmit={handleAddColaborador}>
              <label>
                Nome Completo:
                <input
                  type="text"
                  name="nome_completo"
                  value={newColaborador.nome_completo}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={newColaborador.email}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Setor:
                <select
                  name="setor"
                  value={newColaborador.setor}
                  onChange={handleSetorChange}
                  required
                >
                  <option value="">Selecione um setor</option>
                  {availableSetores.map((setor) => (
                    <option key={setor} value={setor}>
                      {setor}
                    </option>
                  ))}
                  <option value="outro">Outro (escrever manualmente)</option>
                </select>
              </label>
              {newColaborador.setor === 'outro' && (
                <input
                  type="text"
                  placeholder="Digite o novo setor"
                  value={novoSetor}
                  onChange={handleNovoSetorChange}
                  required
                />
              )}
              <label>
                Data de Nascimento:
                <input
                  type="date"
                  name="data_nascimento"
                  value={newColaborador.data_nascimento}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Senha:
                <input
                  type="password"
                  name="senha"
                  value={newColaborador.senha}
                  onChange={handleChange}
                  required
                />
              </label>
              <div className="modal-buttons">
                <button type="submit" className="btn-add">
                  Salvar
                </button>
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
