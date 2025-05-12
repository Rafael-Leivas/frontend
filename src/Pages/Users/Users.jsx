import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../Components/SideBar/Sidebar';
import './Users.css';
import { 
  getAllColaboradores, 
  createColaborador 
} from '../../api/services/colaboradorService';
import { isAuthenticated, getUserRole } from '../../api/auth';

const Users = () => {
  const navigate = useNavigate();
  const [colaboradoresData, setColaboradoresData] = useState([]);
  const [selectedSetor, setSelectedSetor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newColaborador, setNewColaborador] = useState({
    nome_completo: '',
    email: '',
    setor: '',
    data_nascimento: '',
    senha: '',
    id_administrador: '' // Será preenchido com o ID do admin logado
  });
  const [novoSetor, setNovoSetor] = useState('');
  const [availableSetores, setAvailableSetores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  useEffect(() => {
    // Verifica autenticação e permissões
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const role = getUserRole();
    setCurrentUserRole(role);

    // Apenas administradores podem acessar esta página
    // if (role !== 'admin') {
    //   navigate('/unauthorized');
    //   return;
    // }

    // Obtém o ID do administrador do token (você precisará implementar isso)
    const adminId = getAdminIdFromToken(); // Função fictícia - implemente conforme seu sistema
    setNewColaborador(prev => ({ ...prev, id_administrador: adminId }));

    const fetchColaboradores = async () => {
      setLoading(true);
      try {
        const response = await getAllColaboradores();
        setColaboradoresData(response.data || []);
        
        // Extrair setores únicos
        const setores = [...new Set(response.data.map(colab => colab.setor))];
        setAvailableSetores(setores);
      } catch (err) {
        setError(err.message);
        console.error('Erro ao buscar colaboradores:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchColaboradores();
  }, [navigate]);

  // Função fictícia - você precisará implementar de acordo com seu sistema
  const getAdminIdFromToken = () => {
    // Implemente a lógica para extrair o ID do admin do token JWT
    return 'ID_DO_ADMIN_LOGADO'; // Substitua por sua implementação real
  };

  const handleSetorClick = (setor) => {
    setSelectedSetor(selectedSetor === setor ? null : setor);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewColaborador(prev => ({
      ...prev,
      nome_completo: '',
      email: '',
      setor: '',
      data_nascimento: '',
      senha: ''
    }));
    setNovoSetor('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewColaborador(prev => ({ ...prev, [name]: value }));
  };

  const handleNovoSetorChange = (e) => {
    setNovoSetor(e.target.value);
  };

  const handleAddColaborador = async (e) => {
    e.preventDefault();
    try {
      const colaboradorData = {
        ...newColaborador,
        setor: newColaborador.setor === 'outro' ? novoSetor : newColaborador.setor,
      };
      
      const response = await createColaborador(colaboradorData);
      
      // Atualiza a lista de colaboradores e setores
      setColaboradoresData(prev => [...prev, response.data]);
      
      // Se for um novo setor, adiciona à lista
      if (newColaborador.setor === 'outro' && !availableSetores.includes(novoSetor)) {
        setAvailableSetores(prev => [...prev, novoSetor]);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao adicionar colaborador:', error);
      alert(error.response?.data?.message || 'Erro ao adicionar colaborador');
    }
  };

  const handleSetorChange = (e) => {
    const { value } = e.target;
    setNewColaborador(prev => ({ ...prev, setor: value }));
  };

  if (!currentUserRole) return <div>Verificando permissões...</div>;
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar currentPage="users" name="Nome do Usuário" />
      <main className="colaboradores-main">
        <h1>Colaboradores</h1>
        
        {currentUserRole === 'admin' && (
          <div className="button-container">
            <button className="btn-add" onClick={handleOpenModal}>
              + Adicionar colaborador
            </button>
          </div>
        )}

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
                        <div key={user._id} className="setor-user-card">
                          {user.nome_completo}
                          {currentUserRole === 'admin' && (
                            <span className="user-email">{user.email}</span>
                          )}
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
              {currentUserRole === 'admin' && (
                <span className="email">Email</span>
              )}
            </div>
            {colaboradoresData.map((colaborador) => (
              <div key={colaborador._id} className="colaborador-card">
                <span className="nome">{colaborador.nome_completo}</span>
                <span className="setor">{colaborador.setor}</span>
                {currentUserRole === 'admin' && (
                  <span className="email">{colaborador.email}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal de Adição - Visível apenas para admins */}
      {isModalOpen && currentUserRole === 'admin' && (
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