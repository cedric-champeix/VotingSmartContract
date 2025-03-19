import { Link, useNavigate } from 'react-router-dom';
import { ThemeChanger } from './ThemeChanger';
import { LanguageChanger } from './LanguageChanger';
import { useTranslation } from 'react-i18next';
import { Separator } from '../ui/separator';
import { Briefcase, FileText, House, Info, LogOut, Mail, Menu, PersonStanding, StickyNote, Users, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useLogout } from '@/hooks/useLogout';
import { useWeb3 } from '@/hooks/useWeb3';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from '../ui/dropdown-menu';

export const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const { logout, loading } = useLogout();
  const { account } = useWeb3();

  // Handle clicks outside of the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <div className='navbar sticky top-0 left-0 bg-background right-0 z-50 border-b-2 border-primary'>
        {/* Display only on screens larger than 'sm' */}
        <div className='hidden md:flex items-center justify-between p-4 text-primary px-8 select-none'>
          <div className='font-extrabold text-3xl' style={{ fontFamily: 'Antic Didone, serif' }}>
            <Link to='/' onClick={() => navigate('/')}>
              Crypto TCG
            </Link>
          </div>
          <div className='flex gap-4 items-center'>
            <div className='flex gap-12 items-center'>
              <Link to='/about' onClick={() => navigate('/about')}>
                {t('navbar.about')}
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarFallback className='bg-gray-200 dark:bg-gray-800'>{account.slice(0, 3)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-40'>
                  <DropdownMenuLabel>{t('navbar.myAccount')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className='flex gap-4 items-center justify-start' onClick={() => logout()}>
                      {t('navbar.logout')}
                      <LogOut className='w-4 h-4' />
                      <DropdownMenuShortcut></DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Separator orientation='vertical' className='h-6' />
            <div className='flex gap-4 items-center justify-between'>
              <LanguageChanger />
              <ThemeChanger />
            </div>
          </div>
        </div>

        {/* Mobile Navbar with Hamburger Menu */}
        <div className='flex md:hidden justify-between items-center p-4'>
          <div className='font-extrabold text-3xl'>
            <Link to='/'>Crypto TCG</Link>
          </div>
          <Menu onClick={() => setIsOpen(!isOpen)} className='cursor-pointer' />
        </div>

        {/* Hamburger Menu Dropdown */}
        <div
          ref={menuRef}
          className={cn(
            'fixed top-0 right-0 w-4/5 h-screen overflow-hidden bg-background text-primary transition-transform duration-300 ease-in-out z-20',
            isOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className='flex justify-end'>
            <X onClick={() => setIsOpen(!isOpen)} className='m-4 cursor-pointer' />
          </div>

          <div className='flex flex-col gap-4 p-8 pt-2'>
            <Button
              onClick={() => {
                navigate('/');
                setIsOpen(false);
              }}
              variant='link'
              className='flex gap-4 items-center justify-start'
            >
              <House className='w-4 h-4' />
              {t('navbar.home')}
            </Button>

            <Button
              onClick={() => {
                navigate('/about');
                setIsOpen(false);
              }}
              variant='link'
              className='flex gap-4 items-center justify-start'
            >
              <Users className='w-4 h-4' />
              {t('navbar.about')}
            </Button>
            <Button
              onClick={() => {
                logout();
              }}
              variant='link'
              className='flex gap-4 items-center justify-start'
            >
              <LogOut className='w-4 h-4' />
              {t('navbar.logout')}
            </Button>
            <Separator />
            <div className='flex gap-4 justify-center items-center '>
              <LanguageChanger />
              <ThemeChanger />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
