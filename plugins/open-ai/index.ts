import {
  APIConfig,
  createFetchFactory,
} from "@u-tools/core/modules/fetch-factory/create-fetch-factory";
import type {
  CancelFineTuneParams,
  ChatCompletionParams,
  ChatCompletionResponse,
  CompletionsResponse,
  CreateFileParams,
  DeleteFileParams,
  FilesListResponse,
  FineTuneEvent,
  FineTuneResponse,
  FineTunesListResponse,
  ListFineTuneEventsParams,
  ListFineTunesParams,
  ListModelsParams,
  ModelsListResponse,
  OpenAIFileObject,
  RetrieveFineTuneParams,
  RetrieveModelParams,
  RetrieveModelResponse,
} from "./open-ai-types";

type OpenAIEndpoints = {
  "/v1/chat/completions": APIConfig<
    ChatCompletionResponse,
    ChatCompletionParams
  >;
  "/v1/models": APIConfig<ModelsListResponse, ListModelsParams>;
  "/v1/models/:modelId": APIConfig<RetrieveModelResponse, RetrieveModelParams>;
  "/v1/files": APIConfig<OpenAIFileObject, CreateFileParams, null>;
  "/v1/files/:fileId": APIConfig<void, DeleteFileParams>;
  "/v1/fine-tunes": APIConfig<FineTunesListResponse, ListFineTunesParams>;
  "/v1/fine-tunes/:fineTuneId": APIConfig<
    FineTuneResponse,
    RetrieveFineTuneParams
  >;
  "/v1/fine-tunes/:fineTuneId/events": APIConfig<
    FineTuneEvent,
    ListFineTuneEventsParams
  >;
  "/v1/fine-tunes/:fineTuneId/cancel": APIConfig<
    FineTuneResponse,
    CancelFineTuneParams
  >;
};

type APIEndpointsMap = {
  [K in keyof OpenAIEndpoints]: APIConfig<
    OpenAIEndpoints[K]["response"],
    OpenAIEndpoints[K]["params"],
    OpenAIEndpoints[K]["body"]
  >;
};

const endpointConfig: APIEndpointsMap = {
  "/v1/chat/completions": {
    method: "POST",
    endpoint: "/v1/chat/completions",
  },
  "/v1/models": {
    method: "GET",
    endpoint: "/v1/models",
  },
  "/v1/models/:modelId": {
    method: "GET",
    endpoint: "/v1/models/:modelId",
  },
  "/v1/files": {
    method: "POST",
    endpoint: "/v1/files",
  },
  "/v1/files/:fileId": {
    method: "DELETE",
    endpoint: "/v1/files/:fileId",
  },
  "/v1/fine-tunes": {
    method: "GET",
    endpoint: "/v1/fine-tunes",
  },
  "/v1/fine-tunes/:fineTuneId": {
    method: "GET",
    endpoint: "/v1/fine-tunes/:fineTuneId",
  },
  "/v1/fine-tunes/:fineTuneId/events": {
    method: "GET",
    endpoint: "/v1/fine-tunes/:fineTuneId/events",
  },
  "/v1/fine-tunes/:fineTuneId/cancel": {
    method: "POST",
    endpoint: "/v1/fine-tunes/:fineTuneId/cancel",
  },
};

const createHeaders = (
  apiKey: string,
  organizationId?: string
): HeadersInit => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${apiKey}`,
  ...(organizationId ? { "OpenAI-Organization": organizationId } : {}),
});

export const createOpenAIApi = ({
  apiKey,
  organizationId,
}: {
  apiKey: string;
  organizationId?: string;
}) => {
  const headers = createHeaders(apiKey, organizationId);
  const api = createFetchFactory<OpenAIEndpoints>({
    baseUrl: "https://api.openai.com",
    config: endpointConfig,
    defaultHeaders: headers,
  });

  api.get({
    endpoint: "/v1/chat/completions",
  });

  return api;
};

export default createOpenAIApi;
