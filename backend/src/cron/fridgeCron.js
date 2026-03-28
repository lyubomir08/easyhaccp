import cron from "node-cron";
import ObjectModel from "../models/Object.js";
import Fridge from "../models/Fridge.js";
import FridgeTemperatureLog from "../models/logs/FridgeTemperatureLog.js";
import Employee from "../models/Employee.js";

const randomTemp = (min, max) => {
    const val = min + Math.random() * (max - min);
    return Math.round(val * 10) / 10;
};

const parseWorkingHours = (working_hours) => {
    if (!working_hours) return { openH: 8, openM: 0, closeH: 20, closeM: 0 };
    const match = working_hours.match(/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/);
    if (!match) return { openH: 8, openM: 0, closeH: 20, closeM: 0 };
    return {
        openH: parseInt(match[1]),
        openM: parseInt(match[2]),
        closeH: parseInt(match[3]),
        closeM: parseInt(match[4]),
    };
};

const generateFridgeLogs = async () => {
    try {
        const now = new Date();
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(now);
        todayEnd.setHours(23, 59, 59, 999);

        const objects = await ObjectModel.find({});

        for (const obj of objects) {
            const { openH, openM, closeH, closeM } = parseWorkingHours(obj.working_hours);

            const morningTime = new Date(now);
            morningTime.setHours(openH + 1, openM, 0, 0);

            const eveningTime = new Date(now);
            eveningTime.setHours(closeH - 1, closeM, 0, 0);

            const fridges = await Fridge.find({ object_id: obj._id });
            if (fridges.length === 0) continue;

            const employees = await Employee.find({ object_id: obj._id });
            const randomEmployee = employees.length > 0
                ? employees[Math.floor(Math.random() * employees.length)]
                : null;

            for (const fridge of fridges) {
                const min = fridge.norm_min ?? -2;
                const max = fridge.norm_max ?? 4;

                const morningExists = await FridgeTemperatureLog.findOne({
                    fridge_id: fridge._id,
                    date: { $gte: todayStart, $lt: morningTime }
                });

                if (!morningExists && now >= morningTime) {
                    await FridgeTemperatureLog.create({
                        object_id: obj._id,
                        fridge_id: fridge._id,
                        date: morningTime,
                        measured_temp: randomTemp(min, max),
                        employee_id: randomEmployee?._id || undefined,
                        corrective_action: ""
                    });
                    console.log(`[FridgeCron] Сутрешен запис: ${obj.name} - ${fridge.name}`);
                }

                const eveningExists = await FridgeTemperatureLog.findOne({
                    fridge_id: fridge._id,
                    date: { $gte: eveningTime, $lte: todayEnd }
                });

                if (!eveningExists && now >= eveningTime) {
                    await FridgeTemperatureLog.create({
                        object_id: obj._id,
                        fridge_id: fridge._id,
                        date: eveningTime,
                        measured_temp: randomTemp(min, max),
                        employee_id: randomEmployee?._id || undefined,
                        corrective_action: ""
                    });
                    console.log(`[FridgeCron] Вечерен запис: ${obj.name} - ${fridge.name}`);
                }
            }
        }
    } catch (err) {
        console.error("[FridgeCron] Грешка:", err.message);
    }
};

export const startFridgeCron = () => {
    cron.schedule("0 * * * *", async () => {
        console.log("[FridgeCron] Проверка за автоматични записи...");
        await generateFridgeLogs();
    });

    generateFridgeLogs();

    console.log("[FridgeCron] Стартиран успешно");
};