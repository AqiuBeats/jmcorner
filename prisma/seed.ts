// prisma/seed.ts
import { faker } from '@faker-js/faker/locale/zh_CN';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

faker.seed(2025); // 固定随机种子保证数据可复现

const USER_COUNT = 50;
const MESSAGE_PER_USER = 3;
const INVITE_CODES_PER_USER = 2;

const createUser = async () => {
  return prisma.user.create({
    data: {
      phone: `+86 ${faker.string.numeric(10)}`,
      email: faker.internet.email({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        provider: 'example.com'
      }),
      password: "123456",
      idNumber: faker.helpers.replaceSymbols('11010119######??'),
      name: faker.person.fullName(),
      nickname: faker.person.firstName(),
      age: faker.number.int({ min: 18, max: 60 }),
      role: faker.helpers.arrayElement(['USER', 'ADMIN']),
      gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
      height: faker.number.int({ min: 150, max: 190 }),
      education: faker.helpers.arrayElement(['BACHELOR', 'MASTER']),
      occupation: faker.person.jobTitle(),
      income: faker.number.int({ min: 5, max: 200 }),
      region: `${faker.location.state()} ${faker.location.city()}`,
      maritalStatus: faker.helpers.arrayElement(['SINGLE', 'DIVORCED', 'PARENT']),
      hobbies: Array.from({ length: 5 }, () => faker.word.noun()),
      photos: Array.from({ length: 3 }, () => faker.image.avatar()),
      constellation: faker.helpers.arrayElement(['ARIES', 'TAURUS', 'GEMINI']),
      mbti: faker.helpers.arrayElement(['ISTJ', 'ENFP', 'INTP']),
      // 更新账户关联关系
      flowerAccount: {
        create: {
          balance: faker.number.int({ min: 0, max: 10000 }),
          transactions: {
            create: Array.from({ length: 5 }, () => ({
              type: faker.helpers.arrayElement(['RECHARGE', 'CONSUME', 'REWARD']),
              amount: faker.number.int({ min: 10, max: 500 }),
              status: 'SUCCESS',
              description: faker.finance.transactionType(),
              preBalance: faker.number.int({ min: 0, max: 1000 }),
              postBalance: faker.number.int({ min: 0, max: 1000 })
            }))
          }
        }
      },
      membership: {
        create: {
          level: faker.number.int({ min: 1, max: 6 }),
          exp: faker.number.int({ min: 0, max: 1000 }),
          validUntil: faker.date.future({ years: 1 }),
          MembershipBenefit: {
            create: {
              benefitType: faker.helpers.arrayElement(['SIGN_IN_BONUS', 'AD_REVENUE_BONUS']),
              value: faker.number.int({ min: 10, max: 50 })
            }
          }
        }
      },
      inviteCodes: {
        create: Array.from({ length: INVITE_CODES_PER_USER }, () => ({
          code: faker.string.alphanumeric(8).toUpperCase(),
          isUsed: faker.datatype.boolean()
        }))
      }
    },
    include: { flowerAccount: true } // 更新包含关系
  });
};

const createSocialRelations = async () => {
  const users = await prisma.user.findMany({
    select: { id: true, flowerAccountId: true } // 更新字段选择
  });

  await prisma.$transaction([
    prisma.message.createMany({
      data: users.flatMap(user => 
        Array.from({ length: MESSAGE_PER_USER }, () => ({
          content: faker.lorem.sentence(),
          flowersUsed: 10,
          senderId: user.id,
          receiverId: faker.helpers.arrayElement(users.filter(u => u.id !== user.id)).id
        }))
      )
    }),
    prisma.invitation.createMany({
      data: users.map(user => ({
        inviterId: user.id,
        inviteeId: faker.helpers.arrayElement(users.filter(u => u.id !== user.id)).id
      }))
    })
  ]);

  await prisma.$transaction(
    users.flatMap(user => [
      ...Array.from({ length: MESSAGE_PER_USER }, () => 
        prisma.transaction.create({
          data: {
            type: 'CONSUME',
            amount: 10,
            status: 'SUCCESS',
            flowerAccountId: user.flowerAccountId!,
            preBalance: faker.number.int({ min: 0, max: 1000 }),
            postBalance: faker.number.int({ min: 0, max: 1000 })
          }
        })
      ),
      prisma.transaction.create({
        data: {
          type: 'REWARD',
          amount: 50,
          status: 'SUCCESS',
          flowerAccountId: user.flowerAccountId!,
          preBalance: faker.number.int({ min: 0, max: 1000 }),
          postBalance: faker.number.int({ min: 0, max: 1000 })
        }
      })
    ])
  );
};

async function main() {
  console.log('🌱 开始数据播种...');
  
  // 更新数据清理顺序（根据外键约束调整）
  await prisma.$transaction([
    prisma.transaction.deleteMany(),
    prisma.membershipBenefit.deleteMany(),
    prisma.membership.deleteMany(),
    prisma.flowerAccount.deleteMany(), // 更新模型名称
    prisma.user.deleteMany(),
  ]);

  const userPromises = Array(USER_COUNT).fill(null).map(createUser);
  await Promise.all(userPromises);
  
  await createSocialRelations();

  console.log(`✅ 成功生成：
    - ${USER_COUNT} 个用户（含小花账户、会员信息）
    - ${USER_COUNT * INVITE_CODES_PER_USER} 个邀请码
    - ${USER_COUNT * MESSAGE_PER_USER} 条消息
    - ${USER_COUNT} 条邀请关系`);
}

main()
  .catch(e => {
    console.error('❌ 播种失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });