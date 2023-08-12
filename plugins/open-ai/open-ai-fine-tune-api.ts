import {
  createFetchFactory,
} from "@u-tools/core/modules/fetch-factory/create-fetch-factory";

export type FineTuneEvent = {
  object: string;
  created_at: number;
  level: string;
  message: string;
};

export type FineTuneFile = {
  id: string;
  object: string;
  bytes: number;
  created_at: number;
  filename: string;
  purpose: string;
};

export type FineTuneParams = {
  batch_size?: number;
  learning_rate_multiplier?: number;
  n_epochs?: number;
  prompt_loss_weight?: number;
};

export type FineTuneResponse = {
  id: string;
  object: string;
  model: string;
  created_at: number;
  events: FineTuneEvent[];
  fine_tuned_model: string;
  hyperparams: FineTuneParams;
  organization_id: string;
  result_files: FineTuneFile[];
  status: string;
  validation_files: FineTuneFile[];
  training_files: FineTuneFile[];
  updated_at: number;
};

export type FineTunesListResponse = {
  object: string;
  data: FineTuneResponse[];
};

const fineTuneEndpoint = "/v1/fine-tunes";

export const createOpenAIFineTune = ({ apiKey }: { apiKey: string }) => {
  const baseUrl = "https://api.openai.com";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const openAiAPI = createFetchFactory({
    baseUrl,
  });

  return {
    async createFineTune(
      model: string,
      training_files: FineTuneFile[],
      validation_files: FineTuneFile[],
      hyperparams: FineTuneParams
    ): Promise<FineTuneResponse> {
      const body = {
        model,
        training_files,
        validation_files,
        hyperparams,
      };

      try {
        const { data } = await openAiAPI.post<FineTuneResponse>({
          endpoint: fineTuneEndpoint,
          headers,
          postData: body,
        });

        return data;
      } catch (error) {
        console.error("Error creating fine tune:", error);
        throw error;
      }
    },

    async listFineTunes(): Promise<FineTunesListResponse> {
      try {
        const { data } = await openAiAPI.get<FineTunesListResponse>({
          endpoint: fineTuneEndpoint,
          headers,
        });

        return data;
      } catch (error) {
        console.error("Error fetching list of fine tunes:", error);
        throw error;
      }
    },

    async retrieveFineTune(fineTuneId: string): Promise<FineTuneResponse> {
      try {
        const { data } = await openAiAPI.get<FineTuneResponse>({
          endpoint: `${fineTuneEndpoint}/${fineTuneId}`,
          headers,
        });

        return data;
      } catch (error) {
        console.error(`Error fetching fine tune with ID ${fineTuneId}:`, error);
        throw error;
      }
    },

    async listFineTuneEvents(
      fineTuneId: string
    ): Promise<{ object: string; data: FineTuneEvent[] }> {
      try {
        const { data } = await openAiAPI.get<{
          object: string;
          data: FineTuneEvent[];
        }>({
          endpoint: `${fineTuneEndpoint}/${fineTuneId}/events`,
          headers,
        });

        return data;
      } catch (error) {
        console.error(
          `Error fetching events for fine tune with ID ${fineTuneId}:`,
          error
        );
        throw error;
      }
    },

    async cancelFineTune(fineTuneId: string): Promise<FineTuneResponse> {
      try {
        const { data } = await openAiAPI.post<FineTuneResponse>({
          endpoint: `${fineTuneEndpoint}/${fineTuneId}/cancel`,
          headers,
        });

        return data;
      } catch (error) {
        console.error(
          `Error cancelling fine tune with ID ${fineTuneId}:`,
          error
        );
        throw error;
      }
    },
  };
};

export default createOpenAIFineTune;
