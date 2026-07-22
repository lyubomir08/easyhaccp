import ScheduledTraining from "../models/ScheduledTraining.js";
import Training from "../models/Training.js";

const createScheduledTraining = async (data) => {
    return await ScheduledTraining.create(data);
};

const getScheduledTrainings = async () => {
    return await ScheduledTraining.find()
        .populate("object_id")
        .populate("participants.employee_id")
        .sort({ planned_date: 1 });
};

const getScheduledTrainingsByObject = async (objectId) => {
    return await ScheduledTraining.find({
        object_id: objectId,
    })
        .populate("participants.employee_id")
        .sort({ planned_date: 1 });
};

const updateScheduledTraining = async (id, data) => {
    return await ScheduledTraining.findByIdAndUpdate(id, data, {
        new: true,
    });
};

const deleteScheduledTraining = async (id) => {
    return await ScheduledTraining.findByIdAndDelete(id);
};

const completeScheduledTraining = async (id) => {
    const scheduledTraining = await ScheduledTraining.findById(id);

    if (!scheduledTraining) {
        throw new Error("Training not found");
    }

    const training = await Training.create({
        object_id: scheduledTraining.object_id,
        topic: scheduledTraining.topic,
        lecturer: scheduledTraining.lecturer,
        date: scheduledTraining.planned_date,
        participants: scheduledTraining.participants,
        scheduled_training_id: scheduledTraining._id,
    });

    await ScheduledTraining.findByIdAndDelete(id);

    return training;
};

export default {
    createScheduledTraining,
    getScheduledTrainings,
    getScheduledTrainingsByObject,
    updateScheduledTraining,
    deleteScheduledTraining,
    completeScheduledTraining,
};