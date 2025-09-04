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
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdArrowUpward,
  MdArrowDownward,
} from "react-icons/md";
import { toast } from "sonner";
import api from "@/utils/api/axios";
import { Project } from "@/types/student-projects";

interface ProjectsResponse {
  items: Project[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export default function StudentProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get<ProjectsResponse>(
        `/student-projects?page=${page}&limit=${rowsPerPage}`
      );
      setProjects(data.items);
      setTotalProjects(data.meta.total);
    } catch (error) {
      toast.error("Layihələr yüklənə bilmədi");
      console.error("Layihələri yükləmə xətası:", error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (project: Project) => {
    setSelectedProject(project);
    onOpen();
  };

  const confirmDelete = async () => {
    if (!selectedProject) return;

    try {
      await api.delete(`/student-projects/${selectedProject.id}`);
      toast.success("Layihə uğurla silindi");
      fetchProjects();
    } catch (error) {
      toast.error("Layihəni silmək mümkün olmadı");
      console.error("Layihəni silmə xətası:", error);
    } finally {
      onClose();
      setSelectedProject(null);
    }
  };

  const handleMove = async (project: Project, direction: "up" | "down") => {
    try {
      const newOrder =
        direction === "up" ? project.order - 1 : project.order + 1;
      await api.patch(`/student-projects/${project.id}`, {
        order: newOrder,
      });

      await fetchProjects();
      toast.success("Sıralama uğurla yeniləndi");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Sıralama yenilənə bilmədi");
    }
  };

  const columns = [
    { name: "BAŞLIQ", uid: "title" },
    { name: "TƏSVİR", uid: "description" },
    { name: "KATEQORİYA", uid: "category" },
    { name: "SIRALA", uid: "order" },
    { name: "YARADILMA TARİXİ", uid: "createdAt" },
    { name: "ƏMƏLİYYATLAR", uid: "actions" },
  ];

  const renderCell = (project: Project, columnKey: string) => {
    switch (columnKey) {
      case "title":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{project.title.az}</p>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-tiny text-blue-500 hover:underline"
            >
              Layihəyə Bax
            </a>
          </div>
        );
      case "description":
        return (
          <p className="text-small">
            {project.description.az.length > 100
              ? `${project.description.az.substring(0, 100)}...`
              : project.description.az}
          </p>
        );
      case "category":
        return <p className="text-small">{project.category.name}</p>;
      case "order":
        return (
          <div className="flex flex-col gap-1 items-center">
            <Tooltip content="Yuxarı">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                isDisabled={project.order === 0}
                onClick={() => handleMove(project, "up")}
              >
                <MdArrowUpward className="text-default-400" size={20} />
              </Button>
            </Tooltip>
            <span className="text-tiny text-default-400">
              Sıra: {project.order + 1}
            </span>
            <Tooltip content="Aşağı">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                isDisabled={project.order === totalProjects - 1}
                onClick={() => handleMove(project, "down")}
              >
                <MdArrowDownward className="text-default-400" size={20} />
              </Button>
            </Tooltip>
          </div>
        );
      case "createdAt":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">
              {new Date(project.createdAt).toLocaleDateString("az-AZ")}
            </p>
            <p className="text-bold text-tiny text-default-400">
              {new Date(project.createdAt).toLocaleTimeString("az-AZ")}
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
                  router.push(`/dashboard/student-projects/edit/${project.id}`)
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
                onClick={() => handleDelete(project)}
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
            <h1 className="text-2xl font-bold">Tələbə Layihələri</h1>
            <p className="text-gray-500">Tələbə layihələrini idarə edin</p>
          </div>
          <Button
            color="primary"
            className="bg-jsyellow text-white"
            startContent={<MdAdd size={24} />}
            onClick={() => router.push("/dashboard/student-projects/create")}
          >
            Yeni Layihə
          </Button>
        </div>

        <Table
          aria-label="Tələbə layihələri cədvəli"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="warning"
                page={page}
                total={Math.ceil(totalProjects / rowsPerPage)}
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
            items={projects}
            loadingContent={<div>Yüklənir...</div>}
            loadingState={loading ? "loading" : "idle"}
          >
            {(project) => (
              <TableRow key={project.id}>
                {columns.map((column) => (
                  <TableCell key={column.uid}>
                    {renderCell(project, column.uid)}
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
                <ModalHeader>Layihəni Sil</ModalHeader>
                <ModalBody>
                  <p>
                    &quot;{selectedProject?.title.az}&quot; layihəsini silmək
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
      </motion.div>
    </div>
  );
}
