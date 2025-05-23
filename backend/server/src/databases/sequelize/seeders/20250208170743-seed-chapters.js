'use strict';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createHash } = require('crypto')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const chapters = [];

    // Function to generate random number of images per chapter (between 15-25)
    // const getRandomImageCount = () => Math.floor(Math.random() * 11) + 15;

    // Function to generate chapter image content
    const generateChapterContent = (mangaId, chapNumber) => {
      // const imageCount = getRandomImageCount();
      // const images = [];

      // for (let i = 1; i <= imageCount; i++) {
      //   images.push({
      //     page: i,
      //     image_url: `https://mangacdn.com/manga-${mangaId}/chapter-${chapNumber}/page-${i}.jpg`
      //   });
      // }
      // return JSON.stringify({ pages: images });

      const randomData = Date.now().toString() + Math.random().toString();
      return createHash('md5').update(randomData).digest('hex');
    };

    // Generate chapters for manga IDs 1-4
    const chaptersPerManga = {
      1: 3,
      2: 1,
      3: 2,
      4: 4,
    };

    // Create chapter records for each manga
    for (const [mangaId, totalChapters] of Object.entries(chaptersPerManga)) {
      for (let chapNumber = 1; chapNumber <= totalChapters; chapNumber++) {
        chapters.push({
          chap_manga_id: mangaId,
          chap_number: chapNumber,
          chap_title: `Chapter ${chapNumber}`,
          chap_content: generateChapterContent(mangaId, chapNumber), // * Chapter content is a CID of ipfs file
          chap_views: Math.floor(Math.random() * 50000) + 1000, // Random views between 1000-51000
          is_deleted: false,
          createdAt: new Date(
            Date.now() - (totalChapters - chapNumber) * 7 * 24 * 60 * 60 * 1000,
          ), // Older chapters created earlier
          updatedAt: new Date(
            Date.now() - (totalChapters - chapNumber) * 7 * 24 * 60 * 60 * 1000,
          ),
        });
      }
    }

    // Insert all chapter records
    await queryInterface.bulkInsert('chapters', chapters);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('chapters', null, {});
  },
};
