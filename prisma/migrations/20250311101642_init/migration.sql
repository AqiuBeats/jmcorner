-- CreateEnum
CREATE TYPE "AdLogStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "BenefitType" AS ENUM ('SIGN_IN_BONUS', 'AD_REVENUE_BONUS', 'MESSAGE_DISCOUNT', 'DAILY_FLOWER_CAP');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('LOGIN', 'LOGOUT', 'SEND_MESSAGE', 'VIEW_AD', 'SIGN_IN', 'VIEW_PROFILE', 'UPDATE_INFO');

-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "EducationType" AS ENUM ('PRIMARY_SCHOOL', 'JUNIOR_HIGH_SCHOOL', 'HIGH_SCHOOL', 'BACHELOR', 'MASTER', 'DOCTOR');

-- CreateEnum
CREATE TYPE "MaritalType" AS ENUM ('SINGLE', 'DIVORCED', 'WIDOWED', 'PARENT');

-- CreateEnum
CREATE TYPE "TransType" AS ENUM ('RECHARGE', 'CONSUME', 'REWARD', 'REFUND', 'TRANSFER', 'AD_REVENUE');

-- CreateEnum
CREATE TYPE "TransStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'ROLLBACK');

-- CreateEnum
CREATE TYPE "MBTIType" AS ENUM ('ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP', 'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ');

-- CreateEnum
CREATE TYPE "Constellation" AS ENUM ('ARIES', 'TAURUS', 'GEMINI', 'CANCER', 'LEO', 'VIRGO', 'LIBRA', 'SCORPIO', 'SAGITTARIUS', 'CAPRICORN', 'AQUARIUS', 'PISCES');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "idNumber" TEXT,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "gender" "GenderType" NOT NULL,
    "height" INTEGER NOT NULL,
    "education" "EducationType" NOT NULL,
    "occupation" TEXT NOT NULL,
    "income" INTEGER NOT NULL,
    "region" TEXT NOT NULL,
    "maritalStatus" "MaritalType" NOT NULL,
    "hobbies" TEXT[],
    "photos" TEXT[],
    "constellation" "Constellation",
    "mbti" "MBTIType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isProfileVisible" BOOLEAN NOT NULL DEFAULT true,
    "accountId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "exp" INTEGER NOT NULL DEFAULT 0,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "flowersUsed" INTEGER NOT NULL DEFAULT 10,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InviteCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InviteCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL,
    "inviterId" TEXT NOT NULL,
    "inviteeId" TEXT NOT NULL,
    "flowersAwarded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "type" "TransType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "TransStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "metadata" JSONB,
    "preBalance" INTEGER NOT NULL,
    "postBalance" INTEGER NOT NULL,
    "accountId" TEXT NOT NULL,
    "userId" TEXT,
    "messageId" TEXT,
    "invitationId" TEXT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyCheckIn" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "earnedFlowers" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyCheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdViewLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "earnedFlowers" INTEGER NOT NULL DEFAULT 5,
    "status" "AdLogStatus" NOT NULL DEFAULT 'PENDING',
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "AdViewLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipBenefit" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "benefitType" "BenefitType" NOT NULL,
    "value" INTEGER NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3),
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MembershipBenefit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserActionLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actionType" "ActionType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "deviceInfo" JSONB,
    "details" JSONB,

    CONSTRAINT "UserActionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_idNumber_key" ON "User"("idNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_accountId_key" ON "User"("accountId");

-- CreateIndex
CREATE INDEX "User_region_age_income_idx" ON "User"("region", "age", "income");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_key" ON "Membership"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "InviteCode_code_key" ON "InviteCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_inviterId_inviteeId_key" ON "Invitation"("inviterId", "inviteeId");

-- CreateIndex
CREATE INDEX "DailyCheckIn_userId_idx" ON "DailyCheckIn"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyCheckIn_userId_date_key" ON "DailyCheckIn"("userId", "date");

-- CreateIndex
CREATE INDEX "AdViewLog_adId_idx" ON "AdViewLog"("adId");

-- CreateIndex
CREATE INDEX "AdViewLog_viewedAt_idx" ON "AdViewLog"("viewedAt");

-- CreateIndex
CREATE INDEX "MembershipBenefit_membershipId_idx" ON "MembershipBenefit"("membershipId");

-- CreateIndex
CREATE INDEX "MembershipBenefit_benefitType_idx" ON "MembershipBenefit"("benefitType");

-- CreateIndex
CREATE INDEX "UserActionLog_userId_idx" ON "UserActionLog"("userId");

-- CreateIndex
CREATE INDEX "UserActionLog_actionType_idx" ON "UserActionLog"("actionType");

-- CreateIndex
CREATE INDEX "UserActionLog_timestamp_idx" ON "UserActionLog"("timestamp");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InviteCode" ADD CONSTRAINT "InviteCode_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyCheckIn" ADD CONSTRAINT "DailyCheckIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdViewLog" ADD CONSTRAINT "AdViewLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipBenefit" ADD CONSTRAINT "MembershipBenefit_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActionLog" ADD CONSTRAINT "UserActionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
