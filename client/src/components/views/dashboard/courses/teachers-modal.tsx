import { Course } from "@/types/course";
import { CourseTeacherAssignment, TeamMember } from "@/types/team";
import api from "@/utils/api/axios";
import {
  Avatar,
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  courseId?: string;
  teacherRoleId?: string;
  onUpdate: () => void;
  course: Course;
}

export default function TeachersModal({
  isOpen,
  onClose,
  courseId,
  teacherRoleId,
  onUpdate,
  course,
}: Props) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<CourseTeacherAssignment[]>([]);
  const [positions, setPositions] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen || !courseId || !teacherRoleId) return;
      try {
        setLoading(true);
        const [teamResponse, assignmentsResponse] = await Promise.all([
          api.get("/team?limit=100"),
          api.get(`/course-teacher/${teacherRoleId}?limit=100`),
        ]);

        setTeamMembers(teamResponse.data.items);

        const courseAssignments = assignmentsResponse.data.courses
          .filter((a: any) => a.courseId === courseId)
          .map((a: any) => ({
            teacherId: a.teacherId,
            courseId: a.courseId,
            position: a.position,
            teacher: a.teacher,
          }));

        setAssignments(courseAssignments);

        const positionsMap: { [key: string]: string } = {};
        courseAssignments.forEach((assignment: CourseTeacherAssignment) => {
          if (assignment.position) {
            positionsMap[assignment.teacherId] = assignment.position;
          }
        });
        setPositions(positionsMap);
      } catch (error) {
        console.error("Məlumatlar yüklənmədi:", error);
        toast.error("Məlumatlar yüklənə bilmədi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, courseId, teacherRoleId]);

  const handleAssign = async (teamId: string) => {
    try {
      await api.post(
        `/course-teacher/${teacherRoleId}/courses/${courseId}/team/${teamId}`,
        {
          position: positions[teamId],
        }
      );
      toast.success("Müəllim əlavə edildi");
      onUpdate();

      const teacher = teamMembers.find((t) => t.id === teamId);
      if (teacher) {
        setAssignments([
          ...assignments,
          {
            teacherId: teamId,
            courseId: courseId!,
            position: positions[teamId],
            teacher,
          },
        ]);
      }
    } catch (error) {
      console.error("Müəllim əlavə edilmədi:", error);
      toast.error("Əməliyyat uğursuz oldu");
    }
  };

  const handleUnassign = async (teamId: string) => {
    try {
      await api.delete(
        `/course-teacher/${teacherRoleId}/courses/${courseId}/team/${teamId}`
      );
      toast.success("Müəllim silindi");
      onUpdate();

      setAssignments(assignments.filter((a) => a.teacherId !== teamId));
      const newPositions = { ...positions };
      delete newPositions[teamId];
      setPositions(newPositions);
    } catch (error) {
      console.error("Müəllim silinmədi:", error);
      toast.error("Əməliyyat uğursuz oldu");
    }
  };

  const handleToggle = (teamId: string, isSelected: boolean) => {
    if (isSelected) {
      handleAssign(teamId);
    } else {
      handleUnassign(teamId);
    }
  };

  const handlePositionChange = (teamId: string, position: string) => {
    setPositions({ ...positions, [teamId]: position });
  };

  const renderTeamMember = (member: TeamMember) => {
    const isAssigned = assignments.some((a) => a.teacherId === member.id);

    return (
      <div
        key={member.id}
        className="flex items-center gap-4 p-2 rounded-lg hover:bg-default-100"
      >
        <Checkbox
          isSelected={isAssigned}
          onValueChange={(isSelected) => handleToggle(member.id, isSelected)}
        />
        <Avatar
          src={`${process.env.NEXT_PUBLIC_CDN_URL}/${member.imageUrl}`}
          size="sm"
          className="flex-shrink-0"
        />
        <div className="flex-grow">
          <p className="font-medium">{member.fullName}</p>
          <p className="text-small text-default-500">{member.bio.az}</p>
        </div>
        <div className="w-48">
          <Input
            type="text"
            placeholder="Vəzifə"
            size="sm"
            value={positions[member.id] || ""}
            onChange={(e) => handlePositionChange(member.id, e.target.value)}
            disabled={!isAssigned}
            onBlur={() => {
              if (isAssigned && positions[member.id]) {
                handleAssign(member.id);
              }
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" backdrop="blur">
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">Kurs Müəllimləri</h2>
            <p className="text-small text-default-500">
              {course?.title?.az} kursu üçün müəllimləri seçin
            </p>
          </ModalHeader>
          <ModalBody>
            <ScrollShadow className="max-h-[500px]">
              <div className="flex flex-col gap-3">
                {loading ? (
                  <p>Yüklənir...</p>
                ) : (
                  teamMembers
                    .sort((a, b) => a.order - b.order)
                    .map(renderTeamMember)
                )}
              </div>
            </ScrollShadow>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Bağla
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
