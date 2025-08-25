import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query, Account, Permission, Role } from "appwrite";

export class Service{
    client = new Client();
    databases;
    bucket;
    account;
    
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
        this.account = new Account(this.client);
        
        // Log configuration for debugging
        console.log("Appwrite client initialized with:");
        console.log("URL:", conf.appwriteUrl);
        console.log("Project ID:", conf.appwriteProjectId);
    }
async logout() {

        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite serive :: logout :: ", error);
        }
    }
async createPost({ title, slug, content, featureimage, status, userid }) {
  try {
    // Validate required fields
    if (!title || !content || !featureimage || !status || !userid) {
      throw new Error("Missing required fields");
    }
    
    // Remove slug from database storage - it will be used only for URL routing
    // Temporary workaround: truncate content to 255 chars until collection is updated
    const contentString = String(content);
    const truncatedContent = contentString.length > 255 
      ? contentString.substring(0, 252) + "..." 
      : contentString;
    
    console.log(`Content length: ${contentString.length}, truncated: ${truncatedContent.length <= 255}`);
    
    const documentData = {
      title: String(title).trim(),
      content: truncatedContent,
      featureimage: String(featureimage),
      status: String(status),
      userid: String(userid),
    };
    
    console.log("Creating document with validated data:", {
      ...documentData,
      content: documentData.content.substring(0, 100) + "..."
    });
    
    return await this.databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      ID.unique(),
      documentData
    )
  } catch (error) {
    console.error("Appwrite service :: createPost :: error", error);
    if (error.response) {
      console.error("Full error response:", JSON.stringify(error.response, null, 2));
    }
    throw error;
  }
}


    async updatePost(documentId, {title, slug, content, featureimage, status}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                documentId,
                {
                    title,
                    content,
                    featureimage,
                    status,
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: updatePost :: error", error);
            throw error; // Re-throw to handle in component
        }
    }

    async deletePost(documentId){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                documentId
            
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deletePost :: error", error);
            return false
        }
    }

  async getPost(documentId){
  return await this.databases.getDocument(
    conf.appwriteDatabaseId,
    conf.appwriteCollectionId,
    documentId
  );
}



    async getPosts(queries = [Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
                

            )
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error", error);
            return false
        }
    }

    // Test method to check database connection
    async testConnection() {
        try {
            console.log("Testing database connection...");
            const result = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [],
                1
            );
            console.log("Database connection successful:", result);
            return true;
        } catch (error) {
            console.log("Database connection failed:", error);
            return false;
        }
    }

    // Get collection attributes to debug schema issues
    async getCollectionInfo() {
        try {
            const collection = await this.databases.getCollection(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId
            );
            console.log("Collection attributes:", collection.attributes);
            console.log("Collection name:", collection.name);
            console.log("Collection permissions:", collection.$permissions);
            return collection;
        } catch (error) {
            console.error("Failed to get collection info:", error);
            return null;
        }
    }

    // Test with minimal data to isolate the issue
    async testCreatePost() {
        try {
            const testData = {
                title: "Test Post",
                slug: "test-post",
                content: "Test content",
                featureimage: "test-image-id",
                status: "active",
                userid: "test-user-id"
            };
            
            console.log("Testing with minimal data:", testData);
            
            const result = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                ID.unique(),
                testData
            );
            
            console.log("Test successful:", result);
            return result;
        } catch (error) {
            console.error("Test failed:", error);
            console.error("Test error response:", error.response);
            return null;
        }
    }

    // file upload service

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file,
                [
                    Permission.read(Role.any())
                ]
            )
        } catch (error) {
            console.log("Appwrite serive :: uploadFile :: error", error);
            return false
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteFile :: error", error);
            return false
        }
    }

    getFileView(fileId){
        if (!fileId) {
            console.warn('getFileView: fileId is null or undefined');
            return '';
        }
        try {
            const url = this.bucket.getFileView(
                conf.appwriteBucketId,
                fileId
            );
            console.log('Generated file view URL:', url);
            console.log('Bucket ID:', conf.appwriteBucketId);
            console.log('File ID:', fileId);
            return url;
        } catch (error) {
            console.error('getFileView error:', error);
            return '';
        }
    }
}


const service = new Service()
export default service