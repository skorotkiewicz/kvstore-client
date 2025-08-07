/**
 * Configuration options for KVStore initialization
 */
export interface KVStoreOptions {
  /** Access token for API authentication */
  accessToken: string;
  /** Name of the store to operate on */
  storeName: string;
  /** Name of the database to operate on */
  dbName: string;
}

/**
 * Form data for user registration
 */
export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  [key: string]: any;
}

/**
 * Form data for user login
 */
export interface LoginFormData {
  username: string;
  password: string;
  [key: string]: any;
}

/**
 * Key-value entry structure
 */
export interface KVEntry {
  key: string;
  value: any;
}

/**
 * API response structure for requests
 */
export interface APIResponse<T = any> {
  success?: boolean;
  error?: string;
  data?: T;
  [key: string]: any;
}

/**
 * KVStore class for managing key-value operations with a remote API
 *
 * @example
 * ```typescript
 * const store = new KVStore('https://api.example.com/connect', {
 *   accessToken: 'your-token',
 *   storeName: 'mystore',
 *   dbName: 'mydb'
 * });
 *
 * await store.set('key1', 'value1');
 * const value = await store.get('key1');
 * ```
 */
export class KVStore {
  /** API endpoint URL */
  private readonly apiUrl: string;
  /** Access token for authentication */
  private readonly accessToken: string;
  /** Store name for operations */
  private readonly storeName: string;
  /** Database name for operations */
  private readonly dbName: string;

  /**
   * Creates a new KVStore instance
   *
   * @param apiUrl - The API endpoint URL
   * @param options - Configuration options including tokens and names
   */
  constructor(apiUrl: string, options: KVStoreOptions) {
    this.apiUrl = apiUrl;
    this.accessToken = options.accessToken;
    this.storeName = options.storeName;
    this.dbName = options.dbName;
  }

