import { createFetchFactory } from "../..";

export type FileObject = {
  id: string;
  object: string;
  bytes: number;
  created_at: number;
  filename: string;
  purpose: string;
};

export type FilesListResponse = {
  object: string;
  data: FileObject[];
};

export const createOpenAIFiles = ({ apiKey }: { apiKey: string }) => {
  const baseUrl = "https://api.openai.com";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
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

    async createFile(file: FileObject): Promise<FileObject> {
      try {
        const { data } = await openAiAPI.post<FileObject>({
          endpoint: filesEndpoint,
          headers,
          postData: file,
        });

        return data;
      } catch (error) {
        console.error("Error creating file:", error);
        throw error;
      }
    },

    async retrieveFile(fileId: string): Promise<FileObject> {
      try {
        const { data } = await openAiAPI.get<FileObject>({
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
