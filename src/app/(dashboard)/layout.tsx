import type React from 'react';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Bell,
  Home,
  MessageSquare,
  Search,
  Users,
  Menu,
  User,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ParallaxBackground } from '@/components/parallax-background';
import { HeartIcon } from '@/components/heart-icon';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="{inter.className}">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ParallaxBackground>
            <div className="flex min-h-screen flex-col">
              {/* bg-mint-mambo/80 */}
              <header className="sticky top-0 z-50 w-full border-b glassmorphism bg-mint-mambo/80">
                <div className="container flex h-14 items-center">
                  <Link
                    href="/"
                    className="flex items-center font-serif font-bold text-xl mr-6"
                  >
                    <span className="text-white">缘</span>
                    <span className="text-white">分</span>
                  </Link>

                  {/* Desktop Navigation */}
                  <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
                    <Link
                      href="/"
                      className="flex items-center text-sm font-medium transition-colors text-menu-gray hover:text-white"
                    >
                      <Home className="h-4 w-4 mr-1 icon-outline" />
                      首页
                    </Link>
                    <Link
                      href="/square"
                      className="flex items-center text-sm font-medium transition-colors text-menu-gray hover:text-white"
                    >
                      <Users className="h-4 w-4 mr-1 icon-outline" />
                      广场
                    </Link>
                    <Link
                      href="/match"
                      className="flex items-center text-sm font-medium transition-colors text-menu-gray hover:text-white"
                    >
                      <HeartIcon className="h-4 w-4 mr-1" />
                      匹配
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center text-sm font-medium transition-colors text-menu-gray hover:text-white"
                    >
                      <User className="h-4 w-4 mr-1 icon-outline" />
                      我的
                    </Link>
                  </nav>

                  <div className="ml-auto flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden md:flex text-menu-gray hover:text-white hover:bg-mint-mambo/20"
                    >
                      <Search className="h-5 w-5 icon-outline" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden md:flex text-menu-gray hover:text-white hover:bg-mint-mambo/20"
                    >
                      <Bell className="h-5 w-5 icon-outline" />
                    </Button>
                    <div className="hidden md:block avatar-glassmorphism rounded-full">
                      <Avatar>
                        <AvatarImage
                          src="/placeholder.svg?height=32&width=32"
                          alt="用户"
                        />
                        <AvatarFallback>用户</AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Mobile Menu */}
                    <Sheet>
                      <SheetTrigger asChild className="md:hidden">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-menu-gray hover:text-white hover:bg-mint-mambo/20"
                        >
                          <Menu className="h-5 w-5 icon-outline" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent
                        side="right"
                        className="w-[80vw] sm:w-[350px] glassmorphism"
                      >
                        <div className="flex flex-col h-full">
                          <div className="flex items-center justify-between py-4 border-b">
                            <div className="flex items-center gap-2">
                              <div className="avatar-glassmorphism rounded-full">
                                <Avatar>
                                  <AvatarImage
                                    src="/placeholder.svg?height=32&width=32"
                                    alt="用户"
                                  />
                                  <AvatarFallback>用户</AvatarFallback>
                                </Avatar>
                              </div>
                              <div>
                                <p className="font-medium font-serif">张小明</p>
                                <p className="text-xs text-muted-foreground">
                                  查看个人资料
                                </p>
                              </div>
                            </div>
                          </div>

                          <nav className="flex flex-col gap-1 py-4">
                            <Link
                              href="/"
                              className="flex items-center gap-3 px-4 py-3 text-sm rounded-md hover:bg-muted"
                            >
                              <Home className="h-5 w-5 icon-outline" />
                              首页
                            </Link>
                            <Link
                              href="/square"
                              className="flex items-center gap-3 px-4 py-3 text-sm rounded-md hover:bg-muted"
                            >
                              <Users className="h-5 w-5 icon-outline" />
                              广场
                            </Link>
                            <Link
                              href="/match"
                              className="flex items-center gap-3 px-4 py-3 text-sm rounded-md hover:bg-muted"
                            >
                              <HeartIcon className="h-5 w-5" />
                              匹配
                            </Link>
                            <Link
                              href="/profile"
                              className="flex items-center gap-3 px-4 py-3 text-sm rounded-md hover:bg-muted"
                            >
                              <User className="h-5 w-5 icon-outline" />
                              我的
                            </Link>
                          </nav>

                          <div className="mt-auto border-t py-4">
                            <div className="flex items-center justify-between px-4">
                              <Button variant="ghost" size="icon">
                                <Search className="h-5 w-5 icon-outline" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Bell className="h-5 w-5 icon-outline" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <MessageSquare className="h-5 w-5 icon-outline" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </header>

              {/* Mobile Bottom Navigation */}
              <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t glassmorphism">
                <div className="flex justify-around items-center h-16">
                  <Link
                    href="/"
                    className="flex flex-col items-center justify-center w-full py-2 text-menu-gray"
                  >
                    <Home className="h-5 w-5 icon-outline" />
                    <span className="text-xs mt-1">首页</span>
                  </Link>
                  <Link
                    href="/square"
                    className="flex flex-col items-center justify-center w-full py-2 text-menu-gray"
                  >
                    <Users className="h-5 w-5 icon-outline" />
                    <span className="text-xs mt-1">广场</span>
                  </Link>
                  <Link
                    href="/match"
                    className="flex flex-col items-center justify-center w-full py-2 text-menu-gray"
                  >
                    <HeartIcon className="h-5 w-5" />
                    <span className="text-xs mt-1">匹配</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="flex flex-col items-center justify-center w-full py-2 text-menu-gray"
                  >
                    <User className="h-5 w-5 icon-outline" />
                    <span className="text-xs mt-1">我的</span>
                  </Link>
                </div>
              </div>

              <main className="flex-1 pb-16 md:pb-0">{children}</main>
              <footer className="border-t py-4 text-center text-sm text-muted-foreground hidden md:block">
                © {new Date().getFullYear()}{' '}
                <span className="font-serif">缘分相亲网</span>. 保留所有权利.
              </footer>
            </div>
          </ParallaxBackground>
        </ThemeProvider>
      </body>
    </html>
  );
}
