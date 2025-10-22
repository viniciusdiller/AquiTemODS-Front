export const odsColors: { [key: string]: string } = {
  "1": "#E5243B",
  "2": "#DDA63A",
  "3": "#4C9F38",
  "4": "#C5192D",
  "5": "#FF3A21",
  "6": "#26BDE2",
  "7": "#FCC30B",
  "8": "#A21942",
  "9": "#FD6925",
  "10": "#DD1367",
  "11": "#FD9D24",
  "12": "#BF8B2E",
  "13": "#3F7E44",
  "14": "#0A97D9",
  "15": "#56C02B",
  "16": "#00689D",
  "17": "#19486A",
};

// Função auxiliar para obter a cor (retorna uma cor padrão se não encontrar)
export const getOdsColor = (odsNumber: string | number): string => {
  const key = String(odsNumber).trim(); // Remove espaços extras
  return odsColors[key] || "#6c757d"; // Fallback cinza
};
