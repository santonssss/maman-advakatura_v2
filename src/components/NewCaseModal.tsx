import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { lawyers } from "@/data/mockData";
import { Upload, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewCaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewCaseModal({ open, onOpenChange }: NewCaseModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    client: "",
    category: "",
    description: "",
    amount: "",
    lawyerId: "",
  });
  const [contractFile, setContractFile] = useState<File | null>(null);

  const categories = [
    "Корпоративное право",
    "Гражданское право",
    "Уголовное право",
    "Административное право",
    "Налоговое право",
    "Семейное право",
    "Трудовое право",
    "Международное право",
    "Арбитражное право",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setContractFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.client || !formData.category) {
      toast({
        title: "Ошибка",
        description: "Заполните обязательные поля",
        variant: "destructive",
      });
      return;
    }

    // Here would be the logic to save the case
    toast({
      title: "Дело создано",
      description: `Дело для клиента ${formData.client} успешно создано`,
    });

    // Reset form
    setFormData({
      client: "",
      category: "",
      description: "",
      amount: "",
      lawyerId: "",
    });
    setContractFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Новое дело
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Contract Upload */}
          <div className="space-y-2">
            <Label className="text-foreground">Договор (скан)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              {contractFile ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <span className="text-foreground">{contractFile.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setContractFile(null)}
                    className="h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    Нажмите для загрузки договора
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Client Name */}
          <div className="space-y-2">
            <Label htmlFor="client" className="text-foreground">
              Клиент *
            </Label>
            <Input
              id="client"
              value={formData.client}
              onChange={(e) =>
                setFormData({ ...formData, client: e.target.value })
              }
              placeholder="ФИО или название организации"
              className="bg-background border-border"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-foreground">Категория дела *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-foreground">
              Сумма договора (₽)
            </Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="По умолчанию оплата позже"
              className="bg-background border-border"
            />
            <p className="text-xs text-muted-foreground">
              Оставьте пустым, если оплата будет позже
            </p>
          </div>

          {/* Lawyer Selection */}
          <div className="space-y-2">
            <Label className="text-foreground">Адвокат (необязательно)</Label>
            <Select
              value={formData.lawyerId}
              onValueChange={(value) =>
                setFormData({ ...formData, lawyerId: value })
              }
            >
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Назначить позже" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Назначить позже</SelectItem>
                {lawyers.map((lawyer) => (
                  <SelectItem key={lawyer.id} value={lawyer.id}>
                    {lawyer.name} — {lawyer.specialization}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Описание
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Краткое описание дела..."
              className="bg-background border-border min-h-[100px]"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Создать дело
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
