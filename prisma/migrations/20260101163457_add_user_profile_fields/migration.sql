-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';
