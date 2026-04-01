import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

export const appwriteConfig = {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '',
    storageBucketId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || 'land-images',
};

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID, Query };

// Auth Helpers
export const login = async (email: string, password: string) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        console.error('Error in login:', error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const user = await account.get();
        return user;
    } catch {
        return null;
    }
};

export const logout = async () => {
    try {
        await account.deleteSession('current');
        return true;
    } catch (error) {
        console.error('Error in logout:', error);
        return false;
    }
};

export const checkAuth = async () => {
    const user = await getCurrentUser();
    return user;
};
