import { handleRequest } from "./http";
import type { Env } from "./db";

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return handleRequest(request, env);
  }
};

