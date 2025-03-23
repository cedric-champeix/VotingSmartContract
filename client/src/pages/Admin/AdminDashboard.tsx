'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount, useWriteContract } from 'wagmi';
import { hardhat } from 'viem/chains';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock,
  HelpCircle,
  ListChecks,
  type LucideIcon,
  ShieldAlert,
  Users,
  Vote,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { contractABI, contractAddress } from '@/constants';
import useIsOwner from '@/hooks/useIsOwner';
import { useWorkflowStatus, WorkflowStatus, getNextWorkflow } from '@/hooks/useWorkflowStatus';
import VoterDialog from './components/VoterDialog';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface WorkflowStep {
  status: WorkflowStatus;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  const account = useAccount();
  const { data: workflowStatus, refetch: refetchWorkflowStatus } = useWorkflowStatus();
  const { writeContract } = useWriteContract();
  const { data: isOwner } = useIsOwner();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const workflowSteps: WorkflowStep[] = [
    {
      status: WorkflowStatus.VotersRegisteration,
      label: t('workflowStatus.0'),
      description: t('workflowDescription.0'),
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      status: WorkflowStatus.ProposalsRegistrationStart,
      label: t('workflowStatus.1'),
      description: t('workflowDescription.1'),
      icon: ClipboardList,
      color: 'bg-indigo-500',
    },
    {
      status: WorkflowStatus.ProposalsRegistrationEnd,
      label: t('workflowStatus.2'),
      description: t('workflowDescription.2'),
      icon: ListChecks,
      color: 'bg-violet-500',
    },
    {
      status: WorkflowStatus.VotingSessionStart,
      label: t('workflowStatus.3'),
      description: t('workflowDescription.3'),
      icon: Vote,
      color: 'bg-purple-500',
    },
    {
      status: WorkflowStatus.VotingSessionEnd,
      label: t('workflowStatus.4'),
      description: t('workflowDescription.4'),
      icon: Clock,
      color: 'bg-fuchsia-500',
    },
    {
      status: WorkflowStatus.VotesTallied,
      label: t('workflowStatus.5'),
      description: t('workflowDescription.5'),
      icon: CheckCircle2,
      color: 'bg-green-500',
    },
  ];

  const handleNextWorkflow = () => {
    if (workflowStatus === undefined) return;

    setIsProcessing(true);

    const nextWorkflowFunction = getNextWorkflow(workflowStatus);
    const nextWorkflowLabel = workflowStatus < 5 ? workflowSteps[workflowStatus + 1].label : 'Final State';

    writeContract(
      {
        address: contractAddress,
        abi: contractABI.abi,
        functionName: nextWorkflowFunction,
        scopeKey: 'workflowStatus',
        chain: hardhat,
        chainId: 31337,
        account: account.address,
      },
      {
        onSuccess: () => {
          refetchWorkflowStatus();
          toast.success(`Workflow mis à jour avec succès`, {
            description: `Passage à l'étape: ${nextWorkflowLabel}`,
            position: 'top-center',
          });
          setIsProcessing(false);
        },
        onError: (error) => {
          toast.error(`Erreur lors de la mise à jour du workflow`, {
            description: error.message,
            position: 'top-center',
          });
          setIsProcessing(false);
        },
      }
    );
  };

  if (workflowStatus === undefined) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <HelpCircle className='mx-auto h-12 w-12 text-muted-foreground animate-pulse' />
          <h2 className='mt-4 text-lg font-semibold'>Chargement du statut...</h2>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className='container max-w-6xl mx-auto px-4 py-12'>
        <Alert variant='destructive' className='mb-6'>
          <ShieldAlert className='h-5 w-5' />
          <AlertTitle>Accès refusé</AlertTitle>
          <AlertDescription>Vous n'avez pas les droits d'administrateur nécessaires pour accéder à cette page.</AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>Tableau de bord administrateur</CardTitle>
            <CardDescription>Cette section est réservée aux administrateurs du système de vote.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Veuillez vous connecter avec un compte administrateur pour accéder à ces fonctionnalités.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='container max-w-6xl mx-auto px-4 py-8'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Tableau de bord administrateur</h1>
          <p className='text-muted-foreground mt-1'>Gérez le processus de vote et les participants</p>
        </div>
        <Badge variant='outline' className='px-3 py-1 text-sm flex items-center gap-2'>
          <div className='w-2 h-2 rounded-full bg-green-500'></div>
          Administrateur
        </Badge>
      </div>

      <Tabs defaultValue='workflow' className='mb-8'>
        <TabsList className='mb-4 bg-black'>
          <TabsTrigger value='workflow'>Workflow</TabsTrigger>
          <TabsTrigger value='voters'>Électeurs</TabsTrigger>
        </TabsList>

        <TabsContent value='workflow'>
          <Card className='mb-8'>
            <CardHeader>
              <CardTitle>Statut du workflow</CardTitle>
              <CardDescription>Progression actuelle du processus de vote</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='relative'>
                <div className='absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2'></div>
                <div className='relative flex justify-between'>
                  {workflowSteps.map((step, index) => {
                    const isCurrent = workflowStatus === step.status;
                    const isCompleted = workflowStatus > step.status;

                    return (
                      <div key={index} className='flex flex-col items-center z-10'>
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full mb-2 transition-all ${
                            isCurrent
                              ? step.color + ' text-white shadow-lg'
                              : isCompleted
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <step.icon className='h-5 w-5' />
                        </div>
                        <div
                          className={`text-xs font-medium text-center max-w-[80px] ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}
                        >
                          {step.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex justify-end'>
              {workflowStatus === WorkflowStatus.VotesTallied ? (
                <Button
                  onClick={() => handleNextWorkflow()} // Ajoute un paramètre ou adapte la logique pour réinitialiser
                  className='flex items-center gap-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-800/30 dark:text-yellow-100 dark:hover:bg-yellow-700/40 transition'
                >
                  Revenir à l'étape 1
                  <ArrowLeft className='h-4 w-4' />
                </Button>
              ) : (
                <Button onClick={handleNextWorkflow} disabled={isProcessing} className='flex items-center gap-2'>
                  {isProcessing ? 'Traitement en cours...' : "Passer à l'étape suivante"}
                  {!isProcessing && <ArrowRight className='h-4 w-4' />}
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value='voters'>
          <Card>
            <CardHeader>
              1 🗳️
              <CardTitle>Gestion des électeurs</CardTitle>
              <CardDescription>Ajoutez des électeurs autorisés à participer au vote</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='border-2 border-black p-4 rounded-lg mb-4'>
                <h3 className='font-medium mb-2'>Statut d'inscription</h3>
                <p className='text-sm text-muted-foreground mb-2'>
                  {workflowStatus === WorkflowStatus.VotersRegisteration
                    ? "L'inscription des électeurs est actuellement ouverte. Vous pouvez ajouter de nouveaux électeurs."
                    : "L'inscription des électeurs est fermée. Vous ne pouvez plus ajouter de nouveaux électeurs."}
                </p>
                <Badge variant={workflowStatus === WorkflowStatus.VotersRegisteration ? 'default' : 'secondary'}>
                  {workflowStatus === WorkflowStatus.VotersRegisteration ? 'Ouvert' : 'Fermé'}
                </Badge>
              </div>

              <Separator className='my-4' />

              <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                {/* <Button
                  variant='outline'
                  className='flex items-center gap-2'
                  disabled={workflowStatus !== WorkflowStatus.VotersRegisteration}
                >
                  <Users className='h-5 w-5' />
                  Ajouter un électeur
                </Button> */}
                <VoterDialog />
                <p className='text-sm text-muted-foreground'>
                  {workflowStatus !== WorkflowStatus.VotersRegisteration &&
                    "Vous devez être à l'étape d'inscription des électeurs pour ajouter de nouveaux électeurs."}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Informations du contrat</CardTitle>
            <CardDescription>Détails sur le contrat de vote</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div>
                <h3 className='text-sm font-medium text-muted-foreground  mb-1'>Adresse du contrat</h3>
                <p className='font-mono text-xs p-2 rounded overflow-x-auto'>{contractAddress}</p>
              </div>
              <div>
                <h3 className='text-sm font-medium text-muted-foreground mb-1'>Réseau</h3>
                <p className='text-sm'>Hardhat (ID: 31337)</p>
              </div>
              <div>
                <h3 className='text-sm font-medium text-muted-foreground mb-1'>Propriétaire</h3>
                <p className='font-mono text-xs p-2 rounded overflow-x-auto'>{account.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Fonctionnalités administratives</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-3'>
              <Button variant='outline' className='h-auto py-4 flex flex-col items-center justify-center' onClick={() => navigate('/')}>
                <ClipboardList className='h-5 w-5 mb-1' />
                <span className='text-xs'>Voir les propositions</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
