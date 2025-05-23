export interface MangaType {
  id: string;
  title: string;
  coverImage: string;
  bannerImage?: string;
  author: string;
  artist: string;
  status: 'ongoing' | 'completed' | 'hiatus';
  publicationYear: number;
  genres: string[];
  synopsis: string;
  rating: number;
  chapters: number;
  views: number;
  isNew?: boolean;
  isUpdated?: boolean;
}

export const mockGenres = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery',
  'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller'
];

export const mockFeaturedManga: MangaType[] = [
  {
    id: '1',
    title: 'Blade of the Immortal',
    coverImage: 'https://images.unsplash.com/photo-1569701813229-33284b643e3c?q=80&w=1288&auto=format&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1569701813229-33284b643e3c?q=80&w=1288&auto=format&fit=crop',
    author: 'Hiroaki Samura',
    artist: 'Hiroaki Samura',
    status: 'completed',
    publicationYear: 1993,
    genres: ['Action', 'Adventure', 'Historical', 'Supernatural'],
    synopsis: 'A samurai cursed with immortality teams up with a young girl seeking revenge for the murder of her family in feudal Japan.',
    rating: 4.8,
    chapters: 206,
    views: 1250000
  },
  {
    id: '2',
    title: 'Spirit Hunter',
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1287&auto=format&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1287&auto=format&fit=crop',
    author: 'Hayashi Mikoto',
    artist: 'Hayashi Mikoto',
    status: 'ongoing',
    publicationYear: 2018,
    genres: ['Horror', 'Supernatural', 'Mystery', 'Psychological'],
    synopsis: 'In a world where vengeful spirits haunt the living, only a special few with supernatural abilities can exorcise these dangerous entities and save humanity from impending doom.',
    rating: 4.6,
    chapters: 78,
    views: 890000
  },
  {
    id: '3',
    title: 'Cosmic Odyssey',
    coverImage: 'https://images.unsplash.com/photo-1560932684-5e552e2894e9?q=80&w=1287&auto=format&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1560932684-5e552e2894e9?q=80&w=1287&auto=format&fit=crop',
    author: 'Nakamura Sora',
    artist: 'Katsuki Ren',
    status: 'ongoing',
    publicationYear: 2020,
    genres: ['Sci-Fi', 'Adventure', 'Action', 'Drama'],
    synopsis: 'A crew of explorers navigate the vastness of space, discovering ancient alien civilizations and uncovering the secrets of the universe while fighting to prevent an interstellar war.',
    rating: 4.7,
    chapters: 45,
    views: 750000
  }
];

export const mockPopularManga: MangaType[] = [
  {
    id: '4',
    title: 'Crystal Kingdom',
    coverImage: 'https://images.unsplash.com/photo-1559933240-dc734a29e6e3?q=80&w=1288&auto=format&fit=crop',
    author: 'Tanaka Yuji',
    artist: 'Tanaka Yuji',
    status: 'ongoing',
    publicationYear: 2017,
    genres: ['Fantasy', 'Adventure', 'Action'],
    synopsis: 'In a world where crystals grant magical powers, a young boy discovers he possesses the rarest crystal of all.',
    rating: 4.9,
    chapters: 156,
    views: 2100000
  },
  {
    id: '5',
    title: 'Shadow Academy',
    coverImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1160&auto=format&fit=crop',
    author: 'Watanabe Hiro',
    artist: 'Kimura Akira',
    status: 'ongoing',
    publicationYear: 2019,
    genres: ['Fantasy', 'School Life', 'Action'],
    synopsis: 'Students with supernatural abilities train to become elite protectors at the most prestigious academy in the world.',
    rating: 4.7,
    chapters: 87,
    views: 1750000,
    isUpdated: true
  },
  {
    id: '6',
    title: 'Destiny Breaker',
    coverImage: 'https://images.unsplash.com/photo-1560932684-6e76797c292f?q=80&w=1287&auto=format&fit=crop',
    author: 'Nakamura Hana',
    artist: 'Nakamura Hana',
    status: 'hiatus',
    publicationYear: 2016,
    genres: ['Action', 'Drama', 'Fantasy', 'Romance'],
    synopsis: 'A warrior who can see the future tries to change the tragic destiny that awaits those he loves.',
    rating: 4.6,
    chapters: 124,
    views: 1500000
  },
  {
    id: '7',
    title: 'Urban Legends',
    coverImage: 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?q=80&w=1287&auto=format&fit=crop',
    author: 'Yamamoto Kenji',
    artist: 'Suzuki Takashi',
    status: 'ongoing',
    publicationYear: 2020,
    genres: ['Horror', 'Mystery', 'Supernatural'],
    synopsis: 'A journalist investigates disturbing urban legends only to discover they are all connected to a terrifying truth.',
    rating: 4.8,
    chapters: 54,
    views: 900000,
    isNew: true
  },
  {
    id: '8',
    title: 'Moonlight Samurai',
    coverImage: 'https://images.unsplash.com/photo-1496096265110-f83ad7f96608?q=80&w=1170&auto=format&fit=crop',
    author: 'Matsumoto Ryo',
    artist: 'Matsumoto Ryo',
    status: 'completed',
    publicationYear: 2015,
    genres: ['Historical', 'Action', 'Drama', 'Romance'],
    synopsis: 'In the last days of the samurai era, a skilled warrior finds himself torn between duty and love.',
    rating: 4.9,
    chapters: 178,
    views: 1900000
  }
];

