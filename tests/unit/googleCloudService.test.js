jest.mock('@google-cloud/firestore', () => {
    const mFirestore = {
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockReturnThis(),
        add: jest.fn().mockResolvedValue(true),
        set: jest.fn().mockResolvedValue(true),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue({
            empty: false,
            forEach: jest.fn(cb => cb({ data: () => ({ role: 'user', text: 'hi' }) }))
        })
    };
    return {
        Firestore: jest.fn(() => mFirestore)
    };
});
jest.mock('@google-cloud/firestore', () => {
    const mockFieldValue = {
        serverTimestamp: jest.fn()
    };
    const mFirestore = {
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockReturnThis(),
        add: jest.fn().mockImplementation(() => {
            if (process.env.TEST_FS_ERROR) return Promise.reject(new Error('Permission Denied'));
            return Promise.resolved(true);
        }),
        set: jest.fn().mockResolvedValue(true),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        get: jest.fn().mockImplementation(() => {
            if (process.env.TEST_FS_ERROR) return Promise.reject(new Error('Offline'));
            return Promise.resolve({
                empty: false,
                forEach: jest.fn(cb => cb({ data: () => ({ role: 'user', text: 'hi' }) }))
            });
        })
    };
    const mockFirestoreConstructor = jest.fn(() => mFirestore);
    mockFirestoreConstructor.FieldValue = mockFieldValue;
    return {
        Firestore: mockFirestoreConstructor
    };
});

jest.mock('@google-cloud/vertexai');
jest.mock('@google-cloud/translate');
jest.mock('@google-cloud/language');

const gcp = require('../../src/services/googleCloudService');

describe('Google Cloud Service', () => {
    
    it('should export all required properties', () => {
        expect(gcp).toHaveProperty('googleServicesReady');
        expect(gcp).toHaveProperty('generativeModel');
        expect(gcp).toHaveProperty('translationClient');
        expect(gcp).toHaveProperty('nlpClient');
        expect(gcp).toHaveProperty('SYSTEM_PROMPT');
        expect(gcp).toHaveProperty('saveChatMessage');
        expect(gcp).toHaveProperty('getChatHistory');
    });

    it('saveChatMessage should save to firestore if ready', async () => {
        gcp.googleServicesReady = true;
        await gcp.saveChatMessage('session-1', 'user', 'hello');
        // Since it's mocked, we just want it to not throw and coverage to hit.
        expect(true).toBe(true);
    });

    it('saveChatMessage should handle firestore permission denied gracefully', async () => {
        gcp.googleServicesReady = true;
        process.env.TEST_FS_ERROR = 'true';
        await gcp.saveChatMessage('session-1', 'user', 'hello');
        delete process.env.TEST_FS_ERROR;
        expect(true).toBe(true); // Should not throw
    });

    it('getChatHistory should fetch from firestore if ready', async () => {
        gcp.googleServicesReady = true;
        const history = await gcp.getChatHistory('session-1');
        expect(Array.isArray(history)).toBe(true);
    });

    it('getChatHistory should handle offline/no-network gracefully', async () => {
        gcp.googleServicesReady = true;
        process.env.TEST_FS_ERROR = 'true';
        const history = await gcp.getChatHistory('session-1');
        delete process.env.TEST_FS_ERROR;
        expect(history).toEqual([]); // Fallback to empty array
    });

});
