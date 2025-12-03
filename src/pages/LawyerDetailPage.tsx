import { useParams, Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { lawyers, cases } from "@/data/mockData";
import { ArrowLeft, Mail, Phone, Upload, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import type { Case } from "@/types/lawyer";

const LawyerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const lawyer = lawyers.find((l) => l.id === id);
  const lawyerCases = cases.filter((c) => c.lawyerId === id);

  const [sortField, setSortField] = useState<keyof Case | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  if (!lawyer) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Адвокат не найден</p>
      </div>
    );
  }

  const handleSort = (field: keyof Case) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedCases = [...lawyerCases].sort((a, b) => {
    if (!sortField) return 0;

    const aVal = a[sortField];
    const bVal = b[sortField];

    if (aVal === undefined || bVal === undefined) return 0;

    if (
      sortField === "deadline" ||
      sortField === "startDate" ||
      sortField === "orderDate"
    ) {
      const aTime = new Date(aVal as string).getTime();
      const bTime = new Date(bVal as string).getTime();
      return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
    }

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return 0;
  });

  const activeCases = lawyerCases.filter((c) => c.status === "active").length;
  const overdueCases = lawyerCases.filter((c) => {
    if (c.status === "completed") return false;
    return new Date(c.deadline) < new Date();
  }).length;

  const isOverdue = (deadline: string, status: string) => {
    if (status === "completed") return false;
    return new Date(deadline) < new Date();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      active: "default",
      pending: "secondary",
      completed: "outline",
      overdue: "destructive",
    };

    const labels: Record<string, string> = {
      active: "Активно",
      pending: "В ожидании",
      completed: "Завершено",
      overdue: "Просрочено",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Профиль адвоката</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Личная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={lawyer.avatar} alt={lawyer.name} />
                <AvatarFallback>{lawyer.name[0]}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Изменить фото
              </Button>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold">{lawyer.name}</h3>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{lawyer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{lawyer.phone}</span>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Специализация</p>
                  <p className="font-medium">{lawyer.specialization}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Опыт работы</p>
                  <p className="font-medium">{lawyer.experience} лет</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Образование</p>
                  <p className="font-medium">{lawyer.education}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2">Документы</h4>
              <Button variant="outline" size="sm" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Загрузить паспорт
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>KPI и статистика</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-3xl font-bold text-primary">
                  {lawyerCases.length}
                </p>
                <p className="text-sm text-muted-foreground">Всего дел</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-3xl font-bold text-green-500">
                  {activeCases}
                </p>
                <p className="text-sm text-muted-foreground">Активных</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-3xl font-bold text-destructive">
                  {overdueCases}
                </p>
                <p className="text-sm text-muted-foreground">Просрочено</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Дела адвоката</h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("caseNumber")}
                      >
                        <div className="flex items-center gap-2">
                          Номер дела
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("client")}
                      >
                        <div className="flex items-center gap-2">
                          Клиент
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("category")}
                      >
                        <div className="flex items-center gap-2">
                          Категория
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("orderNumber")}
                      >
                        <div className="flex items-center gap-2">
                          Ордер №
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("orderDate")}
                      >
                        <div className="flex items-center gap-2">
                          Дата ордера
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("startDate")}
                      >
                        <div className="flex items-center gap-2">
                          Начало
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("deadline")}
                      >
                        <div className="flex items-center gap-2">
                          Срок
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center gap-2">
                          Статус
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedCases.map((caseItem) => (
                      <TableRow
                        key={caseItem.id}
                        onClick={() => navigate(`/case/${caseItem.id}`)}
                        className={`cursor-pointer hover:bg-accent/50 transition-colors ${
                          isOverdue(caseItem.deadline, caseItem.status)
                            ? "bg-destructive/10 animate-pulse-attention"
                            : ""
                        }`}
                      >
                        <TableCell className="font-medium">
                          {caseItem.caseNumber}
                        </TableCell>
                        <TableCell>{caseItem.client}</TableCell>
                        <TableCell>{caseItem.category}</TableCell>
                        <TableCell>{caseItem.orderNumber}</TableCell>
                        <TableCell>
                          {new Date(caseItem.orderDate).toLocaleDateString(
                            "ru-RU"
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(caseItem.startDate).toLocaleDateString(
                            "ru-RU"
                          )}
                        </TableCell>
                        <TableCell
                          className={
                            isOverdue(caseItem.deadline, caseItem.status)
                              ? "text-destructive font-semibold"
                              : ""
                          }
                        >
                          {new Date(caseItem.deadline).toLocaleDateString(
                            "ru-RU"
                          )}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(
                            isOverdue(caseItem.deadline, caseItem.status)
                              ? "overdue"
                              : caseItem.status
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LawyerDetailPage;
