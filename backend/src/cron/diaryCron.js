import cron from "node-cron";
import ObjectModel from "../models/Object.js";
import Employee from "../models/Employee.js";
import Room from "../models/Room.js";
import Disinfectant from "../models/Disinfectant.js";
import Fryer from "../models/Fryer.js";
import FoodGroup from "../models/FoodGroup.js";
import HygieneLog from "../models/logs/HygieneLog.js";
import PersonalHygieneLog from "../models/logs/PersonalHygieneLog.js";
import FryerOilLog from "../models/logs/FryerOilLog.js";
import ProducedFood from "../models/logs/ProducedFood.js";
import ShipmentLog from "../models/logs/ShipmentLog.js";

const FOOD_GROUP_PORTIONS = {
    "Супи":                       [30, 50],
    "Топли ястия":                [70, 120],
    "Студени салати":             [25, 50],
    "Десерти":                    [20, 40],
    "Грил и скара":               [20, 40],
    "Сосове (топли)":             [50, 90],
    "Студени предястия":          [15, 30],
    "Сандвичи":                   [10, 25],
    "Десерти с крем":             [10, 20],
    "Гарнитури (охладени)":       [60, 100],
    "Пица":                       [15, 40],
    "Хляб и тестени":             [60, 100],
    "Пресни салати (без дресинг)": [15, 30],
    "Суши / сурова риба":         [5, 15],
    "Напитки (прясни)":           [50, 80],
};

const randomInRange = (min, max) => Math.round(min + Math.random() * (max - min));

