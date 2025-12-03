import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    studyPeriod: 7,
    firstResultsPeriod: 14,
    warningThreshold: 3,
    criticalThreshold: 1,
  });

  const handleSave = () => {
    toast({
      title: "Настройки сохранены",
      description: "Параметры сроков успешно обновлены",
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Настройки</h1>
        <p className="text-muted-foreground mt-2">
          Управление сроками и параметрами работы системы
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Сроки работы с делами</CardTitle>
            <CardDescription>
              Настройте стандартные сроки для этапов работы адвокатов
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="study-period">
                Срок на ознакомление с делом (дней)
              </Label>
              <Input
                id="study-period"
                type="number"
                min="1"
                value={settings.studyPeriod}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    studyPeriod: parseInt(e.target.value),
                  })
                }
              />
              <p className="text-sm text-muted-foreground">
                Количество дней, отведённое адвокату на изучение нового дела
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="first-results-period">
                Срок на первые результаты (дней)
              </Label>
              <Input
                id="first-results-period"
                type="number"
                min="1"
                value={settings.firstResultsPeriod}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    firstResultsPeriod: parseInt(e.target.value),
                  })
                }
              />
              <p className="text-sm text-muted-foreground">
                Количество дней на получение первых результатов по делу
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Пороги просрочки</CardTitle>
            <CardDescription>
              Настройте предупреждения о приближающихся сроках
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="warning-threshold">
                Предупреждение (дней до срока)
              </Label>
              <Input
                id="warning-threshold"
                type="number"
                min="1"
                value={settings.warningThreshold}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    warningThreshold: parseInt(e.target.value),
                  })
                }
              />
              <p className="text-sm text-muted-foreground">
                За сколько дней до истечения срока показывать предупреждение
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="critical-threshold">
                Критический порог (дней до срока)
              </Label>
              <Input
                id="critical-threshold"
                type="number"
                min="0"
                value={settings.criticalThreshold}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    criticalThreshold: parseInt(e.target.value),
                  })
                }
              />
              <p className="text-sm text-muted-foreground">
                За сколько дней до истечения срока показывать критическое
                предупреждение
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">
            Сохранить настройки
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
