import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { KVStore, store } from "../src/index";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("KVStore", () => {
  let kvStore: KVStore;
  const apiUrl = "https://api.example.com/connect";
  const options = {
    accessToken: "test-token",
    storeName: "test-store",
    dbName: "test-db",
  };

  beforeEach(() => {
    kvStore = new KVStore(apiUrl, options);
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("constructor", () => {
    it("should create instance with correct properties", () => {
      expect(kvStore).toBeInstanceOf(KVStore);
      expect(kvStore["apiUrl"]).toBe(apiUrl);
      expect(kvStore["accessToken"]).toBe(options.accessToken);
      expect(kvStore["storeName"]).toBe(options.storeName);
      expect(kvStore["dbName"]).toBe(options.dbName);
    });
  });

  describe("_request method", () => {
    it("should make correct POST request with headers", async () => {
      const mockResponse = { success: true, data: "test" };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await kvStore["_request"]("test-action", { key: "value" });

      expect(mockFetch).toHaveBeenCalledWith(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${options.accessToken}`,
        },
        body: JSON.stringify({
          action: "test-action",
          dbName: options.dbName,
          storeName: options.storeName,
          key: "value",
        }),
      });
    });

    it("should throw error on failed request", async () => {
      const mockResponse = { error: "Request failed" };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(kvStore["_request"]("test-action")).rejects.toThrow(
        "Request failed",
      );
    });

    it("should throw generic error when no error message provided", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({}),
      });

      await expect(kvStore["_request"]("test-action")).rejects.toThrow(
        "Request failed",
      );
    });
  });

  describe("register", () => {
    it("should call _request with register action", async () => {
      const mockResponse = { success: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const formData = {
        username: "test",
        email: "test@example.com",
        password: "password",
      };
      const result = await kvStore.register(formData);

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        apiUrl,
        expect.objectContaining({
          body: JSON.stringify({
            action: "register",
            dbName: options.dbName,
            storeName: options.storeName,
            ...formData,
          }),
        }),
      );
    });
  });

  describe("login", () => {
    it("should call _request with login action", async () => {
      const mockResponse = { success: true, token: "new-token" };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const formData = { username: "test", password: "password" };
      const result = await kvStore.login(formData);

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        apiUrl,
        expect.objectContaining({
          body: JSON.stringify({
            action: "login",
            dbName: options.dbName,
            storeName: options.storeName,
            ...formData,
          }),
        }),
      );
    });
  });

  describe("generateToken", () => {
    it("should call _request with generate-token action", async () => {
      const mockResponse = { success: true, token: "new-token" };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await kvStore.generateToken();

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        apiUrl,
        expect.objectContaining({
          body: JSON.stringify({
            action: "generate-token",
            dbName: options.dbName,
            storeName: options.storeName,
          }),
        }),
      );
    });
  });

  describe("getUserInfo", () => {
    it("should call _request with get-user-info action", async () => {
      const mockResponse = { success: true, user: { id: 1, username: "test" } };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await kvStore.getUserInfo();

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        apiUrl,
        expect.objectContaining({
          body: JSON.stringify({
            action: "get-user-info",
            dbName: options.dbName,
            storeName: options.storeName,
          }),
        }),
      );
    });
  });

  describe("getDatabases", () => {
    it("should call _request with get-databases action", async () => {
      const mockResponse = { success: true, databases: ["db1", "db2"] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await kvStore.getDatabases();

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        apiUrl,
        expect.objectContaining({
          body: JSON.stringify({
            action: "get-databases",
            dbName: options.dbName,
            storeName: options.storeName,
          }),
        }),
      );
    });
  });

  describe("createDatabase", () => {
    it("should call _request with create-database action and name", async () => {
      const mockResponse = { success: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const dbName = "new-db";
      const result = await kvStore.createDatabase(dbName);

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        apiUrl,
        expect.objectContaining({
          body: JSON.stringify({
            action: "create-database",
            dbName: options.dbName,
            storeName: options.storeName,
            name: dbName,
          }),
        }),
      );
    });
  });

  describe("createStore", () => {
    it("should call _request with create-store action", async () => {
      const mockResponse = { success: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await kvStore.createStore("db1", "store1");

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        apiUrl,
        expect.objectContaining({
          body: JSON.stringify({
            action: "create-store",
            dbName: "db1",
            storeName: "store1",
          }),
        }),
      );
    });
  });

  describe("set", () => {
    it("should call _request with set action", async () => {
      const mockResponse = { success: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await kvStore.set("key1", "value1");

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        apiUrl,
        expect.objectContaining({
          body: JSON.stringify({
            action: "set",
            dbName: options.dbName,
            storeName: options.storeName,
            key: "key1",
            value: "value1",
          }),
        }),
      );
    });

    it("should handle complex values", async () => {
      const mockResponse = { success: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const complexValue = { name: "John", age: 30, active: true };
      await kvStore.set("user:123", complexValue);

      expect(mockFetch).toHaveBeenCalledWith(
        apiUrl,
        expect.objectContaining({
          body: JSON.stringify({
            action: "set",
            dbName: options.dbName,
            storeName: options.storeName,
            key: "user:123",
            value: complexValue,
          }),
        }),
      );
    });
  });

  describe("get", () => {
    it("should call _request with get action and return value", async () => {
      const mockValue = "test-value";
      const mockResponse = { success: true, value: mockValue };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await kvStore.get("key1");

      expect(result).toEqual(mockValue);
      expect(mockFetch).toHaveBeenCalledWith(
        apiUrl,
        expect.objectContaining({
          body: JSON.stringify({
            action: "get",
            dbName: options.dbName,
            storeName: options.storeName,
            key: "key1",
          }),
        }),
      );
    });
  });

  describe("getStores", () => {
    it("should call _request with get-stores action and return stores array", async () => {
      const mockStores = ["store1", "store2"];
      const mockResponse = { success: true, stores: mockStores };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await kvStore.getStores("test-db");

      expect(result).toEqual(mockStores);
      expect(mockFetch).toHaveBeenCalledWith(
        apiUrl,
        expect.objectContaining({
          body: JSON.stringify({
            action: "get-stores",
            dbName: "test-db",
            storeName: options.storeName,
          }),
        }),
      );
    });
  });

  describe("setMany", () => {
    it("should call _request with setMany action", async () => {
      const mockResponse = { success: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const entries = [
        { key: "key1", value: "value1" },
        { key: "key2", value: "value2" },
      ];
      const result = await kvStore.setMany(entries);

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        apiUrl,
        expect.objectContaining({
          body: JSON.stringify({
            action: "setMany",
            dbName: options.dbName,
            storeName: options.storeName,
            entries,
          }),
        }),
      );
    });
  });

  describe("getMany", () => {
    it("should call _request with getMany action and return values array", async () => {
      const mockValues = ["value1", "value2"];
      const mockResponse = { success: true, values: mockValues };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const keys = ["key1", "key2"];
      const result = await kvStore.getMany(keys);

      expect(result).toEqual(mockValues);
      expect(mockFetch).toHaveBeenCalledWith(
        apiUrl,
        expect.objectContaining({
          body: JSON.stringify({
            action: "getMany",
            dbName: options.dbName,
            storeName: options.storeName,
            keys,
          }),
        }),
      );
    });
  });

  describe("update", () => {
    it("should call _request with update action", async () => {
      const mockResponse = { success: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await kvStore.update("key1", "new-value");

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        apiUrl,
        expect.objectContaining({
          body: JSON.stringify({
            action: "update",
            dbName: options.dbName,
            storeName: options.storeName,
            key: "key1",
            value: "new-value",
          }),
        }),
      );
    });
  });

  describe("delete", () => {
    it("should call _request with delete action", async () => {
      const mockResponse = { success: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await kvStore.delete("key1");

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        apiUrl,
        expect.objectContaining({
          body: JSON.stringify({
            action: "delete",
            dbName: options.dbName,
            storeName: options.storeName,
            key: "key1",
          }),
        }),
      );
    });
  });

  describe("deleteMany", () => {
    it("should call _request with deleteMany action", async () => {
      const mockResponse = { success: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const keys = ["key1", "key2"];
      const result = await kvStore.deleteMany(keys);

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        apiUrl,
        expect.objectContaining({
          body: JSON.stringify({
            action: "deleteMany",
            dbName: options.dbName,
            storeName: options.storeName,
            keys,
          }),
        }),
      );
    });
  });

  describe("entries", () => {
    it("should call _request with entries action and return entries array", async () => {
      const mockEntries = [
        { key: "key1", value: "value1" },
        { key: "key2", value: "value2" },
      ];
      const mockResponse = { success: true, entries: mockEntries };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await kvStore.entries("db1", "store1");

      expect(result).toEqual(mockEntries);
      expect(mockFetch).toHaveBeenCalledWith(
        apiUrl,
        expect.objectContaining({
          body: JSON.stringify({
            action: "entries",
            dbName: "db1",
            storeName: "store1",
          }),
        }),
      );
    });
  });

  describe("keys", () => {
    it("should call _request with keys action and return keys array", async () => {
      const mockKeys = ["key1", "key2"];
      const mockResponse = { success: true, keys: mockKeys };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await kvStore.keys();

      expect(result).toEqual(mockKeys);
      expect(mockFetch).toHaveBeenCalledWith(
        apiUrl,
        expect.objectContaining({
          body: JSON.stringify({
            action: "keys",
            dbName: options.dbName,
            storeName: options.storeName,
          }),
        }),
      );
    });
  });

  describe("values", () => {
    it("should call _request with values action and return values array", async () => {
      const mockValues = ["value1", "value2"];
      const mockResponse = { success: true, values: mockValues };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await kvStore.values();

      expect(result).toEqual(mockValues);
      expect(mockFetch).toHaveBeenCalledWith(
        apiUrl,
        expect.objectContaining({
          body: JSON.stringify({
            action: "values",
            dbName: options.dbName,
            storeName: options.storeName,
          }),
        }),
      );
    });
  });

  describe("clear", () => {
    it("should call _request with clear action", async () => {
      const mockResponse = { success: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await kvStore.clear();

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        apiUrl,
        expect.objectContaining({
          body: JSON.stringify({
            action: "clear",
            dbName: options.dbName,
            storeName: options.storeName,
          }),
        }),
      );
    });
  });

  describe("deleteStore", () => {
    it("should call _request with delete-store action", async () => {
      const mockResponse = { success: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await kvStore.deleteStore("db1", "store1");

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        apiUrl,
        expect.objectContaining({
          body: JSON.stringify({
            action: "delete-store",
            dbName: "db1",
            storeName: "store1",
          }),
        }),
      );
    });
  });

  describe("deleteDatabase", () => {
    it("should call _request with delete-database action", async () => {
      const mockResponse = { success: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await kvStore.deleteDatabase("db1");

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        apiUrl,
        expect.objectContaining({
          body: JSON.stringify({
            action: "delete-database",
            dbName: "db1",
            storeName: options.storeName,
          }),
        }),
      );
    });
  });
});

describe("store factory function", () => {
  it("should create KVStore instance", () => {
    const apiUrl = "https://api.example.com/connect";
    const options = {
      accessToken: "test-token",
      storeName: "test-store",
      dbName: "test-db",
    };

    const instance = store(apiUrl, options);

    expect(instance).toBeInstanceOf(KVStore);
    expect(instance["apiUrl"]).toBe(apiUrl);
    expect(instance["accessToken"]).toBe(options.accessToken);
    expect(instance["storeName"]).toBe(options.storeName);
    expect(instance["dbName"]).toBe(options.dbName);
  });
});