const parseShelfLifeHours = (shelfLife) => {
    if (!shelfLife) return 0;
    const match = shelfLife.match(/(\d+)\s*(час|ч)/i);
    if (match) return parseInt(match[1]);
    const dayMatch = shelfLife.match(/(\d+)\s*(ден|дни|д)/i);
    if (dayMatch) return parseInt(dayMatch[1]) * 24;
    return 0;
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

const generateDiaryLogs = async () => {
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

            // Split point = midpoint between morning and evening — works for any working hours
            const splitTime = new Date((morningTime.getTime() + eveningTime.getTime()) / 2);

            const employees = await Employee.find({ object_id: obj._id, active: true });
            if (employees.length === 0) continue;

            const randomEmployee = employees[Math.floor(Math.random() * employees.length)];

            // ===== ХИГИЕНА НА ОБЕКТА =====
            const rooms = await Room.find({ object_id: obj._id });
            const disinfectants = await Disinfectant.find({ object_id: obj._id });

            if (rooms.length > 0 && disinfectants.length > 0) {
                for (const room of rooms) {
                    const disinfectant = disinfectants[Math.floor(Math.random() * disinfectants.length)];

                    // Сутрешна хигиена — проверяваме само сутрешния слот (00:00 – 12:00)
                    const morningExists = await HygieneLog.findOne({
                        object_id: obj._id,
                        room_id: room._id,
                        date: { $gte: todayStart, $lte: splitTime },
                    });
                    if (!morningExists && now >= morningTime) {
                        await HygieneLog.create({
                            object_id: obj._id,
                            date: morningTime,
                            room_id: room._id,
                            disinfectant_id: disinfectant._id,
                            employee_id: randomEmployee._id,
                        });
                        console.log(`[DiaryCron] Сутрешна хигиена: ${obj.name} — ${room.name}`);
                    }

                    // Вечерна хигиена — проверяваме само вечерния слот (12:00 – 23:59)
                    const eveningExists = await HygieneLog.findOne({
                        object_id: obj._id,
                        room_id: room._id,
                        date: { $gte: splitTime, $lte: todayEnd },
                    });
                    if (!eveningExists && now >= eveningTime) {
                        await HygieneLog.create({
                            object_id: obj._id,
                            date: eveningTime,
                            room_id: room._id,
                            disinfectant_id: disinfectant._id,
                            employee_id: randomEmployee._id,
                        });
                        console.log(`[DiaryCron] Вечерна хигиена: ${obj.name} — ${room.name}`);
                    }
                }
            }

            // ===== ЛИЧНА ХИГИЕНА НА ПЕРСОНАЛА =====
            // Стойности: здрав + чисто облекло (в норма)
            for (const employee of employees) {
                // Сутрешна лична хигиена
                const morningPersonalExists = await PersonalHygieneLog.findOne({
                    object_id: obj._id,
                    employee_id: employee._id,
                    date: { $gte: todayStart, $lte: splitTime },
                });
                if (!morningPersonalExists && now >= morningTime) {
                    await PersonalHygieneLog.create({
                        object_id: obj._id,
                        date: morningTime,
                        employee_id: employee._id,
                        health_status: "healthy",
                        uniform_status: "clean",
                    });
                    console.log(`[DiaryCron] Сутрешна лична хигиена: ${obj.name} — ${employee.first_name} ${employee.last_name}`);
                }

                // Вечерна лична хигиена
                const eveningPersonalExists = await PersonalHygieneLog.findOne({
                    object_id: obj._id,
                    employee_id: employee._id,
                    date: { $gte: splitTime, $lte: todayEnd },
                });
                if (!eveningPersonalExists && now >= eveningTime) {
                    await PersonalHygieneLog.create({
                        object_id: obj._id,
                        date: eveningTime,
                        employee_id: employee._id,
                        health_status: "healthy",
                        uniform_status: "clean",
                    });
                    console.log(`[DiaryCron] Вечерна лична хигиена: ${obj.name} — ${employee.first_name} ${employee.last_name}`);
                }
            }

            // ===== СМЯНА НА МАЗНИНИ =====
            const fryers = await Fryer.find({ object_id: obj._id });

            const oilTypes = ["Слънчогледово олио", "Растително масло", "Палмово масло"];
            const vary = (val) => {
                const delta = val * 0.05;
                return Math.round((val + (Math.random() * 2 - 1) * delta) * 10) / 10;
            };

            for (const fryer of fryers) {
                // Последен запис с реални стойности (изключва непълни авто-записи)
                const lastLog = await FryerOilLog.findOne({
                    fryer_id: fryer._id,
                    oil_type: { $exists: true, $nin: [null, ""] },
                    $or: [
                        { load_quantity: { $exists: true, $gt: 0 } },
                        { change_quantity: { $exists: true, $gt: 0 } },
                    ],
                }).sort({ created_at: -1 });

                const randomQty = Math.round((8 + Math.random() * 7) * 10) / 10;
                const baseOilType = lastLog?.oil_type || oilTypes[Math.floor(Math.random() * oilTypes.length)];
                const baseLoadQty = lastLog?.load_quantity || lastLog?.change_quantity || randomQty;
                const baseChangeQty = lastLog?.change_quantity || lastLog?.load_quantity || randomQty;

                // Единичен дневен запис — зареждане + смяна се въвеждат наведнъж
                const todayOilRecord = await FryerOilLog.findOne({
                    fryer_id: fryer._id,
                    load_datetime: { $gte: todayStart, $lte: todayEnd },
                });

                if (!todayOilRecord && now >= morningTime) {
                    await FryerOilLog.create({
                        object_id: obj._id,
                        fryer_id: fryer._id,
                        load_datetime: morningTime,
                        load_quantity: vary(baseLoadQty),
                        change_datetime: eveningTime,
                        change_quantity: vary(baseChangeQty),
                        employee_id: randomEmployee._id,
                        oil_type: baseOilType,
                    });
                    console.log(`[DiaryCron] Дневен запис мазнина: ${obj.name} — ${fryer.name}`);
                } else if (todayOilRecord && !todayOilRecord.oil_type) {
                    await FryerOilLog.findByIdAndUpdate(todayOilRecord._id, {
                        oil_type: baseOilType,
                        load_quantity: vary(baseLoadQty),
                        change_datetime: eveningTime,
                        change_quantity: vary(baseChangeQty),
                    });
                    console.log(`[DiaryCron] Обновен запис мазнина: ${obj.name} — ${fryer.name}`);
                } else if (todayOilRecord && !todayOilRecord.change_datetime) {
                    await FryerOilLog.findByIdAndUpdate(todayOilRecord._id, {
                        change_datetime: eveningTime,
                        change_quantity: vary(baseChangeQty),
                    });
                    console.log(`[DiaryCron] Добавена смяна към запис: ${obj.name} — ${fryer.name}`);
                }
            }

            // ===== ПРОИЗВЕДЕНИ ХРАНИ ЗА ЗАВЕДЕНИЯ =====
            if (obj.object_type === "restaurant") {
                const foodGroups = await FoodGroup.find({ object_id: obj._id });

                for (const group of foodGroups) {
                    const existing = await ProducedFood.findOne({
                        object_id: obj._id,
                        food_group_id: group._id,
                        date: { $gte: todayStart, $lte: todayEnd },
                    });

                    if (!existing && now >= morningTime) {
                        const range = FOOD_GROUP_PORTIONS[group.food_name] || [20, 50];
                        const portions = randomInRange(range[0], range[1]);
                        const batchNumber = `${group.food_name} - ${now.toLocaleDateString("bg-BG")}`;

                        await ProducedFood.create({
                            date: morningTime,
                            object_id: obj._id,
                            food_group_id: group._id,
                            portions,
                            product_batch_number: batchNumber,
                            product_shelf_life: group.shelf_life || "",
                        });

                        console.log(`[DiaryCron] Произведени храни: ${obj.name} — ${group.food_name} (${portions} порции)`);
                    }
                }

                // ===== ЕКСПЕДИЦИЯ СЛЕД ИЗТИЧАНЕ НА СРОКА =====
                const todayProduced = await ProducedFood.find({
                    object_id: obj._id,
                    food_group_id: { $exists: true },
                    date: { $gte: todayStart, $lte: todayEnd },
                }).populate("food_group_id");

                for (const record of todayProduced) {
                    const alreadyShipped = await ShipmentLog.findOne({
                        produced_food_id: record._id,
                    });
                    if (alreadyShipped) continue;

                    const shelfHours = parseShelfLifeHours(record.food_group_id?.shelf_life);
                    const expiresAt = new Date(record.date.getTime() + shelfHours * 60 * 60 * 1000);

                    if (now >= expiresAt) {
                        await ShipmentLog.create({
                            date: now,
                            object_id: obj._id,
                            produced_food_id: record._id,
                            quantity: record.portions,
                        });
                        console.log(`[DiaryCron] Експедиция (след ${shelfHours}ч): ${obj.name} — ${record.food_group_id?.food_name} (${record.portions} порции)`);
                    }
                }
            }
        }
    } catch (err) {
        console.error("[DiaryCron] Грешка:", err.message);
    }
};

export const startDiaryCron = () => {
    cron.schedule("0 * * * *", async () => {
        console.log("[DiaryCron] Проверка за автоматични дневници...");
        await generateDiaryLogs();
    });

    generateDiaryLogs();

    console.log("[DiaryCron] Стартиран успешно (проверява всеки час)");
};
