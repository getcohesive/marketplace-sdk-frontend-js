import { parseJwt } from "./common";
import { makeAjaxCall, setupPageSync } from "./communication";

export const CohesiveSDK: ICohesiveSDK = {
  host: null,
  axios: null,

  init: (host: string, axios) => {
    CohesiveSDK.host = host;
    // CohesiveSDK.axios = axios.create(this.host);
    CohesiveSDK.axios = axios ? axios : axios.create(host);
    CohesiveSDK.axios.interceptors.request.use(async (config) => {
      const { JWTToken } = await CohesiveSDK.getToken();
      if (config.headers) {
        config.headers.set("Authorization", `Bearer ${JWTToken}`);
        config.headers.set("X-COHESIVE-ENABLED", true);
      }
      return config;
    });
    setupPageSync();
    // return CohesiveSDK
  },

  getUserData: async () => {
    const { JWTToken } = await CohesiveSDK.getToken();
    // return JSON.parse(Buffer.from(JWTToken.split(".")[1], "base64").toString());
    return parseJwt(JWTToken);
  },
  getToken: async () => {
    return await makeAjaxCall("USER_DATA");
  },
};

interface ICohesiveSDK {
  host: string | null;
  axios: any | null;
  init: (host: string, axios: any) => void;
  getUserData: () => Promise<IUser>;
  getToken: () => Promise<{ JWTToken: string }>;
}

interface IUser {
  current_period_started_at: number;
  exp: number;
  instance_id: number;
  role: string;
  user_id: number;
  user_name: string;
  workspace_id: number;
  workspace_name: string;
}
