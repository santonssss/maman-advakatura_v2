import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, X } from "lucide-react";
import type { Lawyer, Case } from "@/types/lawyer";
import { Statistic } from "./Statistic";

type ButtonStatisticsProps = {
  lawyer: Lawyer;
  lawyerCases: Case[];
  allLawyers: Lawyer[];
  allCases: Case[];
};

export const ButtonStatistics: React.FC<ButtonStatisticsProps> = ({
  lawyer,
  lawyerCases,
  allLawyers,
  allCases,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2"
      >
        <BarChart3 className="w-4 h-4" />
        {isOpen
          ? "Скрыть финансовую статистику"
          : "Показать финансовую статистику"}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-3 z-50 w-[min(960px,calc(100vw-3rem))]">
          <div className="relative">
            {/* крестик внутри панели, если захочется закрыть не по кнопке */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-3 top-3 z-10 inline-flex items-center justify-center rounded-full border border-border bg-card/80 p-1 text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
            >
              <X className="w-3 h-3" />
            </button>

            <Statistic
              lawyer={lawyer}
              lawyerCases={lawyerCases}
              allLawyers={allLawyers}
              allCases={allCases}
            />
          </div>
        </div>
      )}
    </div>
  );
};
