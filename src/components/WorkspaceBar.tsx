import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookmarkStore } from '@/store/bookmarkStore';
import { ConfirmDialog } from './ConfirmDialog';
import { CreateWorkspaceDialog } from './CreateWorkspaceDialog';

export const WorkspaceBar = () => {
  const { workspaces, activeWorkspaceId, setActiveWorkspace, deleteWorkspace } = useBookmarkStore();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deleteWorkspaceId, setDeleteWorkspaceId] = useState<string | null>(null);
  const [deleteBookmarks, setDeleteBookmarks] = useState(false);

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const currentIndex = workspaces.findIndex((w) => w.id === activeWorkspaceId);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setActiveWorkspace(workspaces[currentIndex - 1].id);
    }
  };

  const goToNext = () => {
    if (currentIndex < workspaces.length - 1) {
      setActiveWorkspace(workspaces[currentIndex + 1].id);
    }
  };

  const handleDeleteWorkspace = () => {
    if (deleteWorkspaceId) {
      deleteWorkspace(deleteWorkspaceId, deleteBookmarks);
      setDeleteWorkspaceId(null);
      setDeleteBookmarks(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="glass-strong rounded-full px-4 py-2 shadow-glass flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="h-8 w-8 rounded-full glass-hover transition-smooth hover:glow-subtle disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium px-3">{activeWorkspace?.name}</span>
            {workspaces.length > 1 && (
              <button
                onClick={() => setDeleteWorkspaceId(activeWorkspaceId)}
                className="h-6 w-6 rounded-full glass-hover flex items-center justify-center transition-smooth hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            disabled={currentIndex === workspaces.length - 1}
            className="h-8 w-8 rounded-full glass-hover transition-smooth hover:glow-subtle disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-glass-border" />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowCreateDialog(true)}
            className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth hover:glow-primary"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CreateWorkspaceDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />

      <ConfirmDialog
        open={deleteWorkspaceId !== null}
        onOpenChange={(open) => !open && setDeleteWorkspaceId(null)}
        title="Delete Workspace"
        description="What would you like to do with the bookmarks in this workspace?"
        onConfirm={handleDeleteWorkspace}
        confirmText="Delete Workspace"
        checkbox={{
          label: "Also delete all bookmarks in this workspace",
          checked: deleteBookmarks,
          onCheckedChange: setDeleteBookmarks,
        }}
      />
    </>
  );
};
