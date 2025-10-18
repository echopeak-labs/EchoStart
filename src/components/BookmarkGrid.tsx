import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useBookmarkStore } from '@/store/bookmarkStore';
import { BookmarkTile } from './BookmarkTile';
import { CreateBookmarkDialog } from './CreateBookmarkDialog';

export const BookmarkGrid = () => {
  const { getActiveWorkspaceBookmarks } = useBookmarkStore();
  const { grid, bookmarks } = getActiveWorkspaceBookmarks();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowCreateDialog(true);
  };

  if (grid.length === 0) {
    return (
      <>
        <div
          className="flex-1 flex flex-col items-center justify-center gap-4 p-8"
          onContextMenu={handleContextMenu}
        >
          <div className="glass-strong rounded-2xl p-8 max-w-md text-center animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Bookmarks Yet</h3>
            <p className="text-muted-foreground mb-4">
              Right-click anywhere to create your first bookmark
            </p>
            <button
              onClick={() => setShowCreateDialog(true)}
              className="glass glass-hover px-4 py-2 rounded-lg transition-smooth hover:glow-subtle"
            >
              Create Bookmark
            </button>
          </div>
        </div>

        <CreateBookmarkDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      </>
    );
  }

  // Sort tiles by favorite status - favorited bookmarks first
  const sortedGrid = [...grid].sort((a, b) => {
    const bookmarkA = bookmarks.find((bm) => bm.id === a.bookmarkId);
    const bookmarkB = bookmarks.find((bm) => bm.id === b.bookmarkId);
    
    if (!bookmarkA || !bookmarkB) return 0;
    
    // Favorited bookmarks come first
    if (bookmarkA.isFavorite && !bookmarkB.isFavorite) return -1;
    if (!bookmarkA.isFavorite && bookmarkB.isFavorite) return 1;
    
    // If both have same favorite status, maintain original order
    return 0;
  });

  return (
    <>
      <div
        className="flex-1 p-6 overflow-auto"
        onContextMenu={handleContextMenu}
      >
        <div className="grid grid-cols-6 gap-4 auto-rows-[160px]">
          {sortedGrid.map((tile) => {
            const bookmark = bookmarks.find((b) => b.id === tile.bookmarkId);
            if (!bookmark) return null;

            return (
              <BookmarkTile
                key={tile.id}
                tile={tile}
                bookmark={bookmark}
              />
            );
          })}
        </div>
      </div>

      <CreateBookmarkDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </>
  );
};
