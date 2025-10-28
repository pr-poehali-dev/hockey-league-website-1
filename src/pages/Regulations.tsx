import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const Regulations = () => {
  const navigate = useNavigate();
  const [regulations, setRegulations] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('phl_regulations');
    if (saved) {
      setRegulations(saved);
    } else {
      setRegulations(`# Регламент турнира PHL

## 1. Общие положения
Первая Хоккейная Лига (PHL) - это турнир среди 8 команд.

## 2. Система начисления очков
- Победа в основное время: 2 очка
- Победа в овертайме/буллитах: 2 очка
- Поражение в овертайме/буллитах: 1 очко
- Поражение в основное время: 0 очков

## 3. Определение мест в турнирной таблице
При равенстве очков у двух и более команд места определяются по следующим показателям:
1. Разница забитых и пропущенных шайб
2. Количество забитых шайб
3. Количество побед в основное время

## 4. Формат турнира
Турнир проводится в 8 туров. Каждая команда проводит матчи с другими участниками.

## 5. Дополнительные правила
Все правила могут быть изменены администрацией турнира.`);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e17] via-[#0d1221] to-[#0a0e17]">
      <header className="border-b border-primary/20 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold neon-text text-primary">Регламент</h1>
            <Button variant="outline" onClick={() => navigate('/')} className="hover:border-primary">
              <Icon name="Home" size={20} className="mr-2" />
              На главную
            </Button>
          </div>
          <p className="text-muted-foreground mt-2">Первая Хоккейная Лига</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="glass-card border-primary/20 p-8">
          <div className="prose prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-foreground">{regulations}</pre>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Regulations;
