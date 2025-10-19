/*
  Warnings:

  - Added the required column `address` to the `form_submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationality` to the `form_submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `form_submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visaStatus` to the `form_submissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "form_submissions" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "consent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nationality" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "visaStatus" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "message" DROP NOT NULL;
