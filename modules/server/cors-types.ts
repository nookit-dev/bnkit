import { CommonHttpHeaders, HttpMethod } from "mod/utils/http-types";

export type CORSOptions = {
  origins?: string[];
  methods?: HttpMethod[];
  headers?: CommonHttpHeaders[] | string[];
  credentials?: boolean;
};
export type ClientCORSCredentialOpts = "omit" | "same-origin" | "include";
