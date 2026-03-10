export const formatPrefeituraSlug = (name: string) => {
  if (!name) return "";

  return (
    name
      // Remove o prefixo se existir
      .replace(/Prefeitura Municipal de /gi, "")
      // Remove acentos
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      // Passa para minúsculas
      .toLowerCase()
      // Remove espaços no início e no fim
      .trim()
      // Substitui espaços por hífen
      .replace(/\s+/g, "-")
      // Remove qualquer outro caractere especial que não seja letra, número ou hífen
      .replace(/[^a-z0-9-]/g, "")
  );
};
