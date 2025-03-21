'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { X, Sparkles, ArrowRight, MessageSquare } from 'lucide-react';
import { useMobile } from '@/hooks/component/use-mobile';
import { HeartIcon } from '@/components/heart-icon';
import { StarIcon } from '@/components/star-icon';
import { HeartParticles } from '@/components/heart-particles';

// 模拟用户数据
const potentialMatches = [
  {
    id: 1,
    name: '李小华',
    age: 26,
    avatar: '/placeholder.svg?height=300&width=300&text=李',
    level: 4,
    zodiac: '天秤座',
    mbti: 'ENFJ',
    interests: ['旅行', '摄影', '美食'],
    bio: '喜欢探索新地方，记录美好瞬间。生活中的美食家，旅行中的摄影师。',
    compatibility: 85,
  },
  {
    id: 2,
    name: '王小明',
    age: 28,
    avatar: '/placeholder.svg?height=300&width=300&text=王',
    level: 5,
    zodiac: '射手座',
    mbti: 'INFP',
    interests: ['音乐', '电影', '阅读'],
    bio: '音乐是我生活的调味剂，电影是我了解世界的窗口。喜欢安静的阅读时光。',
    compatibility: 92,
  },
  {
    id: 3,
    name: '张小红',
    age: 25,
    avatar: '/placeholder.svg?height=300&width=300&text=张',
    level: 3,
    zodiac: '双子座',
    mbti: 'ENTP',
    interests: ['健身', '烹饪', '绘画'],
    bio: '热爱生活，享受运动带来的活力。闲暇时喜欢下厨，偶尔涂鸦记录生活。',
    compatibility: 78,
  },
  {
    id: 4,
    name: '陈小琳',
    age: 27,
    avatar: '/placeholder.svg?height=300&width=300&text=陈',
    level: 4,
    zodiac: '水瓶座',
    mbti: 'INTJ',
    interests: ['编程', '科技', '游戏'],
    bio: '科技爱好者，喜欢探索新技术。游戏是放松的方式，编程是实现创意的工具。',
    compatibility: 88,
  },
];

