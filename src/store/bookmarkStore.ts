import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  icon?: string;
  isFavorite: boolean;
  createdAt: number;
  tags?: string[];
}

export interface BookmarkTile {
  id: string;
  bookmarkId: string;
  x: number;
  y: number;
  w: number; // 1 or 2
  h: number; // 1 or 2
}

export interface Workspace {
  id: string;
  name: string;
}

interface WorkspaceBookmarks {
  favorites: Bookmark[];
  grid: BookmarkTile[];
  bookmarks: Bookmark[];
}

interface BookmarkStore {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  bookmarksByWorkspace: Record<string, WorkspaceBookmarks>;
  
  // Workspace actions
  addWorkspace: (name: string) => void;
  deleteWorkspace: (id: string, deleteBookmarks: boolean) => void;
  setActiveWorkspace: (id: string) => void;
  
  // Bookmark actions
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  updateBookmark: (id: string, updates: Partial<Bookmark>) => void;
  deleteBookmark: (id: string) => void;
  deleteAllBookmarks: () => void;
  toggleFavorite: (id: string) => void;
  
  // Grid actions
  addTileToGrid: (bookmarkId: string, x: number, y: number, w: number, h: number) => void;
  updateTilePosition: (tileId: string, x: number, y: number) => void;
  updateTileSize: (tileId: string, w: number, h: number) => void;
  removeTileFromGrid: (tileId: string) => void;
  
  // Helpers
  getActiveWorkspaceBookmarks: () => WorkspaceBookmarks;
  getBookmarkById: (id: string) => Bookmark | undefined;
}

const defaultWorkspace: Workspace = {
  id: 'default',
  name: 'Personal',
};

