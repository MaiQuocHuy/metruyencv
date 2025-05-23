'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useCreateMangaMutation } from '@/services/apiManga';
import { useGetCategoriesQuery } from '@/services/apiCategory';

export default function NewMangaPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    manga_title: '',
    manga_author: '',
    manga_description: ''
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);

  const [createManga, { isLoading }] = useCreateMangaMutation();

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();
  console.log(categoriesData);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    // Map input ids to corresponding state property names
    const fieldMap: Record<string, string> = {
      title: 'manga_title',
      author: 'manga_author',
      description: 'manga_description'
    };

    const stateField = fieldMap[id] || id;
    setFormData((prev) => ({ ...prev, [stateField]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleAddCategory = (category: string) => {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleRemoveCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter((c) => c !== category));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submissionData = new FormData();

      // Append text fields correctly from state
      submissionData.append('manga_title', formData.manga_title);
      submissionData.append('manga_author', formData.manga_author);
      submissionData.append(
        'manga_description',
        formData.manga_description || ''
      );

      // Append cover image if available
      if (coverImage) {
        submissionData.append('manga_thumb', coverImage);
      } else {
        console.log('Cover image is required');
        setIsSubmitting(false);
        return;
      }

      // Append categories individually to match backend DTO expectation
      selectedCategories.forEach((categoryId) => {
        submissionData.append('category_id', categoryId);
      });

      await createManga(submissionData).unwrap();
      router.push('/dashboard/manga');
    } catch (error) {
      console.log('Failed to create manga:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Manga</h1>
        <p className="text-muted-foreground">
          Create a new manga entry in your collection
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details about the manga
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Manga title"
                  required
                  value={formData.manga_title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  placeholder="Author name"
                  required
                  value={formData.manga_author}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>
                Provide more information about the manga
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the manga"
                  rows={4}
                  value={formData.manga_description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Categories</Label>
                <Select onValueChange={handleAddCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesData &&
                      categoriesData.map((category) => (
                        <SelectItem
                          key={category.category_id}
                          value={category.category_id.toString()}
                        >
                          {category.category_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedCategories.map((categoryId) => {
                    const category = categoriesData?.find(
                      (c) => c.category_id.toString() === categoryId
                    );
                    return (
                      <div
                        key={categoryId}
                        className="bg-primary/10 flex items-center rounded-full px-3 py-1 text-sm"
                      >
                        {category ? category.category_name : categoryId}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="ml-1 h-4 w-4"
                          onClick={() => handleRemoveCategory(categoryId)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
              <CardDescription>
                Upload a cover image for the manga
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="border-muted-foreground/50 flex h-40 w-32 items-center justify-center rounded-md border border-dashed">
                  {coverImage ? (
                    <img
                      src={URL.createObjectURL(coverImage)}
                      alt="Cover preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <p className="text-muted-foreground text-sm">No image</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    id="cover"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <p className="text-muted-foreground text-xs">
                    Recommended size: 350x500 pixels. Max file size: 2MB.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/manga')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isLoading}>
                {isSubmitting || isLoading ? 'Saving...' : 'Save Manga'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
