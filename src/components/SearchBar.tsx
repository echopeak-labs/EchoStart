import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { z } from "zod";

const searchEngines = [
  { name: "Google", url: "https://www.google.com/search?q=" },
  { name: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
  { name: "Bing", url: "https://www.bing.com/search?q=" },
  { name: "Brave", url: "https://search.brave.com/search?q=" },
];

const searchQuerySchema = z.string().trim().min(1).max(500);

export const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [selectedEngine, setSelectedEngine] = useState(searchEngines[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedQuery = searchQuerySchema.parse(query);
      const encodedQuery = encodeURIComponent(validatedQuery);
      window.open(selectedEngine.url + encodedQuery, "_blank", "noopener,noreferrer");
      setQuery("");
    } catch (error) {
      console.error("Invalid search query");
    }
  };

  const handleEngineSelect = (engine: (typeof searchEngines)[0]) => {
    setSelectedEngine(engine);
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  const handleChatGPT = () => {
    window.open("https://chatgpt.com", "_blank", "noopener,noreferrer");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-3 w-full max-w-2xl relative z-50">
      {/* ChatGPT Button */}
      <Button
        type="button"
        onClick={handleChatGPT}
        className="glass glass-hover h-11 w-11 p-0 flex-shrink-0 transition-smooth hover:glow-primary"
        variant="ghost"
        aria-label="Open ChatGPT"
      >
        <MessageSquare className="h-5 w-5 text-primary" />
      </Button>

      {/* Search Bar Container */}
      <div className="flex-1 flex glass rounded-xl shadow-glass">
        {/* Engine Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={toggleDropdown}
            className="h-11 px-4 flex items-center gap-2 glass-hover transition-smooth text-sm font-medium border-r border-glass-border hover:bg-white/8"
            aria-label="Select search engine"
            aria-expanded={isDropdownOpen}
          >
            <span className="min-w-[90px] text-left">{selectedEngine.name}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 glass-strong rounded-lg overflow-hidden shadow-glass z-[9999] animate-scale-in min-w-[140px]">
              {searchEngines.map((engine) => (
                <button
                  key={engine.name}
                  type="button"
                  onClick={() => handleEngineSelect(engine)}
                  className={`w-full px-4 py-3 text-left text-sm transition-smooth whitespace-nowrap ${
                    selectedEngine.name === engine.name ? "bg-primary/20 text-primary font-medium" : "hover:bg-white/10"
                  }`}
                >
                  {engine.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="flex-1 flex items-center px-4 min-w-0">
          <Search className="h-4 w-4 mr-3 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the web... (Ctrl+K)"
            maxLength={500}
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            aria-label="Search query"
          />
        </div>

        {/* Search Button */}
        <Button
          type="submit"
          disabled={!query.trim()}
          className="h-11 rounded-l-none rounded-r-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth px-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Search
        </Button>
      </div>
    </form>
  );
};
