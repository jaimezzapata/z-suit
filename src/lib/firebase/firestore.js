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

export const createCourse = async (profesorId, courseData) => {
  try {
    const docRef = await addDoc(collection(db, 'courses'), {
      profesorId,
      name: courseData.name,
      description: courseData.description || '',
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
      where('profesorId', '==', profesorId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const courses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
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
