import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/SideBar/Sidebar";
import OnboardingCard from "../../Components/OnboardingCard/OnboardingCard";
import axios from "../../api/axiosConfig";
import st from "./Onboarding.module.css";

import { message, Modal } from "antd";
import CreateContent from "./CreateContent/CreateContent";
import { getUserId } from "../../api/auth";

const Onboarding = () => {
  const [cards, setCards] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [newCard, setNewCard] = useState({
    title: "",
    subtitle: "",
    body: "",
    disponivel: false,
  });
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = getUserId();

  // Fetch inicial dos cards
  useEffect(() => {
    const fetchCards = async () => {
      if (!userId) return;

      setIsLoading(true);
      try {
        const response = await axios.get(`/conteudo/colaborador/${userId}`);
        // Acessa os conteúdos dentro da estrutura response.data.data.conteudos
        const conteudos = response.data.data?.conteudos || [];

        const fetchedCards = conteudos.map((card, index) => ({
          number: index + 1, // Isso criará a sequência 1, 2, 3...
          id: card._id.toString(), // Mantemos o ID original em outro campo caso precise
          title: card.titulo,
          subtitle: card.tipo,
          content: card.corpo,
          liberado: card.disponivel,
          adminName: card.id_administrador?.nome_completo || "Admin",
          createdAt: card.createdAt,
        }));
        setCards(fetchedCards);
      } catch (error) {
        setError(error.response?.data?.message || "Erro ao carregar os cards");
        console.error("Erro ao carregar os cards:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [userId]);

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewCard({ title: "", subtitle: "", body: "", disponivel: false });
    setError(null);
  };

  const openViewModal = (card) => {
    setSelectedCard(card);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedCard(null);
  };

  const handleAddCard = async () => {
    if (!newCard.title || !newCard.subtitle || !newCard.body) return;

    setIsLoading(true);
    const newCardData = {
      titulo: newCard.title,
      tipo: newCard.subtitle,
      corpo: newCard.body,
      disponivel: newCard.disponivel,
      id_administrador: "682157ed55d61d80722ba159",
    };

    try {
      const response = await axios.post("/conteudo", newCardData);
      const savedCard = response.data.data;

      setCards((prevCards) => [
        ...prevCards,
        {
          number: savedCard.id_conteudo.toString(),
          title: savedCard.titulo,
          subtitle: savedCard.tipo,
          content: savedCard.corpo,
          liberado: savedCard.disponivel,
        },
      ]);

      closeCreateModal();
    } catch (error) {
      setError(error.response?.data?.message || "Erro ao salvar o card");
      console.error("Erro ao enviar os dados para o backend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsCompleted = async () => {
    if (!selectedCard) return;

    setIsLoading(true);
    try {
      await axios.put(`/conteudo/${selectedCard.number}`, {
        titulo: selectedCard.title,
        tipo: selectedCard.subtitle,
        corpo: selectedCard.content,
        disponivel: true,
        id_administrador: "682157ed55d61d80722ba159",
      });

      setCards((prevCards) => {
        const updatedCards = prevCards.map((card) => {
          if (card.number === selectedCard.number) {
            return { ...card, liberado: true };
          }
          return card;
        });

        // Liberar o próximo card
        const nextCardIndex =
          prevCards.findIndex((card) => card.number === selectedCard.number) +
          1;
        if (nextCardIndex < prevCards.length) {
          updatedCards[nextCardIndex] = {
            ...updatedCards[nextCardIndex],
            liberado: true,
          };
        }

        return updatedCards;
      });

      closeViewModal();
    } catch (error) {
      setError(error.response?.data?.message || "Erro ao atualizar o card");
      console.error("Erro ao enviar a atualização:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewMore = (card) => {
    openViewModal(card);
  };

  const handleContentCreated = () => {
    closeCreateModal();
    message.success("Conteúdo criado com sucesso!");
    // Aqui você pode recarregar os cards, se quiser:
    // fetchCards();
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar currentPage="onboarding" name="Nome do Usuário" />
      <main className={st.main}>
        <h1>Onboarding</h1>
        <button
          className={st.addButton}
          onClick={openCreateModal}
          disabled={isLoading}
        >
          {isLoading ? "Carregando..." : "+ Adicionar Novo Card"}
        </button>

        {error && <p className={st.error}>{error}</p>}

        <div className={st.cardsContainer}>
          {cards.map((card, index) => (
            <OnboardingCard
              key={index}
              number={index + 1}
              title={card.title}
              subtitle={card.subtitle}
              liberado={card.liberado}
              onViewMore={() => handleViewMore(card)}
            />
          ))}
        </div>

        {/* Modal para visualização de card */}
        {showViewModal && selectedCard && (
          <div className={st.modalOverlay}>
            <div className={st.modalContent}>
              <h2>{selectedCard.title}</h2>
              <h3>{selectedCard.subtitle}</h3>
              <div
                dangerouslySetInnerHTML={{ __html: selectedCard.content }}
                style={{
                  lineHeight: "1.6",
                  fontSize: "14px",
                  color: "#333",
                }}
              />

              <div className={st.modalButtons}>
                {/* <button onClick={handleMarkAsCompleted} disabled={isLoading}>
                  {isLoading ? "Processando..." : "Marcar como Concluído"}
                </button> */}
                <button onClick={closeViewModal} disabled={isLoading}>
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para criar novo card */}
        <Modal
          title="Adicionar novo card"
          closable={{ "aria-label": "Custom Close Button" }}
          open={showCreateModal}
          onOk={closeCreateModal}
          onCancel={closeCreateModal}
          width={800}
          style={{ top: 30 }}
          footer={null}
        >
          <CreateContent onSuccess={handleContentCreated} />
        </Modal>
      </main>
    </div>
  );
};

export default Onboarding;
