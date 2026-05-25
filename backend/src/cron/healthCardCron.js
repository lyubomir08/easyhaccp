import cron from "node-cron";
import Employee from "../models/Employee.js";
import ObjectModel from "../models/Object.js";
import User from "../models/User.js";
import { sendHealthCardExpiryEmail } from "../services/emailService.js";

const checkHealthCards = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const in7Days = new Date(today);
        in7Days.setDate(in7Days.getDate() + 7);
        const in7DaysEnd = new Date(in7Days);
        in7DaysEnd.setHours(23, 59, 59, 999);

        // Find employees whose health card expires exactly in 7 days OR today (already expired)
        const employees = await Employee.find({
            active: true,
            health_card_expiry: {
                $gte: in7Days,
                $lte: in7DaysEnd,
            },
        });

        if (employees.length === 0) {
            console.log("[HealthCardCron] Няма изтичащи здравни книжки.");
            return;
        }

        console.log(`[HealthCardCron] Намерени ${employees.length} служителя с изтичащи книжки.`);

        for (const employee of employees) {
            const object = await ObjectModel.findById(employee.object_id);
            if (!object) continue;

            // Find owner(s) of the firm
            const owners = await User.find({
                role: "owner",
                firm_id: object.firm_id,
                email: { $exists: true, $ne: "" },
            });

            // Find manager(s) of the object
            const managers = await User.find({
                role: "manager",
                object_id: employee.object_id,
                email: { $exists: true, $ne: "" },
            });

            // Collect unique emails
            const allUsers = [...owners, ...managers];
            const uniqueEmails = [...new Set(allUsers.map(u => u.email).filter(Boolean))];

            if (uniqueEmails.length === 0) {
                console.log(`[HealthCardCron] Няма имейли за обект ${object.name}`);
                continue;
            }

            const expiryDate = employee.health_card_expiry;
            const diffMs = new Date(expiryDate).setHours(0, 0, 0, 0) - today.getTime();
            const daysLeft = Math.round(diffMs / (1000 * 60 * 60 * 24));

            const fullName = `${employee.first_name} ${employee.last_name}`;

            for (const email of uniqueEmails) {
                try {
                    await sendHealthCardExpiryEmail({
                        to: email,
                        employeeName: fullName,
                        expiryDate,
                        objectName: object.name,
                        daysLeft,
                    });
                    console.log(`[HealthCardCron] Имейл изпратен до ${email} за ${fullName}`);
                } catch (err) {
                    console.error(`[HealthCardCron] Грешка при изпращане до ${email}:`, err.message);
                }
            }
        }
    } catch (err) {
        console.error("[HealthCardCron] Грешка:", err.message);
    }
};

export const startHealthCardCron = () => {
    // Runs every day at 08:00
    cron.schedule("0 8 * * *", async () => {
        console.log("[HealthCardCron] Проверка за изтичащи здравни книжки...");
        await checkHealthCards();
    });

    console.log("[HealthCardCron] Стартиран успешно (всеки ден в 08:00)");
};
