import FoodProduct from "../models/FoodProduct.js";

export const getByObject = async (req, res) => {
    try {
        const products = await FoodProduct.find({ object_id: req.params.objectId }).sort({ name: 1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const create = async (req, res) => {
    try {
        const { object_id, name } = req.body;
        const existing = await FoodProduct.findOne({ object_id, name: { $regex: `^${name.trim()}$`, $options: "i" } });
        if (existing) return res.status(409).json({ message: "Продуктът вече съществува" });
        const product = await FoodProduct.create({ object_id, name: name.trim() });
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const update = async (req, res) => {
    try {
        const product = await FoodProduct.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name?.trim() },
            { new: true }
        );
        if (!product) return res.status(404).json({ message: "Не е намерен" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const remove = async (req, res) => {
    try {
        await FoodProduct.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
