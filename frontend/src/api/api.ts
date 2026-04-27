const DEFAULT_API_URL = "http://localhost:5001/api";
const DEFAULT_SOCKET_URL = "http://localhost:5001";

export const BASE_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || DEFAULT_SOCKET_URL;

export const API = {
  login:   `${BASE_URL}/auth/login`,
  signup:  `${BASE_URL}/auth/register`,
  me:      `${BASE_URL}/users/me`,
  profile: `${BASE_URL}/users/profile`,
  users:   `${BASE_URL}/users`,
  userStatus: (id: string) => `${BASE_URL}/users/${id}/status`,
  courses: `${BASE_URL}/courses`,
  teacherCourses: `${BASE_URL}/courses/teacher`,
  studentCourses: `${BASE_URL}/courses/student`,
  enrolledCourses: `${BASE_URL}/courses/enrolled`,
  courseDetails: (id: string) => `${BASE_URL}/courses/${id}`,
  courseMaterials: (id: string) => `${BASE_URL}/courses/${id}/materials`,
  addCourseMaterial: (id: string) => `${BASE_URL}/courses/${id}/materials`,
  enrollCourse: (id: string) => `${BASE_URL}/courses/${id}/enroll`,
  assignments: `${BASE_URL}/assignments`,
  assignmentById: (id: string) => `${BASE_URL}/assignments/${id}`,
  submitAssignment: (id: string) => `${BASE_URL}/assignments/${id}/submit`,
  gradeSubmission: (assignmentId: string, submissionId: string) => `${BASE_URL}/assignments/${assignmentId}/submissions/${submissionId}/grade`,
  courseAssignments: (courseId: string) => `${BASE_URL}/assignments/course/${courseId}`,
  chatThreads: `${BASE_URL}/chat/threads`,
  chatThreadMessages: (threadId: string) => `${BASE_URL}/chat/threads/${threadId}/messages`,
  markChatThreadRead: (threadId: string) => `${BASE_URL}/chat/threads/${threadId}/read`,
  createOrGetGroupThread: `${BASE_URL}/chat/threads/group`,
  createOrGetDirectThread: `${BASE_URL}/chat/threads/direct`,
  liveClasses: `${BASE_URL}/live-classes`,
  courseLiveClasses: (courseId: string) => `${BASE_URL}/live-classes/course/${courseId}`,
  groupLiveClasses: (groupId: string) => `${BASE_URL}/live-classes/group/${groupId}`
};