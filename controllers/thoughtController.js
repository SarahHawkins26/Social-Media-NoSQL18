const { Thought, User } = require("../models");

module.exports = {
  //get all thoughts
  async getAllThoughts(req, res) {
    try {
      const thought = await Thought.find();

      const thoughtObj = {
        thought,
      };
      res.json(thoughtObj);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
  //get single thought by id
  async getSingleThoughtById(req, res) {
    try {
      const thought = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select("-__v");
      if (!thought) {
        return res.status(404).json({
          message: `No thought found with ID ${req.params.thoughtId}`,
        });
      }
      res.json({
        thought,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
  //post, create a new thought
  async createNewThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $push: { thoughts: thought._id } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: `Thought created`,
        })
      }
      res.json(`Thought created, "${thought.thoughtText}"`);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  //put, update thought by ID
  async updateThought(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        { _id: req.params.thoughtId },
        { $set: { thoughtText: req.body.thoughtText } },
        { new: true }
      );

      if (!thought) {
        return res.status(404).json({
          message: `No thought found with ID ${req.params.thoughtId}`,
        })
      }
      res.json(thought);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  //delete, delete thought by id
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findByIdAndDelete({
        _id: req.params.thoughtId,
      });
      if (!thought) {
        return res.status(404).json({
          message: `No thought found with ID ${req.params.thoughtId}`,
        });
      }
      res.json({ message: `Thought with ID ${req.params.thoughtId} deleted` });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  //post, create a reaction
  async createReaction(req, res) {
    try {
      const reaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reactions: req.body } },
        {
          runValidators: true,
          new: true,
        }
      );
      if (!reaction) {
        return res.status(404).json({
          message: `No thought found with ID ${req.params.thoughtId}`
        });
      }
      res.json(reaction);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  //delete, delete reaction
  async deleteReaction(req, res) {
    try {
      const reaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        {
          $pull: {
            reactions: {
              _id: req.params.reactionId,
            },
          },
        },
        {
          runValidators: true,
          new: true,
        }
      );
      if (!reaction) {
        return res
          .status(404)
          .json({
            message: `No thought found with ID ${req.params.thoughtId}`
          });
      }
      res.json(reaction);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
};
