"use client";

import React, { useState, useEffect } from "react";
import {
  Card, Button, Input, Upload, List, message, Typography,
  Spin, Popconfirm, Divider, Tag, Modal
} from "antd";
import {
  UploadOutlined, DeleteOutlined, SaveOutlined, ArrowLeftOutlined,
  EditOutlined, CloseOutlined, SearchOutlined, PlusOutlined, PictureOutlined,
  BarChartOutlined, StopOutlined, UndoOutlined, WarningOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const { Title, Text } = Typography;

interface CursoCard {
  id: number;
  titulo: string;
  linkDestino: string;
  imagemUrl: string;
  ativo: boolean;
}

const AdminCursos = () => {
  const [cards, setCards] = useState<CursoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchText, setSearchText] = useState("");
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [cursoAtivo, setCursoAtivo] = useState(true);

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
      const timestamp = new Date().getTime();
      // Adiciona timestamp para evitar cache do navegador
      const res = await fetch(`${API_URL}/api/cursos?t=${timestamp}`, {
        cache: 'no-store'
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

  const openModal = (item?: CursoCard) => {
    if (item) {
      // Edição
      setEditingId(item.id);
      setTitulo(item.titulo);
      setLink(item.linkDestino);
      setCursoAtivo(item.ativo);
      setFileList([]);
      setPreviewImage(getFullImageUrl(item.imagemUrl));
    } else {
      // Novo Curso
      setEditingId(null);
      setTitulo("");
      setLink("");
      setCursoAtivo(true); 
      setFileList([]);
      setPreviewImage(null);
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingId(null);
    setTitulo("");
    setLink("");
    setFileList([]);
    setPreviewImage(null);
  };

  const handleSubmit = async () => {
    if (!titulo || !link) return message.warning("Título e Link são obrigatórios.");
    if (!editingId && fileList.length === 0 && !previewImage) return message.warning("A imagem é obrigatória para novos cursos.");

    const token = localStorage.getItem("admin_token");
    if (!token) return message.error("Você precisa estar logado.");

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("linkDestino", link);
    
    // --- CORREÇÃO AQUI ---
    // Se for edição, usa o estado atual (pode ser false).
    // Se for NOVO (editingId null), FORÇA "true".
    const statusParaEnviar = editingId ? String(cursoAtivo) : "true";
    formData.append("ativo", statusParaEnviar);
    // ---------------------

    if (fileList.length > 0) formData.append("imagem", fileList[0].originFileObj);

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

      if (!res.ok) throw new Error("Erro ao salvar");

      message.success(editingId ? "Curso atualizado!" : "Novo Curso criado!");
      closeModal();
      
      // Delay pequeno e recarregamento forçado
      setTimeout(() => {
          fetchCards();
      }, 300);

    } catch (error: any) {
      message.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchive = async () => {
    if (!editingId) return;
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${API_URL}/api/cursos/${editingId}`, {
        method: "DELETE", // Backend deve entender isso como 'Soft Delete'
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erro ao arquivar");
      }
      
      message.success("Curso arquivado com sucesso.");
      
      // ATUALIZAÇÃO IMEDIATA (Optimistic Update)
      setCards(prev => prev.map(c => c.id === editingId ? { ...c, ativo: false } : c));
      
      // Atualiza o estado do modal para refletir a mudança (botão muda para Reativar)
      setCursoAtivo(false); 
      
      // Opcional: Recarrega do servidor para garantir
      fetchCards();

    } catch (error: any) {
      message.error(error.message || "Erro ao arquivar curso.");
    }
  };

  const handleReactivate = async () => {
    if (!editingId) return;
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${API_URL}/api/cursos/${editingId}/restore`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao reativar");
      
      message.success("Curso reativado.");
      setCards(prev => prev.map(c => c.id === editingId ? { ...c, ativo: true } : c));
      setCursoAtivo(true);
    } catch (error) {
      message.error("Erro ao reativar.");
    }
  };

  const handleForceDelete = async () => {
    if (!editingId) return;
    const token = localStorage.getItem("admin_token");
    try {
        const res = await fetch(`${API_URL}/api/cursos/${editingId}/force`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erro ao excluir permanentemente");

        message.success("Curso excluído definitivamente.");
        closeModal();
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
            <Button shape="circle" icon={<ArrowLeftOutlined />} onClick={() => router.back()} className="border-none shadow-none hover:bg-gray-100" />
            <div>
              <Title level={4} style={{ margin: 0 }} className="text-gray-800">
                Gerenciar <span className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent font-bold">Cursos</span>
              </Title>
              <Text type="secondary" className="text-xs">Administração dos cursos da página Espaço ODS</Text>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/cursos/indicadores">
                <Button icon={<BarChartOutlined />}>Indicadores</Button>
            </Link>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()} style={{ backgroundColor: "#D7386E", borderColor: "#D7386E" }}>
                Novo Curso
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Card title={<div className="flex justify-between items-center"><span>Lista de Cursos ({filteredCards.length})</span><Input placeholder="Buscar..." prefix={<SearchOutlined />} className="w-64" value={searchText} onChange={e => setSearchText(e.target.value)} /></div>}>
            {loading ? <Spin className="block mx-auto my-10" /> : (
            <List
                dataSource={filteredCards}
                pagination={{ pageSize: 8 }}
                grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
                renderItem={(item) => (
                <List.Item>
                    <Card
                        hoverable
                        cover={
                            <div className={`relative h-32 w-full overflow-hidden ${!item.ativo ? 'grayscale' : ''}`}>
                                <Image src={getFullImageUrl(item.imagemUrl)} alt={item.titulo} fill className="object-cover" />
                                {!item.ativo && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Tag color="red">INATIVO</Tag>
                                    </div>
                                )}
                            </div>
                        }
                        actions={[
                            <Button type="text" block icon={<EditOutlined />} onClick={() => openModal(item)}>Editar / Gerenciar</Button>
                        ]}
                        className={!item.ativo ? "opacity-75" : ""}
                    >
                        <Card.Meta 
                            title={<span className="text-sm" title={item.titulo}>{item.titulo}</span>}
                            description={
                                <div className="flex items-center gap-2 mt-1">
                                    {item.ativo ? <Tag color="success" className="mr-0">Ativo</Tag> : <Tag color="default" className="mr-0">Arquivado</Tag>}
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

      {/* --- MODAL --- */}
      <Modal
        title={
            <div className="flex items-center gap-2">
                {editingId ? <EditOutlined className="text-[#D7386E]" /> : <PlusOutlined className="text-[#D7386E]" />}
                <span>{editingId ? "Editar Curso" : "Novo Curso"}</span>
                {editingId && (
                    <Tag color={cursoAtivo ? "success" : "red"} className="ml-2">
                        {cursoAtivo ? "Ativo" : "Inativo"}
                    </Tag>
                )}
            </div>
        }
        open={modalVisible}
        onCancel={closeModal}
        footer={null}
        width={600}
      >
        <div className="flex flex-col gap-5 py-4">
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
                <Text strong className="mb-1 block text-gray-700">{editingId ? "Trocar Imagem" : "Upload da Capa"}</Text>
                <Upload listType="picture" maxCount={1} fileList={fileList} onChange={handleFileChange} beforeUpload={() => false} className="w-full" accept="image/*">
                    <Button icon={<UploadOutlined />} block size="large">Selecionar Arquivo</Button>
                </Upload>
            </div>

            <Button 
                type="primary" 
                icon={<SaveOutlined />} 
                onClick={handleSubmit} 
                loading={submitting} 
                block 
                size="large" 
                className="bg-[#D7386E] hover:bg-[#b02e5a] mt-2 h-12 font-semibold"
            >
                {editingId ? "Salvar Alterações" : "Criar Curso"}
            </Button>

            {/* ZONA DE GERENCIAMENTO - APENAS NA EDIÇÃO */}
            {editingId && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <Text strong className="text-gray-500 mb-3 block text-xs uppercase tracking-wide">Gerenciar Status</Text>
                    
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-3">
                            {cursoAtivo ? (
                                <Popconfirm 
                                    title="Arquivar Curso" 
                                    description="O curso deixará de aparecer no site público." 
                                    onConfirm={handleArchive}
                                    okText="Sim, arquivar"
                                    cancelText="Cancelar"
                                    icon={<WarningOutlined style={{ color: 'orange' }} />}
                                >
                                    <Button block icon={<StopOutlined />}>Arquivar (Tornar Inativo)</Button>
                                </Popconfirm>
                            ) : (
                                <Popconfirm 
                                    title="Reativar Curso" 
                                    description="O curso voltará a aparecer no site público." 
                                    onConfirm={handleReactivate}
                                    okText="Sim, reativar"
                                    cancelText="Cancelar"
                                >
                                    <Button type="primary" ghost block icon={<UndoOutlined />}>Reativar Curso</Button>
                                </Popconfirm>
                            )}
                        </div>

                        {/* EXCLUIR PERMANENTE */}
                        <div className="mt-2">
                            <Popconfirm 
                                title="EXCLUIR PERMANENTEMENTE" 
                                description={
                                    <div className="max-w-xs">
                                        <p>Você tem certeza absoluta?</p>
                                        <p className="text-red-500 text-xs">Esta ação apagará o curso e todo o histórico de cliques para sempre. Não pode ser desfeito.</p>
                                    </div>
                                }
                                onConfirm={handleForceDelete}
                                okText="Sim, DELETAR"
                                cancelText="Cancelar"
                                okButtonProps={{ danger: true }}
                                icon={<WarningOutlined style={{ color: 'red' }} />}
                            >
                                <Button danger block type="text" icon={<DeleteOutlined />}>Excluir Permanentemente</Button>
                            </Popconfirm>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </Modal>
    </div>
  );
};

export default AdminCursos;