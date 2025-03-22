'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Camera, MessageCircle, Share2, ThumbsUp } from 'lucide-react';
import { useMobile } from '@/hooks/component/use-mobile';
import { StarIcon } from '@/components/star-icon';

export default function ProfilePage() {
  const { isMobile, isTablet } = useMobile();
  const [thoughts, setThoughts] = useState<{ text: string; date: Date }[]>([
    { text: '今天天气真好！', date: new Date() },
    {
      text: '刚看了一部很感人的电影...',
      date: new Date(Date.now() - 86400000),
    },
  ]);
  const [newThought, setNewThought] = useState('');
  const [checkedIn, setCheckedIn] = useState(false);

  const handlePostThought = () => {
    if (newThought.trim()) {
      setThoughts([{ text: newThought, date: new Date() }, ...thoughts]);
      setNewThought('');
    }
  };

  const handleCheckIn = () => {
    setCheckedIn(true);
    // Here you would typically call an API to record the check-in
  };

  return (
    <div className="container mx-auto py-6">
      <div
        className={`grid ${isMobile || isTablet ? 'grid-cols-1' : 'grid-cols-3'} gap-6`}
      >
        {/* Left sidebar - User info */}
        <div className="space-y-4">
          <Card className="border-light-lilac glassmorphism">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-4">
                <div className="avatar-glassmorphism rounded-full h-20 w-20 border-4 border-mint-mambo/20">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src="/placeholder.svg?height=80&width=80"
                      alt="User"
                    />
                    <AvatarFallback>用户</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <CardTitle className="text-xl font-serif">张小明</CardTitle>
                  <div className="flex items-center mt-1">
                    <Badge className="bg-soft-peach text-foreground border-none">
                      Lv4
                    </Badge>
                    <span className="ml-2 text-sm text-muted-foreground">
                      积分: 2580
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">星座:</span>
                  <span>天秤座</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MBTI:</span>
                  <span>ENFP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">兴趣爱好:</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    <Badge variant="secondary" className="text-xs">
                      旅行
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      摄影
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      美食
                    </Badge>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-sm italic font-serif">
                    "生活就像一盒巧克力，你永远不知道下一块是什么味道"
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              {!checkedIn ? (
                <Button
                  onClick={handleCheckIn}
                  className="w-full bg-calm-blue hover:bg-calm-blue/90 glassmorphism"
                >
                  今日签到
                </Button>
              ) : (
                <Button disabled className="w-full">
                  已签到{' '}
                  <StarIcon className="ml-2 h-4 w-4 text-light-yellow" filled />
                </Button>
              )}
              <Button
                variant="outline"
                className="bg-light-yellow/20 border-light-yellow hover:bg-light-yellow/30"
              >
                <StarIcon className="h-4 w-4 text-light-yellow" />
              </Button>
            </CardFooter>
          </Card>

          {/* 相册卡片 - 在移动端可以选择性隐藏或简化 */}
          {(!isMobile || (isMobile && !isTablet)) && (
            <Card className="border-light-lilac glassmorphism">
              <CardHeader>
                <CardTitle className="text-lg font-serif">我的相册</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-md overflow-hidden"
                    >
                      <img
                        src={`/placeholder.svg?height=80&width=80&text=照片${i}`}
                        alt={`照片${i}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  查看全部
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Main content */}
        <div className={isMobile || isTablet ? '' : 'col-span-2'}>
          <div className="space-y-6">
            {/* Post new thought */}
            <Card className="border-light-lilac glassmorphism">
              <CardHeader>
                <CardTitle className="text-lg font-serif">发表动态</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="thought">
                  <TabsList className="mb-4">
                    <TabsTrigger value="thought">发想法</TabsTrigger>
                    <TabsTrigger value="journal">写日志</TabsTrigger>
                  </TabsList>
                  <TabsContent value="thought">
                    <div className="space-y-4">
                      <Textarea
                        placeholder="分享你的想法..."
                        value={newThought}
                        onChange={(e) => setNewThought(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-between">
                        <Button variant="outline" size="icon">
                          <Camera className="h-4 w-4 icon-outline" />
                        </Button>
                        <Button
                          className="bg-calm-blue hover:bg-calm-blue/90 glassmorphism"
                          onClick={handlePostThought}
                        >
                          发布
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="journal">
                    <div className="space-y-4">
                      <div className="border rounded-md p-2">
                        <div className="border-b pb-2 mb-2">
                          <input
                            type="text"
                            placeholder="日志标题"
                            className="w-full p-2 outline-none font-serif"
                          />
                        </div>
                        <div className="min-h-[200px] p-2">
                          <textarea
                            placeholder="写下你的日志内容..."
                            className="w-full h-full outline-none resize-none"
                          />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon">
                            <Camera className="h-4 w-4 icon-outline" />
                          </Button>
                        </div>
                        <Button className="bg-calm-blue hover:bg-calm-blue/90 glassmorphism">
                          发布日志
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Thoughts feed */}
            <div className="space-y-4">
              {thoughts.map((thought, index) => (
                <Card key={index} className="border-light-lilac glassmorphism">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="avatar-glassmorphism rounded-full">
                          <Avatar>
                            <AvatarImage
                              src="/placeholder.svg?height=40&width=40"
                              alt="User"
                            />
                            <AvatarFallback>用户</AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <CardTitle className="text-base font-serif">
                            张小明
                          </CardTitle>
                          <CardDescription>
                            {new Date(thought.date).toLocaleString('zh-CN', {
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{thought.text}</p>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <div className="flex justify-between w-full text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <ThumbsUp className="h-4 w-4 icon-outline" />
                        {isMobile ? <span>12</span> : <span>赞 (12)</span>}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <MessageCircle className="h-4 w-4 icon-outline" />
                        {isMobile ? <span>3</span> : <span>评论 (3)</span>}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Share2 className="h-4 w-4 icon-outline" />
                        {!isMobile && <span>分享</span>}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
