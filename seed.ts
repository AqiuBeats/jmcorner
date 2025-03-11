// prisma/seed.ts
import { faker } from '@faker-js/faker/locale/zh_CN';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 配置中文数据生成（新版locale配置更规范）
faker.seed(2025); // 固定随机种子保证数据可复现

// 生成器配置
const USER_COUNT = 50;
const MESSAGE_PER_USER = 3;
const INVITE_CODES_PER_USER = 2;

// 类型增强
type GenderType = 'MALE' | 'FEMALE';
type EducationType = 'PRIMARY_SCHOOL' | 'JUNIOR_HIGH_SCHOOL' | 'HIGH_SCHOOL' | 'BACHELOR' | 'MASTER' | 'DOCTOR';

// 核心数据生成器（更新模块路径和方法）
const createUser = async () => {
    return prisma.user.create({
      data: {
        phone: `+86 ${faker.string.numeric(10)}`, // 生成 +86 13xxxxxxxx 格式
        email: faker.internet.email({
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          provider: 'example.com'
        }),
        idNumber: faker.helpers.replaceSymbols('11010119######??'),
        name: faker.person.fullName(),
        age: faker.number.int({ min: 18, max: 60 }),
        role: faker.helpers.arrayElement(['USER', 'ADMIN']),
        gender: faker.helpers.arrayElement(['MALE', 'FEMALE']) as GenderType,
        height: faker.number.int({ min: 150, max: 190 }),
        education: faker.helpers.arrayElement(['BACHELOR', 'MASTER']) as EducationType,
        occupation: faker.person.jobTitle(),
        income: faker.number.int({ min: 5, max: 200 }),
        region: `${faker.location.state()} ${faker.location.city()}`,
        maritalStatus: faker.helpers.arrayElement(['SINGLE', 'DIVORCED', 'PARENT']),
        hobbies: Array.from({ length: 5 }, () => faker.word.noun()),
        photos: Array.from({ length: 3 }, () => faker.image.avatar()),
        constellation: faker.helpers.arrayElement(['ARIES', 'TAURUS', 'GEMINI']),
        mbti: faker.helpers.arrayElement(['ISTJ', 'ENFP', 'INTP']),
        account: {
          create: {
            balance: faker.number.int({ min: 0, max: 10000 }),
            transactions: {
              create: Array.from({ length: 5 }, () => ({
                type: faker.helpers.arrayElement(['RECHARGE', 'CONSUME', 'REWARD']),
                amount: faker.number.int({ min: 10, max: 500 }),
                status: 'SUCCESS',
                description: faker.finance.transactionType(),
                preBalance: faker.number.int({ min: 0, max: 1000 }), // 新增
                postBalance: faker.number.int({ min: 0, max: 1000 }) // 新增
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
      include: { account: true }
    });
  };

// 生成社交关系数据（保持核心逻辑，更新细节方法）
const createSocialRelations = async () => {
  const users = await prisma.user.findMany({
    select: { id: true, accountId: true }
  });

  // 使用更高效的批量插入方式
  await prisma.$transaction([
    prisma.message.createMany({
      data: users.flatMap(user => 
        Array.from({length:MESSAGE_PER_USER}, () => ({
          content: faker.lorem.sentence(),
          flowersUsed: 10,
          senderId: user.id,
          receiverId: faker.helpers.arrayElement(users.filter(u => u.id !== user.id)).id,
          transactionId: undefined
        }))
      )
    }),
    prisma.invitation.createMany({
      data: users.map(user => ({
        inviterId: user.id,
        inviteeId: faker.helpers.arrayElement(users.filter(u => u.id !== user.id)).id,
        transactionId: undefined
      }))
    })
  ]);

  // 单独处理交易记录（需要关联数据）
  await prisma.$transaction(
    users.flatMap(user => [
      ...Array.from({length:MESSAGE_PER_USER}, () => 
        prisma.transaction.create({
          data: {
            type: 'CONSUME',
            amount: 10,
            status: 'SUCCESS',
            accountId: user.accountId!,
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
          accountId: user.accountId!,
          preBalance: faker.number.int({ min: 0, max: 1000 }),
          postBalance: faker.number.int({ min: 0, max: 1000 })
        }
      })
    ])
  );
};

// 主种子逻辑
async function main() {
    console.log('🌱 开始数据播种...');
    
    // 清空现有数据（生产环境慎用）
    await prisma.$transaction([
      prisma.transaction.deleteMany(),
      prisma.membershipBenefit.deleteMany(),
      prisma.membership.deleteMany(),
      prisma.account.deleteMany(),
      prisma.user.deleteMany(),
    ]);
  
    // 批量生成用户（包含嵌套关系）
    const userPromises = Array(USER_COUNT).fill(null).map(createUser);
    await Promise.all(userPromises);
    
    // 生成社交关系
    await createSocialRelations();
  
    console.log(`✅ 成功生成：
    - ${USER_COUNT} 个用户（含账户、会员信息）
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
