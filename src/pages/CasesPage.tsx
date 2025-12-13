import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cases } from "@/data/mockData";
import type { Case, PaymentStatus, CaseResult } from "@/types/lawyer";
import {
  ArrowUpDown,
  Plus,
  CircleDollarSign,
  Trophy,
  Clock,
} from "lucide-react";
import { NewCaseModal } from "@/components/NewCaseModal";

const getStatusColor = (status: Case["status"]) => {
  const colors = {
    active: "bg-success/10 text-success border-success/20",
    overdue: "bg-destructive/10 text-destructive border-destructive/20",
    completed: "bg-muted text-muted-foreground border-border",
    pending: "bg-warning/10 text-warning border-warning/20",
  };
  return colors[status];
};

const getStatusLabel = (status: Case["status"]) => {
  const labels = {
    active: "Активное",
    overdue: "Просрочено",
    completed: "Завершено",
    pending: "В ожидании",
  };
  return labels[status];
};

const getPaymentColor = (status: PaymentStatus) => {
  const colors = {
    paid: "bg-success/10 text-success border-success/20",
    unpaid: "bg-destructive/10 text-destructive border-destructive/20",
    partial: "bg-warning/10 text-warning border-warning/20",
  };
  return colors[status];
};

const getPaymentLabel = (status: PaymentStatus) => {
  const labels = {
    paid: "Оплачено",
    unpaid: "Не оплачено",
    partial: "Частично",
  };
  return labels[status];
};

const getResultColor = (result: CaseResult) => {
  const colors = {
    won: "bg-success/10 text-success border-success/20",
    lost: "bg-destructive/10 text-destructive border-destructive/20",
    partial_win: "bg-warning/10 text-warning border-warning/20",
    settled: "bg-primary/10 text-primary border-primary/20",
    pending: "bg-muted text-muted-foreground border-border",
  };
  return colors[result];
};

const getResultLabel = (result: CaseResult) => {
  const labels = {
    won: "Выиграно",
    lost: "Проиграно",
    partial_win: "Частично",
    settled: "Мировая",
    pending: "В процессе",
  };
  return labels[result];
};

type SortField = "caseNumber" | "deadline" | "startDate" | "status" | "amount";
type SortDirection = "asc" | "desc";