export const mockLatestUpdates: MangaType[] = [
  {
    id: '5',
    title: 'Shadow Academy',
    coverImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1160&auto=format&fit=crop',
    author: 'Watanabe Hiro',
    artist: 'Kimura Akira',
    status: 'ongoing',
    publicationYear: 2019,
    genres: ['Fantasy', 'School Life', 'Action'],
    synopsis: 'Students with supernatural abilities train to become elite protectors at the most prestigious academy in the world.',
    rating: 4.7,
    chapters: 87,
    views: 1750000,
    isUpdated: true
  },
  {
    id: '9',
    title: 'Digital Dreams',
    coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1287&auto=format&fit=crop',
    author: 'Saito Ayumu',
    artist: 'Ito Makoto',
    status: 'ongoing',
    publicationYear: 2021,
    genres: ['Sci-Fi', 'Cyberpunk', 'Action'],
    synopsis: 'In a future where people live both in reality and virtual worlds, a hacker discovers a conspiracy that threatens both realms.',
    rating: 4.5,
    chapters: 32,
    views: 650000,
    isUpdated: true
  },
  {
    id: '10',
    title: 'Eternal Bonds',
    coverImage: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1170&auto=format&fit=crop',
    author: 'Kobayashi Mei',
    artist: 'Kobayashi Mei',
    status: 'ongoing',
    publicationYear: 2018,
    genres: ['Romance', 'Drama', 'Supernatural'],
    synopsis: 'Two souls find each other in every lifetime, bound by a promise made centuries ago.',
    rating: 4.6,
    chapters: 64,
    views: 1200000,
    isUpdated: true
  },
  {
    id: '11',
    title: 'Battle Athletes',
    coverImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1171&auto=format&fit=crop',
    author: 'Takahashi Kenji',
    artist: 'Mori Hiroshi',
    status: 'ongoing',
    publicationYear: 2017,
    genres: ['Sports', 'Action', 'School Life'],
    synopsis: 'Students with extraordinary athletic abilities compete to become the champion in a futuristic sports tournament.',
    rating: 4.4,
    chapters: 112,
    views: 980000,
    isUpdated: true
  }
];

export const mockNewReleases: MangaType[] = [
  {
    id: '7',
    title: 'Urban Legends',
    coverImage: 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?q=80&w=1287&auto=format&fit=crop',
    author: 'Yamamoto Kenji',
    artist: 'Suzuki Takashi',
    status: 'ongoing',
    publicationYear: 2020,
    genres: ['Horror', 'Mystery', 'Supernatural'],
    synopsis: 'A journalist investigates disturbing urban legends only to discover they are all connected to a terrifying truth.',
    rating: 4.8,
    chapters: 54,
    views: 900000,
    isNew: true
  },
  {
    id: '12',
    title: 'Ocean Depths',
    coverImage: 'https://images.unsplash.com/photo-1588421357574-87938a86fa28?q=80&w=1170&auto=format&fit=crop',
    author: 'Mizuki Akira',
    artist: 'Mizuki Akira',
    status: 'ongoing',
    publicationYear: 2022,
    genres: ['Adventure', 'Mystery', 'Sci-Fi'],
    synopsis: 'Deep-sea explorers encounter strange phenomena and ancient secrets hidden beneath the waves.',
    rating: 4.7,
    chapters: 18,
    views: 450000,
    isNew: true
  },
  {
    id: '13',
    title: 'Clockwork Heart',
    coverImage: 'https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?q=80&w=1170&auto=format&fit=crop',
    author: 'Hayashi Sakura',
    artist: 'Sato Yuki',
    status: 'ongoing',
    publicationYear: 2022,
    genres: ['Steampunk', 'Romance', 'Fantasy'],
    synopsis: 'In a steampunk world, an engineer falls in love with a princess who has a mechanical heart.',
    rating: 4.6,
    chapters: 12,
    views: 320000,
    isNew: true
  },
  {
    id: '14',
    title: 'Phantom Thieves',
    coverImage: 'https://images.unsplash.com/photo-1507034589631-9433cc6bc453?q=80&w=987&auto=format&fit=crop',
    author: 'Ito Haruki',
    artist: 'Ito Haruki',
    status: 'ongoing',
    publicationYear: 2022,
    genres: ['Action', 'Mystery', 'Thriller'],
    synopsis: 'A group of master thieves with unique abilities steal from corrupt elites to expose their crimes.',
    rating: 4.5,
    chapters: 10,
    views: 290000,
    isNew: true
  }
];

export const allManga: MangaType[] = [
  ...mockFeaturedManga,
  ...mockPopularManga,
  ...mockLatestUpdates.filter(manga => !mockPopularManga.some(m => m.id === manga.id)),
  ...mockNewReleases.filter(manga => !mockPopularManga.some(m => m.id === manga.id) && !mockLatestUpdates.some(m => m.id === manga.id))
];