const defaultWorkspaceBookmarks: WorkspaceBookmarks = {
  favorites: [],
  grid: [],
  bookmarks: [],
};

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      workspaces: [defaultWorkspace],
      activeWorkspaceId: 'default',
      bookmarksByWorkspace: {
        default: defaultWorkspaceBookmarks,
      },

      addWorkspace: (name) => {
        const id = `workspace-${Date.now()}`;
        set((state) => ({
          workspaces: [...state.workspaces, { id, name }],
          bookmarksByWorkspace: {
            ...state.bookmarksByWorkspace,
            [id]: { favorites: [], grid: [], bookmarks: [] },
          },
          activeWorkspaceId: id,
        }));
      },

      deleteWorkspace: (id, deleteBookmarks) => {
        const state = get();
        if (state.workspaces.length === 1) return;
        
        const newWorkspaces = state.workspaces.filter((w) => w.id !== id);
        const newBookmarks = { ...state.bookmarksByWorkspace };
        
        if (deleteBookmarks) {
          delete newBookmarks[id];
        }
        
        set({
          workspaces: newWorkspaces,
          bookmarksByWorkspace: newBookmarks,
          activeWorkspaceId: state.activeWorkspaceId === id ? newWorkspaces[0].id : state.activeWorkspaceId,
        });
      },

      setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),

      addBookmark: (bookmark) => {
        const id = `bookmark-${Date.now()}`;
        const newBookmark: Bookmark = {
          ...bookmark,
          id,
          createdAt: Date.now(),
        };
        
        set((state) => {
          const workspaceId = state.activeWorkspaceId;
          const workspace = state.bookmarksByWorkspace[workspaceId] || defaultWorkspaceBookmarks;
          
          return {
            bookmarksByWorkspace: {
              ...state.bookmarksByWorkspace,
              [workspaceId]: {
                ...workspace,
                bookmarks: [...workspace.bookmarks, newBookmark],
                favorites: newBookmark.isFavorite 
                  ? [...workspace.favorites, newBookmark]
                  : workspace.favorites,
              },
            },
          };
        });
        
        return id;
      },

      updateBookmark: (id, updates) => {
        set((state) => {
          const workspaceId = state.activeWorkspaceId;
          const workspace = state.bookmarksByWorkspace[workspaceId];
          if (!workspace) return state;
          
          const updatedBookmarks = workspace.bookmarks.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          );
          
          const bookmark = updatedBookmarks.find((b) => b.id === id);
          const updatedFavorites = bookmark?.isFavorite
            ? workspace.favorites.some((f) => f.id === id)
              ? workspace.favorites.map((f) => (f.id === id ? { ...f, ...updates } : f))
              : [...workspace.favorites, bookmark]
            : workspace.favorites.filter((f) => f.id !== id);
          
          return {
            bookmarksByWorkspace: {
              ...state.bookmarksByWorkspace,
              [workspaceId]: {
                ...workspace,
                bookmarks: updatedBookmarks,
                favorites: updatedFavorites,
              },
            },
          };
        });
      },

      deleteBookmark: (id) => {
        set((state) => {
          const workspaceId = state.activeWorkspaceId;
          const workspace = state.bookmarksByWorkspace[workspaceId];
          if (!workspace) return state;
          
          return {
            bookmarksByWorkspace: {
              ...state.bookmarksByWorkspace,
              [workspaceId]: {
                ...workspace,
                bookmarks: workspace.bookmarks.filter((b) => b.id !== id),
                favorites: workspace.favorites.filter((f) => f.id !== id),
                grid: workspace.grid.filter((t) => t.bookmarkId !== id),
              },
            },
          };
        });
      },

      deleteAllBookmarks: () => {
        set((state) => {
          const workspaceId = state.activeWorkspaceId;
          return {
            bookmarksByWorkspace: {
              ...state.bookmarksByWorkspace,
              [workspaceId]: defaultWorkspaceBookmarks,
            },
          };
        });
      },

      toggleFavorite: (id) => {
        const state = get();
        const bookmark = state.getBookmarkById(id);
        if (bookmark) {
          state.updateBookmark(id, { isFavorite: !bookmark.isFavorite });
        }
      },

      addTileToGrid: (bookmarkId, x, y, w, h) => {
        const tileId = `tile-${Date.now()}`;
        set((state) => {
          const workspaceId = state.activeWorkspaceId;
          const workspace = state.bookmarksByWorkspace[workspaceId];
          if (!workspace) return state;
          
          return {
            bookmarksByWorkspace: {
              ...state.bookmarksByWorkspace,
              [workspaceId]: {
                ...workspace,
                grid: [...workspace.grid, { id: tileId, bookmarkId, x, y, w, h }],
              },
            },
          };
        });
      },

      updateTilePosition: (tileId, x, y) => {
        set((state) => {
          const workspaceId = state.activeWorkspaceId;
          const workspace = state.bookmarksByWorkspace[workspaceId];
          if (!workspace) return state;
          
          return {
            bookmarksByWorkspace: {
              ...state.bookmarksByWorkspace,
              [workspaceId]: {
                ...workspace,
                grid: workspace.grid.map((t) =>
                  t.id === tileId ? { ...t, x, y } : t
                ),
              },
            },
          };
        });
      },

      updateTileSize: (tileId, w, h) => {
        set((state) => {
          const workspaceId = state.activeWorkspaceId;
          const workspace = state.bookmarksByWorkspace[workspaceId];
          if (!workspace) return state;
          
          return {
            bookmarksByWorkspace: {
              ...state.bookmarksByWorkspace,
              [workspaceId]: {
                ...workspace,
                grid: workspace.grid.map((t) =>
                  t.id === tileId ? { ...t, w, h } : t
                ),
              },
            },
          };
        });
      },

      removeTileFromGrid: (tileId) => {
        set((state) => {
          const workspaceId = state.activeWorkspaceId;
          const workspace = state.bookmarksByWorkspace[workspaceId];
          if (!workspace) return state;
          
          return {
            bookmarksByWorkspace: {
              ...state.bookmarksByWorkspace,
              [workspaceId]: {
                ...workspace,
                grid: workspace.grid.filter((t) => t.id !== tileId),
              },
            },
          };
        });
      },

      getActiveWorkspaceBookmarks: () => {
        const state = get();
        return state.bookmarksByWorkspace[state.activeWorkspaceId] || defaultWorkspaceBookmarks;
      },

      getBookmarkById: (id) => {
        const state = get();
        const workspace = state.bookmarksByWorkspace[state.activeWorkspaceId];
        return workspace?.bookmarks.find((b) => b.id === id);
      },
    }),
    {
      name: 'bookmark-storage',
    }
  )
);
