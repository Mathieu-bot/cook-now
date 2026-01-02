-- CreateTable
CREATE TABLE "RecipeNote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecipeNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RecipeNote_recipeId_idx" ON "RecipeNote"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeNote_userId_recipeId_key" ON "RecipeNote"("userId", "recipeId");

-- AddForeignKey
ALTER TABLE "RecipeNote" ADD CONSTRAINT "RecipeNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeNote" ADD CONSTRAINT "RecipeNote_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
