'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const mangaCategoryRecords = [];

    // Function to get random number of categories (between 1 and 3)
    const getRandomCategoryCount = () => Math.floor(Math.random() * 5) + 1;

    // Function to get random categories (no duplicates)
    const getRandomCategories = (count) => {
      const categories = new Set();
      while (categories.size < count) {
        categories.add(Math.floor(Math.random() * 5) + 1); // Random category_id from 1-5
      }
      return Array.from(categories);
    };

    // Generate associations for manga_id 1-35
    for (let mangaId = 1; mangaId <= 35; mangaId++) {
      const categoryCount = getRandomCategoryCount();
      const selectedCategories = getRandomCategories(categoryCount);

      // Create records for each category associated with this manga
      selectedCategories.forEach((categoryId) => {
        mangaCategoryRecords.push({
          manga_id: mangaId,
          category_id: categoryId,
          is_deleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    }

    // Insert all records
    await queryInterface.bulkInsert('MangaCategory', mangaCategoryRecords);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('MangaCategory', null, {});
  },
};
