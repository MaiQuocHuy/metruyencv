/* eslint-disable prettier/prettier */
'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface) {
    const baseManga = [
      {
        manga_id: 1,
        manga_title: 'One Piece',
        manga_thumb: 'https://example.com/thumbs/one-piece.jpg',
        manga_slug: 'one-piece',
        manga_description:
          'A legendary adventure on the high seas in search of the One Piece treasure.',
        manga_author: 'Eiichiro Oda',
        manga_status: 'ongoing',
        manga_views: 1000000,
        manga_ratings_count: 10000,
        manga_total_star_rating: 45000,
        manga_number_of_followers: 500000,
        is_deleted: false,
        is_draft: false,
        is_published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        manga_id: 2,
        manga_title: 'Attack on Titan',
        manga_thumb: 'https://example.com/thumbs/attack-on-titan.jpg',
        manga_slug: 'attack-on-titan',
        manga_description:
          'A dark fantasy series where humanity fights against man-eating giants.',
        manga_author: 'Hajime Isayama',
        manga_status: 'completed',
        manga_views: 2000000,
        manga_ratings_count: 15000,
        manga_total_star_rating: 70000,
        manga_number_of_followers: 600000,
        is_deleted: false,
        is_draft: false,
        is_published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        manga_id: 3,
        manga_title: 'My Hero Academia',
        manga_thumb: 'https://example.com/thumbs/my-hero-academia.jpg',
        manga_slug: 'my-hero-academia',
        manga_description:
          'A world where almost everyone has superpowers, and one boy dreams of being a hero.',
        manga_author: 'Kohei Horikoshi',
        manga_status: 'ongoing',
        manga_views: 1500000,
        manga_ratings_count: 12000,
        manga_total_star_rating: 60000,
        manga_number_of_followers: 550000,
        is_deleted: false,
        is_draft: true,
        is_published: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        manga_id: 4,
        manga_title: 'Naruto: Shippuden',
        manga_thumb: 'https://example.com/naruto-shippuden-thumb.jpg',
        manga_slug: 'naruto-shippuden',
        manga_description:
          'Naruto returns to Konoha after two and a half years of training with Jiraiya.',
        manga_author: 'Masashi Kishimoto',
        manga_status: 'completed',
        manga_views: 8000000,
        manga_ratings_count: 20000,
        manga_total_star_rating: 96000,
        manga_number_of_followers: 200000,
        is_deleted: false,
        is_draft: false,
        is_published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    // Additional manga data generation
    const titles = ['Dragon Quest', 'Mystic Blade', 'Spirit Hunter', 'Dark Magic', 'Golden Knight'];
    const authors = ['Akira Toriyama', 'Yoshihiro Togashi', 'Rumiko Takahashi', 'Naoki Urasawa'];
    const statuses = ['ongoing', 'completed', 'hiatus'];

    const generateDescription = (title) => `Follow the epic adventure in ${title} as heroes face incredible challenges and discover their true destiny.`;

    const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');

    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const generatedManga = [];

    // Generate 20 additional manga entries
    for (let i = 5; i <= 35; i++) {
      const randomTitle = `${titles[i % titles.length]} ${String(i).padStart(2, '0')}`;
      const views = getRandomInt(100000, 10000000);
      const ratingsCount = getRandomInt(1000, 50000);
      const totalStarRating = getRandomInt(1000, 50000);

      generatedManga.push({
        manga_id: i,
        manga_title: randomTitle,
        manga_thumb: `https://example.com/${generateSlug(randomTitle)}-thumb.jpg`,
        manga_slug: generateSlug(randomTitle),
        manga_description: generateDescription(randomTitle),
        manga_author: authors[i % authors.length],
        manga_status: statuses[i % statuses.length],
        manga_views: views,
        manga_ratings_count: ratingsCount,
        manga_total_star_rating: totalStarRating,
        manga_number_of_followers: Math.floor(views * getRandomInt(1, 3) / 100), // Followers as percentage of views
        is_deleted: false,
        is_draft: false,
        is_published: true,
        createdAt: new Date(Date.now() - getRandomInt(0, 365 * 24 * 60 * 60 * 1000)), // Random date within last year
        updatedAt: new Date(),
      });
    }

    // Combine base and generated manga data
    const allManga = [...baseManga, ...generatedManga];
    await queryInterface.bulkInsert(
      'manga',
      allManga
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('manga', null, {});
  },
};
