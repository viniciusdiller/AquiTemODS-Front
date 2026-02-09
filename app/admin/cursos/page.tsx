"use client";

import React, { useState, useEffect } from "react";
import {
  Card, Button, Input, Upload, List, message, Typography,
  Spin, Empty, Popconfirm, Tag, Tooltip, Divider
} from "antd";
import {
  UploadOutlined, DeleteOutlined, SaveOutlined, ArrowLeftOutlined,
  EditOutlined, CloseOutlined, SearchOutlined, PlusOutlined, PictureOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Image from "next/image";

const { Title, Text } = Typography;

interface CursoCard {
  id: number;
  titulo: string;
  linkDestino: string;
  imagemUrl: string;
}

const AdminCursos = () => {
  const [cards, setCards] = useState<CursoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form States
  const [titulo, setTitulo] = useState("");
  const [link, setLink] = useState("");
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const getFullImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/cursos`);
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

  const handleFileChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const file = newFileList[0].originFileObj;
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      if (!editingId) setPreviewImage(null);
    }
  };

  const handleEdit = (item: CursoCard) => {
    setEditingId(item.id);
    setTitulo(item.titulo);
    setLink(item.linkDestino);
    setFileList([]);
    setPreviewImage(getFullImageUrl(item.imagemUrl));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitulo("");
    setLink("");
    setFileList([]);
    setPreviewImage(null);
  };

  const handleSubmit = async () => {
    if (!titulo || !link) {
      return message.warning("Título e Link são obrigatórios.");
    }
    if (!editingId && fileList.length === 0) {
      return message.warning("A imagem é obrigatória para novos cursos.");
    }

    const token = localStorage.getItem("admin_token");
    if (!token) {
      message.error("Você precisa estar logado.");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("linkDestino", link);
    if (fileList.length > 0) {
      formData.append("imagem", fileList[0].originFileObj);
    }

    setSubmitting(true);
    try {
      let url = `${API_URL}/api/cursos`;
      let method = "POST";

      if (editingId) {
        url = `${API_URL}/api/cursos/${editingId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method: method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erro ao salvar");
      }

      message.success(editingId ? "Curso atualizado!" : "Novo Curso criado!");
      cancelEdit();
      fetchCards();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${API_URL}/api/cursos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao deletar");
      message.success("Curso removido.");
      fetchCards();
    } catch (error) {
      message.error("Erro ao excluir curso.");
    }
  };

  const filteredCards = cards.filter((card) =>
    card.titulo.toLowerCase().includes(searchText.toLowerCase())
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
                Gerenciar <span className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent font-bold">
                  Cursos
                </span>
              </Title>
              <Text type="secondary" className="text-xs">
                Administração dos cursos da página Espaço ODS
              </Text>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <Card
              title={
                <div className="flex items-center gap-2">
                  {editingId ? <EditOutlined className="text-[#D7386E]" /> : <PlusOutlined className="text-[#D7386E]" />}
                  <span>{editingId ? `Editar Curso` : "Novo Curso"}</span>
                </div>
              }
              className={`shadow-md border-t-4 sticky top-24 ${editingId ? "#D7386E" : "from-[#D7386E]"}`}
              extra={editingId && <Button size="small" type="text" danger icon={<CloseOutlined />} onClick={cancelEdit}>Cancelar</Button>}
            >
              <div className="flex flex-col gap-5">
                <div className="w-full aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
                  {previewImage ? (
                    <Image src={previewImage} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="text-center text-gray-400">
                      <PictureOutlined style={{ fontSize: 32 }} />
                      <p className="text-xs mt-2">Nenhuma imagem</p>
                    </div>
                  )}
                </div>

                <div>
                  <Text strong className="mb-1 block text-gray-700">Título do Curso</Text>
                  <Input placeholder="Ex: Curso de ODS" size="large" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
                </div>

                <div>
                  <Text strong className="mb-1 block text-gray-700">Link de Destino</Text>
                  <Input placeholder="https://..." size="large" value={link} onChange={(e) => setLink(e.target.value)} />
                </div>

                <div>
                  <Text strong className="mb-1 block text-gray-700">{editingId ? "Alterar Imagem" : "Upload da Capa"}</Text>
                  <Upload listType="picture" maxCount={1} fileList={fileList} onChange={handleFileChange} beforeUpload={() => false} className="w-full"
                    accept="image/*">
                    <Button icon={<UploadOutlined />} block size="large">Selecionar Arquivo</Button>
                  </Upload>
                </div>

                <Divider className="my-2" />
                <Button
                                  type="primary"
                                  icon={<SaveOutlined />}
                                  onClick={handleSubmit}
                                  loading={submitting}
                                  block
                                  size="large"
                                  className={`font-semibold h-12 shadow-lg transition-all ${
                                    editingId
                                      ? "bg-[#D7386E] hover:bg-[#b02e5a] hover:scale-[1.02]"
                                      : "bg-[#D7386E] hover:bg-[#b02e5a] hover:scale-[1.02]"
                                  }`}
                                >
                  {editingId ? "Salvar Alterações" : "Cadastrar Curso"}
                </Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Card title={<div className="flex justify-between items-center"><span>Cursos Ativos ({filteredCards.length})</span><Input placeholder="Buscar..." prefix={<SearchOutlined />} className="w-48" value={searchText} onChange={e => setSearchText(e.target.value)} /></div>}>
              {loading ? <Spin className="block mx-auto my-10" /> : (
                <List
                  dataSource={filteredCards}
                  pagination={{ pageSize: 5 }}
                  renderItem={(item) => (
                    <List.Item actions={[
                      <Button key="edit" type="text" icon={<EditOutlined />} onClick={() => handleEdit(item)} className="#D7386E" />,
                      <Popconfirm title="Excluir Curso" onConfirm={() => handleDelete(item.id)} okText="Sim" cancelText="Não">
                        <Button key="del" type="text" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    ]}>
                      <List.Item.Meta
                        avatar={<div className="relative w-24 h-16 rounded overflow-hidden border"><Image src={getFullImageUrl(item.imagemUrl)} alt={item.titulo} fill className="object-cover" /></div>}
                        title={item.titulo}
                        description={<a href={item.linkDestino} target="_blank" className="text-xs text-gray-500 truncate block max-w-xs">{item.linkDestino}</a>}
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCursos;