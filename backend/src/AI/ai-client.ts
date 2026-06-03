import axios from "axios";
import type { chatDTO } from "./ai-chat.dto.js";

export class AIClient {
    async sendChatMessage(data: chatDTO) {
        try {
            const content = data.message.map((msg) => msg.content).join("\n");
            console.log("Model: ", data.model);
            console.log("Extracted content for AI service:", content);
            const response = await axios.post(
                process.env.AI_Service_URL + "/chat",
                {model: data.model, message: content}
            );
            console.log("AI service response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error sending chat message to AI service");
            throw error;
        }
    }

    async createConversationTitle(messages: string) {
        try {
            console.log("Generating conversation title with messages:", messages);
            const response = await axios.post(
                process.env.AI_Service_URL + "/generate-title",
                { messages }
            );
            return response.data.title;
        } catch (error) {
            console.error("Error generating conversation title:", error);
            throw error;
        }
    }
}