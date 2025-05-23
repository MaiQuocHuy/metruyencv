// Types for the history data
export interface MangaChange {
  field?: string;
  oldValue?: string;
  newValue?: string;
  manga_title?: string;
  manga_author?: string;
  manga_description?: string;
  manga_id?: number;
  manga_slug?: string;
  manga_thumb?: string;
  categoryId?: number;
  categoryName?: string;
  chap_id?: number;
  chap_manga_id?: string;
  chap_title?: string;
  chap_number?: number;
  chap_content?: string;
  newCategoryId?: number;
  newCategoryName?: string;
  removeCategoryId?: number;
  removeCategoryName?: string;
  categories?: {
    field: string;
    newCategoryId: number;
    newCategoryName: string;
  }[];
}

export interface VersionInfo {
  version: number;
  cid: string;
}

export interface ChangeLog {
  timestamp: string;
  description: string;
  changes: MangaChange[];
}

export interface HistoryEntry {
  version: number;
  content: string;
  type: string;
  changeLog: ChangeLog;
  recentVersions: VersionInfo[];
  previousVersion: string;
}
