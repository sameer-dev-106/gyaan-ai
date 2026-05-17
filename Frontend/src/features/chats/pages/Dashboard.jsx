import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import MessagesSection from "../components/MessagesSection";
import InputArea from "../components/InputArea";

import "../style/index.scss";

const Dashboard = () => {
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const currentChatIdRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [hoveredChatId, setHoveredChatId] = useState(null);
  const [openMenuChatId, setOpenMenuChatId] = useState(null);

  const chat = useChat();

  const user = useSelector((state) => state.auth.user);
  const isLoading = useSelector((state) => state.chat.isLoading);
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
    currentChatId,
    currentChatIdRef,
    messagesEndRef,
    textareaRef,
    sidebarOpen,
    setSidebarOpen,
    inputValue,
    setInputValue,
    hoveredChatId,
    setHoveredChatId,
    openMenuChatId,
    setOpenMenuChatId,
  };

  return (
    <main className={`chatPage ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <Sidebar {...dashboardProps} />

      <section className="chatSection">
        <Topbar {...dashboardProps} />
        <MessagesSection {...dashboardProps} />
        <InputArea {...dashboardProps} />
      </section>
    </main>
  );
};

export default Dashboard;
