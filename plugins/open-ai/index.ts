import {
  EndpointConfig,
  createFetchFactory,
} from "@u-tools/core/modules/fetch-factory/create-fetch-factory";
import { FetchConfig } from "../..";
import {
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
  "/v1/chat/completions": EndpointConfig<
    ChatCompletionResponse,
    ChatCompletionParams
  >;
  "/v1/models": EndpointConfig<ModelsListResponse, ListModelsParams>;
  "/v1/models/:modelId": EndpointConfig<
    RetrieveModelResponse,
    RetrieveModelParams
  >;
  "/v1/files": EndpointConfig<OpenAIFileObject, null, CreateFileParams>;
  "/v1/files/:fileId": EndpointConfig<void, DeleteFileParams>;
  "/v1/fine-tunes": EndpointConfig<FineTunesListResponse, ListFineTunesParams>;
  "/v1/fine-tunes/:fineTuneId": EndpointConfig<
    FineTuneResponse,
    RetrieveFineTuneParams
  >;
  "/v1/fine-tunes/:fineTuneId/events": EndpointConfig<
    FineTuneEvent,
    ListFineTuneEventsParams
  >;
  "/v1/fine-tunes/:fineTuneId/cancel": EndpointConfig<
    FineTuneResponse,
    CancelFineTuneParams
  >;
};

const APIConfigMap: Record<
  keyof OpenAIEndpoints,
  FetchConfig<
    OpenAIEndpoints,
    OpenAIEndpoints[keyof OpenAIEndpoints]["method"],
    keyof OpenAIEndpoints
  >
> = {
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
    config: APIConfigMap,
  });

  return api;
};

export default createOpenAIApi;
