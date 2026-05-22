-- CreateIndex
CREATE UNIQUE INDEX "LearningPath_title_key" ON "LearningPath"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Course_learningPathId_order_key" ON "Course"("learningPathId", "order");
