// Firestore Schema & Helper Functions
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';

// ===== COURSES =====

// Generar código de acceso aleatorio
const generateAccessCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const createCourse = async (profesorId, courseData) => {
  try {
    // Determinar número de sesiones según tipo
    const numSessions = courseData.tipo === 'empresarial' ? 7 : 18;
    
    // Inicializar sesiones vacías
    const sessions = Array.from({ length: numSessions }, (_, i) => ({
      number: i + 1,
      title: '',
      description: '',
      documentationIds: [], // IDs de docs asociados a esta sesión
    }));

    const docRef = await addDoc(collection(db, 'courses'), {
      profesorId,
      name: courseData.name,
      nivel: courseData.nivel, // "1", "2", o "3"
      description: courseData.description || '',
      tipo: courseData.tipo || 'regular', // 'regular' o 'empresarial'
      sessions, // Array de sesiones (18 o 7 según tipo)
      accessCode: generateAccessCode(), // Código único para acceso
      isPublic: courseData.isPublic !== undefined ? courseData.isPublic : true, // Por defecto público
      slug: courseData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating course:', error);
    return { success: false, error: error.message };
  }
};

export const getCoursesByProfesor = async (profesorId) => {
  try {
    const q = query(
      collection(db, 'courses'),
      where('profesorId', '==', profesorId)
    );
    const snapshot = await getDocs(q);
    const courses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // Ordenar en el cliente por ahora
    courses.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
    return { success: true, data: courses };
  } catch (error) {
    console.error('Error fetching courses:', error);
    return { success: false, error: error.message };
  }
};

export const updateCourse = async (courseId, updates) => {
  try {
    const courseRef = doc(db, 'courses', courseId);
    await updateDoc(courseRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating course:', error);
    return { success: false, error: error.message };
  }
};

export const deleteCourse = async (courseId) => {
  try {
    await deleteDoc(doc(db, 'courses', courseId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting course:', error);
    return { success: false, error: error.message };
  }
};

// Buscar curso por código de acceso
export const getCourseByAccessCode = async (accessCode) => {
  try {
    const q = query(
      collection(db, 'courses'),
      where('accessCode', '==', accessCode.toUpperCase())
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return { success: false, error: 'Código no válido' };
    }
    const courseData = snapshot.docs[0].data();
    return { 
      success: true, 
      data: { 
        id: snapshot.docs[0].id, 
        ...courseData 
      } 
    };
  } catch (error) {
    console.error('Error fetching course by code:', error);
    return { success: false, error: error.message };
  }
};

// Buscar curso por slug (para URLs amigables)
export const getCourseBySlug = async (slug) => {
  try {
    const q = query(
      collection(db, 'courses'),
      where('slug', '==', slug),
      where('isPublic', '==', true)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return { success: false, error: 'Curso no encontrado o no público' };
    }
    const courseData = snapshot.docs[0].data();
    return { 
      success: true, 
      data: { 
        id: snapshot.docs[0].id, 
        ...courseData 
      } 
    };
  } catch (error) {
    console.error('Error fetching course by slug:', error);
    return { success: false, error: error.message };
  }
};

// ===== DOCUMENTATION =====

export const createDocumentation = async (courseId, docData) => {
  try {
    const docRef = await addDoc(collection(db, 'documentation'), {
      courseId,
      title: docData.title,
      contentMd: docData.contentMd,
      metadata: docData.metadata || {},
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating documentation:', error);
    return { success: false, error: error.message };
  }
};

export const getDocumentationByCourse = async (courseId) => {
  try {
    const q = query(
      collection(db, 'documentation'),
      where('courseId', '==', courseId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { success: true, data: docs };
  } catch (error) {
    console.error('Error fetching documentation:', error);
    return { success: false, error: error.message };
  }
};

// ===== GENERIC HELPERS =====

export const getDocumentById = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: 'Document not found' };
    }
  } catch (error) {
    console.error('Error fetching document:', error);
    return { success: false, error: error.message };
  }
};

// ===== EXAMS =====

// Generar código de acceso para examen (diferente formato que cursos)
const generateExamAccessCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sin I, O, 0, 1
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const createExam = async (profesorId, examData) => {
  try {
    const docRef = await addDoc(collection(db, 'exams'), {
      profesorId,
      courseId: examData.courseId,
      title: examData.title,
      accessCode: generateExamAccessCode(),
      questionCount: examData.questionCount,
      timeLimit: examData.timeLimit, // en minutos
      tolerance: examData.tolerance, // número de infracciones permitidas
      generateWithAI: examData.generateWithAI,
      status: 'draft', // draft, active, closed
      questions: [], // Se llenará después con la generación IA
      attempts: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating exam:', error);
    return { success: false, error: error.message };
  }
};

export const getExamsByCourse = async (courseId) => {
  try {
    const q = query(
      collection(db, 'exams'),
      where('courseId', '==', courseId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const exams = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { success: true, data: exams };
  } catch (error) {
    console.error('Error fetching exams:', error);
    return { success: false, error: error.message };
  }
};

export const getExamsByProfesor = async (profesorId) => {
  try {
    const q = query(
      collection(db, 'exams'),
      where('profesorId', '==', profesorId)
    );
    const snapshot = await getDocs(q);
    const exams = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    // Ordenar manualmente en JavaScript
    exams.sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || 0;
      const timeB = b.createdAt?.toMillis?.() || 0;
      return timeB - timeA;
    });
    return { success: true, data: exams };
  } catch (error) {
    console.error('Error fetching exams:', error);
    return { success: false, error: error.message };
  }
};

export const getExamByAccessCode = async (accessCode) => {
  try {
    const q = query(
      collection(db, 'exams'),
      where('accessCode', '==', accessCode.toUpperCase())
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return { success: false, error: 'Código de acceso no válido' };
    }

    const examDoc = snapshot.docs[0];
    return {
      success: true,
      data: { id: examDoc.id, ...examDoc.data() }
    };
  } catch (error) {
    console.error('Error fetching exam:', error);
    return { success: false, error: error.message };
  }
};

export const updateExam = async (examId, data) => {
  try {
    const docRef = doc(db, 'exams', examId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating exam:', error);
    return { success: false, error: error.message };
  }
};

export const deleteExam = async (examId) => {
  try {
    await deleteDoc(doc(db, 'exams', examId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting exam:', error);
    return { success: false, error: error.message };
  }
};

// Crear intento de examen (cuando un estudiante empieza)
export const createExamAttempt = async (examId, studentEmail, studentName = '') => {
  try {
    const docRef = await addDoc(collection(db, 'examAttempts'), {
      examId,
      studentEmail,
      studentName,
      answers: {},
      proctoringLogs: [],
      startedAt: Timestamp.now(),
      submittedAt: null,
      score: null,
      penaltyScore: 0,
      status: 'in-progress',
      visibilityWarnings: 0,
      submissionReason: null,
      autoSubmitted: false,
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating exam attempt:', error);
    return { success: false, error: error.message };
  }
};

export const getExamAttempts = async (examId) => {
  try {
    const q = query(
      collection(db, 'examAttempts'),
      where('examId', '==', examId)
    );
    const snapshot = await getDocs(q);
    const attempts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    // Ordenar manualmente
    attempts.sort((a, b) => {
      const timeA = a.startedAt?.toMillis?.() || 0;
      const timeB = b.startedAt?.toMillis?.() || 0;
      return timeB - timeA;
    });
    return { success: true, data: attempts };
  } catch (error) {
    console.error('Error fetching exam attempts:', error);
    return { success: false, error: error.message };
  }
};

export const getExamAttemptsByStudent = async (examId, studentEmail) => {
  try {
    const q = query(
      collection(db, 'examAttempts'),
      where('examId', '==', examId),
      where('studentEmail', '==', studentEmail)
    );
    const snapshot = await getDocs(q);
    const attempts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { success: true, data: attempts };
  } catch (error) {
    console.error('Error fetching student exam attempts:', error);
    return { success: false, error: error.message };
  }
};

export const updateExamAttempt = async (attemptId, data) => {
  try {
    const docRef = doc(db, 'examAttempts', attemptId);
    await updateDoc(docRef, data);
    return { success: true };
  } catch (error) {
    console.error('Error updating exam attempt:', error);
    return { success: false, error: error.message };
  }
};

