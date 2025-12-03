import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
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
import { type Case } from "@/types/lawyer";
import { ArrowUpDown } from "lucide-react";

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

type SortField = "caseNumber" | "deadline" | "startDate" | "status";
type SortDirection = "asc" | "desc";

export default function CasesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("caseNumber");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const activeCases = cases.filter((c) => c.status === "active");
  const overdueCases = cases.filter((c) => c.status === "overdue");
  const completedCases = cases.filter((c) => c.status === "completed");

  const filteredAndSortedCases = useMemo(() => {
    let filtered = cases.filter((caseItem) => {
      const matchesSearch =
        caseItem.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || caseItem.status === statusFilter;

      return matchesSearch && matchesStatus;
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
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [searchQuery, statusFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Реестр дел</h1>
        <p className="text-muted-foreground mt-1">
          Управление всеми делами фирмы
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <p className="text-sm text-muted-foreground mb-2">
                Просроченных дел
              </p>
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
      </div>

      {/* Filters */}
      <Card className="bg-card border-border shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Поиск по номеру, клиенту или названию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Фильтр по статусу" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="active">Активное</SelectItem>
                <SelectItem value="overdue">Просрочено</SelectItem>
                <SelectItem value="completed">Завершено</SelectItem>
                <SelectItem value="pending">В ожидании</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cases Table */}
      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Все дела</CardTitle>
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
                  <TableHead className="text-foreground font-semibold">
                    Ордер №
                  </TableHead>
                  <TableHead className="text-foreground font-semibold">
                    Дата ордера
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
                  <TableHead
                    className="text-foreground font-semibold cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-2">
                      Статус
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedCases.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
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
                            ? "bg-destructive/5 hover:bg-destructive/10 animate-pulse-attention"
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
                        <TableCell className="text-muted-foreground">
                          {caseItem.orderNumber}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(caseItem.orderDate).toLocaleDateString(
                            "ru"
                          )}
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
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
