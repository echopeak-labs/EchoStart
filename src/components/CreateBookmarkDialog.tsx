import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useBookmarkStore } from '@/store/bookmarkStore';
import { getFaviconUrl } from '@/utils/faviconUtils';
import { Loader2 } from 'lucide-react';

interface CreateBookmarkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateBookmarkDialog = ({ open, onOpenChange }: CreateBookmarkDialogProps) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [tags, setTags] = useState('');
  const [isFetchingFavicon, setIsFetchingFavicon] = useState(false);
  const [autoFetchedIcon, setAutoFetchedIcon] = useState('');
  
  const { addBookmark, addTileToGrid, getActiveWorkspaceBookmarks } = useBookmarkStore();

  // Auto-fetch favicon when URL changes
  useEffect(() => {
    const fetchFavicon = async () => {
      if (!url || icon) return; // Don't fetch if URL is empty or user set custom icon
      
      setIsFetchingFavicon(true);
      try {
        const faviconUrl = getFaviconUrl(url);
        if (faviconUrl) {
          setAutoFetchedIcon(faviconUrl);
        }
      } catch (error) {
        console.error('Error fetching favicon:', error);
      } finally {
        setIsFetchingFavicon(false);
      }
    };

    const timeoutId = setTimeout(fetchFavicon, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [url, icon]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && url.trim()) {
      // Use custom icon if provided, otherwise use auto-fetched favicon
      const finalIcon = icon.trim() || autoFetchedIcon;
      
      const bookmarkId = addBookmark({
        title: title.trim(),
        url: url.trim(),
        icon: finalIcon || undefined,
        isFavorite,
        tags: tags.trim() ? tags.split(',').map(t => t.trim()) : undefined,
      });

      // Add to grid at next available position
      const { grid } = getActiveWorkspaceBookmarks();
      const nextY = Math.floor(grid.length / 6);
      const nextX = grid.length % 6;
      addTileToGrid(bookmarkId as any, nextX, nextY, 1, 1);

      // Reset form
      setTitle('');
      setUrl('');
      setIcon('');
      setAutoFetchedIcon('');
      setIsFavorite(false);
      setTags('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-glass-border shadow-glass">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Bookmark</DialogTitle>
            <DialogDescription>
              Add a new bookmark to your collection
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Bookmark"
                className="glass mt-2"
                autoFocus
              />
            </div>

            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="glass mt-2"
              />
            </div>

            <div>
              <Label htmlFor="icon">Icon (emoji or URL)</Label>
              <div className="relative">
                <Input
                  id="icon"
                  value={icon}
                  onChange={(e) => {
                    setIcon(e.target.value);
                    setAutoFetchedIcon(''); // Clear auto-fetched when user types
                  }}
                  placeholder="🔖 or leave empty to auto-fetch"
                  className="glass mt-2 pr-10"
                />
                {isFetchingFavicon && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 mt-1">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
                {!icon && autoFetchedIcon && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 mt-1">
                    <img 
                      src={autoFetchedIcon} 
                      alt="Favicon preview" 
                      className="h-5 w-5"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {autoFetchedIcon && !icon ? 'Favicon will be auto-fetched' : 'Enter emoji or custom image URL'}
              </p>
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="work, important, design"
                className="glass mt-2"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="favorite"
                checked={isFavorite}
                onCheckedChange={(checked) => setIsFavorite(checked as boolean)}
              />
              <label
                htmlFor="favorite"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Add to favorites
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="glass-hover"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || !url.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
            >
              Create Bookmark
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
