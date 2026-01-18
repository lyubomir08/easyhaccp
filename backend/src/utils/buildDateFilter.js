const buildDateFilter = (queryParams, dateField) => {
    const { date, from, to } = queryParams;

    if (date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);

        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        return {
            [dateField]: { $gte: start, $lte: end }
        };
    }

    if (from || to) {
        const filter = {};

        if (from) {
            const start = new Date(from);
            start.setHours(0, 0, 0, 0);
            filter.$gte = start;
        }

        if (to) {
            const end = new Date(to);
            end.setHours(23, 59, 59, 999);
            filter.$lte = end;
        }

        return {
            [dateField]: filter
        };
    }

    return {};
};

export default buildDateFilter;
