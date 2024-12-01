import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import st from "./Login.module.css";

import image from "../../Assets/loginPeoples.svg"

const schema = yup.object({
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .required("Senha é obrigatória"),
});

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
    // Enviar os dados para o backend
    
    navigate("/onboarding");
  };

  return (
    <div className={st.loginContainer}>
      {/* Lado esquerdo: Formulário */}
      <div className={st.leftSide}>
        <form onSubmit={handleSubmit(onSubmit)} className={st.form}>
          <h2>Login</h2>
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

          <button type="submit" className={st.submitButton}>
            Entrar
          </button>
        </form>
      </div>

      {/* Lado direito: Imagem */}
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
