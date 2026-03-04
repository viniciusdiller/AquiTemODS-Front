// components/admin/cursos/CursoModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Input,
  Upload,
  message,
  Typography,
  Popconfirm,
  Tag,
  Select,
} from "antd";
import {
  UploadOutlined,
  SaveOutlined,
  EditOutlined,
  PlusOutlined,
  PictureOutlined,
  StopOutlined,
  UndoOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Image from "next/image";

const { Text } = Typography;
const { Option } = Select;

// Gerar lista de ODS-1 até ODS-18
const ODS_OPTIONS = Array.from({ length: 18 }, (_, i) => `ODS-${i + 1}`);

export interface CursoCard {
  id: number;
  titulo: string;
  linkDestino: string;
  imagemUrl: string;
  ativo: boolean;
  tag?: string;
}

interface CursoModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  curso: CursoCard | null;
  API_URL: string | undefined;
}

export default function CursoModal({
  visible,
  onClose,
  onSuccess,
  curso,
  API_URL,
}: CursoModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [link, setLink] = useState("");
  const [tag, setTag] = useState<string | undefined>(undefined); // Estado para o Dropdown
  const [cursoAtivo, setCursoAtivo] = useState(true);
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const isEditing = !!curso;

  const getFullImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  useEffect(() => {
    if (curso) {
      setTitulo(curso.titulo);
      setLink(curso.linkDestino);
      setTag(curso.tag || undefined);
      setCursoAtivo(curso.ativo);
      setFileList([]);
      setPreviewImage(getFullImageUrl(curso.imagemUrl));
    } else {
      setTitulo("");
      setLink("");
      setTag(undefined);
      setCursoAtivo(true);
      setFileList([]);
      setPreviewImage(null);
    }
  }, [curso, visible]);

  const handleFileChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const file = newFileList[0].originFileObj;
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      if (!isEditing) setPreviewImage(null);
    }
  };

  const handleSubmit = async () => {
    if (!titulo || !link || !tag)
      return message.warning("Título, Link e ODS são obrigatórios.");
    if (!isEditing && fileList.length === 0 && !previewImage)
      return message.warning("A imagem é obrigatória.");

    const token = localStorage.getItem("admin_token");
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("linkDestino", link);
    formData.append("tag", tag);
    formData.append("ativo", isEditing ? String(cursoAtivo) : "true");

    if (fileList.length > 0)
      formData.append("imagem", fileList[0].originFileObj);

    setSubmitting(true);
    try {
      const url = isEditing
        ? `${API_URL}/api/cursos/${curso.id}`
        : `${API_URL}/api/cursos`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Erro ao salvar curso");

      message.success("Sucesso!");
      onSuccess();
      onClose();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Funções de Deletar/Restaurar permanecem iguais...
  const handleArchive = async () => {
    /* ... código anterior ... */
  };
  const handleReactivate = async () => {
    /* ... código anterior ... */
  };
  const handleForceDelete = async () => {
    /* ... código anterior ... */
  };

  return (
    <Modal
      title={isEditing ? "Editar Curso" : "Novo Curso"}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      <div className="flex flex-col gap-4 py-2">
        {/* Preview da Imagem */}
        <div className="w-full h-40 bg-gray-100 rounded-md border border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
          {previewImage ? (
            <Image
              src={previewImage}
              alt="Preview"
              fill
              className="object-cover"
            />
          ) : (
            <PictureOutlined className="text-3xl text-gray-300" />
          )}
        </div>

        <div>
          <Text strong className="text-gray-600 text-xs uppercase">
            Título
          </Text>
          <Input
            placeholder="Nome do curso"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        <div>
          <Text strong className="text-gray-600 text-xs uppercase">
            Selecione a ODS
          </Text>
          <Select
            placeholder="Selecione a ODS correspondente"
            className="w-full"
            value={tag}
            onChange={(value) => setTag(value)}
            showSearch
          >
            {ODS_OPTIONS.map((ods) => (
              <Option key={ods} value={ods}>
                {ods}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <Text strong className="text-gray-600 text-xs uppercase">
            Link
          </Text>
          <Input
            placeholder="https://..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        <div>
          <Upload
            maxCount={1}
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />} block>
              Escolher Imagem
            </Button>
          </Upload>
        </div>

        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSubmit}
          loading={submitting}
          block
          className="bg-[#D7386E] h-10 mt-2"
        >
          Salvar Curso
        </Button>

        {isEditing && (
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100 text-center">
            {cursoAtivo ? (
              <Popconfirm title="Arquivar?" onConfirm={handleArchive}>
                <Button type="link">Arquivar Curso</Button>
              </Popconfirm>
            ) : (
              <Button type="link" onClick={handleReactivate}>
                Reativar Curso
              </Button>
            )}
            <Popconfirm title="Excluir de vez?" onConfirm={handleForceDelete}>
              <Button type="link" danger>
                Excluir Permanentemente
              </Button>
            </Popconfirm>
          </div>
        )}
      </div>
    </Modal>
  );
}
