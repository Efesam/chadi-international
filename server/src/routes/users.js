import { Router } from "express";
import { getUsers, saveUsers, hashPassword, publicUser, requireAuth } from "../lib/auth.js";
import { generateId } from "../lib/store.js";

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  const users = await getUsers();
  res.json(users.map(publicUser));
});

router.post("/", async (req, res) => {
  const { name, email, password, role } = req.body || {};

  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email and password are required" });
    return;
  }

  const users = await getUsers();

  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    res.status(409).json({ error: "A user with that email already exists" });
    return;
  }

  const user = {
    id: generateId("user"),
    name,
    email,
    role: role || "editor",
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
    resetToken: null,
    resetTokenExpires: null,
  };

  users.unshift(user);
  await saveUsers(users);
  res.status(201).json(publicUser(user));
});

router.put("/:id", async (req, res) => {
  const users = await getUsers();
  const index = users.findIndex((u) => u.id === req.params.id);

  if (index === -1) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const { name, email, role, password } = req.body || {};
  const current = users[index];

  users[index] = {
    ...current,
    name: name ?? current.name,
    email: email ?? current.email,
    role: role ?? current.role,
    passwordHash: password ? hashPassword(password) : current.passwordHash,
  };

  await saveUsers(users);
  res.json(publicUser(users[index]));
});

router.delete("/:id", async (req, res) => {
  const users = await getUsers();

  if (users.length <= 1) {
    res.status(400).json({ error: "Cannot delete the last remaining admin user" });
    return;
  }

  if (req.user.sub === req.params.id) {
    res.status(400).json({ error: "You cannot delete your own account while logged in" });
    return;
  }

  const next = users.filter((u) => u.id !== req.params.id);

  if (next.length === users.length) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  await saveUsers(next);
  res.status(204).end();
});

export default router;
