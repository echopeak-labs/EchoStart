import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const searchEngines = [
  { name: 'Google', url: 'https://www.google.com/search?q=' },
  { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
  { name: 'Bing', url: 'https://www.bing.com/search?q=' },
  { name: 'Brave', url: 'https://search.brave.com/search?q=' },
];

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [selectedEngine, setSelectedEngine] = useState(searchEngines[0]);
  const [showEngines, setShowEngines] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowEngines(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.open(selectedEngine.url + encodeURIComponent(query), '_blank');
      setQuery('');
    }
  };

  const handleChatGPT = () => {
    window.open('https://chatgpt.com', '_blank');
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2 w-full max-w-2xl">
      <Button
        type="button"
        onClick={handleChatGPT}
        className="glass glass-hover h-10 w-10 p-0 flex-shrink-0 transition-smooth hover:glow-primary"
        variant="ghost"
      >
        <MessageSquare className="h-5 w-5 text-primary" />
      </Button>

      <div className="flex-1 flex glass rounded-xl overflow-hidden shadow-glass relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setShowEngines(!showEngines)}
          className="h-10 px-4 flex items-center gap-2 glass-hover transition-smooth text-sm font-medium flex-shrink-0"
        >
          {selectedEngine.name}
          <ChevronDown className="h-4 w-4" />
        </button>

        {showEngines && (
          <div className="absolute top-full left-0 mt-2 glass-strong rounded-lg overflow-hidden shadow-glass z-[100] animate-scale-in min-w-[140px]">
            {searchEngines.map((engine) => (
              <button
                key={engine.name}
                type="button"
                onClick={() => {
                  setSelectedEngine(engine);
                  setShowEngines(false);
                }}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-primary/20 transition-smooth whitespace-nowrap"
              >
                {engine.name}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 flex items-center px-4">
          <Search className="h-4 w-4 mr-2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the web..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
        </div>

        <Button
          type="submit"
          className="h-full rounded-none bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth px-6"
        >
          Search
        </Button>
      </div>
    </form>
  );
};
