import { useState } from "react";
import { Form, Input, Button } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useAuthContext } from "../../../contexts/AuthContext";
import axios from "axios";
import { message } from "antd";

const baseUrl = import.meta.env.VITE_API_URL;

const CreateContent = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const auth = useAuthContext();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const body = {
        titulo: values.title,
        tipo: "Card",
        setor: values.sector,
        corpo: content,
        disponivel: true,
        id_administrador: auth?.user?.id,
      };

      const token = localStorage.getItem("token");

      await axios.post(`${baseUrl}/conteudo`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      form.resetFields();
      setContent("");
      setError(null);

      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Erro ao criar conteúdo");
      console.error(err);
      message.error("Erro ao criar conteúdo: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
    ],
  };

  return (
    <div>
      {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}

      <Form form={form} layout="vertical">
        <Form.Item
          label="Título"
          name="title"
          rules={[{ required: true, message: "Por favor insira o título" }]}
        >
          <Input placeholder="Digite o título do card" />
        </Form.Item>

        <Form.Item
          label="Descrição"
          name="description"
          rules={[{ required: true, message: "Por favor insira a descrição" }]}
        >
          <Input placeholder="Digite a descrição do card" />
        </Form.Item>

        <Form.Item
          label="Setor"
          name="sector"
          rules={[{ required: true, message: "Por favor selecione o setor" }]}
        >
          <Input placeholder="Digite o setor que faz parte" />
        </Form.Item>

        <Form.Item label="Corpo" required>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            style={{ height: 200, marginBottom: 40 }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            style={{ marginRight: 16 }}
          >
            Salvar
          </Button>
          <Button onClick={() => form.resetFields()}>Cancelar</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateContent;
