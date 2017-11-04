module.exports = {

    disable: (...events) => {
        const disabled = {};
        
        for (e of events)
            disabled[e] = true;

        return disabled;
    }

}