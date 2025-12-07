import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cases, lawyers } from "@/data/mockData";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  FileText,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AnalyticsPage = () => {
  const [period, setPeriod] = useState<"month" | "quarter" | "year">("month");

  // Вычисляем метрики
  const metrics = useMemo(() => {
    const now = new Date();
    const activeCases = cases.filter((c) => c.status === "active");
    const completedCases = cases.filter((c) => c.status === "completed");
    const overdueCases = cases.filter((c) => {
      const deadline = new Date(c.deadline);
      return deadline < now && c.status !== "completed";
    });

    // Выручка
    const totalRevenue = lawyers.reduce(
      (sum, l) => sum + (l.totalRevenue || 0),
      0
    );
    const avgRevenue = totalRevenue / lawyers.length;

    // Предполагаемая задолженность (30% от активных дел)
    const estimatedDebt = activeCases.length * 250000;

    return {
      totalCases: cases.length,
      activeCases: activeCases.length,
      completedCases: completedCases.length,
      overdueCases: overdueCases.length,
      totalRevenue,
      avgRevenue,
      estimatedDebt,
      successRate:
        Math.round((completedCases.length / cases.length) * 100) || 0,
    };
  }, []);

  // Данные по статусам дел для пайчарта
  const caseStatusData = useMemo(
    () => [
      {
        name: "Активные",
        value: metrics.activeCases,
        color: "hsl(43, 74%, 66%)",
      },
      {
        name: "Завершены",
        value: metrics.completedCases,
        color: "hsl(142, 76%, 36%)",
      },
      {
        name: "Просрочены",
        value: metrics.overdueCases,
        color: "hsl(0, 70%, 50%)",
      },
      {
        name: "На паузе",
        value: cases.filter((c) => c.status === "pending").length,
        color: "hsl(45, 5%, 60%)",
      },
    ],
    [metrics]
  );

  // Данные выручки по адвокатам
  const lawyerRevenueData = useMemo(
    () =>
      lawyers
        .map((l) => ({
          name: l.name.split(" ")[0],
          revenue: (l.totalRevenue || 0) / 1000000,
          winRate: l.winRate || 0,
          fullName: l.name,
        }))
        .sort((a, b) => b.revenue - a.revenue),
    []
  );

  // Месячная динамика (симуляция)
  const monthlyTrend = useMemo(
    () => [
      { month: "Янв", revenue: 4.2, cases: 8 },
      { month: "Фев", revenue: 3.8, cases: 6 },
      { month: "Мар", revenue: 5.1, cases: 10 },
      { month: "Апр", revenue: 4.5, cases: 7 },
      { month: "Май", revenue: 6.2, cases: 12 },
      { month: "Июн", revenue: 5.8, cases: 9 },
      { month: "Июл", revenue: 7.1, cases: 14 },
      { month: "Авг", revenue: 6.5, cases: 11 },
      { month: "Сен", revenue: 8.2, cases: 15 },
      { month: "Окт", revenue: 7.8, cases: 13 },
      { month: "Ноя", revenue: 9.1, cases: 16 },
      { month: "Дек", revenue: 8.5, cases: 12 },
    ],
    []
  );

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)} млн ₽`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)} тыс ₽`;
    return `${value} ₽`;
  };

  // Определяем "здоровье" бизнеса
  const businessHealth = useMemo(() => {
    const overdueRatio = metrics.overdueCases / metrics.totalCases;
    if (overdueRatio > 0.3)
      return {
        status: "critical",
        label: "Требуется внимание",
        color: "text-destructive",
      };
    if (overdueRatio > 0.15)
      return { status: "warning", label: "Есть риски", color: "text-warning" };
    return { status: "good", label: "Всё в порядке", color: "text-success" };
  }, [metrics]);

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Аналитика
          </h1>
          <p className="text-muted-foreground mt-1">Обзор состояния бизнеса</p>
        </div>
        <Select
          value={period}
          onValueChange={(v: "month" | "quarter" | "year") => setPeriod(v)}
        >
          <SelectTrigger className="w-[180px] bg-card border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Текущий месяц</SelectItem>
            <SelectItem value="quarter">Квартал</SelectItem>
            <SelectItem value="year">Год</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Главный индикатор здоровья */}
      <Card
        className={`border-2 ${
          businessHealth.status === "good"
            ? "border-success/50 bg-success/5"
            : businessHealth.status === "warning"
            ? "border-warning/50 bg-warning/5"
            : "border-destructive/50 bg-destructive/5"
        }`}
      >
        <CardContent className="p-6 flex items-center gap-6">
          <div
            className={`p-4 rounded-full ${
              businessHealth.status === "good"
                ? "bg-success/20"
                : businessHealth.status === "warning"
                ? "bg-warning/20"
                : "bg-destructive/20"
            }`}
          >
            {businessHealth.status === "good" ? (
              <CheckCircle className="h-10 w-10 text-success" />
            ) : businessHealth.status === "warning" ? (
              <AlertTriangle className="h-10 w-10 text-warning" />
            ) : (
              <AlertCircle className="h-10 w-10 text-destructive" />
            )}
          </div>
          <div>
            <p className={`text-2xl font-bold ${businessHealth.color}`}>
              {businessHealth.label}
            </p>
            <p className="text-muted-foreground">
              {businessHealth.status === "good"
                ? "Дела идут хорошо, нет критичных проблем"
                : businessHealth.status === "warning"
                ? `${metrics.overdueCases} дел требуют внимания`
                : "Много просроченных дел, нужно срочно вмешаться"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Ключевые метрики - большие карточки */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Выручка */}
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Общая выручка</p>
                <p className="text-3xl md:text-4xl font-bold text-primary mt-2">
                  {formatCurrency(metrics.totalRevenue)}
                </p>
                <div className="flex items-center gap-1 mt-2 text-success text-sm">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+12% к прошлому периоду</span>
                </div>
              </div>
              <div className="p-3 bg-primary/20 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Активные дела */}
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Активных дел</p>
                <p className="text-3xl md:text-4xl font-bold text-blue-400 mt-2">
                  {metrics.activeCases}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  из {metrics.totalCases} всего
                </p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Просроченные */}
        <Card
          className={`bg-gradient-to-br ${
            metrics.overdueCases > 0
              ? "from-destructive/20 to-destructive/5 border-destructive/30"
              : "from-success/20 to-success/5 border-success/30"
          }`}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Просрочено</p>
                <p
                  className={`text-3xl md:text-4xl font-bold mt-2 ${
                    metrics.overdueCases > 0
                      ? "text-destructive"
                      : "text-success"
                  }`}
                >
                  {metrics.overdueCases}
                </p>
                <p
                  className={`text-sm mt-2 ${
                    metrics.overdueCases > 0
                      ? "text-destructive/80"
                      : "text-success/80"
                  }`}
                >
                  {metrics.overdueCases > 0 ? "требуют внимания" : "отлично!"}
                </p>
              </div>
              <div
                className={`p-3 rounded-full ${
                  metrics.overdueCases > 0
                    ? "bg-destructive/20"
                    : "bg-success/20"
                }`}
              >
                <Clock
                  className={`h-6 w-6 ${
                    metrics.overdueCases > 0
                      ? "text-destructive"
                      : "text-success"
                  }`}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Задолженность */}
        <Card className="bg-gradient-to-br from-orange-500/20 to-orange-500/5 border-orange-500/30">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">К получению</p>
                <p className="text-3xl md:text-4xl font-bold text-orange-400 mt-2">
                  {formatCurrency(metrics.estimatedDebt)}
                </p>
                <div className="flex items-center gap-1 mt-2 text-orange-400/80 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span>ожидает оплаты</span>
                </div>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Графики */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Динамика выручки */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Динамика за год
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Выручка и количество дел по месяцам
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(43, 74%, 66%)"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(43, 74%, 66%)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(45, 5%, 60%)", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(45, 5%, 60%)", fontSize: 12 }}
                    tickFormatter={(v) => `${v} млн`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 8%)",
                      border: "1px solid hsl(43, 30%, 25%)",
                      borderRadius: "8px",
                      color: "hsl(45, 8%, 95%)",
                    }}
                    formatter={(value: number, name: string) => [
                      name === "revenue" ? `${value} млн ₽` : `${value} дел`,
                      name === "revenue" ? "Выручка" : "Дела",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(43, 74%, 66%)"
                    strokeWidth={3}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Распределение дел */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Статус дел</CardTitle>
            <p className="text-sm text-muted-foreground">
              Распределение по статусам
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={caseStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {caseStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 8%)",
                      border: "1px solid hsl(43, 30%, 25%)",
                      borderRadius: "8px",
                      color: "hsl(45, 8%, 95%)",
                    }}
                    formatter={(value: number, name: string) => [
                      `${value} дел`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {caseStatusData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Рейтинг адвокатов */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Эффективность адвокатов
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Выручка в миллионах рублей и процент побед
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lawyerRevenueData} layout="vertical">
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(45, 5%, 60%)", fontSize: 12 }}
                  tickFormatter={(v) => `${v} млн`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(45, 8%, 95%)", fontSize: 13 }}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 8%)",
                    border: "1px solid hsl(43, 30%, 25%)",
                    borderRadius: "8px",
                    color: "hsl(45, 8%, 95%)",
                  }}
                  formatter={(value: number, _: string, props: any) => [
                    `${value.toFixed(1)} млн ₽ | ${
                      props.payload.winRate
                    }% побед`,
                    props.payload.fullName,
                  ]}
                />
                <Bar
                  dataKey="revenue"
                  fill="hsl(43, 74%, 66%)"
                  radius={[0, 6, 6, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Проблемные зоны */}
      {metrics.overdueCases > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Требуют внимания
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cases
                .filter((c) => {
                  const deadline = new Date(c.deadline);
                  return deadline < new Date() && c.status !== "completed";
                })
                .map((c) => {
                  const lawyer = lawyers.find((l) => l.id === c.lawyerId);
                  const daysOverdue = Math.floor(
                    (new Date().getTime() - new Date(c.deadline).getTime()) /
                      (1000 * 60 * 60 * 24)
                  );
                  return (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-4 bg-card rounded-lg border border-destructive/20"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {c.caseNumber} — {c.client}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {lawyer?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-destructive font-semibold">
                          Просрочено {daysOverdue} дн.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {c.category}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsPage;
