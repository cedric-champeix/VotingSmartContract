import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const VoteForm = () => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const propositions = [
    t("vote.proposition1"),
    t("vote.proposition2"),
    t("vote.proposition3"),
  ];

  const handleSubmit = () => {
    if (selectedOption) {
      setSubmitted(true);
      console.log("Vote submitted for: ", selectedOption);
    }
  };

  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-800">{t("vote.title")}</h1>
      <Card className="p-6 shadow-xl rounded-2xl bg-white max-w-lg mx-auto">
        <CardContent>
          {!submitted ? (
            <div className="flex flex-col gap-4">
              {propositions.map((proposition, index) => (
                <label
                  key={index}
                  className={`p-4 border rounded-xl cursor-pointer transition hover:bg-gray-100 ${
                    selectedOption === proposition ? "border-indigo-600 bg-indigo-50" : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="vote"
                    value={proposition}
                    className="hidden"
                    onChange={() => setSelectedOption(proposition)}
                  />
                  {proposition}
                </label>
              ))}
              <Button onClick={handleSubmit} disabled={!selectedOption} className="mt-4">
                {t("vote.submit")}
              </Button>
            </div>
          ) : (
            <p className="text-lg text-green-600 font-semibold">{t("vote.thankYou")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VoteForm;
