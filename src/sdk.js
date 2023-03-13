import { makeAjaxCall, setupPageSync } from "./communication"
export const CohesiveSDK = {
    host: undefined,
    axios: undefined,

    init: (host) => {
        CohesiveSDK.host = host
        CohesiveSDK.axios = axios.create(this.host);
        CohesiveSDK.axios.interceptors.request.use(async (config) => {
            const { JWTToken } = await CohesiveSDK.getToken();
            if (config.headers) {
                config.headers.set("Authorization", `Bearer ${JWTToken}`);
                config.headers.set("X-COHESIVE-ENABLED", true)
            }
            return config;
        });
        setupPageSync();
        return CohesiveSDK
    },

    getUserData: async () => {
        const { JWTToken } = await CohesiveSDK.getToken();
        return JSON.parse(Buffer.from(JWTToken.split(".")[1], "base64").toString());
    },
    getToken: async () => {
        return await makeAjaxCall("USER_DATA");
    },
}

