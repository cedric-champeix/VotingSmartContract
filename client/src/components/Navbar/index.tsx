import { Link } from 'react-router-dom';
import { ThemeChanger } from './ThemeChanger';
import { LanguageChanger } from './LanguageChanger';
import { useTranslation } from 'react-i18next';
import { Separator } from '../ui/separator';
import { Briefcase, FileText, House, Info, Mail, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

export const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

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

  // Scroll to specific section with navbar height compensation
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      // Récupérer la hauteur de la navbar
      const navbarHeight = document.querySelector('.navbar')?.clientHeight;

      // Calculer la position de la section avec la compensation
      const position = section.offsetTop - navbarHeight;

      // Faire défiler la page avec le défilement ajusté
      window.scrollTo({
        top: position,
        behavior: 'smooth',
      });

      // Fermer le menu après avoir effectué le défilement
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className='navbar sticky top-0 left-0 bg-background right-0 z-50 border-b-2 border-primary'>
        {/* Display only on screens larger than 'sm' */}
        <div className='hidden md:flex items-center justify-between p-4 text-primary px-8 select-none'>
          <div className='font-extrabold text-3xl'>
            <Link to='/' onClick={() => scrollToSection('home-section')}>
              Crypto TCG
            </Link>
          </div>
          <div className='flex gap-4 items-center'>
            <div className='flex gap-2'>
              <Button onClick={() => scrollToSection('home-section')} variant='link'>
                {t('navbar.home')}
              </Button>
              <Button onClick={() => scrollToSection('about-section')} variant='link'>
                {t('navbar.about')}
              </Button>
              <Button onClick={() => scrollToSection('services-section')} variant='link'>
                {t('navbar.services')}
              </Button>
              <Button onClick={() => scrollToSection('projects-section')} variant='link'>
                {t('navbar.projects')}
              </Button>
              <Button onClick={() => scrollToSection('contact-section')} variant='link'>
                {t('navbar.contact')}
              </Button>
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
            <Button onClick={() => scrollToSection('home-section')} variant='link' className='flex gap-4 items-center justify-start'>
              <House className='w-4 h-4' />
              {t('navbar.home')}
            </Button>
            <Button onClick={() => scrollToSection('about-section')} variant='link' className='flex gap-4 items-center justify-start'>
              <Info className='w-4 h-4' />
              {t('navbar.about')}
            </Button>
            <Button onClick={() => scrollToSection('services-section')} variant='link' className='flex gap-4 items-center justify-start'>
              <Briefcase className='w-4 h-4' />
              {t('navbar.services')}
            </Button>
            <Button onClick={() => scrollToSection('projects-section')} variant='link' className='flex gap-4 items-center justify-start'>
              <FileText className='w-4 h-4' />
              {t('navbar.projects')}
            </Button>
            <Button onClick={() => scrollToSection('contact-section')} variant='link' className='flex gap-4 items-center justify-start'>
              <Mail className='w-4 h-4' />
              {t('navbar.contact')}
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
