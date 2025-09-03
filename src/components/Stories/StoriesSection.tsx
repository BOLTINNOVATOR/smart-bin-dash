import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { BookOpen, User, Calendar, ChevronRight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export const StoriesSection = () => {
  const { stories, language } = useAppStore();
  const [expandedStory, setExpandedStory] = useState<string | null>(null);

  const content = {
    en: {
      title: "Success Stories",
      subtitle: "Real stories from our community",
      readMore: "Read More",
      readLess: "Read Less",
      author: "By",
      publishedOn: "Published on",
      tags: "Tags"
    },
    hi: {
      title: "सफलता की कहानियां",
      subtitle: "हमारे समुदाय की वास्तविक कहानियां",
      readMore: "और पढ़ें",
      readLess: "कम पढ़ें",
      author: "लेखक",
      publishedOn: "प्रकाशित",
      tags: "टैग"
    }
  };

  const t = content[language];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'community':
        return 'bg-[hsl(var(--brand-primary)/0.1)] text-[hsl(var(--brand-primary))]';
      case 'success':
        return 'bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))]';
      case 'education':
        return 'bg-[hsl(var(--brand-accent)/0.1)] text-[hsl(var(--brand-accent))]';
      case 'individual':
        return 'bg-[hsl(var(--wet-waste)/0.1)] text-[hsl(var(--wet-waste))]';
      case 'improvement':
        return 'bg-[hsl(var(--dry-waste)/0.1)] text-[hsl(var(--dry-waste))]';
      case 'motivation':
        return 'bg-[hsl(var(--warning)/0.1)] text-[hsl(var(--warning))]';
      case 'collector':
        return 'bg-[hsl(var(--hazardous-waste)/0.1)] text-[hsl(var(--hazardous-waste))]';
      case 'efficiency':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'technology':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const toggleStory = (storyId: string) => {
    setExpandedStory(expandedStory === storyId ? null : storyId);
  };

  return (
    <Card className="shadow-[var(--shadow-soft)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[hsl(var(--brand-primary))]" />
          {t.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              {/* Story Header */}
              <div className="space-y-3 mb-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground leading-tight">
                      {story.title}
                    </h3>
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                      {story.excerpt}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-[hsl(var(--destructive))]" />
                    <span className="text-sm text-muted-foreground">
                      {Math.floor(Math.random() * 50) + 10}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag, tagIndex) => (
                    <Badge 
                      key={tagIndex} 
                      variant="secondary" 
                      className={`text-xs ${getTagColor(tag)}`}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Expanded Content */}
              {expandedStory === story.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 pb-4 border-b border-border"
                >
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    <p className="leading-relaxed whitespace-pre-line">
                      {story.content}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Story Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{t.author} {story.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{t.publishedOn} {formatDate(story.date)}</span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleStory(story.id)}
                  className="flex items-center gap-1 h-8"
                >
                  <span className="text-sm">
                    {expandedStory === story.id ? t.readLess : t.readMore}
                  </span>
                  <ChevronRight 
                    className={`h-3 w-3 transition-transform ${
                      expandedStory === story.id ? 'rotate-90' : ''
                    }`} 
                  />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Stories Button */}
        <div className="text-center mt-6">
          <Button variant="outline" className="flex items-center gap-2 mx-auto">
            <BookOpen className="h-4 w-4" />
            {language === 'en' ? 'View All Stories' : 'सभी कहानियां देखें'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};