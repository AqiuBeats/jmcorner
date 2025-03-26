'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
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
import { Calendar, MessageCircle, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { useMobile } from '@/hooks/component/use-mobile';
import { HeartIcon } from '@/components/heart-icon';
import { StarIcon } from '@/components/star-icon';
import Image from 'next/image';

export default function SquarePage() {
  const { isMobile, isTablet } = useMobile();
  const [activeTab, setActiveTab] = useState('recommend');

  const posts = [
    {
      id: 1,
      user: {
        name: '李小华',
        avatar: '/placeholder.svg?height=40&width=40&text=李',
        level: 3,
      },
      type: 'thought',
      content: '今天去了一家新开的咖啡店，环境很不错，推荐大家去尝试一下！',
      images: ['/placeholder.svg?height=200&width=400&text=咖啡店照片'],
      likes: 45,
      comments: 12,
      date: new Date(Date.now() - 3600000 * 2),
    },
    {
      id: 2,
      user: {
        name: '王大明',
        avatar: '/placeholder.svg?height=40&width=40&text=王',
        level: 5,
      },
      type: 'journal',
      title: '我的旅行日记 - 云南之行',
      content:
        '上周末去了云南，风景真的太美了！大理的洱海、丽江的古城，每一处都让人流连忘返...',
      images: [
        '/placeholder.svg?height=200&width=400&text=洱海',
        '/placeholder.svg?height=200&width=400&text=丽江古城',
      ],
      likes: 78,
      comments: 23,
      date: new Date(Date.now() - 3600000 * 24),
    },
    {
      id: 3,
      user: {
        name: '张小红',
        avatar: '/placeholder.svg?height=40&width=40&text=张',
        level: 4,
      },
      type: 'thought',
      content: '最近在学习烘焙，今天尝试做了提拉米苏，成果还不错！',
      images: ['/placeholder.svg?height=200&width=400&text=提拉米苏'],
      likes: 56,
      comments: 18,
      date: new Date(Date.now() - 3600000 * 5),
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif font-bold">广场</h1>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full max-w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recommend">推荐</TabsTrigger>
            <TabsTrigger value="latest">最新</TabsTrigger>
            <TabsTrigger value="hot">热门</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div
        className={`grid ${isMobile || isTablet ? 'grid-cols-1' : 'grid-cols-3'} gap-6`}
      >
        {/* Main content - posts */}
        <div className={isMobile || isTablet ? '' : 'col-span-2'}>
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="border-light-lilac ">
                <CardHeader>
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <div className=" rounded-full">
                        <Avatar>
                          <AvatarImage
                            src={post.user.avatar}
                            alt={post.user.name}
                          />
                          <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <CardTitle className="text-base font-serif">
                            {post.user.name}
                          </CardTitle>
                          <Badge className="ml-2 bg-soft-peach text-foreground border-none">
                            Lv{post.user.level}
                          </Badge>
                        </div>
                        <CardDescription>
                          {post.date.toLocaleString('zh-CN', {
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-light-yellow/20 border-light-yellow hover:bg-light-yellow/30"
                    >
                      <StarIcon className="h-4 w-4 text-light-yellow" />
                    </Button>
                  </div>
                  {post.type === 'journal' && (
                    <h3 className="text-lg font-serif font-semibold mt-2">
                      {post.title}
                    </h3>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{post.content}</p>
                  <div
                    className={`grid gap-2 ${post.images.length > 1 && !isMobile ? 'grid-cols-2' : 'grid-cols-1'}`}
                  >
                    {post.images.map((img, idx) => (
                      <div key={idx} className="rounded-md overflow-hidden">
                        <Image
                          src={img || '/placeholder.svg'}
                          alt={`图片 ${idx + 1}`}
                          className="w-full h-auto object-cover"
                          height={200}
                          width={400}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="flex justify-between w-full text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <ThumbsUp className="h-4 w-4 icon-outline" />
                      {isMobile ? (
                        <span>{post.likes}</span>
                      ) : (
                        <span>赞 ({post.likes})</span>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <MessageCircle className="h-4 w-4 icon-outline" />
                      {isMobile ? (
                        <span>{post.comments}</span>
                      ) : (
                        <span>评论 ({post.comments})</span>
                      )}
                    </Button>
                    <Button
                      className="bg-calm-blue hover:bg-calm-blue/90 text-white "
                      size="sm"
                    >
                      <MessageCircle className="h-4 w-4 mr-1 icon-outline" />
                      发送消息
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Right sidebar - only show on desktop */}
        {!isMobile && !isTablet && (
          <div className="space-y-6">
            <Card className="border-light-lilac ">
              <CardHeader>
                <CardTitle className="text-lg font-serif">热门用户</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    name: '陈小明',
                    avatar: '/placeholder.svg?height=40&width=40&text=陈',
                    level: 6,
                  },
                  {
                    name: '林小华',
                    avatar: '/placeholder.svg?height=40&width=40&text=林',
                    level: 5,
                  },
                  {
                    name: '赵小红',
                    avatar: '/placeholder.svg?height=40&width=40&text=赵',
                    level: 5,
                  },
                ].map((user, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className=" rounded-full">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <p className="text-sm font-medium font-serif">
                          {user.name}
                        </p>
                        <Badge className="bg-soft-peach text-foreground border-none">
                          Lv{user.level}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-light-yellow/20 border-light-yellow hover:bg-light-yellow/30"
                      >
                        <StarIcon className="h-4 w-4 text-light-yellow" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-soft-peach bg-soft-peach/10 hover:bg-soft-peach/20"
                      >
                        <HeartIcon className="h-4 w-4 text-soft-peach" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-light-lilac ">
              <CardHeader>
                <CardTitle className="text-lg font-serif">今日推荐</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: '如何提高自己的社交能力？', views: 1245 },
                  { title: '十个约会必去的浪漫地点', views: 986 },
                  { title: '如何写一份吸引人的个人介绍', views: 756 },
                ].map((article, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <Link href="#" className="text-sm hover:underline">
                      {article.title}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {article.views} 阅读
                    </span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  查看更多
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-light-lilac ">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center font-serif">
                  <Calendar className="h-5 w-5 mr-2 icon-outline" />
                  每日签到
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 30 }, (_, i) => (
                    <div
                      key={i}
                      className={`aspect-square flex items-center justify-center rounded-md text-xs
                        ${i < 15 ? 'bg-mint-mambo/20 text-mint-mambo' : 'bg-muted text-muted-foreground'}`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center text-sm">
                  <p>
                    已连续签到{' '}
                    <span className="font-bold text-mint-mambo">15</span> 天
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    再签到5天可获得特别奖励
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-calm-blue hover:bg-calm-blue/90 ">
                  立即签到
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>

      {/* 移动端签到卡片 - 只在移动端显示 */}
      {isMobile && (
        <Card className="mt-6 border-light-lilac ">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center font-serif">
              <Calendar className="h-5 w-5 mr-2 icon-outline" />
              每日签到
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center py-4">
              <Button
                size="lg"
                className="w-full max-w-xs bg-calm-blue hover:bg-calm-blue/90 "
              >
                立即签到
              </Button>
            </div>
            <p className="text-center text-sm">
              已连续签到 <span className="font-bold text-mint-mambo">15</span>{' '}
              天
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
