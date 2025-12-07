import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, Table as TableIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockLawyers } from "@/data/mockData";
import type { Lawyer } from "@/types/lawyer";

type ViewMode = "cards" | "table";

const getStatusBadge = (status: Lawyer["status"]) => {
  const variants = {
    active: { label: "Активен", variant: "default" as const },
    busy: { label: "Занят", variant: "secondary" as const },
    vacation: { label: "Отпуск", variant: "outline" as const },
  };
  return variants[status];
};

export default function LawyersPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const navigate = useNavigate();

  const handleLawyerClick = (id: string) => {
    navigate(`/lawyer/${id}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Адвокаты</h1>
          <p className="text-muted-foreground mt-1">
            Управление командой адвокатов
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("cards")}
            className="transition-all"
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("table")}
            className="transition-all"
          >
            <TableIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockLawyers.map((lawyer) => (
            <div
              key={lawyer.id}
              onClick={() => handleLawyerClick(lawyer.id)}
              className="bg-card rounded-lg border border-border p-6 hover:border-primary cursor-pointer transition-all hover:shadow-gold group"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="w-24 h-24 border-2 border-primary/20 group-hover:border-primary transition-all">
                  <AvatarImage src={lawyer.photo} alt={lawyer.name} />
                  <AvatarFallback>
                    {lawyer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2 w-full">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {lawyer.name}
                  </h3>
                  <Badge {...getStatusBadge(lawyer.status)}>
                    {getStatusBadge(lawyer.status).label}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-border">
                  {/* Левый верх: активные дела */}
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Активных дел
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {lawyer.activeCases}
                    </p>
                  </div>

                  {/* Правый верх: просрочено */}
                  <div>
                    <p className="text-sm text-muted-foreground">Просрочено</p>
                    <p
                      className={`text-2xl font-bold ${
                        lawyer.overdueCases > 0
                          ? "text-destructive animate-pulse-attention"
                          : "text-success"
                      }`}
                    >
                      {lawyer.overdueCases}
                    </p>
                  </div>

                  {/* Нижний центр: всего дел */}
                  <div className="col-span-2 flex flex-col items-center">
                    <p className="text-sm text-muted-foreground">Общих дел</p>
                    <p className="text-2xl font-bold text-foreground">
                      {lawyer.totalCases}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="text-foreground font-semibold">
                  Адвокат
                </TableHead>
                <TableHead className="text-foreground font-semibold">
                  Статус
                </TableHead>
                <TableHead className="text-foreground font-semibold text-right">
                  Всего дел
                </TableHead>
                <TableHead className="text-foreground font-semibold text-right">
                  Активных дел
                </TableHead>
                <TableHead className="text-foreground font-semibold text-right">
                  Просрочено
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLawyers.map((lawyer) => (
                <TableRow
                  key={lawyer.id}
                  onClick={() => handleLawyerClick(lawyer.id)}
                  className="cursor-pointer hover:bg-muted/50 transition-colors border-b border-border/50"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border border-primary/20">
                        <AvatarImage src={lawyer.photo} alt={lawyer.name} />
                        <AvatarFallback>
                          {lawyer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-foreground">{lawyer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge {...getStatusBadge(lawyer.status)}>
                      {getStatusBadge(lawyer.status).label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {lawyer.totalCases}
                  </TableCell>
                  <TableCell className="text-right text-foreground font-semibold">
                    {lawyer.activeCases}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`font-bold ${
                        lawyer.overdueCases > 0
                          ? "text-destructive"
                          : "text-success"
                      }`}
                    >
                      {lawyer.overdueCases}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
