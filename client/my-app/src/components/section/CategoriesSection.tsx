"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Plus, Save, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Sample genre icons map
const genreIcons: Record<string, string> = {
  Action: "👊",
  Romance: "❤️",
  Horror: "👻",
  Fantasy: "🧙",
  SciFi: "🚀",
  Adventure: "🗺️",
  Comedy: "😂",
  Drama: "🎭",
  Mystery: "🔍",
  Sports: "⚽",
  Historical: "📜",
  School: "🏫",
  SliceOfLife: "🏡",
  Supernatural: "👽",
  Psychological: "🧠",
};

// Sample categories
const initialCategories = Object.entries(genreIcons).map(
  ([name, icon], index) => ({
    id: index + 1,
    name,
    icon,
    mangaCount: Math.floor(Math.random() * 100) + 5,
  }),
);

const CategoriesSection = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null,
  );
  const [editedName, setEditedName] = useState("");
  const [editedIcon, setEditedIcon] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEdit = (id: number, name: string, icon: string) => {
    setEditingCategoryId(id);
    setEditedName(name);
    setEditedIcon(icon);
  };

  const handleSave = (id: number) => {
    setCategories(
      categories.map((cat) =>
        cat.id === id ? { ...cat, name: editedName, icon: editedIcon } : cat,
      ),
    );
    setEditingCategoryId(null);
  };

  const handleCancel = () => {
    setEditingCategoryId(null);
  };

  const handleDelete = (id: number) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() === "") return;

    const newCategory = {
      id:
        categories.length > 0
          ? Math.max(...categories.map((c) => c.id)) + 1
          : 1,
      name: newCategoryName,
      icon: newCategoryIcon || "📚",
      mangaCount: 0,
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    setNewCategoryIcon("");
    setDialogOpen(false);
  };

  return (
    <Card className="bg-card/50 border-manga-600/20 animate-fade-in shadow-lg backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">
          Categories Management
        </CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-manga-600 hover:bg-manga-700">
              <Plus className="mr-1 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card/90 border-manga-600/40 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Add New Category
              </DialogTitle>
              <DialogDescription>
                Create a new manga category or genre for your collection.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Shonen, Isekai, etc."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="bg-muted/40"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="icon">Icon (emoji)</Label>
                <Input
                  id="icon"
                  placeholder="e.g., 🔥, 🌟, etc."
                  value={newCategoryIcon}
                  onChange={(e) => setNewCategoryIcon(e.target.value)}
                  className="bg-muted/40"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddCategory}
                className="bg-manga-600 hover:bg-manga-700"
              >
                Add Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-muted/30 border-manga-600/20 hover:border-manga-500/40 flex flex-col items-center justify-center space-y-2 rounded-lg border p-4 text-center transition-all"
            >
              {editingCategoryId === category.id ? (
                <>
                  <div className="mb-2 text-3xl">
                    <Input
                      value={editedIcon}
                      onChange={(e) => setEditedIcon(e.target.value)}
                      className="bg-muted/50 mx-auto w-20 text-center"
                    />
                  </div>
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="bg-muted/50 mb-2"
                  />
                  <div className="mt-2 flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => handleSave(category.id)}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={handleCancel}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-2 text-4xl">{category.icon}</div>
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-muted-foreground text-xs">
                    {category.mangaCount} manga
                  </p>
                  <div className="mt-2 flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() =>
                        handleEdit(category.id, category.name, category.icon)
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="hover:text-destructive h-8 w-8 p-0"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoriesSection;
