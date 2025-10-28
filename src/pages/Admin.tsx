import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const ADMIN_PASSWORD = 'phldyez9137';

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

interface News {
  id: string;
  title: string;
  content: string;
  date: string;
  image?: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [champions, setChampions] = useState<Champion[]>([]);
  const [regulations, setRegulations] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    const savedTeams = localStorage.getItem('phl_teams');
    const savedChampions = localStorage.getItem('phl_champions');
    const savedRegulations = localStorage.getItem('phl_regulations');
    const savedPlayers = localStorage.getItem('phl_players');
    const savedNews = localStorage.getItem('phl_news');
    
    if (savedTeams) setTeams(JSON.parse(savedTeams));
    if (savedChampions) setChampions(JSON.parse(savedChampions));
    if (savedRegulations) setRegulations(savedRegulations);
    if (savedPlayers) setPlayers(JSON.parse(savedPlayers));
    if (savedNews) setNews(JSON.parse(savedNews));
    
    localStorage.removeItem('phl_matches');
  }, []);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Неверный пароль');
    }
  };

  const saveTeams = () => {
    localStorage.setItem('phl_teams', JSON.stringify(teams));
    alert('Команды сохранены!');
  };

  const saveMatches = () => {
    localStorage.setItem('phl_matches', JSON.stringify(matches));
    alert('Матчи сохранены!');
  };

  const saveChampions = () => {
    localStorage.setItem('phl_champions', JSON.stringify(champions));
    alert('Чемпионы сохранены!');
  };

  const saveRegulations = () => {
    localStorage.setItem('phl_regulations', regulations);
    alert('Регламент сохранен!');
  };

  const savePlayers = () => {
    localStorage.setItem('phl_players', JSON.stringify(players));
    alert('Игроки сохранены!');
  };

  const saveNews = () => {
    localStorage.setItem('phl_news', JSON.stringify(news));
    alert('Новости сохранены!');
  };

  const addPlayer = () => {
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: 'Новый игрок',
      team: teams[0]?.name || '',
      number: 1,
      goals: 0,
      assists: 0,
      games: 0,
      penalties: 0
    };
    setPlayers([...players, newPlayer]);
  };

  const updatePlayer = (id: string, field: keyof Player, value: any) => {
    setPlayers(players.map(player => 
      player.id === id ? { ...player, [field]: value } : player
    ));
  };

  const deletePlayer = (id: string) => {
    if (confirm('Удалить игрока?')) {
      setPlayers(players.filter(player => player.id !== id));
    }
  };

  const addNews = () => {
    const newNews: News = {
      id: Date.now().toString(),
      title: 'Новая новость',
      content: 'Текст новости',
      date: new Date().toLocaleDateString('ru-RU'),
      image: ''
    };
    setNews([newNews, ...news]);
  };

  const updateNews = (id: string, field: keyof News, value: string) => {
    setNews(news.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const deleteNews = (id: string) => {
    if (confirm('Удалить новость?')) {
      setNews(news.filter(item => item.id !== id));
    }
  };

  const addTeam = () => {
    const newTeam: Team = {
      id: Date.now().toString(),
      name: 'Новая команда',
      logo: '🏒',
      wins: 0,
      losses: 0,
      otLosses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      players: []
    };
    setTeams([...teams, newTeam]);
  };

  const updateTeam = (id: string, field: keyof Team, value: any) => {
    setTeams(teams.map(team => 
      team.id === id ? { ...team, [field]: value } : team
    ));
  };

  const deleteTeam = (id: string) => {
    if (confirm('Удалить команду?')) {
      setTeams(teams.filter(team => team.id !== id));
    }
  };

  const addMatch = () => {
    const newMatch: Match = {
      id: Date.now().toString(),
      tour: 1,
      homeTeam: teams[0]?.name || '',
      awayTeam: teams[1]?.name || '',
      homeScore: null,
      awayScore: null,
      overtime: false,
      shootout: false,
      date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
    };
    setMatches([...matches, newMatch]);
  };

  const updateMatch = (id: string, field: keyof Match, value: any) => {
    setMatches(matches.map(match => 
      match.id === id ? { ...match, [field]: value } : match
    ));
  };

  const deleteMatch = (id: string) => {
    if (confirm('Удалить матч?')) {
      setMatches(matches.filter(match => match.id !== id));
    }
  };

  const addChampion = () => {
    const newChampion: Champion = {
      season: new Date().getFullYear().toString(),
      winner: teams[0]?.name || '',
      runnerUp: teams[1]?.name || ''
    };
    setChampions([...champions, newChampion]);
  };

  const updateChampion = (index: number, field: keyof Champion, value: string) => {
    const updated = [...champions];
    updated[index] = { ...updated[index], [field]: value };
    setChampions(updated);
  };

  const deleteChampion = (index: number) => {
    if (confirm('Удалить чемпиона?')) {
      setChampions(champions.filter((_, i) => i !== index));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e17] via-[#0d1221] to-[#0a0e17] flex items-center justify-center p-4">
        <Card className="glass-card border-primary/30 p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-primary neon-text mb-6 text-center">Админ-панель PHL</h1>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="bg-card/50"
            />
            <Button onClick={handleLogin} className="w-full bg-primary hover:bg-primary/90">
              Войти
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e17] via-[#0d1221] to-[#0a0e17]">
      <header className="border-b border-primary/20 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold neon-text text-primary">Админ-панель</h1>
            <Button variant="outline" onClick={() => navigate('/')} className="hover:border-primary">
              <Icon name="Home" size={20} className="mr-2" />
              На главную
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8 bg-card/50">
            <TabsTrigger value="teams">Команды</TabsTrigger>
            <TabsTrigger value="matches">Матчи</TabsTrigger>
            <TabsTrigger value="players">Игроки</TabsTrigger>
            <TabsTrigger value="news">Новости</TabsTrigger>
            <TabsTrigger value="champions">Чемпионы</TabsTrigger>
            <TabsTrigger value="regulations">Регламент</TabsTrigger>
          </TabsList>

          <TabsContent value="teams" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-primary">Управление командами</h2>
              <Button onClick={addTeam} className="bg-primary hover:bg-primary/90">
                <Icon name="Plus" size={20} className="mr-2" />
                Добавить команду
              </Button>
            </div>
            {teams.map((team) => (
              <Card key={team.id} className="glass-card border-primary/20 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Название команды"
                    value={team.name}
                    onChange={(e) => updateTeam(team.id, 'name', e.target.value)}
                  />
                  <Input
                    placeholder="Логотип (emoji)"
                    value={team.logo}
                    onChange={(e) => updateTeam(team.id, 'logo', e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Побед"
                      value={team.wins}
                      onChange={(e) => updateTeam(team.id, 'wins', parseInt(e.target.value) || 0)}
                    />
                    <Input
                      type="number"
                      placeholder="Поражений"
                      value={team.losses}
                      onChange={(e) => updateTeam(team.id, 'losses', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <Textarea
                    placeholder="Игроки (через запятую)"
                    value={team.players.join(', ')}
                    onChange={(e) => updateTeam(team.id, 'players', e.target.value.split(',').map(p => p.trim()))}
                    className="col-span-full"
                  />
                  <Button variant="destructive" onClick={() => deleteTeam(team.id)} className="col-span-full">
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Удалить команду
                  </Button>
                </div>
              </Card>
            ))}
            <Button onClick={saveTeams} className="w-full bg-primary hover:bg-primary/90 mt-4">
              <Icon name="Save" size={20} className="mr-2" />
              Сохранить все команды
            </Button>
          </TabsContent>

          <TabsContent value="matches" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-primary">Управление матчами</h2>
              <Button onClick={addMatch} className="bg-primary hover:bg-primary/90">
                <Icon name="Plus" size={20} className="mr-2" />
                Добавить матч
              </Button>
            </div>
            {matches.map((match) => (
              <Card key={match.id} className="glass-card border-primary/20 p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    type="number"
                    placeholder="Тур"
                    value={match.tour}
                    onChange={(e) => updateMatch(match.id, 'tour', parseInt(e.target.value) || 1)}
                  />
                  <Input
                    placeholder="Хозяева"
                    value={match.homeTeam}
                    onChange={(e) => updateMatch(match.id, 'homeTeam', e.target.value)}
                  />
                  <Input
                    placeholder="Гости"
                    value={match.awayTeam}
                    onChange={(e) => updateMatch(match.id, 'awayTeam', e.target.value)}
                  />
                  <Input
                    placeholder="Дата"
                    value={match.date}
                    onChange={(e) => updateMatch(match.id, 'date', e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Счет хозяев"
                      value={match.homeScore ?? ''}
                      onChange={(e) => updateMatch(match.id, 'homeScore', e.target.value ? parseInt(e.target.value) : null)}
                    />
                    <Input
                      type="number"
                      placeholder="Счет гостей"
                      value={match.awayScore ?? ''}
                      onChange={(e) => updateMatch(match.id, 'awayScore', e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </div>
                  <Button variant="destructive" onClick={() => deleteMatch(match.id)} className="col-span-full">
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Удалить матч
                  </Button>
                </div>
              </Card>
            ))}
            <Button onClick={saveMatches} className="w-full bg-primary hover:bg-primary/90 mt-4">
              <Icon name="Save" size={20} className="mr-2" />
              Сохранить все матчи
            </Button>
          </TabsContent>

          <TabsContent value="champions" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-primary">Управление чемпионами</h2>
              <Button onClick={addChampion} className="bg-primary hover:bg-primary/90">
                <Icon name="Plus" size={20} className="mr-2" />
                Добавить чемпиона
              </Button>
            </div>
            {champions.map((champ, index) => (
              <Card key={index} className="glass-card border-primary/20 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Сезон"
                    value={champ.season}
                    onChange={(e) => updateChampion(index, 'season', e.target.value)}
                  />
                  <Input
                    placeholder="Чемпион"
                    value={champ.winner}
                    onChange={(e) => updateChampion(index, 'winner', e.target.value)}
                  />
                  <Input
                    placeholder="Финалист"
                    value={champ.runnerUp}
                    onChange={(e) => updateChampion(index, 'runnerUp', e.target.value)}
                  />
                  <Button variant="destructive" onClick={() => deleteChampion(index)} className="col-span-full">
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Удалить
                  </Button>
                </div>
              </Card>
            ))}
            <Button onClick={saveChampions} className="w-full bg-primary hover:bg-primary/90 mt-4">
              <Icon name="Save" size={20} className="mr-2" />
              Сохранить чемпионов
            </Button>
          </TabsContent>

          <TabsContent value="players" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-primary">Управление игроками</h2>
              <Button onClick={addPlayer} className="bg-primary hover:bg-primary/90">
                <Icon name="Plus" size={20} className="mr-2" />
                Добавить игрока
              </Button>
            </div>
            {players.map((player) => (
              <Card key={player.id} className="glass-card border-primary/20 p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder="Имя игрока"
                    value={player.name}
                    onChange={(e) => updatePlayer(player.id, 'name', e.target.value)}
                  />
                  <Input
                    placeholder="Команда"
                    value={player.team}
                    onChange={(e) => updatePlayer(player.id, 'team', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Номер"
                    value={player.number}
                    onChange={(e) => updatePlayer(player.id, 'number', parseInt(e.target.value) || 0)}
                  />
                  <Input
                    type="number"
                    placeholder="Игр"
                    value={player.games}
                    onChange={(e) => updatePlayer(player.id, 'games', parseInt(e.target.value) || 0)}
                  />
                  <Input
                    type="number"
                    placeholder="Голы"
                    value={player.goals}
                    onChange={(e) => updatePlayer(player.id, 'goals', parseInt(e.target.value) || 0)}
                  />
                  <Input
                    type="number"
                    placeholder="Передачи"
                    value={player.assists}
                    onChange={(e) => updatePlayer(player.id, 'assists', parseInt(e.target.value) || 0)}
                  />
                  <Input
                    type="number"
                    placeholder="Штрафы (мин)"
                    value={player.penalties}
                    onChange={(e) => updatePlayer(player.id, 'penalties', parseInt(e.target.value) || 0)}
                  />
                  <Button variant="destructive" onClick={() => deletePlayer(player.id)}>
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Удалить
                  </Button>
                </div>
              </Card>
            ))}
            <Button onClick={savePlayers} className="w-full bg-primary hover:bg-primary/90 mt-4">
              <Icon name="Save" size={20} className="mr-2" />
              Сохранить игроков
            </Button>
          </TabsContent>

          <TabsContent value="news" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-primary">Управление новостями</h2>
              <Button onClick={addNews} className="bg-primary hover:bg-primary/90">
                <Icon name="Plus" size={20} className="mr-2" />
                Добавить новость
              </Button>
            </div>
            {news.map((item) => (
              <Card key={item.id} className="glass-card border-primary/20 p-4">
                <div className="grid grid-cols-1 gap-4">
                  <Input
                    placeholder="Заголовок"
                    value={item.title}
                    onChange={(e) => updateNews(item.id, 'title', e.target.value)}
                  />
                  <Textarea
                    placeholder="Текст новости"
                    value={item.content}
                    onChange={(e) => updateNews(item.id, 'content', e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Input
                    placeholder="URL изображения (опционально)"
                    value={item.image || ''}
                    onChange={(e) => updateNews(item.id, 'image', e.target.value)}
                  />
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder="Дата"
                      value={item.date}
                      onChange={(e) => updateNews(item.id, 'date', e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="destructive" onClick={() => deleteNews(item.id)}>
                      <Icon name="Trash2" size={16} className="mr-2" />
                      Удалить
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            <Button onClick={saveNews} className="w-full bg-primary hover:bg-primary/90 mt-4">
              <Icon name="Save" size={20} className="mr-2" />
              Сохранить новости
            </Button>
          </TabsContent>

          <TabsContent value="regulations">
            <Card className="glass-card border-primary/20 p-6">
              <h2 className="text-2xl font-bold text-primary mb-4">Регламент турнира</h2>
              <Textarea
                placeholder="Введите текст регламента..."
                value={regulations}
                onChange={(e) => setRegulations(e.target.value)}
                className="min-h-[400px] mb-4"
              />
              <Button onClick={saveRegulations} className="w-full bg-primary hover:bg-primary/90">
                <Icon name="Save" size={20} className="mr-2" />
                Сохранить регламент
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;