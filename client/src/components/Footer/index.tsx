import { ArrowUpIcon } from 'lucide-react';
import { Separator } from '../ui/separator';
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <div>
      {/* Section pour mobile */}
      <div className='sm:hidden flex p-4 flex-col gap-8 bg-background text-primary border-t-2 border-primary'>
        <div>
          <p>
            Copyright © {new Date().getFullYear()} {t('footer.copyright.teamName')} <br /> {t('footer.copyright.rightsSentence')}
          </p>
        </div>
      </div>

      {/* Section pour écrans plus grands */}
      <div className='hidden sm:block bg-background text-primary'>
        <Separator />
        <div className='flex justify-between p-4 px-16'>
          <p>© {new Date().getFullYear()} {t('footer.copyright.teamName')} | {t('footer.copyright.rightsSentence')}</p>
          <ArrowUpIcon className='h-6 w-6 cursor-pointer' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        </div>
      </div>
    </div>
  );
};
