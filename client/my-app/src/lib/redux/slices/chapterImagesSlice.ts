import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ChapterImage } from '@/app/(dashboard)/dashboard/manga/[mangaid]/chapters/[chapterid]/images/page';

const chapterImagesSlice = createSlice({
  name: 'chapterImages',
  initialState: {
    images: [] as ChapterImage[]
  },
  reducers: {
    setCurrentImages(state, action: PayloadAction<ChapterImage[]>) {
      state.images = action.payload;
    }
  }
});

export const { setCurrentImages } = chapterImagesSlice.actions;
export default chapterImagesSlice.reducer;
