import mongoose from "mongoose";



const chatSessionSchema = new mongoose.Schema({
    conversationId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    model: { 
        type: String, 
        default: "tinyllama" 
    },
    messages: [{
        messageId: {
            type: String,
            default: () => new mongoose.Types.ObjectId().toString(),
            unique: true,
        },
        sequence: { 
            type: Number, 
            required: true,
        },
        role: { 
            type: String, 
            enum: ["user", "assistant", "system"], 
            required: true 
        },
        content: { 
            type: String, 
            required: true 
        },
        retrievedChunks: [{ 
            chunkId: String, 
            score: Number, 
            content: String
        }],
        toolCalls: [{
            tool: String, 
            input: mongoose.Schema.Types.Mixed, 
            output: mongoose.Schema.Types.Mixed
        }],
        tokenUsage: { 
            PromptTokens: Number, 
            CompletionTokens: Number, 
            TotalTokens: Number 
        },
        createdAt: { 
            type: Date, 
            default: Date.now 
        }
    }],
});

export const ChatSession = mongoose.model("ChatSession", chatSessionSchema);