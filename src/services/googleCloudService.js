const { VertexAI } = require('@google-cloud/vertexai');
const { TranslationServiceClient } = require('@google-cloud/translate');
const language = require('@google-cloud/language');
const { Firestore } = require('@google-cloud/firestore');
const config = require('../config/env');

let vertexAI, generativeModel, translationClient, nlpClient, firestore;
let googleServicesReady = false;

const SYSTEM_PROMPT = `You are ElectionEdu AI, an expert assistant on the Indian Election Process. 
You help citizens, especially first-time voters, understand how Indian elections work.
Topics you cover: voter registration, EVM/VVPAT, polling process, Election Commission, 
political parties, constituencies, Model Code of Conduct, election results.
Keep answers concise, friendly, and factual. If asked about anything unrelated to 
Indian elections or civic education, politely redirect the conversation.`;

try {
    // Initialize Vertex AI
    vertexAI = new VertexAI({ project: config.PROJECT_ID, location: config.REGION });
    generativeModel = vertexAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Initialize Translate API
    translationClient = new TranslationServiceClient({ projectId: config.PROJECT_ID });
    
    // Initialize Natural Language API
    nlpClient = new language.LanguageServiceClient({ projectId: config.PROJECT_ID });

    // Initialize Firestore for chat history
    firestore = new Firestore({ projectId: config.PROJECT_ID });

    googleServicesReady = true;
    console.log('✅ All Google Cloud services initialized');
} catch (err) {
    console.warn('⚠️  Google Cloud services not available. Running in Demo Mode.');
    console.warn(err.message);
}

// Save chat to Firestore
async function saveChatMessage(sessionId, role, text) {
    if (!googleServicesReady) return;
    try {
        const sessionRef = firestore.collection('chatSessions').doc(sessionId);
        await sessionRef.collection('messages').add({
            role,
            text,
            timestamp: Firestore.FieldValue.serverTimestamp()
        });
        
        // Also update the session document to keep track of activity
        await sessionRef.set({ lastActive: Firestore.FieldValue.serverTimestamp() }, { merge: true });
    } catch (err) {
        console.error('Firestore save error:', err.message);
    }
}

// Retrieve chat history for context
async function getChatHistory(sessionId) {
    if (!googleServicesReady) return [];
    try {
        const snapshot = await firestore.collection('chatSessions').doc(sessionId)
            .collection('messages')
            .orderBy('timestamp', 'asc')
            .limit(10) // Limit context to last 10 messages
            .get();
        
        if (snapshot.empty) {
            return [];
        }

        const history = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            history.push({
                role: data.role === 'model' ? 'model' : 'user', // Ensure strict role mapping for Vertex
                parts: [{ text: data.text }]
            });
        });
        return history;
    } catch (err) {
        console.error('Firestore fetch error:', err.message);
        return [];
    }
}

module.exports = {
    googleServicesReady,
    generativeModel,
    translationClient,
    nlpClient,
    SYSTEM_PROMPT,
    saveChatMessage,
    getChatHistory
};
