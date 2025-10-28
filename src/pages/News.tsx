import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface News {
  id: string;
  title: string;
  content: string;
  date: string;
  image?: string;
}

const News = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    const savedNews = localStorage.getItem('phl_news');
    if (savedNews) {
      setNews(JSON.parse(savedNews));
    }
  }, []);

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
            Новости лиги
          </h1>
          <div className="w-32" />
        </div>

        <div className="grid gap-6 max-w-4xl mx-auto">
          {news.length === 0 ? (
            <Card className="glass-card border-primary/30 p-12 text-center">
              <Icon name="Newspaper" size={64} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-xl text-muted-foreground">
                Новостей пока нет. Добавьте их через админ-панель.
              </p>
            </Card>
          ) : (
            news.map((item) => (
              <Card key={item.id} className="glass-card border-primary/30 overflow-hidden hover:border-primary/50 transition-all">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-2xl font-bold text-primary">{item.title}</h2>
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Icon name="Calendar" size={16} />
                      {item.date}
                    </span>
                  </div>
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default News;
