export const ERROR = 1
export const DEBUG = 2
const LOG_PREFIX = "COHESIVE_SDK"
var LOG_LEVEL = ERROR

const log = (level, message) => {
    if (level < LOG_LEVEL) {
        return
    }
    switch (level) {
        case undefined:
            console.debug(LOG_PREFIX, message);
            break;
        case ERROR:
            console.error(LOG_PREFIX, message);
            break;
        case DEBUG:
            console.debug(LOG_PREFIX, message);
            break;
        default:
            console.debug(LOG_PREFIX, message);
            break;
    }
}
