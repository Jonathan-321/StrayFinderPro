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
      
      // Add demo dogs after admin user is created
      this.addDemoDogs();
    });
  }
  
  private addDemoDogs() {
    const demoDogs: InsertDog[] = [
      {
        breed: "Labrador",
        color: "Golden",
        description: "Friendly male Labrador with a blue collar. Very energetic and loves to play. Responds to 'Max'.",
        imageUrls: ["https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&auto=format&fit=crop"],
        address: "Central Park, Main Entrance",
        city: "New York",
        latitude: "40.7812",
        longitude: "-73.9665",
        dateFound: "2025-03-28",
        timeFound: "14:30",
        finderName: "James Wilson",
        finderPhone: "555-123-4567",
        finderEmail: "james.wilson@example.com"
      },
      {
        breed: "German Shepherd",
        color: "Black and Tan",
        description: "Adult German Shepherd, appears well-trained. Has a red collar with no tag. Very calm and obedient.",
        imageUrls: ["https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=500&auto=format&fit=crop"],
        address: "Washington Square Park",
        city: "New York",
        latitude: "40.7308",
        longitude: "-73.9973",
        dateFound: "2025-03-29",
        timeFound: "09:15",
        finderName: "Sarah Miller",
        finderPhone: "555-987-6543",
        finderEmail: "sarah.m@example.com"
      },
      {
        breed: "Beagle",
        color: "Tricolor",
        description: "Small beagle puppy, about 6 months old. Has a green collar with a bell. Very playful and friendly.",
        imageUrls: ["https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=500&auto=format&fit=crop"],
        address: "Prospect Park",
        city: "Brooklyn",
        latitude: "40.6602",
        longitude: "-73.9690",
        dateFound: "2025-03-30",
        timeFound: "16:45",
        finderName: "David Johnson",
        finderPhone: "555-234-5678",
        finderEmail: "david.j@example.com"
      },
      {
        breed: "Husky",
        color: "Gray and White",
        description: "Beautiful adult husky with striking blue eyes. No collar but appears well-groomed and healthy. Very friendly with people.",
        imageUrls: ["https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=500&auto=format&fit=crop"],
        address: "Battery Park",
        city: "New York",
        latitude: "40.7033",
        longitude: "-74.0170",
        dateFound: "2025-03-31",
        timeFound: "11:20",
        finderName: "Emily Chen",
        finderPhone: "555-876-5432",
        finderEmail: "emily.chen@example.com"
      },
      {
        breed: "Poodle",
        color: "White",
        description: "Small toy poodle, recently groomed. Wearing a pink collar with rhinestones but no identification tag.",
        imageUrls: ["https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=500&auto=format&fit=crop"],
        address: "Bryant Park",
        city: "New York",
        latitude: "40.7536",
        longitude: "-73.9832",
        dateFound: "2025-04-01",
        timeFound: "13:10",
        finderName: "Michael Brown",
        finderPhone: "555-345-6789",
        finderEmail: "m.brown@example.com"
      }
    ];
    
    // Add demo dogs to storage
    demoDogs.forEach(dog => {
      this.createDog(dog);
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
        dog.city.toLowerCase().includes(filters.city!.toLowerCase())
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
    // Ensure breed is handled correctly - it can be null if undefined
    const breed = insertDog.breed === undefined ? null : insertDog.breed;
    
    // Explicitly build the dog object without using spread to avoid type issues
    const dog: Dog = { 
      id,
      breed,
      color: insertDog.color, 
      description: insertDog.description,
      imageUrls: insertDog.imageUrls,
      address: insertDog.address,
      city: insertDog.city,
      latitude: insertDog.latitude,
      longitude: insertDog.longitude,
      dateFound: insertDog.dateFound,
      timeFound: insertDog.timeFound,
      finderName: insertDog.finderName,
      finderPhone: insertDog.finderPhone,
      finderEmail: insertDog.finderEmail,
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
