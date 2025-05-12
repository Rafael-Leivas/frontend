import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from '../../api/axiosConfig';
import st from "./AdminForm.module.css";

const schema = yup.object({
  nome_completo: yup.string().required("Nome completo é obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .required("Senha é obrigatória"),
});

const CreateAdmin = () => {
  const [submitError, setSubmitError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSubmitError(null);
    
    try {
      await axios.post('/empresa/administradores', {
        nome_completo: data.nome_completo,
        email: data.email,
        senha: data.password
      });
      
      setSuccessMessage("Administrador criado com sucesso!");
      reset();
    } catch (error) {
      setSubmitError(error.response?.data?.message || "Erro ao criar administrador");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={st.adminFormContainer}>
      <h2>Criar Novo Administrador</h2>
      
      {submitError && <p className={st.error}>{submitError}</p>}
      {successMessage && <p className={st.success}>{successMessage}</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={st.formGroup}>
          <label>Nome Completo</label>
          <input {...register("nome_completo")} />
          {errors.nome_completo && <p className={st.error}>{errors.nome_completo.message}</p>}
        </div>

        <div className={st.formGroup}>
          <label>E-mail</label>
          <input type="email" {...register("email")} />
          {errors.email && <p className={st.error}>{errors.email.message}</p>}
        </div>

        <div className={st.formGroup}>
          <label>Senha</label>
          <input type="password" {...register("password")} />
          {errors.password && <p className={st.error}>{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Criando...' : 'Criar Administrador'}
        </button>
      </form>
    </div>
  );
};

export default CreateAdmin;