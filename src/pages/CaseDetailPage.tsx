import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cases, lawyers } from "@/data/mockData";
import { ArrowLeft, Upload, FileText, Plus } from "lucide-react";
import { useState } from "react";

const CaseDetailPage = () => {
  const { id } = useParams();
  const caseData = cases.find((c) => c.id === id);
  const lawyer = caseData
    ? lawyers.find((l) => l.id === caseData.lawyerId)
    : null;

  const [entries, setEntries] = useState(caseData?.entries || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split("T")[0],
    text: "",
    files: [] as string[],
  });

  if (!caseData || !lawyer) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Дело не найдено</p>
      </div>
    );
  }

  const isOverdue =
    new Date(caseData.deadline) < new Date() && caseData.status !== "completed";

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

  const handleAddEntry = () => {
    if (!newEntry.text.trim()) return;

    const entry = {
      id: `entry-${Date.now()}`,
      date: newEntry.date,
      text: newEntry.text,
      files: newEntry.files,
    };

    setEntries([entry, ...entries]);
    setNewEntry({
      date: new Date().toISOString().split("T")[0],
      text: "",
      files: [],
    });
    setIsDialogOpen(false);
  };

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link to={`/lawyer/${caseData.lawyerId}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Дело {caseData.caseNumber}</h1>
        {isOverdue && (
          <Badge variant="destructive" className="animate-pulse-attention">
            Просрочено
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Информация о деле</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Номер дела</p>
              <p className="font-semibold">{caseData.caseNumber}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Клиент</p>
              <p className="font-semibold">{caseData.client}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Категория</p>
              <p className="font-semibold">{caseData.category}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Ордер №</p>
              <p className="font-semibold">{caseData.orderNumber}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Дата ордера</p>
              <p className="font-semibold">
                {new Date(caseData.orderDate).toLocaleDateString("ru-RU", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Дата начала</p>
              <p className="font-semibold">
                {new Date(caseData.startDate).toLocaleDateString("ru-RU", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Срок</p>
              <p
                className={`font-semibold ${
                  isOverdue ? "text-destructive" : ""
                }`}
              >
                {new Date(caseData.deadline).toLocaleDateString("ru-RU", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Статус</p>
              <div className="mt-1">
                {getStatusBadge(isOverdue ? "overdue" : caseData.status)}
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Адвокат</p>
              <Link to={`/lawyer/${lawyer.id}`}>
                <div className="flex items-center gap-3 hover:bg-accent/50 p-2 rounded-lg transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={lawyer.avatar} alt={lawyer.name} />
                    <AvatarFallback>{lawyer.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{lawyer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {lawyer.specialization}
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2">Документы клиента</h4>
              <Button variant="outline" size="sm" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Загрузить паспорт
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Дневник дела</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить запись
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Новая запись в дневнике</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="entry-date">Дата</Label>
                    <Input
                      id="entry-date"
                      type="date"
                      value={newEntry.date}
                      onChange={(e) =>
                        setNewEntry({ ...newEntry, date: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entry-text">Текст записи</Label>
                    <Textarea
                      id="entry-text"
                      placeholder="Опишите событие или действие по делу..."
                      rows={5}
                      value={newEntry.text}
                      onChange={(e) =>
                        setNewEntry({ ...newEntry, text: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Файлы</Label>
                    <Button variant="outline" className="w-full" type="button">
                      <Upload className="h-4 w-4 mr-2" />
                      Прикрепить файлы
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Отмена
                  </Button>
                  <Button onClick={handleAddEntry}>Добавить</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {sortedEntries.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>Записей пока нет</p>
                <p className="text-sm mt-2">
                  Добавьте первую запись в дневник дела
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="border-l-2 border-primary pl-4 pb-6 relative"
                  >
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary" />

                    <div className="mb-2">
                      <p className="text-lg font-semibold">
                        {new Date(entry.date).toLocaleDateString("ru-RU", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <p className="text-foreground mb-3 whitespace-pre-wrap">
                      {entry.text}
                    </p>

                    {entry.files && entry.files.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Прикрепленные файлы:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {entry.files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                            >
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{file}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CaseDetailPage;
