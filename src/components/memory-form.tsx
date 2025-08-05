'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Memory } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ImagePlus, Wand2, Save, Trash2, X } from 'lucide-react';
import { generateWishAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { DialogTitle } from '@/components/ui/dialog';

const formSchema = z.object({
  imageFile: z.any().optional(),
  imageDescription: z.string().min(10, 'Kripya thoda aur vistaar se likhein.').max(200),
  wish: z.string().optional(),
});

type MemoryFormProps = {
  memoryToEdit: Memory | null;
  onSave: (data: {
    imageFile?: File;
    imageDescription: string;
    wish: string;
    imagePreview?: string;
  }) => Promise<void>;
  onDelete?: () => void;
  onClose: () => void;
};

const MemoryForm = ({ memoryToEdit, onSave, onDelete, onClose }: MemoryFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(memoryToEdit?.imageUrl || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageDescription: memoryToEdit?.imageDescription || '',
      wish: memoryToEdit?.wish || '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('imageFile', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateWish = async () => {
    const description = form.getValues('imageDescription');
    if (!description) {
      form.setError('imageDescription', { message: 'Sandesh banane ke liye vivaran zaroori hai.' });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateWishAction({ imageDescription: description });
      if (result?.wish) {
        form.setValue('wish', result.wish);
        toast({ title: 'Sandesh Taiyaar!', description: 'AI ne aapke liye ek khaas sandesh banaya hai.' });
      } else {
        throw new Error('AI ne koi sandesh nahi diya.');
      }
    } catch (error) {
      toast({ variant: "destructive", title: 'AI Se Garbad', description: 'Sandesh nahi ban paaya. Phir se koshish karein.' });
    }
    setIsGenerating(false);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave({ ...values, wish: values.wish || memoryToEdit?.wish || '', imagePreview: imagePreview || undefined });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-0">
      <div className="relative flex flex-col items-center justify-center bg-muted/50 p-6 md:p-8">
        <Card className="w-full max-w-sm aspect-square relative shadow-lg">
          <CardContent className="p-0">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Memory preview"
                fill
                className="rounded-md object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted rounded-md flex flex-col items-center justify-center">
                 <ImagePlus className="w-16 h-16 text-muted-foreground/50" />
              </div>
            )}
          </CardContent>
        </Card>
        <Input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
        <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => fileInputRef.current?.click()}>
          <ImagePlus className="mr-2 h-4 w-4" />
          {imagePreview ? 'Photo Badlein' : 'Photo Daalein'}
        </Button>
         {form.formState.errors.imageFile && <p className="text-destructive text-xs mt-1">{(form.formState.errors.imageFile.message as string)}</p>}
      </div>

      <div className="flex flex-col p-6 md:p-8 bg-background">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="h-6 w-6" />
        </button>

        <DialogTitle className="font-headline text-2xl md:text-3xl font-semibold mb-4 text-primary-foreground/80">
          {memoryToEdit ? 'Is Yaad Ko Badlein' : 'Ek Nayi Yaad Banayein'}
        </DialogTitle>
        
        <div className="space-y-4 flex-grow">
          <div>
            <Label htmlFor="imageDescription">Us pal ko bayaan karein</Label>
            <Textarea
              id="imageDescription"
              placeholder="Jaise, 2023 mein jab behen ne kalai par rakhi baandhi..."
              {...form.register('imageDescription')}
              className="mt-1"
            />
            {form.formState.errors.imageDescription && <p className="text-destructive text-sm mt-1">{form.formState.errors.imageDescription.message}</p>}
          </div>

          <div>
            <Label htmlFor="wish">Dil Se Sandesh Ya Quote</Label>
            <div className="flex items-start gap-2">
              <Textarea
                id="wish"
                placeholder="Yahan ek khaas sandesh dikhega..."
                {...form.register('wish')}
                className="mt-1"
                rows={4}
              />
              <Button type="button" variant="outline" size="icon" className="mt-1 shrink-0" onClick={handleGenerateWish} disabled={isGenerating}>
                {isGenerating ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div> : <Wand2 className="h-4 w-4" />}
                <span className="sr-only">Sandesh Banayein</span>
              </Button>
            </div>
            {form.formState.errors.wish && <p className="text-destructive text-sm mt-1">{form.formState.errors.wish.message}</p>}
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <div>
            {onDelete && (
              <Button type="button" variant="destructive" onClick={onDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Mitaayein
              </Button>
            )}
          </div>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Yaad Save Karein
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MemoryForm;
