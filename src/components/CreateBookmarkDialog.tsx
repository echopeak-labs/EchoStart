import { useState } from 'react';
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
  
  const { addBookmark, addTileToGrid, getActiveWorkspaceBookmarks } = useBookmarkStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && url.trim()) {
      const bookmarkId = addBookmark({
        title: title.trim(),
        url: url.trim(),
        icon: icon.trim() || undefined,
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
              <Input
                id="icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="🔖 or image URL"
                className="glass mt-2"
              />
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
