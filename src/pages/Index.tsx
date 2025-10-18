import { SidePanel } from '@/components/SidePanel';
import { SearchBar } from '@/components/SearchBar';
import { BookmarkGrid } from '@/components/BookmarkGrid';
import { WorkspaceBar } from '@/components/WorkspaceBar';

const Index = () => {
  return (
    <div className="min-h-screen w-full flex">
      <SidePanel />
      
      <div className="flex-1 flex flex-col">
        {/* Top row - 80px fixed height */}
        <div className="h-20 glass border-b border-glass-border flex items-center justify-center px-6">
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
