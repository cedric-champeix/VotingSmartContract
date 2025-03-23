import { Link } from 'react-router-dom';

export const ForbiddenPage = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 text-center'>
      <h1 className='text-6xl font-bold text-red-500 mb-4'>403</h1>
      <h2 className='text-2xl font-semibold mb-2'>Accès interdit</h2>
      <p className='text-gray-600 mb-6'>Vous n'avez pas les droits pour accéder à cette page.</p>
      <Link to='/' className='text-white bg-primary hover:bg-primary/90 font-semibold px-5 py-3 rounded-xl shadow'>
        Retour à l'accueil
      </Link>
    </div>
  );
};
