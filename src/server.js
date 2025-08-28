import express from "express";

const app = express();
app.use(express.json());

// Rota de saúde
app.get("/health", (req, res) => res.json({ ok: true}));

// Mini API de tarefas em memória
const tasks = [];
let nextId = 1;

app.get("/tasks", (req, res) => res.json(tasks));

app.post("/tasks", (req, res) => {}