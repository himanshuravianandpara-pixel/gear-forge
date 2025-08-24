// Simple in-memory database for development
// This replaces Firebase until proper credentials are set up

class InMemoryDB {
  constructor() {
    this.items = new Map();
    this.counter = 1;
  }

  // Add a new item
  async add(data) {
    const id = this.counter.toString();
    this.counter++;
    
    const item = {
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      views: 0,
      favorites: 0
    };
    
    this.items.set(id, item);
    return { id, ...item };
  }

  // Get all items
  async getAll() {
    return Array.from(this.items.values()).sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  // Get item by ID
  async getById(id) {
    return this.items.get(id);
  }

  // Update item
  async update(id, data) {
    const item = this.items.get(id);
    if (!item) return null;
    
    const updatedItem = {
      ...item,
      ...data,
      updatedAt: new Date()
    };
    
    this.items.set(id, updatedItem);
    return updatedItem;
  }

  // Delete item
  async delete(id) {
    return this.items.delete(id);
  }

  // Get items by status
  async getByStatus(status) {
    return Array.from(this.items.values())
      .filter(item => item.status === status)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Search items
  async search(query) {
    const searchTerm = query.toLowerCase();
    return Array.from(this.items.values())
      .filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.rank.toLowerCase().includes(searchTerm)
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

// Create singleton instance
const db = new InMemoryDB();

// Export database methods that mimic Firestore
const firestore = {
  collection: (name) => ({
    add: async (data) => {
      const result = await db.add(data);
      return {
        id: result.id,
        get: async () => ({
          data: () => result,
          exists: true
        })
      };
    },
    get: async () => {
      const items = await db.getAll();
      return {
        forEach: (callback) => items.forEach(callback)
      };
    },
    doc: (id) => ({
      get: async () => {
        const item = await db.getById(id);
        return {
          data: () => item,
          exists: !!item
        };
      },
      update: async (data) => db.update(id, data),
      delete: async () => db.delete(id)
    })
  })
};

// Export admin object with Firestore
const admin = {
  firestore: {
    FieldValue: {
      serverTimestamp: () => new Date()
    }
  }
};

module.exports = { admin, db: firestore };
