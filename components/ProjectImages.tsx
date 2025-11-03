"use client";

import { Image } from "antd";

interface Item {
  id: string;
  img: string;
}

interface ImageGridProps {
  items: Item[];
}

const ImageGrid: React.FC<ImageGridProps> = ({ items }) => {
  const displayedItems = Array.isArray(items)
    ? items.filter((item) => item && item.img).slice(0, 4)
    : [];

  return (
    <Image.PreviewGroup
      preview={{
        rootClassName: "custom-image-preview-root",
      }}
    >
      <div className="w-full max-w-5xl mx-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {displayedItems.map((item) => (
            <div
              key={item.id}
              className="relative aspect-square cursor-pointer overflow-hidden rounded-xl shadow-lg"
            >
              <Image
                src={item.img}
                alt={`Imagem do portfólio ${item.id}`}
                width="100%"
                height="100%"
                style={{ objectFit: "cover" }}
                className="rounded-xl"
              />
            </div>
          ))}
        </div>
      </div>
    </Image.PreviewGroup>
  );
};

export default ImageGrid;
