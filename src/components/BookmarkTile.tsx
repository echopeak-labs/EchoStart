import { ExternalLink, Star, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Bookmark, BookmarkTile as BookmarkTileType } from '@/store/bookmarkStore';
import { useBookmarkStore } from '@/store/bookmarkStore';
import { ConfirmDialog } from './ConfirmDialog';

interface BookmarkTileProps {
  tile: BookmarkTileType;
  bookmark: Bookmark;
}

export const BookmarkTile = ({ tile, bookmark }: BookmarkTileProps) => {
  const { toggleFavorite, deleteBookmark } = useBookmarkStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const colSpan = tile.w === 2 ? 'col-span-2' : 'col-span-1';
  const rowSpan = tile.h === 2 ? 'row-span-2' : 'row-span-1';

  const handleClick = () => {
    window.open(bookmark.url, '_blank');
  };

  const handleDelete = () => {
    deleteBookmark(bookmark.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div
        className={`glass glass-hover rounded-xl p-4 transition-smooth hover:scale-105 hover:glow-subtle shadow-glass group cursor-pointer ${colSpan} ${rowSpan} flex flex-col`}
        onClick={handleClick}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {bookmark.icon ? (
              <span className="text-2xl">{bookmark.icon}</span>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <ExternalLink className="h-4 w-4 text-primary" />
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(bookmark.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-smooth"
            >
              <Star
                className={`h-4 w-4 ${
                  bookmark.isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'
                }`}
              />
            </button>
          </div>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-smooth">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Edit functionality
              }}
              className="p-1 rounded glass-hover"
            >
              <Edit className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteDialog(true);
              }}
              className="p-1 rounded glass-hover hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{bookmark.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-1">{bookmark.url}</p>

        {bookmark.tags && bookmark.tags.length > 0 && (
          <div className="mt-auto pt-2 flex flex-wrap gap-1">
            {bookmark.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded-full glass"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Bookmark"
        description={`Are you sure you want to delete "${bookmark.title}"?`}
        onConfirm={handleDelete}
      />
    </>
  );
};
