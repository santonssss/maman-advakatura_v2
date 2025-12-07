import { useMemo } from "react";
import type { Lawyer, Case } from "@/types/lawyer";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type StatisticProps = {
  lawyer: Lawyer;
  lawyerCases: Case[];
  allLawyers: Lawyer[];
  allCases: Case[];
};

export const Statistic: React.FC<StatisticProps> = ({
  lawyer,
  lawyerCases,
  allLawyers,
  allCases,
}) => {
  const {
    lawyerRevenue,
    revenueShare,
    successRate,
    successfulCases,
    failedCases,
    rank,
    totalLawyers,
    revenueByLawyer,
    pieData,
  } = useMemo(() => {
    const safeFee = (c: Case) => c.fee ?? 0;

    const lawyerRevenue = lawyerCases.reduce((sum, c) => sum + safeFee(c), 0);
    const firmRevenue = allCases.reduce((sum, c) => sum + safeFee(c), 0);

    const revenueShare =
      firmRevenue > 0 ? (lawyerRevenue / firmRevenue) * 100 : 0;

    const finished = lawyerCases.filter(
      (c) => c.status === "completed" || c.status === "overdue"
    );
    const successfulCases = finished.filter(
      (c) => c.isSuccessful === true
    ).length;
    const failedCases = finished.length - successfulCases;
    const successRate =
      finished.length > 0 ? (successfulCases / finished.length) * 100 : 0;

    const revenueByLawyer = allLawyers.map((l) => {
      const casesOfLawyer = allCases.filter((c) => c.lawyerId === l.id);
      const rev = casesOfLawyer.reduce((sum, c) => sum + safeFee(c), 0);
      return {
        lawyerId: l.id,
        name: l.name,
        revenue: rev,
      };
    });

    const sorted = [...revenueByLawyer].sort((a, b) => b.revenue - a.revenue);
    const rank = sorted.findIndex((x) => x.lawyerId === lawyer.id) + 1 || null;

    const pieData = [
      {
        name: lawyer.name,
        value: lawyerRevenue,
      },
      {
        name: "Остальные адвокаты",
        value: Math.max(firmRevenue - lawyerRevenue, 0),
      },
    ];

    return {
      lawyerRevenue,
      firmRevenue,
      revenueShare,
      successRate,
      successfulCases,
      failedCases,
      rank,
      totalLawyers: allLawyers.length,
      revenueByLawyer: sorted,
      pieData,
    };
  }, [lawyer, lawyerCases, allLawyers, allCases]);

  return (
    <div className="rounded-xl border border-border bg-card/95 shadow-xl shadow-black/40 p-4 space-y-6">
      {/* Верхний ряд KPI только по деньгам/успеху */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-border/70 bg-card/90 p-4">
          <p className="text-xs text-muted-foreground mb-1">
            Всего денег принес
          </p>
          <p className="text-2xl md:text-3xl font-bold tabular-nums text-primary">
            {lawyerRevenue.toLocaleString("ru-RU")}
          </p>
          <p className="text-[11px] text-muted-foreground mt-2">
            Сумма гонораров по делам этого адвоката
          </p>
        </div>

        <div className="rounded-lg border border-border/70 bg-card/90 p-4">
          <p className="text-xs text-muted-foreground mb-1">
            Доля в выручке фирмы
          </p>
          <p className="text-2xl md:text-3xl font-bold tabular-nums text-chart-2">
            {revenueShare.toFixed(1)}%
          </p>
          <p className="text-[11px] text-muted-foreground mt-2">
            От общей суммы по всем адвокатам
          </p>
        </div>

        <div className="rounded-lg border border-border/70 bg-card/90 p-4">
          <p className="text-xs text-muted-foreground mb-1">Успешность дел</p>
          <p className="text-2xl md:text-3xl font-bold tabular-nums text-chart-3">
            {successRate.toFixed(0)}%
          </p>
          <p className="text-[11px] text-muted-foreground mt-2">
            {successfulCases} успешных / {failedCases} неуспешных
          </p>
        </div>

        <div className="rounded-lg border border-border/70 bg-card/90 p-4">
          <p className="text-xs text-muted-foreground mb-1">Место по выручке</p>
          <p className="text-2xl md:text-3xl font-bold tabular-nums text-chart-4">
            {rank ? `${rank} из ${totalLawyers}` : "—"}
          </p>
          <p className="text-[11px] text-muted-foreground mt-2">
            Позиция среди всех адвокатов
          </p>
        </div>
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Выручка по адвокатам (бар) */}
        <div className="rounded-lg border border-border/70 bg-card/90 p-4 flex flex-col">
          <p className="text-xs text-muted-foreground mb-3">
            Выручка по адвокатам (сравнение)
          </p>
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByLawyer}>
                <CartesianGrid
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-popover)",
                    borderColor: "var(--color-border)",
                    borderRadius: 8,
                    padding: 8,
                  }}
                  formatter={(value: any) => [
                    (value as number).toLocaleString("ru-RU"),
                    "Выручка",
                  ]}
                />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                  {revenueByLawyer.map((entry) => (
                    <Cell
                      key={entry.lawyerId}
                      fill={
                        entry.lawyerId === lawyer.id
                          ? "var(--color-chart-1)"
                          : "var(--color-muted)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Пирог: этот адвокат против остальных */}
        <div className="rounded-lg border border-border/70 bg-card/90 p-4 flex flex-col">
          <p className="text-xs text-muted-foreground mb-3">
            Доля выручки: адвокат против остальных
          </p>
          <div className="flex-1 flex items-center justify-center min-h-[220px]">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={
                        index === 0
                          ? "var(--color-chart-1)"
                          : "var(--color-chart-5)"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-popover)",
                    borderColor: "var(--color-border)",
                    borderRadius: 8,
                    padding: 8,
                  }}
                  labelStyle={{
                    color: "var(--color-muted-foreground)",
                    fontSize: 12,
                  }}
                  itemStyle={{
                    color: "var(--color-foreground)",
                    fontSize: 12,
                  }}
                  formatter={(value: any, name) => [
                    (value as number).toLocaleString("ru-RU"),
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Успешные / неуспешные (мини-график) */}
      <div className="rounded-lg border border-border/70 bg-card/90 p-4">
        <p className="text-xs text-muted-foreground mb-3">
          Успешные и неуспешные дела
        </p>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-3 rounded-full bg-muted/60 overflow-hidden">
            <div
              className="h-3 bg-chart-3"
              style={{
                width:
                  successfulCases + failedCases === 0
                    ? "0%"
                    : `${
                        (successfulCases / (successfulCases + failedCases)) *
                        100
                      }%`,
              }}
            />
          </div>
          <div className="flex gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-chart-3" />
              Успешные: {successfulCases}
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-destructive" />
              Неуспешные: {failedCases}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
