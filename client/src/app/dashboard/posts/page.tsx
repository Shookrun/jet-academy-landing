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
  MdEvent,
  MdFeed,
  MdArticle,
  MdPercent,
} from "react-icons/md";
import { toast } from "sonner";
import api from "@/utils/api/axios";
import { Post, PostsResponse } from "@/types/post";
import Link from "next/link";
import { PostType } from "@/types/enums";

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [selectedPostType, setSelectedPostType] = useState<PostType | null>(
    null
  );

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      let url = `/posts?page=${page}&limit=${rowsPerPage}&includeUnpublished=true&includeBlogs=true`;

      if (selectedPostType) {
        url = `/posts/type/${selectedPostType}?page=${page}&limit=${rowsPerPage}&includeUnpublished=true`;
      }

      const { data } = await api.get<PostsResponse>(url);
      setPosts(data.items);
      setTotalPosts(data.meta.total);
    } catch (error) {
      console.error("Postlar yüklənmədi:", error);
      toast.error("Postlar yüklənə bilmədi");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, selectedPostType]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = (post: Post) => {
    setSelectedPost(post);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    if (!selectedPost) return;

    try {
      await api.delete(`/posts/${selectedPost.id}`);
      toast.success("Post uğurla silindi");
      fetchPosts();
    } catch (error) {
      console.error("Post silinmədi:", error);
      toast.error("Postu silmək mümkün olmadı");
    } finally {
      onDeleteClose();
      setSelectedPost(null);
    }
  };

  const handlePostTypeFilter = (type: PostType | null) => {
    setSelectedPostType(type);
    setPage(1);
  };

  const columns = [
    { name: "BAŞLIQ", uid: "title" },
    { name: "MƏZMUN", uid: "content" },
    { name: "TİP", uid: "postType" },
    { name: "STATUS", uid: "published" },
    { name: "TEQLƏR", uid: "tags" },
    { name: "YARADILMA TARİXİ", uid: "createdAt" },
    { name: "ƏMƏLİYYATLAR", uid: "actions" },
  ];

  const renderCell = (post: Post, columnKey: string) => {
    switch (columnKey) {
      case "title":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{post.title.az}</p>
            <p className="text-tiny text-default-400">{post.title.en}</p>
          </div>
        );

      case "content":
        return (
          <div className="flex flex-col">
            <p className="text-small">
              {post.content.az.replace(/<[^>]*>/g, "").substring(0, 100)}...
            </p>
            <Link href={`/news/${post.slug.az}`}>
              <p className="text-primary text-tiny">Ətraflı</p>
            </Link>
          </div>
        );

      case "postType":
        return (
          <Chip
            className="capitalize"
            color={
              post.postType === PostType.BLOG
                ? "primary"
                : post.postType === PostType.NEWS
                ? "success"
                : "warning"
            }
            size="sm"
            variant="flat"
          >
            {post.postType === PostType.BLOG
              ? "Bloq"
              : post.postType === PostType.NEWS
              ? "Xəbər"
              : post.postType === PostType.EVENT
              ? "Tədbir"
              : post.postType === PostType.OFFERS
              ? "Kampaniya"
              : "Bilinmir"}
          </Chip>
        );

      case "published":
        return (
          <Chip
            className="capitalize"
            color={post.published ? "success" : "warning"}
            size="sm"
            variant="flat"
          >
            {post.published ? "Aktiv" : "Deaktiv"}
          </Chip>
        );

      case "tags":
        return (
          <div className="flex flex-wrap gap-1">
            {post.tags && post.tags.length > 0 ? (
              post.tags.map((tag, index) => (
                <Chip key={index} size="sm" variant="flat">
                  {tag}
                </Chip>
              ))
            ) : (
              <span className="text-tiny text-default-400">Teq yoxdur</span>
            )}
          </div>
        );

      case "createdAt":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">
              {new Date(post.createdAt).toLocaleDateString("az-AZ")}
            </p>
            <p className="text-bold text-tiny text-default-400">
              {new Date(post.createdAt).toLocaleTimeString("az-AZ")}
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
                onClick={() => router.push(`/dashboard/posts/edit/${post.id}`)}
              >
                <MdEdit className="text-default-400" size={20} />
              </Button>
            </Tooltip>
            <Tooltip content="Sil" color="danger">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onClick={() => handleDelete(post)}
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
            <h1 className="text-2xl font-bold">Postlar</h1>
            <p className="text-gray-500">Postları idarə edin</p>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              color="primary"
              className="bg-jsyellow text-white"
              startContent={<MdAdd size={24} />}
              onClick={() => router.push("/dashboard/posts/create")}
            >
              Yeni Post
            </Button>
          </div>
        </div>

        <div className="mb-4 flex gap-2">
          <Button
            color={selectedPostType === null ? "warning" : "default"}
            variant={selectedPostType === null ? "solid" : "bordered"}
            onClick={() => handlePostTypeFilter(null)}
          >
            Hamısı
          </Button>
          <Button
            color={selectedPostType === PostType.BLOG ? "warning" : "default"}
            variant={selectedPostType === PostType.BLOG ? "solid" : "bordered"}
            startContent={<MdArticle size={18} />}
            onClick={() => handlePostTypeFilter(PostType.BLOG)}
          >
            Bloq
          </Button>
          <Button
            color={selectedPostType === PostType.NEWS ? "warning" : "default"}
            variant={selectedPostType === PostType.NEWS ? "solid" : "bordered"}
            startContent={<MdFeed size={18} />}
            onClick={() => handlePostTypeFilter(PostType.NEWS)}
          >
            Xəbər
          </Button>
          <Button
            color={selectedPostType === PostType.EVENT ? "warning" : "default"}
            variant={selectedPostType === PostType.EVENT ? "solid" : "bordered"}
            startContent={<MdEvent size={18} />}
            onClick={() => handlePostTypeFilter(PostType.EVENT)}
          >
            Tədbir
          </Button>
          <Button
            color={selectedPostType === PostType.OFFERS ? "warning" : "default"}
            variant={
              selectedPostType === PostType.OFFERS ? "solid" : "bordered"
            }
            startContent={<MdPercent size={18} />}
            onClick={() => handlePostTypeFilter(PostType.OFFERS)}
          >
            Kampaniya
          </Button>
        </div>

        <Table
          aria-label="Postlar cədvəli"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="warning"
                page={page}
                total={Math.ceil(totalPosts / rowsPerPage)}
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
            items={posts}
            loadingContent={<div>Yüklənir...</div>}
            loadingState={loading ? "loading" : "idle"}
            emptyContent={<div>Post tapılmadı</div>}
          >
            {(post) => (
              <TableRow key={post.id}>
                {columns.map((column) => (
                  <TableCell key={column.uid}>
                    {renderCell(post, column.uid)}
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
                <ModalHeader>Postu Sil</ModalHeader>
                <ModalBody>
                  <p>
                    &quot;{selectedPost?.title.az}&quot; postunu silmək
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
