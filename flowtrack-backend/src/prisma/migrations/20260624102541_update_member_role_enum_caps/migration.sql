/*
  Warnings:

  - The values [owner,admin,member] on the enum `MemberRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MemberRole_new" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');
ALTER TABLE "public"."OrganizationMember" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "OrganizationMember" ALTER COLUMN "role" TYPE "MemberRole_new" USING ("role"::text::"MemberRole_new");
ALTER TYPE "MemberRole" RENAME TO "MemberRole_old";
ALTER TYPE "MemberRole_new" RENAME TO "MemberRole";
DROP TYPE "public"."MemberRole_old";
ALTER TABLE "OrganizationMember" ALTER COLUMN "role" SET DEFAULT 'MEMBER';
COMMIT;

-- AlterTable
ALTER TABLE "OrganizationMember" ALTER COLUMN "role" SET DEFAULT 'MEMBER';
