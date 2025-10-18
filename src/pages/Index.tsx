import { SidePanel } from '@/components/SidePanel';
import { SearchBar } from '@/components/SearchBar';
import { FavoritesBar } from '@/components/FavoritesBar';
import { BookmarkGrid } from '@/components/BookmarkGrid';
import { WorkspaceBar } from '@/components/WorkspaceBar';

const Index = () => {
  return (
    <div className="min-h-screen w-full flex">
      <SidePanel />
      
      <div className="flex-1 flex flex-col">
        {/* Top row - 80px fixed height */}
        <div className="h-20 glass border-b border-glass-border flex items-center gap-4 px-6">
          <div className="flex-1 max-w-xs">
            <FavoritesBar />
          </div>
          
          <SearchBar />
        </div>

        {/* Bottom row - Grid */}
        <BookmarkGrid />
      </div>

      <WorkspaceBar />
    </div>
  );
};

export default Index;
