"use client";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader,
  Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow,
  Tooltip, useDisclosure, Chip, Skeleton, Spinner
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MdAdd, MdDelete, MdEdit, MdPeople, MdSettings, MdViewModule, MdShield } from "react-icons/md";
import { toast } from "sonner";
import api from "@/utils/api/axios";
import { Course } from "@/types/course";
import Link from "next/link";

const ModulesModal = dynamic(() => import("@/components/views/dashboard/modules/modules-modal"), { ssr: false });
const EligibilityModal = dynamic(() => import("@/components/views/dashboard/eligibility/eligibility-modal"), { ssr: false });
const TeachersModal = dynamic(() => import("@/components/views/dashboard/courses/teachers-modal"), { ssr: false });

interface CoursesResponse {
  items: Course[];
  meta: { total: number; page: number; limit: number; totalPages?: number };
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
  const [totalPages, setTotalPages] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);

  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(true);

  const { isOpen: isTeachersOpen, onOpen: onTeachersOpen, onClose: onTeachersClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isEligibilityOpen, onOpen: onEligibilityOpen, onClose: onEligibilityClose } = useDisclosure();
  const { isOpen: isModulesOpen, onOpen: onModulesOpen, onClose: onModulesClose } = useDisclosure();

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedTeacherRole, setSelectedTeacherRole] = useState<TeacherRole | null>(null);
  const [selectedCourseForEligibility, setSelectedCourseForEligibility] = useState<Course | null>(null);
  const [selectedCourseForModules, setSelectedCourseForModules] = useState<Course | null>(null);

  // server page indexing auto-detect (false: 1-index, true: 0-index)
  const [serverZeroIndexed, setServerZeroIndexed] = useState<boolean | null>(null);
  const firstDetectDoneRef = useRef(false);

  const backoff = async <T,>(fn: () => Promise<T>, tries = 3, base = 400): Promise<T> => {
    let lastErr: any;
    for (let i = 0; i < tries; i++) {
      try {
        return await fn();
      } catch (e) {
        lastErr = e;
        await new Promise(r => setTimeout(r, base * Math.pow(2, i)));
      }
    }
    throw lastErr;
  };

  const fetchTeacherRoles = async () => {
    try {
      setRolesLoading(true);
      const { data } = await backoff(() => api.get("/course-teacher", { withCredentials: true }));
      setTeacherRoles(data?.items || []);
    } catch {
      setTeacherRoles([]);
      toast.error("Müəllim rolları yüklənmədi");
    } finally {
      setRolesLoading(false);
    }
  };

  const effectiveApiPage = (uiPage: number) => {
    if (serverZeroIndexed === null) return uiPage; // ilk sorğu – bilmədiyimiz üçün elə göndəririk
    return serverZeroIndexed ? uiPage - 1 : uiPage;
  };

  const detectIndexing = (uiPage: number, metaPageFromServer?: number) => {
    if (firstDetectDoneRef.current) return;
    if (typeof metaPageFromServer !== "number") return;
    // meta.page 0-dırsa və ya (meta.page === uiPage-1) isə 0-index kimi qəbul et
    const zero = metaPageFromServer === 0 || metaPageFromServer === uiPage - 1;
    setServerZeroIndexed(zero);
    firstDetectDoneRef.current = true;
  };

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);

      const uiPage = page;
      const apiPage = effectiveApiPage(uiPage);

      const { data } = await backoff(() =>
        api.get<CoursesResponse>(
          `/courses?page=${apiPage}&limit=${rowsPerPage}&includeUnpublished=true`,
          { withCredentials: true }
        )
      );

      // indexing auto-detect (yalnız ilk uğurlu cavabda)
      detectIndexing(uiPage, data?.meta?.page);

      setCourses(data?.items || []);
      setTotalCourses(data?.meta?.total || 0);
      setTotalPages(data?.meta?.totalPages ?? null);

      // əgər boş səhifəyə düşmüşüksə (məs: total azalıb), son səhifəyə geri çək
      const last = Math.max(1, Math.ceil((data?.meta?.total || 0) / rowsPerPage));
      if (uiPage > 1 && (data?.items?.length ?? 0) === 0 && last < uiPage) {
        setPage(last);
      }
    } catch {
      setCourses([]);
      setTotalCourses(0);
      setTotalPages(null);
      toast.error("Kurslar yüklənə bilmədi");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, serverZeroIndexed]);

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
      await api.delete(`/courses/${selectedCourse.id}`, { withCredentials: true });
      toast.success("Kurs uğurla silindi");
      fetchCourses();
    } catch {
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

  const columns = useMemo(
    () => [
      { name: "BAŞLIQ", uid: "title" },
      { name: "TƏSVİR", uid: "description" },
      { name: "MÜDDƏT", uid: "duration" },
      { name: "STATUS", uid: "published" },
      { name: "MODULLAR VƏ TƏLƏBLƏR", uid: "eligibility" },
      { name: "MÜƏLLİMLƏR", uid: "teachers" },
      { name: "YARADILMA TARİXİ", uid: "createdAt" },
      { name: "ƏMƏLİYYATLAR", uid: "actions" },
    ],
    []
  );

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
          <Chip className="capitalize" color={course.published ? "success" : "warning"} size="sm" variant="flat">
            {course.published ? "Aktiv" : "Deaktiv"}
          </Chip>
        );
      case "teachers":
        return rolesLoading ? (
          <Spinner size="sm" color="warning" />
        ) : (
          <div className="flex flex-wrap gap-2">
            {teacherRoles?.map((role) => (
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
              <p className="text-small">Tələblər: {course.eligibility?.length || 0}</p>
            </div>
            <div className="flex gap-1">
              <Tooltip content="Modulları idarə et">
                <Button isIconOnly variant="light" size="sm" onClick={() => handleModulesModal(course)}>
                  <MdViewModule className="text-default-400" size={20} />
                </Button>
              </Tooltip>
              <Tooltip content="Tələbləri idarə et">
                <Button isIconOnly variant="light" size="sm" onClick={() => handleEligibilityModal(course)}>
                  <MdSettings className="text-default-400" size={20} />
                </Button>
              </Tooltip>
            </div>
          </div>
        );
      case "createdAt":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{new Date(course.createdAt).toLocaleDateString("az-AZ")}</p>
            <p className="text-bold text-tiny text-default-400">{new Date(course.createdAt).toLocaleTimeString("az-AZ")}</p>
          </div>
        );
      case "actions":
        return (
          <div className="flex items-center gap-2">
            <Tooltip content="Düzəliş et">
              <Button isIconOnly variant="light" size="sm" onClick={() => router.push(`/dashboard/courses/edit/${course.id}`)}>
                <MdEdit className="text-default-400" size={20} />
              </Button>
            </Tooltip>
            <Tooltip content="Sil" color="danger">
              <Button isIconOnly variant="light" size="sm" onClick={() => handleDelete(course)}>
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Kurslar</h1>
            <p className="text-gray-500">Kursları idarə edin</p>
          </div>
          <div className="flex gap-2 items-center">
            <Link href="/dashboard/eligibilities">
              <Button color="primary" className="bg-jsyellow text-white" startContent={<MdShield size={24} />}>
                Tələblər
              </Button>
            </Link>
            <Link href="/dashboard/modules">
              <Button color="primary" className="bg-jsyellow text-white" startContent={<MdViewModule size={24} />}>
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

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
        ) : (
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
                  total={totalPages ?? Math.max(1, Math.ceil(totalCourses / rowsPerPage))}
                  onChange={(p) => setPage(p)}
                />
              </div>
            }
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>

            <TableBody items={courses}>
              {(course) => (
                <TableRow key={course.id}>
                  {columns.map((column) => (
                    <TableCell key={column.uid}>{renderCell(course, column.uid)}</TableCell>
                  ))}
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Kursu Sil</ModalHeader>
                <ModalBody>
                  <p>&quot;{selectedCourse?.title.az}&quot; kursunu silmək istədiyinizə əminsiniz?</p>
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

        {isModulesOpen && selectedCourseForModules && (
          <ModulesModal
            isOpen={isModulesOpen}
            onClose={onModulesClose}
            courseId={selectedCourseForModules.id}
            course={selectedCourseForModules}
            onUpdate={fetchCourses}
          />
        )}

        {isTeachersOpen && selectedCourse && selectedTeacherRole && (
          <TeachersModal
            isOpen={isTeachersOpen}
            onClose={onTeachersClose}
            teacherRoleId={selectedTeacherRole.id}
            courseId={selectedCourse.id}
            course={selectedCourse}
            onUpdate={fetchCourses}
          />
        )}

        {isEligibilityOpen && selectedCourseForEligibility && (
          <EligibilityModal
            isOpen={isEligibilityOpen}
            onClose={onEligibilityClose}
            courseId={selectedCourseForEligibility.id}
            course={selectedCourseForEligibility}
            onUpdate={fetchCourses}
          />
        )}
      </motion.div>
    </div>
  );
}
