const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 引入必要的模块
const { faker } = require('@faker-js/faker');
const _ = require('lodash');

// 定义随机数据生成函数
async function generateRandomData() {
  // 清空现有数据
  await prisma.$executeRaw`TRUNCATE TABLE "User", "Account", "Membership", "Message", "InviteCode", "Invitation", "Transaction", "DailyCheckIn", "AdViewLog", "MembershipBenefit", "UserActionLog" RESTART IDENTITY CASCADE;`;

  // 生成用户数据
  const users = [];
  for (let i = 0; i < 100; i++) {
    const user = {
      id: faker.string.uuid(),
      phone: faker.phone.number('1##########'),
      email: faker.internet.email(),
      idNumber: faker.string.uuid().replace(/-/g, ''),
      name: faker.person.fullName(),
      age: faker.number.int({ min: 18, max: 60 }),
      role: _.sample(['USER', 'ADMIN', 'SUPER_ADMIN']),
      gender: _.sample(['MALE', 'FEMALE']),
      height: faker.number.int({ min: 150, max: 200 }),
      education: _.sample([
        'PRIMARY_SCHOOL',
        'JUNIOR_HIGH_SCHOOL',
        'HIGH_SCHOOL',
        'BACHELOR',
        'MASTER',
        'DOCTOR',
      ]),
      occupation: faker.person.jobTitle(),
      income: faker.number.int({ min: 5, max: 50 }),
      region: faker.location.city(),
      maritalStatus: _.sample(['SINGLE', 'DIVORCED', 'WIDOWED', 'PARENT']),
      hobbies: faker.word.noun().split(', '),
      photos: [faker.image.avatar()],
      constellation: _.sample([
        'ARIES',
        'TAURUS',
        'GEMINI',
        'CANCER',
        'LEO',
        'VIRGO',
        'LIBRA',
        'SCORPIO',
        'SAGITTARIUS',
        'CAPRICORN',
        'AQUARIUS',
        'PISCES',
      ]),
      mbti: _.sample([
        'ISTJ',
        'ISFJ',
        'INFJ',
        'INTJ',
        'ISTP',
        'ISFP',
        'INFP',
        'INTP',
        'ESTP',
        'ESFP',
        'ENFP',
        'ENTP',
        'ESTJ',
        'ESFJ',
        'ENFJ',
        'ENTJ',
      ]),
      isProfileVisible: faker.datatype.boolean(),
    };
    users.push(user);
  }
  await prisma.user.createMany({ data: users });

  // 生成用户账户数据
  const accounts = [];
  const usersWithId = await prisma.user.findMany({ select: { id: true } });
  for (const user of usersWithId) {
    const account = {
      id: faker.string.uuid(),
      balance: faker.number.int({ min: 0, max: 10000 }),
      user: {
        connect: { id: user.id }, // 关联用户
      },
    };
    accounts.push(account);
  }
  await prisma.account.createMany({ data: accounts });

  // 生成会员等级数据
  const memberships = [];
  for (const user of usersWithId) {
    const membership = {
      id: faker.string.uuid(),
      level: faker.number.int({ min: 1, max: 10 }),
      exp: faker.number.int({ min: 0, max: 10000 }),
      validUntil: faker.date.future().toISOString(),
      userId: user.id,
    };
    memberships.push(membership);
  }
  await prisma.membership.createMany({ data: memberships });

  // 生成消息数据
  const messages = [];
  const usersWithIds = await prisma.user.findMany({ select: { id: true } });
  for (let i = 0; i < 500; i++) {
    const sender = _.sample(usersWithIds);
    const receiver = _.sample(_.without(usersWithIds, sender));
    const message = {
      id: faker.string.uuid(),
      content: faker.lorem.paragraph(),
      flowersUsed: faker.number.int({ min: 10, max: 100 }),
      senderId: sender.id,
      receiverId: receiver.id,
      isRead: faker.datatype.boolean(),
    };
    messages.push(message);
  }
  await prisma.message.createMany({ data: messages });

  // 生成邀请码数据
  const inviteCodes = [];
  for (let i = 0; i < 200; i++) {
    const creator = _.sample(usersWithIds);
    const inviteCode = {
      id: faker.string.uuid(),
      code: faker.string.alpha({ length: 8 }).toUpperCase(),
      creatorId: creator.id,
      isUsed: faker.datatype.boolean(),
    };
    inviteCodes.push(inviteCode);
  }
  await prisma.inviteCode.createMany({ data: inviteCodes });

  // 生成邀请关系数据
  const invitations = [];
  for (let i = 0; i < 300; i++) {
    const inviter = _.sample(usersWithIds);
    const invitee = _.sample(_.without(usersWithIds, inviter));
    const invitation = {
      id: faker.string.uuid(),
      inviterId: inviter.id,
      inviteeId: invitee.id,
      flowersAwarded: faker.datatype.boolean(),
    };
    invitations.push(invitation);
  }
  await prisma.invitation.createMany({ data: invitations });

  // 生成交易数据
  const transactions = [];
  const accountsWithIds = await prisma.account.findMany({
    select: { id: true, userId: true },
  });
  for (let i = 0; i < 1000; i++) {
    const account = _.sample(accountsWithIds);
    const transaction = {
      id: faker.string.uuid(),
      type: _.sample([
        'RECHARGE',
        'CONSUME',
        'REWARD',
        'REFUND',
        'TRANSFER',
        'AD_REVENUE',
      ]),
      amount: faker.number.int({ min: 10, max: 1000 }),
      status: _.sample(['PENDING', 'SUCCESS', 'FAILED', 'ROLLBACK']),
      description: faker.lorem.sentence(),
      metadata: JSON.stringify({ adId: faker.string.uuid() }),
      preBalance: faker.number.int({ min: 0, max: 10000 }),
      postBalance: faker.number.int({ min: 0, max: 10000 }),
      accountId: account.id,
      userId: account.userId,
    };
    transactions.push(transaction);
  }
  await prisma.transaction.createMany({ data: transactions });

  // 生成每日签到数据
  const dailyCheckIns = [];
  for (const user of usersWithIds) {
    for (let i = 0; i < 30; i++) {
      const date = faker.date.between({ from: '2023-01-01', to: '2023-12-31' });
      const dailyCheckIn = {
        id: faker.string.uuid(),
        userId: user.id,
        date: date.toISOString().split('T')[0],
      };
      dailyCheckIns.push(dailyCheckIn);
    }
  }
  await prisma.dailyCheckIn.createMany({ data: dailyCheckIns });

  // 生成广告观看记录数据
  const adViewLogs = [];
  for (let i = 0; i < 800; i++) {
    const user = _.sample(usersWithIds);
    const adViewLog = {
      id: faker.string.uuid(),
      userId: user.id,
      adId: faker.string.uuid(),
      status: _.sample(['PENDING', 'SUCCESS', 'FAILED']),
      metadata: JSON.stringify({
        duration: faker.number.int({ min: 10, max: 60 }),
        type: faker.hacker.adjective(),
      }),
    };
    adViewLogs.push(adViewLog);
  }
  await prisma.adViewLog.createMany({ data: adViewLogs });

  // 生成会员权益数据
  const membershipBenefits = [];
  const membershipsWithIds = await prisma.membership.findMany({
    select: { id: true },
  });
  for (const membership of membershipsWithIds) {
    const benefitTypes = [
      'SIGN_IN_BONUS',
      'AD_REVENUE_BONUS',
      'MESSAGE_DISCOUNT',
      'DAILY_FLOWER_CAP',
    ];
    for (const benefitType of benefitTypes) {
      const membershipBenefit = {
        id: faker.string.uuid(),
        membershipId: membership.id,
        benefitType: benefitType,
        value: faker.number.int({ min: 1, max: 100 }),
        validFrom: faker.date.past().toISOString(),
        validUntil: faker.date.future().toISOString(),
        description: faker.lorem.sentence(),
      };
      membershipBenefits.push(membershipBenefit);
    }
  }
  await prisma.membershipBenefit.createMany({ data: membershipBenefits });

  // 生成用户行为日志数据
  const userActionLogs = [];
  const actionTypes = [
    'LOGIN',
    'LOGOUT',
    'SEND_MESSAGE',
    'VIEW_AD',
    'SIGN_IN',
    'VIEW_PROFILE',
    'UPDATE_INFO',
  ];
  for (let i = 0; i < 1500; i++) {
    const user = _.sample(usersWithIds);
    const userActionLog = {
      id: faker.string.uuid(),
      userId: user.id,
      actionType: _.sample(actionTypes),
      ipAddress: faker.internet.ip(),
      deviceInfo: JSON.stringify({
        os: faker.system.platform(),
        browser: faker.internet.userAgent(),
        device: faker.hacker.noun(),
      }),
      details: JSON.stringify({
        messageLength: faker.number.int({ min: 10, max: 1000 }),
      }),
    };
    userActionLogs.push(userActionLog);
  }
  await prisma.userActionLog.createMany({ data: userActionLogs });

  console.log('随机数据生成完成！');
}

// 执行数据生成函数
generateRandomData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
