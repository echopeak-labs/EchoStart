import { Star, ExternalLink } from 'lucide-react';
import { useBookmarkStore } from '@/store/bookmarkStore';

export const FavoritesBar = () => {
  const { getActiveWorkspaceBookmarks, toggleFavorite } = useBookmarkStore();
  const { favorites } = getActiveWorkspaceBookmarks();

  const handleBookmarkClick = (url: string) => {
    window.open(url, '_blank');
  };

  if (favorites.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
        <Star className="h-4 w-4 mr-2" />
        No favorites yet
      </div>
    );
  }

  return (
    <div className="h-full flex items-center gap-2 overflow-x-auto px-2">
      {favorites.map((bookmark) => (
        <div
          key={bookmark.id}
          className="glass glass-hover rounded-lg px-3 py-1.5 flex items-center gap-2 cursor-pointer transition-smooth hover:scale-105 hover:glow-subtle flex-shrink-0 group"
        >
          <button
            onClick={() => handleBookmarkClick(bookmark.url)}
            className="flex items-center gap-2"
          >
            {bookmark.icon ? (
              bookmark.icon.startsWith('http') ? (
                <img 
                  src={bookmark.icon} 
                  alt={`${bookmark.title} icon`}
                  className="w-5 h-5 rounded object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-lg">{bookmark.icon}</span>
              )
            ) : (
              <ExternalLink className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">{bookmark.title}</span>
          </button>
          <button
            onClick={() => toggleFavorite(bookmark.id)}
            className="ml-1 opacity-0 group-hover:opacity-100 transition-smooth"
          >
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          </button>
        </div>
      ))}
    </div>
  );
};
