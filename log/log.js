module.exports = {
    error: (location, errinfo) => {
        console.error('[server]\x1b[33m', `[server][${location}][error]:\x1b[0m ${errinfo}`);
    },
    log: (location, _event) => {
        console.log('[server]\x1b[36m',`[${location}][event]:`, '\x1b[0m', `${_event}`);
    },
};
