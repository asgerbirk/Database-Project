import { mongodbConnect } from '../mongoConnection.js';
import { ObjectId } from 'mongodb';
import { User, Center, Membership, Class, Product } from '../definitions/definitions.js';

async function seedUsers() {
  const db = await mongodbConnect();
  const usersCollection = db.collection<User>('users');
  const dummyUsers: User[] = [
    {
      _id: new ObjectId(),
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main St, Cityville',
      dateOfBirth: new Date('1990-05-15'),
      roles: 'member',
      joinDate: new Date('2024-01-01'),
      membershipId: new ObjectId(),
      emergencyContact: '1122334455',
    },
    {
        _id: new ObjectId(),
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '0987654321',
      address: '456 Elm St, Townsville',
      dateOfBirth: new Date('1985-10-30'),
      roles: 'employee',
      hireDate: new Date('2022-05-15'),
      jobTitleId: new ObjectId(),
      departmentId: new ObjectId(),
      salary: 3200.0,
      employmentStatus: 'Full-time',
    },
  ];
  await usersCollection.insertMany(dummyUsers);
  console.log('Inserted users');
}

async function seedCenters() {
  const db = await mongodbConnect();
  const centersCollection = db.collection<Center>('centers');
  const dummyCenters: Center[] = [
    {
        _id: new ObjectId(),
      centerName: 'Downtown Fitness Center',
      location: '101 Fitness Rd, Metropolis',
      phone: '2233445566',
      email: 'contact@downtownfitness.com',
      openingHours: '6 AM - 10 PM',
      managerName: 'Alice Brown',
      facilities: 'Pool, Sauna, Yoga Studio',
      departments: [
        {
          departmentName: 'Administration',
        },
        {
          departmentName: 'Fitness Training',
        },
      ],
    },
  ];
  await centersCollection.insertMany(dummyCenters);
  console.log('Inserted centers');
}

async function seedMemberships() {
  const db = await mongodbConnect();
  const membershipsCollection = db.collection<Membership>('memberships');
  const dummyMemberships: Membership[] = [
    {
        _id: new ObjectId(),
      membershipName: 'Basic',
      pricePerMonth: 30.0,
      accessLevel: 'Standard',
      duration: '1 month',
      maxClassBookings: 4,
      description: 'Basic membership with limited class access',
    },
    {
        _id: new ObjectId(),
      membershipName: 'Premium',
      pricePerMonth: 60.0,
      accessLevel: 'Full',
      duration: '1 month',
      maxClassBookings: 10,
      description: 'Full access to all classes and facilities',
    },
  ];
  await membershipsCollection.insertMany(dummyMemberships);
  console.log('Inserted memberships');
}

async function seedClasses() {
  const db = await mongodbConnect();
  const classesCollection = db.collection<Class>('classes');
  const dummyClasses: Class[] = [
    {
        _id: new ObjectId(),
      className: 'Yoga',
      description: 'Relaxing yoga session for all levels',
      classType: 'Fitness',
      duration: 60,
      maxParticipants: 20,
      instructorId: new ObjectId(),
      scheduleDate: new Date('2024-11-20'),
      startTime: '09:00:00',
      endTime: '10:00:00',
      bookings: [],
    },
  ];
  await classesCollection.insertMany(dummyClasses);
  console.log('Inserted classes');
}

async function seedProducts() {
  const db = await mongodbConnect();
  const productsCollection = db.collection<Product>('products');
  const dummyProducts: Product[] = [
    {
        _id: new ObjectId(),
      productName: 'Protein Powder',
      description: 'High-quality whey protein',
      price: 25.0,
      stockQuantity: 100,
      category: {
        categoryName: 'Supplements',
        description: 'Protein powders, vitamins, and more',
      },
    },
    {
        _id: new ObjectId(),
      productName: 'Yoga Mat',
      description: 'Non-slip yoga mat',
      price: 20.0,
      stockQuantity: 50,
      category: {
        categoryName: 'Equipment',
        description: 'Gym gear and accessories',
      },
    },
  ];
  await productsCollection.insertMany(dummyProducts);
  console.log('Inserted products');
}

async function seedAll() {
  try {
    await seedUsers();
    await seedCenters();
    await seedMemberships();
    await seedClasses();
    await seedProducts();
    console.log('Seeding completed');
  } catch (error) {
    console.error('Failed to seed data', error);
  } finally {
    console.log('Connection closed');
  }
}

export default seedAll();