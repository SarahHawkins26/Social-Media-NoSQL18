const { User } = require("../models");

module.exports = {
  //get all users
  async getAllUsers(req, res) {
    try {
      const users = await User.find();

      const userObj = {
        users,
      };
      res.json(userObj);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
  //get a single user by id
  async getSingleUserById(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId }).select(
        "-__v"
      );

      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }
      res.json({
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
  //post, create a new user
  async createNewUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  //put, update user by id
  async updateUser(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        { _id: req.params.userId },
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
          },
        },
        { runValidators: true, new: true }
      );
      if (!user) {
        return res
          .status(404)
          .json({ message: `No user found with ID ${req.params.userId}` });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  //delete, delete user by id
  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete({ _id: req.params.userId });

      if (!user) {
        return res
          .status(404)
          .json({ message: `No user found with ID ${req.params.userId}` });
      }
      res.json({
        message: `User with ID ${req.params.userId} has been deleted.`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  //post, add friend
  async addNewFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate({
        _id: req.params.userId,
        $addToSet: {
          friends: req.params.friendId,
        },
        new: true,
      });
      if (!user) {
        return res
          .status(404)
          .json({ message: `No user found with ID ${req.params.userId}` });
      }

      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  //delete, delete friend
  async deleteFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate({
        _id: req.params.userId,
        $pull: {
          friends: req.params.friendId,
        },
        new: true,
      });

      if (!user) {
        return res
          .status(404)
          .json({ message: `No user found with ID ${req.params.userId}` });
      }
      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
};
