import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  real,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  uid: text("uid").primaryKey(),
  examDate: text("exam_date"),
  startDate: text("start_date").notNull(),
  dailyHours: real("daily_hours").notNull().default(2),
  startTime: text("start_time").notNull().default("18:00"),
  theme: text("theme").notNull().default("auto"),
  focusMin: integer("focus_min").notNull().default(25),
  breakMin: integer("break_min").notNull().default(5),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const progress = pgTable(
  "progress",
  {
    uid: text("uid").notNull(),
    key: text("key").notNull(),
    value: text("value").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.uid, t.key] })],
);

export const studySessions = pgTable("study_sessions", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull(),
  day: text("day").notNull(),
  minutes: integer("minutes").notNull(),
  kind: text("kind").notNull().default("focus"),
  topic: text("topic"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cardStates = pgTable(
  "card_states",
  {
    uid: text("uid").notNull(),
    cardId: text("card_id").notNull(),
    box: integer("box").notNull().default(1),
    due: text("due").notNull(),
    reps: integer("reps").notNull().default(0),
    lapses: integer("lapses").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.uid, t.cardId] })],
);

export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull(),
  questionId: text("question_id").notNull(),
  correct: boolean("correct").notNull(),
  mode: text("mode").notNull().default("practice"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const examResults = pgTable("exam_results", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull(),
  score: integer("score").notNull(),
  total: integer("total").notNull(),
  seconds: integer("seconds").notNull().default(0),
  breakdown: jsonb("breakdown").notNull().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull(),
  title: text("title").notNull().default(""),
  body: text("body").notNull().default(""),
  topic: text("topic"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull(),
  title: text("title").notNull(),
  day: text("day").notNull(),
  done: boolean("done").notNull().default(false),
});
