export async function getCourseDetails(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/courses/slug/${slug}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch course data");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching course details:", error);
    throw error;
  }
}

export async function getAllCourses({ limit = 24, page = 1 }: any) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/courses?${new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
      })}
      `,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch courses");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching all courses:", error);
    throw error;
  }
}
