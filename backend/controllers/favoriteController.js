const Favorite = require('../models/Favorite');
const { getIsConnected } = require('../config/db');

// In-memory fallback if database connection failed
let mockFavorites = [];

// @desc    Get all favorites for user
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const userFavs = mockFavorites.filter(f => f.user === req.user._id.toString() || f.user === req.user._id);
      return res.json(userFavs);
    }
    const favorites = await Favorite.find({ user: req.user._id });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle user favorite (add or remove)
// @route   POST /api/favorites
// @access  Private
const toggleFavorite = async (req, res) => {
  const { type, item } = req.body;
  if (!type || item === undefined) {
    return res.status(400).json({ message: 'Type and item parameters are required.' });
  }

  try {
    const userIdStr = req.user._id.toString();

    if (!getIsConnected()) {
      let existingIdx = -1;
      if (type === 'question') {
        existingIdx = mockFavorites.findIndex(
          f => (f.user.toString() === userIdStr) && 
          f.type === type && 
          f.item.questionText === item.questionText
        );
      } else {
        // Simple string key bookmark or object match
        existingIdx = mockFavorites.findIndex(
          f => (f.user.toString() === userIdStr) && 
          f.type === type && 
          (typeof f.item === 'string' ? f.item === item : JSON.stringify(f.item) === JSON.stringify(item))
        );
      }

      if (existingIdx !== -1) {
        mockFavorites.splice(existingIdx, 1);
        return res.json({ message: 'Removed from favorites', action: 'removed' });
      } else {
        const newFav = {
          _id: `fav_${Date.now()}`,
          user: userIdStr,
          type,
          item,
          createdAt: new Date()
        };
        mockFavorites.push(newFav);
        return res.status(201).json({ message: 'Added to favorites', action: 'added', favorite: newFav });
      }
    }

    // Live MongoDB implementation
    let existing;
    if (type === 'question') {
      existing = await Favorite.findOne({
        user: req.user._id,
        type,
        'item.questionText': item.questionText
      });
    } else {
      existing = await Favorite.findOne({
        user: req.user._id,
        type,
        item: item
      });
    }

    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);
      return res.json({ message: 'Removed from favorites', action: 'removed' });
    } else {
      const favorite = await Favorite.create({
        user: req.user._id,
        type,
        item
      });
      return res.status(201).json({ message: 'Added to favorites', action: 'added', favorite });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFavorites,
  toggleFavorite
};
