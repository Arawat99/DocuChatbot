export interface chatDTO {
    conversationId: string;
    model?: string;
    message: { role: string; content: string }[];
}