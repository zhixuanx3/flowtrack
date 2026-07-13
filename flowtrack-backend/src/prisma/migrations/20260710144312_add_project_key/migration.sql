-- AlterTable
ALTER TABLE "Project" ADD COLUMN "key" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Project_organizationId_key_key" ON "Project"("organizationId", "key");
