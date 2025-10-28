import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Player {
  id: string;
  name: string;
  team: string;
  number: number;
  goals: number;
  assists: number;
  games: number;
  penalties: number;
}

const TEAM_COLORS: Record<string, string> = {
  'ЦСКА': '#e31e24',
  'СКА': '#0066b2',
  'ЛАДА': '#00a651',
  'АМУР': '#ff6b00',
  'АКБАРС': '#006341',
  'МЕТАЛЛУРГ': '#c8102e',
  'СОЧИ': '#0099cc',
  'АДМИРАЛ': '#003087'
};

const Stats = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const savedPlayers = localStorage.getItem('phl_players');
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    }
  }, []);

  const topScorers = [...players]
    .sort((a, b) => (b.goals + b.assists) - (a.goals + a.assists))
    .slice(0, 10);

  const topGoalScorers = [...players]
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 10);

  const topAssistants = [...players]
    .sort((a, b) => b.assists - a.assists)
    .slice(0, 10);

  const PlayerTable = ({ players, stat }: { players: Player[], stat: 'total' | 'goals' | 'assists' }) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-primary/20">
            <th className="text-left py-3 px-4 text-muted-foreground font-medium">#</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium">Игрок</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium">Команда</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium">И</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium">Г</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium">П</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium">О</th>
          </tr>
        </thead>
        <tbody>
          {players.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-8 text-muted-foreground">
                Нет данных. Добавьте игроков через админ-панель.
              </td>
            </tr>
          ) : (
            players.map((player, index) => (
              <tr key={player.id} className="border-b border-primary/10 hover:bg-primary/5">
                <td className="py-3 px-4 font-bold text-primary">{index + 1}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-muted-foreground">#{player.number}</span>
                    <span className="font-semibold">{player.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span 
                    className="font-semibold" 
                    style={{ color: TEAM_COLORS[player.team] || '#fff' }}
                  >
                    {player.team}
                  </span>
                </td>
                <td className="text-center py-3 px-4 text-muted-foreground">{player.games}</td>
                <td className="text-center py-3 px-4 font-bold text-primary">{player.goals}</td>
                <td className="text-center py-3 px-4 font-bold text-accent">{player.assists}</td>
                <td className="text-center py-3 px-4 font-bold">{player.goals + player.assists}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="gap-2"
          >
            <Icon name="ArrowLeft" size={20} />
            На главную
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Статистика игроков
          </h1>
          <div className="w-32" />
        </div>

        <Tabs defaultValue="scorers" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="scorers" className="gap-2">
              <Icon name="Trophy" size={16} />
              Бомбардиры
            </TabsTrigger>
            <TabsTrigger value="goals" className="gap-2">
              <Icon name="Target" size={16} />
              Снайперы
            </TabsTrigger>
            <TabsTrigger value="assists" className="gap-2">
              <Icon name="Users" size={16} />
              Ассистенты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scorers">
            <Card className="glass-card border-primary/30 p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Icon name="Award" size={24} className="text-primary" />
                Лучшие бомбардиры (Г+П)
              </h2>
              <PlayerTable players={topScorers} stat="total" />
            </Card>
          </TabsContent>

          <TabsContent value="goals">
            <Card className="glass-card border-primary/30 p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Icon name="Flame" size={24} className="text-primary" />
                Лучшие снайперы
              </h2>
              <PlayerTable players={topGoalScorers} stat="goals" />
            </Card>
          </TabsContent>

          <TabsContent value="assists">
            <Card className="glass-card border-primary/30 p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Icon name="HandHelping" size={24} className="text-accent" />
                Лучшие по передачам
              </h2>
              <PlayerTable players={topAssistants} stat="assists" />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Stats;
