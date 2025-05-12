import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from '../../api/axiosConfig';
import { setToken, setUserRole } from '../../api/auth';
import st from "./Login.module.css";
import image from "../../Assets/loginPeoples.svg";

const schema = yup.object({
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .required("Senha é obrigatória"),
});

const Login = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError(null);

    console.log(data);
    
    try {
      // Alterado para o endpoint correto
      const response = await axios.post('/empresa/login', {
        email: data.email,
        senha: data.password
      });
      
      // Armazena token e role
      setToken(response.data.data.token);
      setUserRole('empresa'); // Ou 'admin' conforme o tipo de login
      
      // Redireciona para a dashboard
      navigate("/onboarding");
    } catch (error) {
      setLoginError(error.response?.data?.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={st.loginContainer}>
      <div className={st.leftSide}>
        <form onSubmit={handleSubmit(onSubmit)} className={st.form}>
          <h2>Login</h2>
          
          {loginError && <p className={st.error}>{loginError}</p>}

          <div className={st.formGroup}>
            <label>E-mail</label>
            <input {...register("email")} placeholder="Seu e-mail" />
            {errors.email && <p className={st.error}>{errors.email.message}</p>}
          </div>

          <div className={st.formGroup}>
            <label>Senha</label>
            <input
              type="password"
              {...register("password")}
              placeholder="Sua senha"
            />
            {errors.password && (
              <p className={st.error}>{errors.password.message}</p>
            )}
          </div>

          <p className={st.loginnavigate}>
            Ainda não tem conta? <a href="/register">Cadastre-se aqui</a>
          </p>

          <button 
            type="submit" 
            className={st.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
      </div>

      <div className={st.rightSide}>
        <h1>Bem vindo novamente !!</h1>
        <img
          src={image}
          alt="Imagem ilustrativa de login"
          className={st.image_peoples}
        />
      </div>
    </div>
  );
};

export default Login;