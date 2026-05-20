/*
  Warnings:

  - Added the required column `category` to the `LearningPath` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LearningPath" ADD COLUMN     "category" "SkillCategory" NOT NULL;
