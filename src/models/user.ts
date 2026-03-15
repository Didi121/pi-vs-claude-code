import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'employee' | 'hr';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserCreateInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UserLoginInput = Pick<User, 'username' | 'password'>;

// In-memory store for testing (not for production)
const users: User[] = [];

export const userStore = {
  findAll(): User[] {
    return users.filter(user => user.isActive);
  },
  
  findById(id: string): User | undefined {
    return users.find(user => user.id === id && user.isActive);
  },
  
  findByUsername(username: string): User | undefined {
    return users.find(user => user.username === username && user.isActive);
  },
  
  findByEmail(email: string): User | undefined {
    return users.find(user => user.email === email && user.isActive);
  },
  
  async create(data: UserCreateInput): Promise<User> {
    const id = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const newUser: User = {
      ...data,
      id,
      password: hashedPassword,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    users.push(newUser);
    return newUser;
  },
  
  async update(id: string, data: Partial<UserCreateInput>): Promise<User | undefined> {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return undefined;
    
    const updatedData = { ...data };
    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }
    
    users[index] = {
      ...users[index],
      ...updatedData,
      updatedAt: new Date(),
    };
    
    return users[index];
  },
  
  delete(id: string): boolean {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return false;
    
    users[index].isActive = false;
    users[index].updatedAt = new Date();
    return true;
  },
  
  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  },
};

// Create default admin user if none exists
async function initializeDefaultUsers() {
  if (users.length === 0) {
    await userStore.create({
      username: 'admin',
      email: 'admin@company.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    await userStore.create({
      username: 'hr_manager',
      email: 'hr@company.com',
      password: 'hr123456',
      role: 'hr',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

// Initialize default users
initializeDefaultUsers().catch(console.error);