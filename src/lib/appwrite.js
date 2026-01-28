import { Client, Account, Databases, Storage, ID, Query } from "appwrite";

const client = new Client()
    .setEndpoint("https://sgp.cloud.appwrite.io/v1")
    .setProject("6979e02200167e338b86");

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Database constants
const DATABASE_ID = "cantik_db";
const PRODUCTS_COLLECTION = "products";
const ORDERS_COLLECTION = "orders";
const CATEGORIES_COLLECTION = "categories";
const STORAGE_BUCKET = "product_images";

export {
    client,
    account,
    databases,
    storage,
    ID,
    Query,
    DATABASE_ID,
    PRODUCTS_COLLECTION,
    ORDERS_COLLECTION,
    CATEGORIES_COLLECTION,
    STORAGE_BUCKET
};
