const router = require('express').Router();
const {
    getAllUsers,
    getSingleUserById,
    createNewUser,
    updateUser,
    deleteUser,
    addNewFriend,
    deleteFriend,
} = require('../../controllers/userController.js');

// /api/users
router.route('/').get(getAllUsers).post(createNewUser);

// /api/users/:userId
router.route('/:userId').get(getSingleUserById).put(updateUser).delete(deleteUser);

// /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').post(addNewFriend).delete(deleteFriend);

module.exports = router;