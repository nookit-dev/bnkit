import { createFetchFactory } from "@u-tools/core/modules/fetch-factory/create-fetch-factory";
export type OpenAIFileObject = {
  id: string;
  object: string;
  bytes: number;
  created_at: number;
  filename: string;
  purpose: string;
};

export type FilesListResponse = {
  object: string;
  data: OpenAIFileObject[];
};

export const createOpenAIFiles = ({
  apiKey,
  organizationId,
}: {
  apiKey: string;
  organizationId: string;
}) => {
  const baseUrl = "https://api.openai.com";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    "OpenAI-Organization": organizationId,
  };

  const openAiAPI = createFetchFactory({
    baseUrl,
  });

  const filesEndpoint = "/v1/files";

  return {
    async listFiles(): Promise<FilesListResponse> {
      try {
        const { data } = await openAiAPI.get<FilesListResponse>({
          endpoint: filesEndpoint,
          headers,
        });

        return data;
      } catch (error) {
        console.error("Error fetching list of files:", error);
        throw error;
      }
    },

    async createFile(
      filePath: string,
      purpose: string
    ): Promise<OpenAIFileObject> {
      try {
        const formData = new FormData();
        const file = Bun.file(filePath);
        const content = file.stream()
        formData.append("file", file);
        formData.append("purpose", purpose);

        const { data } = await openAiAPI.postForm({
          endpoint: filesEndpoint,
          formData,
          headers: {
            "OpenAI-Organization": organizationId,
          },
        });

        console.log({ data });

        return data;
      } catch (error) {
        console.error("Error creating file:", error);
        throw error;
      }
    },

    async retrieveFile(fileId: string): Promise<OpenAIFileObject> {
      try {
        const { data } = await openAiAPI.get<OpenAIFileObject>({
          endpoint: `${filesEndpoint}/${fileId}`,
          headers,
        });

        return data;
      } catch (error) {
        console.error(`Error fetching file with ID ${fileId}:`, error);
        throw error;
      }
    },

    async deleteFile(
      fileId: string
    ): Promise<{ object: string; deleted: boolean; id: string }> {
      try {
        const { data } = await openAiAPI.delete<{
          object: string;
          deleted: boolean;
          id: string;
        }>({
          endpoint: `${filesEndpoint}/${fileId}`,
          headers,
        });

        return data;
      } catch (error) {
        console.error(`Error deleting file with ID ${fileId}:`, error);
        throw error;
      }
    },
  };
};

export default createOpenAIFiles;
