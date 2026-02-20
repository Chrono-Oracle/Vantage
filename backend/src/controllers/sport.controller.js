const sportService = require('../services/sport.service');

const create = async (req, res) => {
    const result = await sportService.create(req.body);
    if (result.error) {
        return res.status(400).json ({
            message: result.message
        });
    }

    return res.status(201).json({
        message: "Sport created successfully !!!"
    });
};

const findMany = async (req, res) => {
    const result = await sportService.find();
    if (result.error) {
        return res.status(400).json ({
            message: result.message
        });
    }

    return res.status(201).json({
        message: "Sports retrieved successfully !!!",
        data: result.data
    });
};

const find = async (req, res) => {
    const result = await sportService.find(req.params._id);
    if (result.error) {
        console.log("Error finding sport:", result.message);
        return res.status(400).json ({
            message: result.message
        });
    }

    return res.status(201).json({
        message: "Sports retrieved successfully !!!",
        data: result.data
    });
};

const update = async (req, res) => {
    const result = await sportService.update(req.params.id, req.body);
    if (result.error) {
        return res.status(400).json ({
            message: result.message
        });
    }

    return res.status(201).json({
        message: "Sports updated successfully !!!",
        data: result.data
    });
};

const remove = async (req, res) => {
    const result = await sportService.remove(req.params.id);
    if (result.error) {
        return res.status(400).json ({
            message: result.message
        });
    }

    return res.status(201).json({
        message: "Sports removed successfully !!!"
    });
};

module.exports = { create, findMany, find, update, remove };
