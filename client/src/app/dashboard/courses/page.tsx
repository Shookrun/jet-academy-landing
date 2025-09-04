"use client";
import { useState, useCallback, useEffect } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
  Chip,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdPeople,
  MdSettings,
  MdShield,
  MdViewModule,
} from "react-icons/md";
import { toast } from "sonner";
import api from "@/utils/api/axios";
import { Course } from "@/types/course";
import Link from "next/link";
import ModulesModal from "@/components/views/dashboard/modules/modules-modal";
import EligibilityModal from "@/components/views/dashboard/eligibility/eligibility-modal";
import TeachersModal from "@/components/views/dashboard/courses/teachers-modal";

interface CoursesResponse {
  items: Course[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

interface TeacherRole {
  id: string;
  title: string;
}

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [teacherRoles, setTeacherRoles] = useState<TeacherRole[]>([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  const {
    isOpen: isTeachersOpen,
    onOpen: onTeachersOpen,
    onClose: onTeachersClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isEligibilityOpen,
    onOpen: onEligibilityOpen,
    onClose: onEligibilityClose,
  } = useDisclosure();

  const {
    isOpen: isModulesOpen,
    onOpen: onModulesOpen,
    onClose: onModulesClose,
  } = useDisclosure();

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedTeacherRole, setSelectedTeacherRole] =
    useState<TeacherRole | null>(null);
  const [selectedCourseForEligibility, setSelectedCourseForEligibility] =
    useState<Course | null>(null);
  const [selectedCourseForModules, setSelectedCourseForModules] =
    useState<Course | null>(null);

  const fetchTeacherRoles = async () => {
    try {
      const { data } = await api.get("/course-teacher");
      setTeacherRoles(data.items);
    } catch (error) {
      console.error("Müəllim rolları yüklənmədi:", error);
    }
  };

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get<CoursesResponse>(
        `/courses?page=${page}&limit=${rowsPerPage}&includeUnpublished=true`
      );
      setCourses(data.items);
      setTotalCourses(data.meta.total);
    } catch (error) {
      console.error("Kurslar yüklənmədi:", error);
      toast.error("Kurslar yüklənə bilmədi");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchCourses();
    fetchTeacherRoles();
  }, [fetchCourses]);

  const handleDelete = (course: Course) => {
    setSelectedCourse(course);
    onDeleteOpen();
  };

  const handleTeachers = (course: Course, role: TeacherRole) => {
    setSelectedCourse(course);
    setSelectedTeacherRole(role);
    onTeachersOpen();
  };

  const confirmDelete = async () => {
    if (!selectedCourse) return;

    try {
      await api.delete(`/courses/${selectedCourse.id}`);
      toast.success("Kurs uğurla silindi");
      fetchCourses();
    } catch (error) {
      console.error("Kurs silinmədi:", error);
      toast.error("Kursu silmək mümkün olmadı");
    } finally {
      onDeleteClose();
      setSelectedCourse(null);
    }
  };

  const handleEligibilityModal = (course: Course) => {
    setSelectedCourseForEligibility(course);
    onEligibilityOpen();
  };

  const handleModulesModal = (course: Course) => {
    setSelectedCourseForModules(course);
    onModulesOpen();
  };

  const columns = [
    { name: "BAŞLIQ", uid: "title" },
    { name: "TƏSVİR", uid: "description" },
    { name: "MÜDDƏT", uid: "duration" },
    { name: "STATUS", uid: "published" },
    { name: "MODULLAR VƏ TƏLƏBLƏR", uid: "eligibility" },
    { name: "MÜƏLLİMLƏR", uid: "teachers" },
    { name: "YARADILMA TARİXİ", uid: "createdAt" },
    { name: "ƏMƏLİYYATLAR", uid: "actions" },
  ];

