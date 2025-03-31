-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FAQ" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "embed_config_id" INTEGER,
    CONSTRAINT "FAQ_embed_config_id_fkey" FOREIGN KEY ("embed_config_id") REFERENCES "embed_configs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FAQ" ("answer", "createdAt", "id", "question", "updatedAt") SELECT "answer", "createdAt", "id", "question", "updatedAt" FROM "FAQ";
DROP TABLE "FAQ";
ALTER TABLE "new_FAQ" RENAME TO "FAQ";
CREATE INDEX "FAQ_embed_config_id_idx" ON "FAQ"("embed_config_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
