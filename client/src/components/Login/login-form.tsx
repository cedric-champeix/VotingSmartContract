import { useWeb3 } from "@/hooks/useWeb3";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {useTranslation} from "react-i18next";

export function LoginForm() {
  const { t } = useTranslation();
  const { connectWallet } = useWeb3();

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-background p-6">
      <Card className="w-full max-w-4xl overflow-hidden shadow-lg">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 p-0">
          <div className="flex flex-col items-center justify-center p-10">
            <h1 className="text-3xl font-bold mb-6">{t("login.title")}</h1>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-sm">
              {t("login.subtitle")}
            </p>
            <Button onClick={connectWallet} className="bg-primary text-primary-foreground dark:bg-custom-1 dark:text-primary-foreground hover:bg-accent dark:hover:bg-custom-1 px-6 py-3 rounded-lg shadow-md">
              {t("login.button")}
            </Button>
          </div>

          <div className="relative hidden md:block bg-muted">
            <img src="../../public/images/logo-vert.png" alt="Login Illustration" className="w-full h-full object-cover" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
