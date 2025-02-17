-- CreateTable
CREATE TABLE "Foo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Foo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_seeds" (
    "id" TEXT NOT NULL,
    "seed_name" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "app_seeds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Foo_name_key" ON "Foo"("name");

-- CreateIndex
CREATE UNIQUE INDEX "app_seeds_seed_name_key" ON "app_seeds"("seed_name");
