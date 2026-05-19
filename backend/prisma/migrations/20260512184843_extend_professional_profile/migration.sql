-- CreateEnum
CREATE TYPE "JobAvailability" AS ENUM ('AVAILABLE', 'IN_PROCESS', 'NOT_AVAILABLE');

-- CreateEnum
CREATE TYPE "JobModality" AS ENUM ('REMOTE', 'ON_SITE', 'HYBRID');

-- AlterTable
ALTER TABLE "ProfessionalProfile" ADD COLUMN     "availability" "JobAvailability" NOT NULL DEFAULT 'AVAILABLE',
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "portfolioUrl" TEXT,
ADD COLUMN     "preferredModality" "JobModality" NOT NULL DEFAULT 'REMOTE',
ADD COLUMN     "professionalTitle" TEXT,
ADD COLUMN     "salaryExpectation" TEXT,
ADD COLUMN     "valueProposition" TEXT,
ADD COLUMN     "yearsOfExperience" INTEGER DEFAULT 0;

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3),
    "url" TEXT,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ProfessionalProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Language" ADD CONSTRAINT "Language_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ProfessionalProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
