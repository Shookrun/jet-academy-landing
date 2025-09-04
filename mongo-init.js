print("MongoDB initialization script started");

db = db.getSiblingDB("jetschooldb");

try {
  db.createUser({
    user: "jetschool",
    pwd: "secretpass",
    roles: [
      {
        role: "readWrite",
        db: "jetschooldb",
      },
    ],
  });
  print("Application user created successfully");
} catch (error) {
  print("User might already exist: " + error.message);
}

print("MongoDB initialization script completed");
