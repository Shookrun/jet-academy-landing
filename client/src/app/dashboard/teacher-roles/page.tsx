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
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import { toast } from "sonner";
import api from "@/utils/api/axios";
import { CourseTeacherResponse, CourseTeacherRole } from "@/types/team";

export default function CourseTeacherRolesPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<CourseTeacherRole[]>([]);
  const [totalRoles, setTotalRoles] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRole, setSelectedRole] = useState<CourseTeacherRole | null>(
    null
  );

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get<CourseTeacherResponse>(
        `/course-teacher?page=${page}&limit=${rowsPerPage}`
      );
      setRoles(data.items);
      setTotalRoles(data.meta.total);
    } catch (error) {
      toast.error("Müəllim rolları yüklənə bilmədi");
      console.error("Müəllim rollarını yükləmə xətası:", error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleDelete = async (role: CourseTeacherRole) => {
    setSelectedRole(role);
    onOpen();
  };

  const confirmDelete = async () => {
    if (!selectedRole) return;

    try {
      await api.delete(`/teacher-roles/${selectedRole.id}`);
      toast.success("Müəllim rolu uğurla silindi");
      fetchRoles();
    } catch (error) {
      toast.error("Müəllim rolunu silmək mümkün olmadı");
      console.error("Müəllim rolunu silmə xətası:", error);
    } finally {
      onClose();
      setSelectedRole(null);
    }
  };

  const columns = [
    { name: "ROL", uid: "title" },
    { name: "TƏSVİR", uid: "description" },
    { name: "TƏYİN EDİLƏN MÜƏLLIMLƏR", uid: "assignments" },
    { name: "YARADILMA TARİXİ", uid: "createdAt" },
    { name: "ƏMƏLİYYATLAR", uid: "actions" },
  ];

  const renderCell = (role: CourseTeacherRole, columnKey: string) => {
    switch (columnKey) {
      case "title":
        return <p className="text-bold text-small">{role.title}</p>;
      case "description":
        return (
          <p className="text-small">
            {role.description?.az
              ? role.description.az.length > 100
                ? `${role.description.az.substring(0, 100)}...`
                : role.description.az
              : "Təsvir yoxdur"}
          </p>
        );
      case "assignments":
        return (
          <div className="flex flex-col gap-1">
            {role.courses.length > 0 ? (
              role.courses.map((assignment, index) => (
                <div key={index} className="text-small">
                  <span className="font-semibold">
                    {assignment.teacher.fullName}
                  </span>
                  {assignment.position && ` - ${assignment.position}`}
                  <br />
                  <span className="text-tiny text-default-400">
                    {assignment.course.title.az}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-small text-default-400">Təyin edilməyib</p>
            )}
          </div>
        );
      case "createdAt":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">
              {new Date(role.createdAt).toLocaleDateString("az-AZ")}
            </p>
            <p className="text-bold text-tiny text-default-400">
              {new Date(role.createdAt).toLocaleTimeString("az-AZ")}
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
                  router.push(`/dashboard/teacher-roles/edit/${role.id}`)
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
                onClick={() => handleDelete(role)}
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
            <h1 className="text-2xl font-bold">Müəllim Rolları</h1>
            <p className="text-gray-500">Müəllim rollarını idarə edin</p>
          </div>
          <Button
            color="primary"
            className="bg-jsyellow text-white"
            startContent={<MdAdd size={24} />}
            onClick={() => router.push("/dashboard/teacher-roles/create")}
          >
            Yeni Rol
          </Button>
        </div>

        <Table
          aria-label="Müəllim rolları cədvəli"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="warning"
                page={page}
                total={Math.ceil(totalRoles / rowsPerPage)}
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
            items={roles}
            loadingContent={<div>Yüklənir...</div>}
            loadingState={loading ? "loading" : "idle"}
          >
            {(item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell key={column.uid}>
                    {renderCell(item, column.uid)}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Müəllim Rolunu Sil
                </ModalHeader>
                <ModalBody>
                  <p>
                    &quot;{selectedRole?.title}&quot; rolunu silmək istədiyinizə
                    əminsiniz?
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
      </motion.div>
    </div>
  );
}
