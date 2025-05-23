"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Filter, Edit, Trash2, MoreHorizontal, BookOpen } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

// Sample manga data
const sampleManga = [
  { id: 1, title: 'One Piece', author: 'Eiichiro Oda', status: 'ongoing', genre: 'Adventure', views: 1245632, coverImage: 'https://via.placeholder.com/80x120?text=One+Piece' },
  { id: 2, title: 'Demon Slayer', author: 'Koyoharu Gotouge', status: 'completed', genre: 'Action', views: 982145, coverImage: 'https://via.placeholder.com/80x120?text=Demon+Slayer' },
  { id: 3, title: 'Jujutsu Kaisen', author: 'Gege Akutami', status: 'ongoing', genre: 'Supernatural', views: 875421, coverImage: 'https://via.placeholder.com/80x120?text=Jujutsu+Kaisen' },
  { id: 4, title: 'My Hero Academia', author: 'Kohei Horikoshi', status: 'ongoing', genre: 'Superhero', views: 754123, coverImage: 'https://via.placeholder.com/80x120?text=My+Hero+Academia' },
  { id: 5, title: 'Attack on Titan', author: 'Hajime Isayama', status: 'completed', genre: 'Dark Fantasy', views: 1532145, coverImage: 'https://via.placeholder.com/80x120?text=Attack+on+Titan' },
  { id: 6, title: 'Spy x Family', author: 'Tatsuya Endo', status: 'ongoing', genre: 'Action', views: 641235, coverImage: 'https://via.placeholder.com/80x120?text=Spy+x+Family' },
  { id: 7, title: 'Chainsaw Man', author: 'Tatsuki Fujimoto', status: 'ongoing', genre: 'Horror', views: 745896, coverImage: 'https://via.placeholder.com/80x120?text=Chainsaw+Man' },
  { id: 8, title: 'Tokyo Revengers', author: 'Ken Wakui', status: 'completed', genre: 'Action', views: 512369, coverImage: 'https://via.placeholder.com/80x120?text=Tokyo+Revengers' },
];

interface MangaSectionProps {
  mini?: boolean;
}

const MangaSection = ({ mini = false }: MangaSectionProps) => {
  const [manga, setManga] = useState(sampleManga);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('views');
  const [displayedManga, setDisplayedManga] = useState([...manga]);
  
  // Apply filters and sorting
  const applyFilters = () => {
    let filtered = [...manga];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    // Apply sorting
    if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'views') {
      filtered.sort((a, b) => b.views - a.views);
    }
    
    setDisplayedManga(filtered);
  };
  
  // Handle deletion
  const handleDelete = (id: number) => {
    setManga(manga.filter(item => item.id !== id));
    setDisplayedManga(displayedManga.filter(item => item.id !== id));
  };
  
  // Effect for filtering
  useState(() => {
    applyFilters();
  });
  
  // For mini view, only show top 5 manga
  const mangaToShow = mini ? displayedManga.slice(0, 5) : displayedManga;
  
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-manga-600/20 shadow-lg animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">
          {mini ? "Top Manga" : "Manga Management"}
        </CardTitle>
        
        {!mini && (
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-manga-600 hover:bg-manga-700">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Manga
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card/90 backdrop-blur-xl border-manga-600/40">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Add New Manga</DialogTitle>
                </DialogHeader>
                {/* Form would go here */}
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-manga-600 hover:bg-manga-700">Add Manga</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardHeader>
      
      {!mini && (
        <div className="px-6 pb-2 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search manga..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                applyFilters();
              }}
              className="pl-9 bg-muted/40 border-manga-600/20"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                applyFilters();
              }}
            >
              <SelectTrigger className="w-[120px] bg-muted/40 border-manga-600/20">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-card/90 backdrop-blur-xl border-manga-600/40">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value);
                applyFilters();
              }}
            >
              <SelectTrigger className="w-[120px] bg-muted/40 border-manga-600/20">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-card/90 backdrop-blur-xl border-manga-600/40">
                <SelectItem value="views">Most Views</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      <CardContent>
        <div className="rounded-md border border-manga-600/20 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-manga-600/20">
                {!mini && (
                  <th className="w-[30px] text-left py-3 px-4">
                    <Checkbox />
                  </th>
                )}
                <th className="text-left py-3 px-4">Title</th>
                {!mini && <th className="text-left py-3 px-4">Author</th>}
                <th className="text-left py-3 px-4">Status</th>
                {!mini && <th className="text-left py-3 px-4">Genre</th>}
                <th className="text-left py-3 px-4">Views</th>
                {!mini && <th className="w-[80px] text-right py-3 px-4">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {mangaToShow.map((item) => (
                <tr key={item.id} className="border-t border-manga-600/10 hover:bg-manga-600/5">
                  {!mini && (
                    <td className="py-3 px-4">
                      <Checkbox />
                    </td>
                  )}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.coverImage} 
                        alt={item.title} 
                        className="w-8 h-12 object-cover rounded-sm" 
                      />
                      <span className="font-medium">{item.title}</span>
                    </div>
                  </td>
                  {!mini && <td className="py-3 px-4">{item.author}</td>}
                  <td className="py-3 px-4">
                    <Badge variant={item.status === 'ongoing' ? 'outline' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </td>
                  {!mini && <td className="py-3 px-4">{item.genre}</td>}
                  <td className="py-3 px-4">
                    {item.views.toLocaleString()}
                  </td>
                  {!mini && (
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card/90 backdrop-blur-xl border-manga-600/40">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BookOpen className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {!mini && (
          <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
            <div>Showing {displayedManga.length} of {manga.length} manga</div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">1</Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">2</Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">3</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MangaSection;