  const renderCell = (course: Course, columnKey: string) => {
    switch (columnKey) {
      case "title":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{course.title.az}</p>
            <p className="text-tiny text-default-400">{course.title.ru}</p>
          </div>
        );

      case "description":
        return (
          <div className="flex flex-col">
            <p className="text-small">
              {course.description.az.length > 100
                ? `${course.description.az.substring(0, 100)}...`
                : course.description.az}
            </p>
            <Link href={`/course/${course.slug.az}`}>
              <p className="text-primary text-tiny">Ətraflı</p>
            </Link>
          </div>
        );

      case "duration":
        return <p className="text-small">{course.duration} ay</p>;

      case "published":
        return (
          <Chip
            className="capitalize"
            color={course.published ? "success" : "warning"}
            size="sm"
            variant="flat"
          >
            {course.published ? "Aktiv" : "Deaktiv"}
          </Chip>
        );

      case "teachers":
        return (
          <div className="flex flex-wrap gap-2">
            {teacherRoles.map((role) => (
              <Button
                key={role.id}
                size="sm"
                variant="flat"
                onClick={() => handleTeachers(course, role)}
                startContent={<MdPeople size={16} />}
              >
                {role.title}
              </Button>
            ))}
          </div>
        );

      case "eligibility":
       return (
    <div className="flex flex-wrap gap-1 items-center">
      <div className="flex flex-col">
        <p className="text-small">Modullar: {course.modules?.length || 0}</p>
        <p className="text-small">
          Tələblər: {course.eligibility?.length || 0}
        </p>
      </div>
      <div className="flex gap-1">
        <Tooltip content="Modulları idarə et">
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onClick={() => handleModulesModal(course)}
          >
            <MdViewModule className="text-default-400" size={20} />
          </Button>
        </Tooltip>
        <Tooltip content="Tələbləri idarə et">
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onClick={() => handleEligibilityModal(course)}
          >
            <MdSettings className="text-default-400" size={20} />
          </Button>
        </Tooltip>
      </div>
    </div>
  );

      case "createdAt":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">
              {new Date(course.createdAt).toLocaleDateString("az-AZ")}
            </p>
            <p className="text-bold text-tiny text-default-400">
              {new Date(course.createdAt).toLocaleTimeString("az-AZ")}
            </p>
          </div>
        );

      case "actions":
        return (
          <div className="flex items-center gap-2">
            <Tooltip content="Düzəliş et">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onClick={() =>
                  router.push(`/dashboard/courses/edit/${course.id}`)
                }
              >
                <MdEdit className="text-default-400" size={20} />
              </Button>
            </Tooltip>
            <Tooltip content="Sil" color="danger">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onClick={() => handleDelete(course)}
              >
                <MdDelete className="text-danger" size={20} />
              </Button>
            </Tooltip>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Kurslar</h1>
            <p className="text-gray-500">Kursları idarə edin</p>
          </div>
          <div className="flex gap-2 items-center">
            <Link href="/dashboard/eligibilities">
              <Button
                color="primary"
                className="bg-jsyellow text-white"
                startContent={<MdShield size={24} />}
              >
                Tələblər
              </Button>
            </Link>
            <Link href="/dashboard/modules">
              <Button
                color="primary"
                className="bg-jsyellow text-white"
                startContent={<MdViewModule size={24} />}
              >
                Modullar
              </Button>
            </Link>
            <Button
              color="primary"
              className="bg-jsyellow text-white"
              startContent={<MdAdd size={24} />}
              onClick={() => router.push("/dashboard/courses/create")}
            >
              Yeni Kurs
            </Button>
          </div>
        </div>

        <Table
          aria-label="Kurslar cədvəli"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="warning"
                page={page}
                total={Math.ceil(totalCourses / rowsPerPage)}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={courses}
            loadingContent={<div>Yüklənir...</div>}
            loadingState={loading ? "loading" : "idle"}
          >
            {(course) => (
              <TableRow key={course.id}>
                {columns.map((column) => (
                  <TableCell key={column.uid}>
                    {renderCell(course, column.uid)}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Kursu Sil</ModalHeader>
                <ModalBody>
                  <p>
                    &quot;{selectedCourse?.title.az}&quot; kursunu silmək
                    istədiyinizə əminsiniz?
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
                    Ləğv et
                  </Button>
                  <Button color="danger" onPress={confirmDelete}>
                    Sil
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <ModulesModal
          isOpen={isModulesOpen}
          onClose={onModulesClose}
          courseId={selectedCourseForModules?.id}
          course={selectedCourseForModules!}
          onUpdate={fetchCourses}
        />

        <TeachersModal
          isOpen={isTeachersOpen}
          onClose={onTeachersClose}
          teacherRoleId={selectedTeacherRole?.id}
          courseId={selectedCourse?.id}
          course={selectedCourse!}
          onUpdate={fetchCourses}
        />

        <EligibilityModal
          isOpen={isEligibilityOpen}
          onClose={onEligibilityClose}
          courseId={selectedCourseForEligibility?.id}
          course={selectedCourseForEligibility!}
          onUpdate={fetchCourses}
        />
      </motion.div>
    </div>
  );
}
