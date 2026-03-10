import React from "react";
import { Col, Card, List, Button, Pagination, Empty } from "antd";
import { Projeto } from "@/types/Interface-Projeto";
import { PrefeituraLogo } from "@/components/ui/PrefeituraLogo";
import { listIcons } from "./DashboardConstants";

interface Props {
  title: string;
  listData: Projeto[];
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onDetailsClick: (item: Projeto) => void;
}

export const DashboardListCard: React.FC<Props> = ({
  title,
  listData,
  currentPage,
  pageSize,
  onPageChange,
  onDetailsClick,
}) => {
  const totalCount = listData.length;
  const pagedData = listData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <Col xs={24} md={12} lg={8}>
      <Card
        title={
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {listIcons[title] || null}
            {title} ({totalCount})
          </span>
        }
      >
        {listData.length > 0 ? (
          <>
            <List
              dataSource={pagedData}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="link" onClick={() => onDetailsClick(item)}>
                      Detalhes
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div className="w-10 h-10 flex-shrink-0 bg-gray-50 rounded-full border shadow-sm flex items-center justify-center overflow-hidden">
                        <PrefeituraLogo
                          nomePrefeitura={item.prefeitura}
                          tipo="p"
                          className="max-w-full max-h-full object-contain p-1"
                        />
                      </div>
                    }
                    title={item.nomeProjeto}
                    description={`Prefeitura: ${item.prefeitura}`}
                  />
                </List.Item>
              )}
            />
            {totalCount > pageSize && (
              <div className="mt-4 text-center">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={totalCount}
                  onChange={onPageChange}
                  size="small"
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        ) : (
          <Empty description="Nenhuma solicitação" />
        )}
      </Card>
    </Col>
  );
};