  /**
   * Makes an authenticated request to the API
   *
   * @private
   * @param action - The action to perform
   * @param params - Additional parameters for the request
   * @returns Promise resolving to the API response
   * @throws Error when the request fails
   */
  private async _request<T = any>(
    action: string,
    params: Record<string, any> = {},
  ): Promise<T> {
    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify({
        action,
        dbName: this.dbName,
        storeName: this.storeName,
        ...params,
      }),
    });

    const data: APIResponse<T> = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Request failed");
    }

    return data as T;
  }

  /**
   * Registers a new user
   *
   * @param formData - Registration form data containing user details
   * @returns Promise resolving to registration response
   *
   * @example
   * ```typescript
   * const result = await store.register({
   *   username: 'john_doe',
   *   email: 'john@example.com',
   *   password: 'secure123'
   * });
   * ```
   */
  async register(formData: RegisterFormData): Promise<APIResponse> {
    return await this._request("register", formData);
  }

  /**
   * Logs in an existing user
   *
   * @param formData - Login credentials
   * @returns Promise resolving to login response
   */
  async login(formData: LoginFormData): Promise<APIResponse> {
    return await this._request("login", formData);
  }

  /**
   * Generates a new authentication token
   *
   * @returns Promise resolving to token generation response
   *
   * @example
   * ```typescript
   * const result = await store.generateToken();
   * console.log(result.token);
   * ```
   */
  async generateToken(): Promise<APIResponse> {
    return await this._request("generate-token");
  }

  /**
   * Retrieves current user information
   *
   * @returns Promise resolving to user info response
   */
  async getUserInfo(): Promise<APIResponse> {
    return await this._request("get-user-info");
  }

  /**
   * Gets list of available databases
   *
   * @returns Promise resolving to databases list response
   */
  async getDatabases(): Promise<APIResponse> {
    return await this._request("get-databases");
  }

  /**
   * Creates a new database
   *
   * @param name - Name of the database to create
   * @returns Promise resolving to creation response
   */
  async createDatabase(name: string): Promise<APIResponse> {
    return await this._request("create-database", { name });
  }

  /**
   * Creates a new store within a database
   *
   * @param dbName - Database name
   * @param storeName - Store name to create
   * @returns Promise resolving to creation response
   */
  async createStore(dbName: string, storeName: string): Promise<APIResponse> {
    return await this._request("create-store", { dbName, storeName });
  }

  /**
   * Sets a key-value pair in the store
   *
   * @param key - The key to set
   * @param value - The value to associate with the key
   * @returns Promise resolving to set operation response
   *
   * @example
   * ```typescript
   * await store.set('user:123', { name: 'John', age: 30 });
   * ```
   */
  async set(key: string, value: any): Promise<APIResponse> {
    return await this._request("set", { key, value });
  }

  /**
   * Retrieves a value by its key
   *
   * @param key - The key to retrieve
   * @returns Promise resolving to the stored value
   *
   * @example
   * ```typescript
   * const user = await store.get('user:123');
   * console.log(user.name);
   * ```
   */
  async get(key: string): Promise<any> {
    const result = await this._request<{ value: any }>("get", { key });
    return result.value;
  }

  /**
   * Gets list of stores in a database
   *
   * @param dbName - Database name to query
   * @returns Promise resolving to array of store names
   */
  async getStores(dbName: string): Promise<string[]> {
    const result = await this._request<{ stores: string[] }>("get-stores", {
      dbName,
    });
    return result.stores;
  }

  /**
   * Sets multiple key-value pairs at once
   *
   * @param entries - Array of key-value entries to set
   * @returns Promise resolving to batch set response
   *
   * @example
   * ```typescript
   * await store.setMany([
   *   { key: 'user:1', value: { name: 'Alice' } },
   *   { key: 'user:2', value: { name: 'Bob' } }
   * ]);
   * ```
   */
  async setMany(entries: KVEntry[]): Promise<APIResponse> {
    return await this._request("setMany", { entries });
  }

  /**
   * Retrieves multiple values by their keys
   *
   * @param keys - Array of keys to retrieve
   * @returns Promise resolving to array of corresponding values
   *
   * @example
   * ```typescript
   * const users = await store.getMany(['user:1', 'user:2']);
   * ```
   */
  async getMany(keys: string[]): Promise<any[]> {
    const result = await this._request<{ values: any[] }>("getMany", { keys });
    return result.values;
  }

  /**
   * Updates an existing key with a new value
   *
   * @param key - The key to update
   * @param value - The new value
   * @returns Promise resolving to update response
   */
  async update(key: string, value: any): Promise<APIResponse> {
    return await this._request("update", { key, value });
  }

  /**
   * Deletes a key-value pair from the store
   *
   * @param key - The key to delete
   * @returns Promise resolving to deletion response
   */
  async delete(key: string): Promise<APIResponse> {
    return await this._request("delete", { key });
  }

  /**
   * Deletes multiple keys at once
   *
   * @param keys - Array of keys to delete
   * @returns Promise resolving to batch deletion response
   */
  async deleteMany(keys: string[]): Promise<APIResponse> {
    return await this._request("deleteMany", { keys });
  }

  /**
   * Retrieves all entries from a specific store
   *
   * @param dbName - Database name
   * @param storeName - Store name
   * @returns Promise resolving to array of all entries
   */
  async entries(dbName: string, storeName: string): Promise<KVEntry[]> {
    if (!dbName) dbName = this.dbName;
    if (!storeName) storeName = this.storeName;

    const result = await this._request<{ entries: KVEntry[] }>("entries", {
      dbName,
      storeName,
    });
    return result.entries;
  }

  /**
   * Retrieves all keys from the current store
   *
   * @returns Promise resolving to array of all keys
   */
  async keys(): Promise<string[]> {
    const result = await this._request<{ keys: string[] }>("keys");
    return result.keys;
  }

  /**
   * Retrieves all values from the current store
   *
   * @returns Promise resolving to array of all values
   */
  async values(): Promise<any[]> {
    const result = await this._request<{ values: any[] }>("values");
    return result.values;
  }

  /**
   * Clears all data from the current store
   *
   * @returns Promise resolving to clear operation response
   * @warning This operation cannot be undone
   */
  async clear(): Promise<APIResponse> {
    return await this._request("clear");
  }

  /**
   * Deletes a store from a database
   *
   * @param dbName - Database name containing the store
   * @param storeName - Name of store to delete
   * @returns Promise resolving to deletion response
   * @warning This operation cannot be undone
   */
  async deleteStore(dbName: string, storeName: string): Promise<APIResponse> {
    return await this._request("delete-store", { dbName, storeName });
  }

  /**
   * Deletes an entire database
   *
   * @param dbName - Name of database to delete
   * @returns Promise resolving to deletion response
   * @warning This operation cannot be undone and will delete all stores within the database
   */
  async deleteDatabase(dbName: string): Promise<APIResponse> {
    return await this._request("delete-database", { dbName });
  }
}

/**
 * Factory function to create a new KVStore instance
 *
 * @param apiUrl - The API endpoint URL
 * @param storeName - Name of the store (legacy parameter, use options.storeName instead)
 * @param options - Configuration options
 * @returns New KVStore instance
 *
 * @deprecated Consider using `new KVStore()` constructor directly
 *
 * @example
 * ```typescript
 * const kvStore = store('https://api.example.com/connect', {
 *   accessToken: 'token',
 *   storeName: 'mystore',
 *   dbName: 'mydb'
 * });
 * ```
 */
export function store(apiUrl: string, options: KVStoreOptions): KVStore {
  return new KVStore(apiUrl, options);
}
