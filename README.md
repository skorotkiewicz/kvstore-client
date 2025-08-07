# @skorotkiewicz/kvstore-client

A TypeScript/JavaScript client library for managing key-value storage operations through REST API. This library provides a comprehensive interface for interacting with remote key-value stores, including user management, database operations, and CRUD operations.

## Features

- 🔐 **User Authentication** - Register, login, and token management
- 🗄️ **Database Management** - Create, list, and delete databases
- 📦 **Store Operations** - Create, manage, and delete stores within databases
- 🔑 **Key-Value Operations** - Full CRUD operations with batch support
- 📝 **TypeScript Support** - Full type safety and IntelliSense
- 🌐 **REST API Integration** - Clean HTTP-based communication
- ⚡ **Zero Dependencies** - Lightweight with no external dependencies

## Installation

```bash
npm install @skorotkiewicz/kvstore-client
```

## Quick Start

```typescript
import { KVStore } from '@skorotkiewicz/kvstore-client';

// Initialize the client
const store = new KVStore('https://your-api-endpoint.com/connect', {
  accessToken: 'your-access-token',
  storeName: 'my-store',
  dbName: 'my-database'
});

// Set and get values
await store.set('user:123', { name: 'John Doe', email: 'john@example.com' });
const user = await store.get('user:123');
console.log(user); // { name: 'John Doe', email: 'john@example.com' }
```

## API Reference

### Constructor

```typescript
const store = new KVStore(apiUrl: string, options: KVStoreOptions)
```

**Parameters:**
- `apiUrl`: The REST API endpoint URL
- `options`: Configuration object
  - `accessToken`: Authentication token
  - `storeName`: Name of the store to operate on
  - `dbName`: Name of the database to operate on

### User Management

#### Register a new user
```typescript
await store.register({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'secure123'
});
```

#### Login
```typescript
await store.login({
  username: 'john_doe',
  password: 'secure123'
});
```

#### Generate authentication token
```typescript
const tokenResponse = await store.generateToken();
```

#### Get user information
```typescript
const userInfo = await store.getUserInfo();
```

### Database Operations

#### List databases
```typescript
const databases = await store.getDatabases();
```

#### Create a database
```typescript
await store.createDatabase('new-database');
```

#### Delete a database
```typescript
await store.deleteDatabase('database-name');
```

### Store Operations

#### Get stores in a database
```typescript
const stores = await store.getStores('database-name');
```

#### Create a store
```typescript
await store.createStore('database-name', 'store-name');
```

#### Delete a store
```typescript
await store.deleteStore('database-name', 'store-name');
```

### Key-Value Operations

#### Set a value
```typescript
await store.set('key', 'value');
await store.set('user:123', { name: 'John', age: 30 });
```

#### Get a value
```typescript
const value = await store.get('key');
```

#### Update a value
```typescript
await store.update('key', 'new-value');
```

#### Delete a key
```typescript
await store.delete('key');
```

### Batch Operations

#### Set multiple values
```typescript
await store.setMany([
  { key: 'user:1', value: { name: 'Alice' } },
  { key: 'user:2', value: { name: 'Bob' } }
]);
```

#### Get multiple values
```typescript
const values = await store.getMany(['user:1', 'user:2']);
```

#### Delete multiple keys
```typescript
await store.deleteMany(['key1', 'key2', 'key3']);
```

### Store Inspection

#### Get all keys
```typescript
const keys = await store.keys();
```

#### Get all values
```typescript
const values = await store.values();
```

#### Get all entries
```typescript
const entries = await store.entries('database-name', 'store-name');
```

#### Clear all data
```typescript
await store.clear(); // ⚠️ This cannot be undone
```

### Account Management

#### Change password
```typescript
await store.changePassword('currentPassword123', 'newSecurePassword456');
```

#### Delete account
```typescript
await store.deleteAccount('password123', 'DELETE'); // ⚠️ This cannot be undone
```

## Factory Function (Legacy)

For backward compatibility, you can also use the factory function:

```typescript
import { store } from '@skorotkiewicz/kvstore-client';

const kvStore = store('https://api.example.com/connect', {
  accessToken: 'token',
  storeName: 'mystore',
  dbName: 'mydb'
});
```

## TypeScript Interfaces

The library provides full TypeScript support with the following interfaces:

```typescript
interface KVStoreOptions {
  accessToken: string;
  storeName: string;
  dbName: string;
}

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  [key: string]: any;
}

interface LoginFormData {
  username: string;
  password: string;
  [key: string]: any;
}

interface KVEntry {
  key: string;
  value: any;
}

interface APIResponse<T = any> {
  success?: boolean;
  error?: string;
  data?: T;
  [key: string]: any;
}
```

## Error Handling

All methods return promises and will throw errors for failed requests:

```typescript
try {
  await store.set('key', 'value');
} catch (error) {
  console.error('Operation failed:', error.message);
}
```

## Requirements

- Node.js >= 14.0.0
- Modern browsers with fetch support

## Development

```bash
# Build the library
npm run build

# Run tests
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Sebastian Korotkiewicz**

- GitHub: [@skorotkiewicz](https://github.com/skorotkiewicz)
- Repository: [kvstore-client](https://github.com/skorotkiewicz/kvstore-client)

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/skorotkiewicz/kvstore-client/issues) on GitHub.