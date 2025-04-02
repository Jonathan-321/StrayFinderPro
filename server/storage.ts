import { dogs, users, type Dog, type InsertDog, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  // Dog operations
  getAllDogs(): Promise<Dog[]>;
  getDogsWithFilters(filters: { breed?: string; city?: string; query?: string }): Promise<Dog[]>;
  getDogById(id: number): Promise<Dog | undefined>;
  createDog(dog: InsertDog): Promise<Dog>;
  updateDogStatus(id: number, status: string): Promise<Dog | undefined>;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private dogs: Map<number, Dog>;
  private users: Map<number, User>;
  dogsCurrentId: number;
  usersCurrentId: number;

  constructor() {
    this.dogs = new Map();
    this.users = new Map();
    this.dogsCurrentId = 1;
    this.usersCurrentId = 1;
    
    // Create an admin user by default
    this.createUser({
      username: "admin",
      password: "password123",
    }).then(user => {
      // Update the user to be an admin
      const updatedUser = { ...user, isAdmin: true };
      this.users.set(user.id, updatedUser);
    });
  }

  // Dog Operations
  async getAllDogs(): Promise<Dog[]> {
    return Array.from(this.dogs.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getDogsWithFilters(filters: { breed?: string; city?: string; query?: string }): Promise<Dog[]> {
    let results = Array.from(this.dogs.values());

    if (filters.breed && filters.breed !== '') {
      results = results.filter(dog => dog.breed === filters.breed);
    }

    if (filters.city && filters.city !== '') {
      results = results.filter(dog => 
        dog.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.query && filters.query !== '') {
      const query = filters.query.toLowerCase();
      results = results.filter(dog => 
        dog.breed?.toLowerCase().includes(query) ||
        dog.color.toLowerCase().includes(query) ||
        dog.description.toLowerCase().includes(query) ||
        dog.address.toLowerCase().includes(query) ||
        dog.city.toLowerCase().includes(query)
      );
    }

    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getDogById(id: number): Promise<Dog | undefined> {
    return this.dogs.get(id);
  }

  async createDog(insertDog: InsertDog): Promise<Dog> {
    const id = this.dogsCurrentId++;
    const now = new Date();
    const dog: Dog = { 
      ...insertDog, 
      id, 
      status: "active", 
      createdAt: now 
    };
    
    this.dogs.set(id, dog);
    return dog;
  }

  async updateDogStatus(id: number, status: string): Promise<Dog | undefined> {
    const dog = this.dogs.get(id);
    
    if (!dog) {
      return undefined;
    }
    
    const updatedDog = { ...dog, status };
    this.dogs.set(id, updatedDog);
    return updatedDog;
  }

  // User Operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.usersCurrentId++;
    const user: User = { ...insertUser, id, isAdmin: false };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
