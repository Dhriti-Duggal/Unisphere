export const BASE_URL = "http://localhost:5001/api";

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
  enrollCourse: (id: string) => `${BASE_URL}/courses/${id}/enroll`,
  assignments: `${BASE_URL}/assignments`,
  assignmentById: (id: string) => `${BASE_URL}/assignments/${id}`,
  submitAssignment: (id: string) => `${BASE_URL}/assignments/${id}/submit`,
  courseAssignments: (courseId: string) => `${BASE_URL}/assignments/course/${courseId}`,
  liveClasses: `${BASE_URL}/live-classes`,
  courseLiveClasses: (courseId: string) => `${BASE_URL}/live-classes/course/${courseId}`,
  groupLiveClasses: (groupId: string) => `${BASE_URL}/live-classes/group/${groupId}`
};