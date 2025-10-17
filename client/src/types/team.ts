export interface TeamMember {
  id: string;
  name: string;
  surname: string;
  fullName: string;
  imageUrl: string;
  bio: {
    az: string;
    en: string;
  };
  order: number;
  createdAt: string;
  isActive:boolean;
}

export interface TeamMemberFormInputs {
  name: string;
  surname: string;
  fullName?: string;
  image: File[];
  bio: {
    az: string;
    en: string;
  };
}
export interface CourseTeacherAssignment {
  teacherId: string;
  courseId: string;
  position?: string;
  teacher: TeamMember;
}
export interface CourseTeacherRole {
  id: string;
  title: string;
  description: {
    az: string;
    en: string;
  };
  courses: {
    course: {
      id: string;
      title: {
        az: string;
        en: string;
      };
    };
    teacher: {
      id: string;
      fullName: string;
      imageUrl: string;
      bio: {
        az: string;
        en: string;
      };
    };
    position?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseTeacherAsMember {
  id: string;
  position: string | null;
  courseId: string;
  teacherId: string;
  courseTeacherId: string;
  createdAt: string;
  teacher: TeamMember;
  courseTeacher: CourseTeacherRole;
  imageUrl: string;
  fullName: string;
  bio: {
    az: string;
    en: string;
  };
}

export interface CourseTeacherResponse {
  items: CourseTeacherRole[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface CourseTeacherFormInputs {
  title: string;
  description: {
    az: string;
    en: string;
  };
}
