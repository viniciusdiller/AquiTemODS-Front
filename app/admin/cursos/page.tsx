// app/admin/cursos/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Input,
  List,
  message,
  Typography,
  Spin,
  Tag,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CursoModal, { CursoCard } from "@/components/admin/cursos/CursoModal";

const { Title, Text } = Typography;

const AdminCursos = () => {
  const [cards, setCards] = useState<CursoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [editingCurso, setEditingCurso] = useState<CursoCard | null>(null);

  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchCards = async () => {
    setLoading(true);
    try {
      const timestamp = new Date().getTime();
      const res = await fetch(`${API_URL}/api/cursos?t=${timestamp}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Erro ao buscar dados");
      const data = await res.json();
      setCards(data);
    } catch (error) {
      message.error("Erro ao carregar cursos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const openModal = (item?: CursoCard) => {
    setEditingCurso(item || null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingCurso(null);
  };

  const getFullImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  const filteredCards = cards.filter((card) =>
    card.titulo.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              shape="circle"
              icon={<ArrowLeftOutlined />}
              onClick={() => router.back()}
              className="border-none shadow-none hover:bg-gray-100"
            />
            <div>
              <Title level={4} style={{ margin: 0 }} className="text-gray-800">
                Gerenciar{" "}
                <span className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent font-bold">
                  Cursos
                </span>
              </Title>
              <Text type="secondary" className="text-xs">
                Administração dos cursos da página Espaço ODS
              </Text>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/cursos/indicadores">
              <Button icon={<BarChartOutlined />}>Indicadores</Button>
            </Link>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openModal()}
              style={{ backgroundColor: "#D7386E", borderColor: "#D7386E" }}
            >
              Novo Curso
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Card
          title={
            <div className="flex justify-between items-center">
              <span>Lista de Cursos ({filteredCards.length})</span>
              <Input
                placeholder="Buscar..."
                prefix={<SearchOutlined />}
                className="w-64"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          }
        >
          {loading ? (
            <Spin className="block mx-auto my-10" />
          ) : (
            <List
              dataSource={filteredCards}
              pagination={{ pageSize: 8 }}
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    hoverable
                    cover={
                      <div
                        className={`relative h-32 w-full overflow-hidden ${!item.ativo ? "grayscale" : ""}`}
                      >
                        <Image
                          src={getFullImageUrl(item.imagemUrl)}
                          alt={item.titulo}
                          fill
                          className="object-cover"
                        />
                        {!item.ativo && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Tag color="red">INATIVO</Tag>
                          </div>
                        )}
                      </div>
                    }
                    actions={[
                      <Button
                        type="text"
                        block
                        icon={<EditOutlined />}
                        onClick={() => openModal(item)}
                      >
                        Editar / Gerenciar
                      </Button>,
                    ]}
                    className={!item.ativo ? "opacity-75" : ""}
                  >
                    <Card.Meta
                      title={
                        <div className="flex flex-col">
                          <span
                            className="text-sm truncate"
                            title={item.titulo}
                          >
                            {item.titulo}
                          </span>
                          {/* AQUI EXIBIMOS A NOVA TAG NA LISTAGEM */}
                          {item.tag && (
                            <span className="text-xs text-[#D7386E] font-medium mt-1">
                              {item.tag}
                            </span>
                          )}
                        </div>
                      }
                      description={
                        <div className="flex items-center gap-2 mt-2">
                          {item.ativo ? (
                            <Tag color="success" className="mr-0">
                              Ativo
                            </Tag>
                          ) : (
                            <Tag color="default" className="mr-0">
                              Arquivado
                            </Tag>
                          )}
                        </div>
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>

      <CursoModal
        visible={modalVisible}
        onClose={closeModal}
        onSuccess={() => {
          setTimeout(() => fetchCards(), 300);
        }}
        curso={editingCurso}
        API_URL={API_URL}
      />
    </div>
  );
};

export default AdminCursos;
