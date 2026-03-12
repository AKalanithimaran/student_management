const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Student = require('../models/Student');

dotenv.config();

const seedStudents = [
  { name: 'Aarav Mehta', email: 'aarav.mehta@example.com', age: 20, status: 'Active', course: 'Computer Science', enrollmentDate: '2025-10-12' },
  { name: 'Diya Sharma', email: 'diya.sharma@example.com', age: 22, status: 'Pending', course: 'Design', enrollmentDate: '2025-11-05' },
  { name: 'Ishaan Verma', email: 'ishaan.verma@example.com', age: 21, status: 'Active', course: 'Engineering', enrollmentDate: '2025-09-18' },
  { name: 'Meera Kapoor', email: 'meera.kapoor@example.com', age: 23, status: 'Blocked', course: 'Business', enrollmentDate: '2025-08-02' },
  { name: 'Arjun Nair', email: 'arjun.nair@example.com', age: 19, status: 'Active', course: 'Computer Science', enrollmentDate: '2025-12-21' },
  { name: 'Anaya Rao', email: 'anaya.rao@example.com', age: 24, status: 'Pending', course: 'Design', enrollmentDate: '2025-07-14' },
  { name: 'Kabir Singh', email: 'kabir.singh@example.com', age: 26, status: 'Active', course: 'Engineering', enrollmentDate: '2025-06-09' },
  { name: 'Saanvi Iyer', email: 'saanvi.iyer@example.com', age: 20, status: 'Active', course: 'Business', enrollmentDate: '2025-05-19' },
  { name: 'Rohan Desai', email: 'rohan.desai@example.com', age: 28, status: 'Blocked', course: 'Computer Science', enrollmentDate: '2025-04-03' },
  { name: 'Nisha Kulkarni', email: 'nisha.kulkarni@example.com', age: 22, status: 'Active', course: 'Design', enrollmentDate: '2025-03-27' },
  { name: 'Vivaan Joshi', email: 'vivaan.joshi@example.com', age: 25, status: 'Pending', course: 'Engineering', enrollmentDate: '2025-02-15' },
  { name: 'Tara Menon', email: 'tara.menon@example.com', age: 21, status: 'Active', course: 'Business', enrollmentDate: '2025-01-30' },
  { name: 'Aditya Bansal', email: 'aditya.bansal@example.com', age: 27, status: 'Active', course: 'Computer Science', enrollmentDate: '2024-12-11' },
  { name: 'Kavya Pillai', email: 'kavya.pillai@example.com', age: 23, status: 'Pending', course: 'Design', enrollmentDate: '2024-11-22' },
  { name: 'Neel Gupta', email: 'neel.gupta@example.com', age: 29, status: 'Blocked', course: 'Engineering', enrollmentDate: '2024-10-07' },
  { name: 'Riya Chandra', email: 'riya.chandra@example.com', age: 20, status: 'Active', course: 'Business', enrollmentDate: '2024-09-16' },
  { name: 'Karan Malhotra', email: 'karan.malhotra@example.com', age: 24, status: 'Active', course: 'Computer Science', enrollmentDate: '2024-08-28' },
  { name: 'Pooja Nambiar', email: 'pooja.nambiar@example.com', age: 22, status: 'Pending', course: 'Design', enrollmentDate: '2024-07-12' },
  { name: 'Harsh Patel', email: 'harsh.patel@example.com', age: 26, status: 'Active', course: 'Engineering', enrollmentDate: '2024-06-05' },
  { name: 'Zara Khan', email: 'zara.khan@example.com', age: 19, status: 'Active', course: 'Business', enrollmentDate: '2024-05-24' },
  { name: 'Mihir Sethi', email: 'mihir.sethi@example.com', age: 27, status: 'Blocked', course: 'Computer Science', enrollmentDate: '2024-04-17' },
  { name: 'Ira Fernandes', email: 'ira.fernandes@example.com', age: 21, status: 'Active', course: 'Design', enrollmentDate: '2024-03-01' },
  { name: 'Siddharth Roy', email: 'siddharth.roy@example.com', age: 28, status: 'Pending', course: 'Engineering', enrollmentDate: '2024-02-08' },
  { name: 'Lavanya Rao', email: 'lavanya.rao@example.com', age: 23, status: 'Active', course: 'Business', enrollmentDate: '2024-01-19' },
  { name: 'Yash Agarwal', email: 'yash.agarwal@example.com', age: 25, status: 'Active', course: 'Computer Science', enrollmentDate: '2023-12-02' }
];

const upsertStudents = async () => {
  await connectDB();

  const operations = seedStudents.map((student) => ({
    updateOne: {
      filter: { email: student.email },
      update: { $set: student },
      upsert: true
    }
  }));

  const result = await Student.bulkWrite(operations, { ordered: false });
  console.log(`Seeded ${seedStudents.length} students.`);
  console.log('Upserts:', result.upsertedCount || 0, 'Modified:', result.modifiedCount || 0);
  process.exit(0);
};

upsertStudents().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
