import api from './axios';

export interface Course {
  id: string;
  learningPathId: string;
  title: string;
  description: string;
  order: number;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: 'DIGITAL' | 'COGNITIVE' | 'SOCIOEMOTIONAL';
  isActive: boolean;
  courses: Course[];
}

export interface CourseProgress {
  id: string;
  userId: string;
  courseId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  updatedAt: string;
  course: Course & {
    learningPath: {
      id: string;
      title: string;
      description: string;
      category: string;
    }
  };
}

export async function getLearningPaths(): Promise<LearningPath[]> {
  const res = await api.get<{ success: boolean; data: LearningPath[] }>('/api/v1/learning/paths');
  return res.data.data;
}

export async function getUserProgress(): Promise<CourseProgress[]> {
  const res = await api.get<{ success: boolean; data: CourseProgress[] }>('/api/v1/learning/progress');
  return res.data.data;
}

export async function updateCourseProgress(
  courseId: string,
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
): Promise<CourseProgress> {
  const res = await api.post<{ success: boolean; data: CourseProgress }>(
    `/api/v1/learning/progress/${courseId}`,
    { status }
  );
  return res.data.data;
}
