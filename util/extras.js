module.exports = {

    disable: (...events) => {
        const disabled = {};

        for (const e of events)
            disabled[e] = true;

        return disabled;
    }

};