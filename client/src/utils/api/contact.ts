export async function getContact() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch contact data");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching contact data:", error);
    throw error;
  }
}
