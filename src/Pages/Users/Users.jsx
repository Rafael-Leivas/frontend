import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Table,
  Tag,
  Space,
  AutoComplete,
} from "antd";
import { PlusOutlined, EyeOutlined, UserAddOutlined } from "@ant-design/icons";
import Sidebar from "../../Components/SideBar/Sidebar";
import st from "./Users.module.css";
import {
  getAllColaboradores,
  createColaborador,
} from "../../api/services/colaboradorService";
import { getAllAdmins, createAdmin } from "../../api/services/adminService";
import { getAllConteudos } from "../../api/services/conteudoService";
import { isAuthenticated, getUserRole } from "../../api/auth";
import { useAuthContext } from "../../contexts/AuthContext";

const { Option } = Select;

const Users = () => {
  const navigate = useNavigate();
  const auth = useAuthContext();
  const [form] = Form.useForm();
  const [adminForm] = Form.useForm();

  // Estados existentes
  const [colaboradoresData, setColaboradoresData] = useState([]);
  const [selectedSetor, setSelectedSetor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [isEmpresa, setIsEmpresa] = useState(false);

  // Novos estados para o modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittingAdmin, setSubmittingAdmin] = useState(false);

  // Estados para dados do formulário
  const [administradores, setAdministradores] = useState([]);
  const [conteudos, setConteudos] = useState([]);
  const [selectedConteudos, setSelectedConteudos] = useState([]);

  useEffect(() => {
    // Verifica autenticação
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const role = getUserRole(); // 'empresa' ou 'colaborador'
    setCurrentUserRole(role);
    setIsEmpresa(role === "empresa");

    fetchInitialData();
  }, [navigate, auth]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // Buscar colaboradores
      const colaboradoresResponse = await getAllColaboradores();
      setColaboradoresData(colaboradoresResponse.data || []);

      // Buscar administradores
      const adminsResponse = await getAllAdmins();
      setAdministradores(adminsResponse.data || []);

      // Buscar conteúdos
      const conteudosResponse = await getAllConteudos();
      setConteudos(conteudosResponse.data || []);
    } catch (err) {
      setError(err.message);
      message.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const handleSetorClick = (setor) => {
    setSelectedSetor(selectedSetor === setor ? null : setor);
  };

  // Handlers para modal de colaborador
  const handleOpenModal = () => {
    setIsModalOpen(true);
    form.resetFields();
    setSelectedConteudos([]);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setSelectedConteudos([]);
  };

  // Handlers para modal de administrador
  const handleOpenAdminModal = () => {
    setIsAdminModalOpen(true);
    adminForm.resetFields();
  };

  const handleCloseAdminModal = () => {
    setIsAdminModalOpen(false);
    adminForm.resetFields();
  };

  const handleOpenContentModal = () => {
    setIsContentModalOpen(true);
  };

  const handleCloseContentModal = () => {
    setIsContentModalOpen(false);
  };

  const handleContentSelection = (contentIds) => {
    setSelectedConteudos(contentIds);
    handleCloseContentModal();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const colaboradorData = {
        nome_completo: values.nome_completo,
        email: values.email,
        setor: Array.isArray(values.setor) ? values.setor[0] : values.setor,
        cargo: values.cargo || "",
        data_nascimento: values.data_nascimento.format("YYYY-MM-DD"),
        senha: values.senha,
        id_administrador: values.id_administrador,
        cards_vinculados: selectedConteudos,
      };

      const response = await createColaborador(colaboradorData);

      // Atualiza a lista de colaboradores
      setColaboradoresData((prev) => [...prev, response.data]);

      message.success("Colaborador criado com sucesso!");
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao criar colaborador:", error);
      message.error(
        error.response?.data?.message || "Erro ao criar colaborador"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitAdmin = async (values) => {
    setSubmittingAdmin(true);
    try {
      const adminData = {
        nome_completo: values.nome_completo,
        email: values.email,
        senha: values.senha,
        empresa: auth?.user?.id, // ID da empresa logada
        isAdmin: true,
      };

      const response = await createAdmin(adminData);

      // Atualiza a lista de administradores
      setAdministradores((prev) => [...prev, response.data]);

      message.success("Administrador criado com sucesso!");
      handleCloseAdminModal();
    } catch (error) {
      console.error("Erro ao criar administrador:", error);
      message.error(
        error.response?.data?.message || "Erro ao criar administrador"
      );
    } finally {
      setSubmittingAdmin(false);
    }
  };

  // Colunas da tabela de conteúdos
  const contentColumns = [
    {
      title: "Título",
      dataIndex: "titulo",
      key: "titulo",
    },
    {
      title: "Tipo",
      dataIndex: "tipo",
      key: "tipo",
      render: (tipo) => <Tag color="blue">{tipo}</Tag>,
    },
    {
      title: "Setor",
      dataIndex: "setor",
      key: "setor",
      render: (setor) => <Tag color="green">{setor}</Tag>,
    },
    {
      title: "Disponível",
      dataIndex: "disponivel",
      key: "disponivel",
      render: (disponivel) => (
        <Tag color={disponivel ? "green" : "red"}>
          {disponivel ? "Sim" : "Não"}
        </Tag>
      ),
    },
  ];

  const setoresUnicos = [
    ...new Set(colaboradoresData.map((colab) => colab.setor)),
  ];

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar currentPage="users" name={auth?.user?.nome || "Usuário"} />

      <main className={st.colaboradores_main}>
        <h1>Colaboradores</h1>

        <div className={st.button_container}>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenModal}
              style={{
                backgroundColor: "#ffb300",
                borderColor: "#ffb300",
                borderRadius: "25px",
                fontWeight: "bold",
              }}
            >
              Adicionar Colaborador
            </Button>

            {/* Botão para cadastrar administrador - só aparece se for empresa */}
            {/* {isEmpresa && ( */}
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={handleOpenAdminModal}
              style={{
                backgroundColor: "#52c41a",
                borderColor: "#52c41a",
                borderRadius: "25px",
                fontWeight: "bold",
              }}
            >
              Cadastrar Administrador
            </Button>
            {/* )} */}
          </Space>
        </div>

        <div className={st.content_section}>
          <div className={st.setores_container}>
            <h2 className={st.setores_title}>Setores</h2>
            {setoresUnicos.map((setor) => (
              <div key={setor} className={st.setor}>
                <button
                  className={st.setor_btn}
                  onClick={() => handleSetorClick(setor)}
                >
                  {setor}
                </button>
                {selectedSetor === setor && (
                  <div className={st.setor_users}>
                    {colaboradoresData
                      .filter((colaborador) => colaborador.setor === setor)
                      .map((user) => (
                        <div key={user._id} className={st.setor_user_card}>
                          {user.nome_completo}
                          {currentUserRole === "admin" && (
                            <span className={st.user_email}>{user.email}</span>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={st.colaboradores_list}>
            <h3>Todos os colaboradores</h3>
            <div className={st.subtitle_all_colaborators}>
              <span className={st.nome}>Nome</span>
              <span className={st.setor}>Setor</span>
              {currentUserRole === "admin" && (
                <span className={st.email}>Email</span>
              )}
            </div>
            {colaboradoresData.map((colaborador) => (
              <div key={colaborador._id} className={st.colaborador_card}>
                <span className={st.nome}>{colaborador.nome_completo}</span>
                <span className={st.setor}>{colaborador.setor}</span>
                {currentUserRole === "admin" && (
                  <span className={st.email}>{colaborador.email}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal para adicionar colaborador */}
      <Modal
        title="Adicionar Novo Colaborador"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="Nome Completo"
            name="nome_completo"
            rules={[
              { required: true, message: "Por favor insira o nome completo" },
            ]}
          >
            <Input placeholder="Digite o nome completo" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Por favor insira o email" },
              { type: "email", message: "Email inválido" },
            ]}
          >
            <Input placeholder="Digite o email" />
          </Form.Item>

          <Form.Item
            label="Setor"
            name="setor"
            rules={[{ required: true, message: "Por favor digite o setor" }]}
          >
            <AutoComplete
              placeholder="Digite o setor"
              options={setoresUnicos.map((setor) => ({ value: setor }))}
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
              allowClear
            />
          </Form.Item>

          <Form.Item label="Cargo" name="cargo">
            <Input placeholder="Digite o cargo (opcional)" />
          </Form.Item>

          <Form.Item
            label="Data de Nascimento"
            name="data_nascimento"
            rules={[
              {
                required: true,
                message: "Por favor selecione a data de nascimento",
              },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              placeholder="Selecione a data de nascimento"
            />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="senha"
            rules={[
              { required: true, message: "Por favor insira a senha" },
              { min: 6, message: "A senha deve ter pelo menos 6 caracteres" },
            ]}
          >
            <Input.Password placeholder="Digite a senha" />
          </Form.Item>

          <Form.Item
            label="Administrador"
            name="id_administrador"
            rules={[
              {
                required: true,
                message: "Por favor selecione um administrador",
              },
            ]}
          >
            <Select placeholder="Selecione o administrador responsável">
              {administradores.map((admin) => (
                <Option key={admin._id} value={admin._id}>
                  {admin.nome_completo} - {admin.email}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Conteúdos Vinculados">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Button icon={<EyeOutlined />} onClick={handleOpenContentModal}>
                Selecionar Conteúdos ({selectedConteudos.length})
              </Button>
              {selectedConteudos.length > 0 && (
                <span style={{ color: "#52c41a" }}>
                  {selectedConteudos.length} conteúdo(s) selecionado(s)
                </span>
              )}
            </div>
          </Form.Item>

          <Form.Item style={{ marginTop: 30, textAlign: "right" }}>
            <Button onClick={handleCloseModal} style={{ marginRight: 10 }}>
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              style={{ backgroundColor: "#ffb300", borderColor: "#ffb300" }}
            >
              Criar Colaborador
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal para cadastrar administrador */}
      <Modal
        title="Cadastrar Novo Administrador"
        open={isAdminModalOpen}
        onCancel={handleCloseAdminModal}
        footer={null}
        width={500}
        destroyOnClose
      >
        <Form
          form={adminForm}
          layout="vertical"
          onFinish={handleSubmitAdmin}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="Nome Completo"
            name="nome_completo"
            rules={[
              { required: true, message: "Por favor insira o nome completo" },
            ]}
          >
            <Input placeholder="Digite o nome completo do administrador" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Por favor insira o email" },
              { type: "email", message: "Email inválido" },
            ]}
          >
            <Input placeholder="Digite o email do administrador" />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="senha"
            rules={[
              { required: true, message: "Por favor insira a senha" },
              { min: 6, message: "A senha deve ter pelo menos 6 caracteres" },
            ]}
          >
            <Input.Password placeholder="Digite a senha" />
          </Form.Item>

          <Form.Item style={{ marginTop: 30, textAlign: "right" }}>
            <Button onClick={handleCloseAdminModal} style={{ marginRight: 10 }}>
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={submittingAdmin}
              style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
            >
              Cadastrar Administrador
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal para selecionar conteúdos */}
      <Modal
        title="Selecionar Conteúdos"
        open={isContentModalOpen}
        onCancel={handleCloseContentModal}
        width={800}
        footer={[
          <Button key="cancel" onClick={handleCloseContentModal}>
            Cancelar
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={() => handleContentSelection(selectedConteudos)}
            style={{ backgroundColor: "#ffb300", borderColor: "#ffb300" }}
          >
            Confirmar Seleção
          </Button>,
        ]}
      >
        <Table
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: selectedConteudos,
            onChange: (selectedRowKeys) => {
              setSelectedConteudos(selectedRowKeys);
            },
          }}
          columns={contentColumns}
          dataSource={conteudos.map((content) => ({
            ...content,
            key: content._id,
          }))}
          pagination={{ pageSize: 5 }}
          size="small"
        />
      </Modal>
    </div>
  );
};

export default Users;
