/*
  Warnings:

  - A unique constraint covering the columns `[profileId,skillId]` on the table `ProfileSkill` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProfileSkill_profileId_skillId_key" ON "ProfileSkill"("profileId", "skillId");
