import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import MessagesSection from "../components/MessagesSection";
import InputArea from "../components/InputArea";
import SearchModal from "../components/SearchModal";

import "../style/index.scss";

const Dashboard = () => {
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const currentChatIdRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [hoveredChatId, setHoveredChatId] = useState(null);
  const [openMenuChatId, setOpenMenuChatId] = useState(null);

  const chat = useChat();

  const user = useSelector((state) => state.auth.user);
  const isLoading = useSelector((state) => state.chat.isLoading);
  const isStreaming = useSelector((state) => state.chat.isStreaming);
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);

  useEffect(() => {
    currentChatIdRef.current = currentChatId;
  }, [currentChatId]);

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

  useEffect(() => {
    chat.registerSocketEvents();
  }, [chats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, currentChatId]);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuChatId(null);
    if (openMenuChatId) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openMenuChatId]);

  const dashboardProps = {
    chat,
    user,
    chats,
    isLoading,
    isStreaming,
    currentChatId,
    currentChatIdRef,
    messagesEndRef,
    textareaRef,
    sidebarOpen,
    setSidebarOpen,
    searchOpen,
    onSearchOpen: () => setSearchOpen(true),
    inputValue,
    setInputValue,
    hoveredChatId,
    setHoveredChatId,
    openMenuChatId,
    setOpenMenuChatId,
    onDeleteMessage: chat.handleDeleteMessage,
  };

  return (
    <main
      className={`chatPage ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
    >
      <Sidebar {...dashboardProps} />

      <section className="chatSection">
        <Topbar {...dashboardProps} />
        <MessagesSection {...dashboardProps} />
        <InputArea {...dashboardProps} />
      </section>

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        chats={chats}
        onSelectChat={(chatId) => chat.handleOpenChat(chatId, chats)}
      />
    </main>
  );
};

export default Dashboard;
