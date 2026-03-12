import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
};

const mapStudents = (students) =>
  students.map((student) => ({
    Name: student.name,
    Email: student.email,
    Age: student.age,
    Status: student.status,
    Course: student.course,
    Enrolled: formatDate(student.enrollmentDate)
  }));

export const exportStudentsToExcel = (students, fileName = 'students-data.xlsx') => {
  const worksheet = XLSX.utils.json_to_sheet(mapStudents(students));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
  XLSX.writeFile(workbook, fileName);
};

export const exportStudentsToCsv = (students, fileName = 'students-data.csv') => {
  const worksheet = XLSX.utils.json_to_sheet(mapStudents(students));
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
};

export const exportStudentsToPdf = (students, fileName = 'students-data.pdf') => {
  const doc = new jsPDF();
  const tableData = mapStudents(students).map((row) => Object.values(row));
  doc.text('Students Report', 14, 16);
  doc.autoTable({
    startY: 24,
    head: [['Name', 'Email', 'Age', 'Status', 'Course', 'Enrolled']],
    body: tableData
  });
  doc.save(fileName);
};
