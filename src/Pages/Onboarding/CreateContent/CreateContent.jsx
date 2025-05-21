import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Modal } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreateContent = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      console.log({
        ...values,
        content
      });
    } catch (err) {
      setError('Erro ao validar os campos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
    ],
  };

  return (
    <div>
      
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}

      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          label="Título"
          name="title"
          rules={[{ required: true, message: 'Por favor insira o título' }]}
        >
          <Input placeholder="Digite o título do card" />
        </Form.Item>

        <Form.Item
          label="Descrição"
          name="description"
          rules={[{ required: true, message: 'Por favor insira a descrição' }]}
        >
          <Input placeholder="Digite a descrição do card" />
        </Form.Item>

        <Form.Item
          label="Corpo"
          required
        >
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            style={{ height: 200, marginBottom: 40 }}
          />
        </Form.Item>

        <Form.Item name="available" valuePropName="checked">
          <Checkbox>Card disponível imediatamente</Checkbox>
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
          <Button onClick={() => form.resetFields()}>
            Cancelar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateContent;