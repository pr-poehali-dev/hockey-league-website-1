import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Team {
  id: string;
  name: string;
  logo: string;
  wins: number;
  losses: number;
  otLosses: number;
  goalsFor: number;
  goalsAgainst: number;
  players: string[];
}

interface Match {
  id: string;
  tour: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  overtime: boolean;
  shootout: boolean;
  date: string;
}

interface Champion {
  season: string;
  winner: string;
  runnerUp: string;
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

const TEAM_LOGOS: Record<string, string> = {
  'ЦСКА': 'https://cdn.poehali.dev/projects/ac9779fa-ed4f-4f90-94bd-d271950d6e7a/files/7cc1c226-1ad3-4e6e-a664-4ccca034b6a3.jpg',
  'СКА': 'https://cdn.poehali.dev/projects/ac9779fa-ed4f-4f90-94bd-d271950d6e7a/files/98f7fcb5-191d-4728-924d-be960d91edcc.jpg',
  'ЛАДА': 'https://cdn.poehali.dev/projects/ac9779fa-ed4f-4f90-94bd-d271950d6e7a/files/0a9fe94a-fcb4-406a-9e1b-5fa1b3498943.jpg',
  'АМУР': 'https://cdn.poehali.dev/projects/ac9779fa-ed4f-4f90-94bd-d271950d6e7a/files/e2339579-4c02-4127-975d-e58968034e0a.jpg',
  'АКБАРС': 'https://cdn.poehali.dev/projects/ac9779fa-ed4f-4f90-94bd-d271950d6e7a/files/40882092-9c55-4adf-a387-6fe7f0afe114.jpg',
  'МЕТАЛЛУРГ': '⚫',
  'СОЧИ': '🔷',
  'АДМИРАЛ': '⚓'
};

function MatchCard({ 
  match, 
  onUpdate
}: { 
  match: Match; 
  onUpdate: (id: string, homeScore: number, awayScore: number, overtime: boolean, shootout: boolean) => void;
}) {
  const [homeScore, setHomeScore] = useState(match.homeScore?.toString() || '');
  const [awayScore, setAwayScore] = useState(match.awayScore?.toString() || '');
  const [overtime, setOvertime] = useState(match.overtime);
  const [shootout, setShootout] = useState(match.shootout);

  const handleSubmit = () => {
    const home = parseInt(homeScore) || 0;
    const away = parseInt(awayScore) || 0;
    onUpdate(match.id, home, away, overtime, shootout);
  };

  const isFinished = match.homeScore !== null && match.awayScore !== null;

  return (
    <div className="flex items-center gap-4 p-4 bg-card/30 rounded-lg border border-primary/10 hover:border-primary/30 transition-all">
      <div className="flex-1 text-right">
        <span className="font-semibold text-lg" style={{ color: TEAM_COLORS[match.homeTeam] }}>
          {match.homeTeam}
        </span>
      </div>
      
      {isFinished ? (
        <div className="flex items-center gap-2 px-4">
          <span className="text-2xl font-bold text-primary">{match.homeScore}</span>
          <span className="text-muted-foreground">:</span>
          <span className="text-2xl font-bold text-primary">{match.awayScore}</span>
          {(match.overtime || match.shootout) && (
            <Badge variant="outline" className="ml-2 border-yellow-400 text-yellow-400">
              {match.shootout ? 'Б' : 'ОТ'}
            </Badge>
          )}
        </div>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="border-primary/30 hover:border-primary">
              Счет
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-primary/30">
            <DialogHeader>
              <DialogTitle>Внести результат</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-right font-semibold" style={{ color: TEAM_COLORS[match.homeTeam] }}>
                  {match.homeTeam}
                </div>
                <Input 
                  type="number" 
                  value={homeScore} 
                  onChange={(e) => setHomeScore(e.target.value)}
                  className="text-center"
                />
                <div />
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-right font-semibold" style={{ color: TEAM_COLORS[match.awayTeam] }}>
                  {match.awayTeam}
                </div>
                <Input 
                  type="number" 
                  value={awayScore} 
                  onChange={(e) => setAwayScore(e.target.value)}
                  className="text-center"
                />
                <div />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={overtime} 
                    onChange={(e) => {
                      setOvertime(e.target.checked);
                      if (e.target.checked) setShootout(false);
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">Овертайм</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={shootout} 
                    onChange={(e) => {
                      setShootout(e.target.checked);
                      if (e.target.checked) setOvertime(false);
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">Буллиты</span>
                </label>
              </div>
              <Button onClick={handleSubmit} className="w-full bg-primary hover:bg-primary/90">
                Сохранить
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      <div className="flex-1">
        <span className="font-semibold text-lg" style={{ color: TEAM_COLORS[match.awayTeam] }}>
          {match.awayTeam}
        </span>
      </div>
      
      <div className="text-sm text-muted-foreground">{match.date}</div>
    </div>
  );
}

const DEFAULT_TEAMS: Team[] = [
  { id: '1', name: 'ЦСКА', logo: TEAM_LOGOS['ЦСКА'], wins: 0, losses: 0, otLosses: 0, goalsFor: 0, goalsAgainst: 0, players: ['Иванов А.', 'Петров Б.', 'Сидоров В.', 'Козлов Г.', 'Морозов Д.'] },
  { id: '2', name: 'СКА', logo: TEAM_LOGOS['СКА'], wins: 0, losses: 0, otLosses: 0, goalsFor: 0, goalsAgainst: 0, players: ['Смирнов А.', 'Кузнецов Б.', 'Попов В.', 'Волков Г.', 'Соколов Д.'] },
  { id: '3', name: 'ЛАДА', logo: TEAM_LOGOS['ЛАДА'], wins: 0, losses: 0, otLosses: 0, goalsFor: 0, goalsAgainst: 0, players: ['Лебедев А.', 'Новиков Б.', 'Федоров В.', 'Михайлов Г.', 'Александров Д.'] },
  { id: '4', name: 'АМУР', logo: TEAM_LOGOS['АМУР'], wins: 0, losses: 0, otLosses: 0, goalsFor: 0, goalsAgainst: 0, players: ['Васильев А.', 'Павлов Б.', 'Семенов В.', 'Голубев Г.', 'Виноградов Д.'] },
  { id: '5', name: 'АКБАРС', logo: TEAM_LOGOS['АКБАРС'], wins: 0, losses: 0, otLosses: 0, goalsFor: 0, goalsAgainst: 0, players: ['Романов А.', 'Егоров Б.', 'Макаров В.', 'Фролов Г.', 'Григорьев Д.'] },
  { id: '6', name: 'МЕТАЛЛУРГ', logo: '⚫', wins: 0, losses: 0, otLosses: 0, goalsFor: 0, goalsAgainst: 0, players: ['Степанов А.', 'Николаев Б.', 'Орлов В.', 'Андреев Г.', 'Яковлев Д.'] },
  { id: '7', name: 'СОЧИ', logo: '🔷', wins: 0, losses: 0, otLosses: 0, goalsFor: 0, goalsAgainst: 0, players: ['Борисов А.', 'Герасимов Б.', 'Ильин В.', 'Гусев Г.', 'Титов Д.'] },
  { id: '8', name: 'АДМИРАЛ', logo: '⚓', wins: 0, losses: 0, otLosses: 0, goalsFor: 0, goalsAgainst: 0, players: ['Максимов А.', 'Сергеев Б.', 'Захаров В.', 'Королев Г.', 'Никитин Д.'] },
];

const Index = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS);

  const [matches, setMatches] = useState<Match[]>([]);
  const [champions, setChampions] = useState<Champion[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  useEffect(() => {
    const savedTeams = localStorage.getItem('phl_teams');
    const savedMatches = localStorage.getItem('phl_matches');
    const savedChampions = localStorage.getItem('phl_champions');
    
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    }
    if (savedMatches) {
      setMatches(JSON.parse(savedMatches));
    } else {
      setMatches([
        { id: '1', tour: 1, homeTeam: 'ЦСКА', awayTeam: 'СКА', homeScore: null, awayScore: null, overtime: false, shootout: false, date: '01.11' },
        { id: '2', tour: 1, homeTeam: 'ЛАДА', awayTeam: 'АМУР', homeScore: null, awayScore: null, overtime: false, shootout: false, date: '01.11' },
        { id: '3', tour: 1, homeTeam: 'АКБАРС', awayTeam: 'МЕТАЛЛУРГ', homeScore: null, awayScore: null, overtime: false, shootout: false, date: '02.11' },
        { id: '4', tour: 1, homeTeam: 'СОЧИ', awayTeam: 'АДМИРАЛ', homeScore: null, awayScore: null, overtime: false, shootout: false, date: '02.11' },
        { id: '5', tour: 2, homeTeam: 'СКА', awayTeam: 'ЛАДА', homeScore: null, awayScore: null, overtime: false, shootout: false, date: '08.11' },
        { id: '6', tour: 2, homeTeam: 'АМУР', awayTeam: 'ЦСКА', homeScore: null, awayScore: null, overtime: false, shootout: false, date: '08.11' },
        { id: '7', tour: 2, homeTeam: 'МЕТАЛЛУРГ', awayTeam: 'СОЧИ', homeScore: null, awayScore: null, overtime: false, shootout: false, date: '09.11' },
        { id: '8', tour: 2, homeTeam: 'АДМИРАЛ', awayTeam: 'АКБАРС', homeScore: null, awayScore: null, overtime: false, shootout: false, date: '09.11' },
      ]);
    }
    if (savedChampions) {
      setChampions(JSON.parse(savedChampions));
    } else {
      setChampions([
        { season: '2024', winner: 'ЦСКА', runnerUp: 'СКА' },
        { season: '2023', winner: 'СКА', runnerUp: 'АКБАРС' },
      ]);
    }
  }, []);

  const calculatePoints = (team: Team) => team.wins * 2 + team.otLosses;
  
  const calculateGoalDiff = (team: Team) => team.goalsFor - team.goalsAgainst;

  const sortedTeams = [...teams].sort((a, b) => {
    const pointsDiff = calculatePoints(b) - calculatePoints(a);
    if (pointsDiff !== 0) return pointsDiff;
    return calculateGoalDiff(b) - calculateGoalDiff(a);
  });

  const updateMatchScore = (matchId: string, homeScore: number, awayScore: number, overtime: boolean, shootout: boolean) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    const updatedMatches = matches.map(m => 
      m.id === matchId 
        ? { ...m, homeScore, awayScore, overtime, shootout }
        : m
    );
    setMatches(updatedMatches);

    const updatedTeams = teams.map(team => {
      if (team.name === match.homeTeam) {
        const isWinner = homeScore > awayScore;
        const isOTLoss = homeScore < awayScore && (overtime || shootout);
        return {
          ...team,
          wins: team.wins + (isWinner ? 1 : 0),
          losses: team.losses + (homeScore < awayScore && !overtime && !shootout ? 1 : 0),
          otLosses: team.otLosses + (isOTLoss ? 1 : 0),
          goalsFor: team.goalsFor + homeScore,
          goalsAgainst: team.goalsAgainst + awayScore,
        };
      }
      if (team.name === match.awayTeam) {
        const isWinner = awayScore > homeScore;
        const isOTLoss = awayScore < homeScore && (overtime || shootout);
        return {
          ...team,
          wins: team.wins + (isWinner ? 1 : 0),
          losses: team.losses + (awayScore < homeScore && !overtime && !shootout ? 1 : 0),
          otLosses: team.otLosses + (isOTLoss ? 1 : 0),
          goalsFor: team.goalsFor + awayScore,
          goalsAgainst: team.goalsAgainst + homeScore,
        };
      }
      return team;
    });

    setTeams(updatedTeams);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e17] via-[#0d1221] to-[#0a0e17]">
      <header className="border-b border-primary/20 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-5xl font-bold neon-text text-primary">PHL</h1>
            <div className="flex gap-4 items-center">
              <Button variant="ghost" onClick={() => navigate('/regulations')} className="hover:text-primary">
                Регламент
              </Button>
              <Button variant="outline" size="icon" className="hover:text-primary hover:border-primary transition-all" asChild>
                <a href="https://t.me" target="_blank" rel="noopener noreferrer">
                  <Icon name="Send" size={20} />
                </a>
              </Button>
              <Button variant="outline" size="icon" className="hover:text-secondary hover:border-secondary transition-all" asChild>
                <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
                  <Icon name="MessageCircle" size={20} />
                </a>
              </Button>
              <Button variant="outline" size="icon" className="hover:text-accent hover:border-accent transition-all" asChild>
                <a href="https://twitch.tv" target="_blank" rel="noopener noreferrer">
                  <Icon name="Tv" size={20} />
                </a>
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground mt-2">Первая Хоккейная Лига</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="standings" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-card/50">
            <TabsTrigger value="standings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Таблица
            </TabsTrigger>
            <TabsTrigger value="teams" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Команды
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Календарь
            </TabsTrigger>
            <TabsTrigger value="champions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Чемпионы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="standings" className="animate-fade-in">
            <Card className="glass-card border-primary/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-primary/20 bg-primary/10">
                      <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Команда</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">И</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">В</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">ВО</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">П</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">Ш</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">О</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTeams.map((team, index) => (
                      <tr 
                        key={team.id} 
                        className="border-b border-primary/10 hover:bg-primary/5 transition-colors cursor-pointer"
                        onClick={() => setSelectedTeam(team)}
                      >
                        <td className="px-4 py-4">
                          <Badge 
                            variant="outline" 
                            className={`${index < 3 ? 'border-primary text-primary' : 'border-muted-foreground'}`}
                          >
                            {index + 1}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {team.logo.startsWith('http') ? (
                              <img src={team.logo} alt={team.name} className="w-8 h-8 object-contain rounded" />
                            ) : (
                              <span className="text-2xl">{team.logo}</span>
                            )}
                            <span 
                              className="font-semibold text-lg"
                              style={{ color: TEAM_COLORS[team.name] }}
                            >
                              {team.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">{team.wins + team.losses + team.otLosses}</td>
                        <td className="px-4 py-4 text-center text-green-400">{team.wins}</td>
                        <td className="px-4 py-4 text-center text-yellow-400">{team.otLosses}</td>
                        <td className="px-4 py-4 text-center text-red-400">{team.losses}</td>
                        <td className="px-4 py-4 text-center text-muted-foreground">
                          {team.goalsFor}:{team.goalsAgainst}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-xl font-bold text-primary neon-text">
                            {calculatePoints(team)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="teams" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teams.map(team => (
                <Card 
                  key={team.id} 
                  className="glass-card border-primary/20 hover:border-primary/50 transition-all hover:scale-105 cursor-pointer group"
                  onClick={() => setSelectedTeam(team)}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      {team.logo.startsWith('http') ? (
                        <img src={team.logo} alt={team.name} className="w-12 h-12 object-contain rounded" />
                      ) : (
                        <span className="text-4xl">{team.logo}</span>
                      )}
                      <h3 
                        className="text-2xl font-bold group-hover:neon-text transition-all"
                        style={{ color: TEAM_COLORS[team.name] }}
                      >
                        {team.name}
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Очки:</span>
                        <span className="text-primary font-bold">{calculatePoints(team)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Разница шайб:</span>
                        <span className={calculateGoalDiff(team) >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {calculateGoalDiff(team) > 0 ? '+' : ''}{calculateGoalDiff(team)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="animate-fade-in">
            <div className="space-y-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(tour => (
                <Card key={tour} className="glass-card border-primary/20">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-4 text-primary neon-text">Тур {tour}</h3>
                    <div className="space-y-4">
                      {matches.filter(m => m.tour === tour).map(match => (
                        <MatchCard 
                          key={match.id} 
                          match={match} 
                          onUpdate={updateMatchScore}
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="champions" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {champions.map(champ => (
                <Card key={champ.season} className="glass-card border-primary/20 overflow-hidden">
                  <div className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10">
                    <div className="text-center mb-6">
                      <div className="text-6xl mb-4">🏆</div>
                      <h3 className="text-3xl font-bold neon-text text-primary mb-2">Сезон {champ.season}</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-primary/20 rounded-lg border border-primary/30">
                        <div className="text-sm text-muted-foreground mb-1">Чемпион</div>
                        <div 
                          className="text-2xl font-bold neon-text"
                          style={{ color: TEAM_COLORS[champ.winner] }}
                        >
                          {champ.winner}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-secondary/20 rounded-lg border border-secondary/30">
                        <div className="text-sm text-muted-foreground mb-1">Финалист</div>
                        <div 
                          className="text-xl font-bold"
                          style={{ color: TEAM_COLORS[champ.runnerUp] }}
                        >
                          {champ.runnerUp}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-primary/10 bg-black/20 py-4 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Первая Хоккейная Лига. Все права защищены.
            {' '}
            <span 
              onClick={() => navigate('/admin')} 
              className="opacity-5 hover:opacity-100 hover:text-primary transition-all cursor-pointer select-none"
              title="Админ-панель"
            >
              ⚙
            </span>
          </p>
        </div>
      </footer>

      <Dialog open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
        <DialogContent className="glass-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-3xl">
              {selectedTeam?.logo.startsWith('http') ? (
                <img src={selectedTeam.logo} alt={selectedTeam.name} className="w-12 h-12 object-contain rounded" />
              ) : (
                <span className="text-4xl">{selectedTeam?.logo}</span>
              )}
              <span style={{ color: selectedTeam ? TEAM_COLORS[selectedTeam.name] : '' }}>
                {selectedTeam?.name}
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 text-primary">Состав:</h4>
              <ul className="space-y-2">
                {selectedTeam?.players.map((player, index) => (
                  <li key={index} className="flex items-center gap-2 p-2 bg-primary/5 rounded border border-primary/10">
                    <Icon name="User" size={16} className="text-primary" />
                    <span>{player}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;