export default function CasesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [resultFilter, setResultFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("caseNumber");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);

  const activeCases = cases.filter((c) => c.status === "active");
  const overdueCases = cases.filter((c) => c.status === "overdue");
  const completedCases = cases.filter((c) => c.status === "completed");
  const unpaidTotal = cases.reduce(
    (acc, c) => acc + (c.amount - c.paidAmount),
    0
  );

  const filteredAndSortedCases = useMemo(() => {
    let filtered = cases.filter((caseItem) => {
      const matchesSearch =
        caseItem.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || caseItem.status === statusFilter;
      const matchesPayment =
        paymentFilter === "all" || caseItem.paymentStatus === paymentFilter;
      const matchesResult =
        resultFilter === "all" || caseItem.caseResult === resultFilter;

      return matchesSearch && matchesStatus && matchesPayment && matchesResult;
    });

    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "caseNumber":
          comparison = a.caseNumber.localeCompare(b.caseNumber);
          break;
        case "deadline":
          comparison =
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
          break;
        case "startDate":
          comparison =
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [
    searchQuery,
    statusFilter,
    paymentFilter,
    resultFilter,
    sortField,
    sortDirection,
  ]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Реестр дел</h1>
          <p className="text-muted-foreground mt-1">
            Управление всеми делами фирмы
          </p>
        </div>
        <Button
          onClick={() => setIsNewCaseModalOpen(true)}
          className="bg-primary hover:bg-primary/90 gap-2"
        >
          <Plus className="w-5 h-5" />
          Новое дело
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border shadow-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Активных дел</p>
              <p className="text-4xl font-bold text-success">
                {activeCases.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Просроченных</p>
              <p className="text-4xl font-bold text-destructive animate-pulse-attention">
                {overdueCases.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Завершено</p>
              <p className="text-4xl font-bold text-foreground">
                {completedCases.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-card border-destructive/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Задолженность
              </p>
              <p className="text-2xl font-bold text-destructive">
                {formatCurrency(unpaidTotal)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <Input
              placeholder="Поиск по номеру, клиенту или категории..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <Clock className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="active">Активное</SelectItem>
                <SelectItem value="overdue">Просрочено</SelectItem>
                <SelectItem value="completed">Завершено</SelectItem>
                <SelectItem value="pending">В ожидании</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <CircleDollarSign className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Оплата" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все оплаты</SelectItem>
                <SelectItem value="paid">Оплачено</SelectItem>
                <SelectItem value="unpaid">Не оплачено</SelectItem>
                <SelectItem value="partial">Частично</SelectItem>
              </SelectContent>
            </Select>
            <Select value={resultFilter} onValueChange={setResultFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <Trophy className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Результат" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все результаты</SelectItem>
                <SelectItem value="won">Выиграно</SelectItem>
                <SelectItem value="lost">Проиграно</SelectItem>
                <SelectItem value="partial_win">Частично выиграно</SelectItem>
                <SelectItem value="settled">Мировая</SelectItem>
                <SelectItem value="pending">В процессе</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cases Table */}
      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">
            Все дела ({filteredAndSortedCases.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border">
                  <TableHead
                    className="text-foreground font-semibold cursor-pointer"
                    onClick={() => handleSort("caseNumber")}
                  >
                    <div className="flex items-center gap-2">
                      Номер дела
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-foreground font-semibold">
                    Клиент
                  </TableHead>
                  <TableHead className="text-foreground font-semibold">
                    Категория
                  </TableHead>
                  <TableHead
                    className="text-foreground font-semibold cursor-pointer"
                    onClick={() => handleSort("amount")}
                  >
                    <div className="flex items-center gap-2">
                      Сумма
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-foreground font-semibold cursor-pointer"
                    onClick={() => handleSort("startDate")}
                  >
                    <div className="flex items-center gap-2">
                      Начало
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-foreground font-semibold cursor-pointer"
                    onClick={() => handleSort("deadline")}
                  >
                    <div className="flex items-center gap-2">
                      Срок
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-foreground font-semibold">
                    Статус
                  </TableHead>
                  <TableHead className="text-foreground font-semibold">
                    Оплата
                  </TableHead>
                  <TableHead className="text-foreground font-semibold">
                    Результат
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedCases.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center text-muted-foreground py-8"
                    >
                      Дела не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedCases.map((caseItem) => {
                    return (
                      <TableRow
                        key={caseItem.id}
                        onClick={() => navigate(`/case/${caseItem.id}`)}
                        className={`cursor-pointer transition-colors border-b border-border/50 ${
                          caseItem.status === "overdue"
                            ? "bg-destructive/5 hover:bg-destructive/10"
                            : caseItem.paymentStatus === "unpaid"
                            ? "bg-warning/5 hover:bg-warning/10"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <TableCell className="font-medium text-foreground">
                          {caseItem.caseNumber}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {caseItem.client}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {caseItem.category}
                        </TableCell>
                        <TableCell className="text-foreground font-medium">
                          {formatCurrency(caseItem.amount)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(caseItem.startDate).toLocaleDateString(
                            "ru"
                          )}
                        </TableCell>
                        <TableCell
                          className={
                            caseItem.status === "overdue"
                              ? "text-destructive font-semibold"
                              : "text-muted-foreground"
                          }
                        >
                          {new Date(caseItem.deadline).toLocaleDateString("ru")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusColor(caseItem.status)}
                            variant="outline"
                          >
                            {getStatusLabel(caseItem.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getPaymentColor(caseItem.paymentStatus)}
                            variant="outline"
                          >
                            {getPaymentLabel(caseItem.paymentStatus)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getResultColor(caseItem.caseResult)}
                            variant="outline"
                          >
                            {getResultLabel(caseItem.caseResult)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <NewCaseModal
        open={isNewCaseModalOpen}
        onOpenChange={setIsNewCaseModalOpen}
      />
    </div>
  );
}
