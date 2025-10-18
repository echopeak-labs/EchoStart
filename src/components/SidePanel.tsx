import { Home, Bookmark, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookmarkStore } from '@/store/bookmarkStore';
import { useState } from 'react';
import { ConfirmDialog } from './ConfirmDialog';

export const SidePanel = () => {
  const { deleteAllBookmarks } = useBookmarkStore();
  const [showDeleteAll, setShowDeleteAll] = useState(false);

  const handleDeleteAll = () => {
    setShowDeleteAll(true);
  };

  const confirmDeleteAll = () => {
    deleteAllBookmarks();
    setShowDeleteAll(false);
  };

  return (
    <>
      <aside className="w-16 glass border-r border-glass-border flex flex-col items-center py-4 gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="glass-hover transition-smooth hover:glow-subtle"
        >
          <Home className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="glass-hover transition-smooth hover:glow-subtle"
        >
          <Bookmark className="h-5 w-5" />
        </Button>
        
        <div className="flex-1" />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDeleteAll}
          className="glass-hover transition-smooth hover:text-destructive hover:glow-subtle"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="glass-hover transition-smooth hover:glow-subtle"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </aside>

      <ConfirmDialog
        open={showDeleteAll}
        onOpenChange={setShowDeleteAll}
        title="Delete All Bookmarks"
        description="Are you sure you want to delete ALL bookmarks in the current workspace? This action cannot be undone."
        onConfirm={confirmDeleteAll}
      />
    </>
  );
};