export default function MatchPage() {
  const { isMobile, isTablet } = useMobile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [matchedUser, setMatchedUser] = useState<
    (typeof potentialMatches)[0] | null
  >(null);
  const [likedUsers, setLikedUsers] = useState<number[]>([]);

  const cardVariants = {
    initial: (direction: string) => {
      return direction === 'right'
        ? { x: 300, opacity: 0, scale: 0.5, rotateZ: 10 }
        : direction === 'left'
          ? { x: -300, opacity: 0, scale: 0.5, rotateZ: -10 }
          : { scale: 0.8, opacity: 0 };
    },
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateZ: 0,
      transition: { duration: 0.3 },
    },
    exit: (direction: string) => {
      return direction === 'right'
        ? {
            x: 300,
            opacity: 0,
            scale: 0.5,
            rotateZ: 10,
            transition: { duration: 0.3 },
          }
        : {
            x: -300,
            opacity: 0,
            scale: 0.5,
            rotateZ: -10,
            transition: { duration: 0.3 },
          };
    },
  };

  const handleSwipe = (direction: string) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setDirection(direction);

    if (direction === 'right') {
      const newLikedUsers = [...likedUsers, potentialMatches[currentIndex].id];
      setLikedUsers(newLikedUsers);

      // 模拟匹配成功的逻辑 - 这里简单地用高兼容度作为匹配条件
      if (potentialMatches[currentIndex].compatibility > 85) {
        setMatchedUser(potentialMatches[currentIndex]);
        setTimeout(() => {
          setShowMatchAnimation(true);
          // 显示粒子动画
          setTimeout(() => {
            setShowParticles(true);
          }, 500);
        }, 500);
      }
    }

    setTimeout(() => {
      if (currentIndex < potentialMatches.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // 重置到第一个用户，实际应用中可能需要加载更多用户
        setCurrentIndex(0);
      }
      setDirection(null);
      setIsAnimating(false);
    }, 300);
  };

  const currentUser = potentialMatches[currentIndex];

  // 根据设备类型设置不同的样式和尺寸
  const cardHeight = isMobile ? 'h-[500px]' : 'h-[600px]';
  const imageHeight = isMobile ? 'h-[250px]' : 'h-[350px]';
  const buttonSize = isMobile ? 'h-12 w-12' : 'h-14 w-14';
  const iconSize = isMobile ? 'h-5 w-5' : 'h-6 w-6';
  const textSize = isMobile ? 'text-xs' : 'text-sm';
  const headingSize = isMobile ? 'text-lg' : 'text-xl';

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-serif font-bold text-center mb-6">
          缘分配对
        </h1>

        <div className={`relative ${cardHeight} w-full`}>
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute w-full h-full"
            >
              <Card className="w-full h-full overflow-hidden border-light-lilac border-2 glassmorphism">
                <div
                  className={`relative ${imageHeight} bg-gradient-to-b from-mint-mambo/20 to-background`}
                >
                  <img
                    src={currentUser.avatar || '/placeholder.svg'}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="glassmorphism text-white p-2 rounded-lg">
                      <h3 className={`${headingSize} font-serif font-bold`}>
                        {currentUser.name}, {currentUser.age}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className="bg-mint-mambo/50 text-white border-none"
                        >
                          {currentUser.zodiac}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-mint-mambo/50 text-white border-none"
                        >
                          {currentUser.mbti}
                        </Badge>
                      </div>
                    </div>
                    <div className="glassmorphism text-white p-2 rounded-full">
                      <Badge className="bg-soft-peach border-none text-foreground">
                        心动指数 {currentUser.compatibility}%
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="mb-4">
                    <h4
                      className={`${textSize} font-serif font-semibold text-muted-foreground mb-2`}
                    >
                      兴趣爱好
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentUser.interests.map((interest, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className={textSize}
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4
                      className={`${textSize} font-serif font-semibold text-muted-foreground mb-2`}
                    >
                      个人介绍
                    </h4>
                    <p className={textSize}>{currentUser.bio}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-4 border-t">
                  <Button
                    onClick={() => handleSwipe('left')}
                    variant="outline"
                    size="icon"
                    className={`${buttonSize} rounded-full border-2 border-destructive`}
                  >
                    <X
                      className={`${iconSize} text-destructive icon-outline`}
                    />
                  </Button>

                  <Button className="bg-calm-blue hover:bg-calm-blue/90 text-white glassmorphism">
                    <MessageSquare className="h-4 w-4 mr-2 icon-outline" />
                    发送消息
                  </Button>

                  <Button
                    onClick={() => handleSwipe('right')}
                    variant="outline"
                    size="icon"
                    className={`${buttonSize} rounded-full border-2 border-soft-peach bg-soft-peach/10`}
                  >
                    <HeartIcon className={`${iconSize} text-soft-peach`} />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 匹配成功动画 */}
        <AnimatePresence>
          {showMatchAnimation && matchedUser && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
            >
              <HeartParticles
                show={showParticles}
                onComplete={() => setShowParticles(false)}
              />

              <div className="bg-background rounded-xl p-4 sm:p-6 max-w-sm w-full text-center border-2 border-light-lilac glassmorphism">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5, times: [0, 0.8, 1] }}
                >
                  <Sparkles
                    className={`${isMobile ? 'h-12 w-12' : 'h-16 w-16'} text-gold animate-pulse-gold`}
                  />
                </motion.div>
                <motion.h2
                  className={`${isMobile ? 'text-xl' : 'text-2xl'} font-serif font-bold mb-4`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  匹配成功！
                </motion.h2>
                <motion.div
                  className="flex justify-center gap-4 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="relative">
                    <Avatar
                      className={`${isMobile ? 'h-16 w-16' : 'h-20 w-20'} border-4 border-mint-mambo avatar-glassmorphism animate-float`}
                    >
                      <AvatarImage
                        src="/placeholder.svg?height=80&width=80&text=你"
                        alt="你"
                      />
                      <AvatarFallback>你</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex items-center">
                    <HeartIcon
                      className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-gold animate-pulse-gold`}
                      filled
                    />
                  </div>
                  <div className="relative">
                    <Avatar
                      className={`${isMobile ? 'h-16 w-16' : 'h-20 w-20'} border-4 border-mint-mambo avatar-glassmorphism animate-float`}
                      style={{ animationDelay: '0.3s' }}
                    >
                      <AvatarImage
                        src={matchedUser.avatar}
                        alt={matchedUser.name}
                      />
                      <AvatarFallback>{matchedUser.name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                </motion.div>
                <motion.p
                  className="text-sm text-muted-foreground mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  你与{matchedUser.name}的匹配度高达{matchedUser.compatibility}
                  %！现在可以开始聊天了。
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex gap-4"
                >
                  <Button
                    className="w-full bg-calm-blue hover:bg-calm-blue/90 glassmorphism"
                    onClick={() => {
                      setShowMatchAnimation(false);
                      setShowParticles(false);
                    }}
                  >
                    开始聊天{' '}
                    <ArrowRight className="ml-2 h-4 w-4 icon-outline" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-auto bg-light-yellow/20 border-light-yellow hover:bg-light-yellow/30"
                    onClick={() => {
                      setShowMatchAnimation(false);
                      setShowParticles(false);
                    }}
                  >
                    <StarIcon className="h-4 w-4 text-light-yellow" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
