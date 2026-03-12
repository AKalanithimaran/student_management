const Student = require('../models/Student');
const { getIO } = require('../socket/socket');

const parseAgeFilter = (ageFilter) => {
  if (!ageFilter || ageFilter === 'all') return null;
  switch (ageFilter) {
    case '0-18':
      return { $gte: 0, $lte: 18 };
    case '19-25':
      return { $gte: 19, $lte: 25 };
    case '26-40':
      return { $gte: 26, $lte: 40 };
    case '40+':
      return { $gte: 40 };
    default:
      return null;
  }
};

const validatePayload = ({ name, email, age, status, course, enrollmentDate }) => {
  const errors = {};
  if (!name || name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = 'Valid email is required';
  }
  const ageNum = Number(age);
  if (!Number.isFinite(ageNum) || ageNum < 1 || ageNum > 120) {
    errors.age = 'Age must be a number between 1 and 120';
  }
  const allowedStatus = ['Active', 'Pending', 'Blocked'];
  if (!status || !allowedStatus.includes(status)) {
    errors.status = 'Status must be Active, Pending, or Blocked';
  }
  if (!course || course.trim().length < 2) {
    errors.course = 'Course must be at least 2 characters';
  }
  const dateValue = new Date(enrollmentDate);
  if (!enrollmentDate || Number.isNaN(dateValue.getTime())) {
    errors.enrollmentDate = 'Valid enrollment date is required';
  }
  return { errors, isValid: Object.keys(errors).length === 0 };
};

const getStudents = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limitRaw = parseInt(req.query.limit || '10', 10);
    const limit = Number.isFinite(limitRaw) ? limitRaw : 10;
    const search = (req.query.search || '').trim();
    const ageFilter = (req.query.ageFilter || 'all').trim();
    const status = (req.query.status || '').trim();
    const course = (req.query.course || '').trim();
    const enrollmentDate = (req.query.enrollmentDate || '').trim();

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const ageRange = parseAgeFilter(ageFilter);
    if (ageRange) {
      query.age = ageRange;
    }
    if (status) {
      query.status = status;
    }
    if (course) {
      query.course = course;
    }
    if (enrollmentDate) {
      const start = new Date(`${enrollmentDate}T00:00:00.000Z`);
      const end = new Date(`${enrollmentDate}T23:59:59.999Z`);
      if (!Number.isNaN(start.getTime())) {
        query.enrollmentDate = { $gte: start, $lte: end };
      }
    }

    const total = await Student.countDocuments(query);

    let studentsQuery = Student.find(query).sort({ createdAt: -1 });
    if (limit > 0) {
      studentsQuery = studentsQuery.skip((page - 1) * limit).limit(limit);
    }

    const students = await studentsQuery;
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;

    res.json({
      data: students,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch students' });
  }
};

const createStudent = async (req, res) => {
  try {
    const { name, email, age, status, course, enrollmentDate } = req.body;
    const { errors, isValid } = validatePayload({ name, email, age, status, course, enrollmentDate });
    if (!isValid) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const existing = await Student.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: 'Email already exists', errors: { email: 'Email already exists' } });
    }

    const student = await Student.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      age: Number(age),
      status,
      course: course.trim(),
      enrollmentDate: new Date(enrollmentDate)
    });

    getIO().emit('studentAdded', student);

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create student' });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age, status, course, enrollmentDate } = req.body;
    const { errors, isValid } = validatePayload({ name, email, age, status, course, enrollmentDate });
    if (!isValid) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const existing = await Student.findOne({ email: email.toLowerCase().trim(), _id: { $ne: id } });
    if (existing) {
      return res.status(409).json({ message: 'Email already exists', errors: { email: 'Email already exists' } });
    }

    const updated = await Student.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        age: Number(age),
        status,
        course: course.trim(),
        enrollmentDate: new Date(enrollmentDate)
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Student not found' });
    }

    getIO().emit('studentUpdated', updated);

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update student' });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Student.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Student not found' });
    }

    getIO().emit('studentDeleted', { id });

    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete student' });
  }
};

module.exports = {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent
};
