import { useState } from "react";
import { toast } from "react-toastify";

import { collection, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import useFirebase from "../../../../hooks/firebase/useFirebase";
import { useAppSelector } from "../../../../hooks/redux/useStore";
import { paths } from "../../../../routes/path";
import { authSelector } from "../../../../store/Auth";
import AisdrBuilder from "../Builder";
import DefineIcpAndPersona from "../DefineIcpAndPersona";
import { FormData as DefineIcpAndPersonaFormData } from "../DefineIcpAndPersona/FromScratch";
import PersonalisationOptions, { FormData as PersonalisationOptionsFormData } from "../PersonalisationOptions";


type Data = {
  defineIcpAndPersona: DefineIcpAndPersonaFormData;
  personalisationOptions: PersonalisationOptionsFormData;
};

const steps = [
  { name: "Define ICP + PERSONA", value: 0 },
  { name: "Personalisation Options", value: 1 },
  { name: "Outreach Review", value: 2 },
];

const AiSdrSetupPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [currentMethod, setCurrentMethod] = useState(0);
  const [formData, setFormData] = useState<Data | null>(null);
  const { firestore } = useFirebase();
  const { userInfo } = useAppSelector(authSelector);
  const navigate = useNavigate();

  const handleSave = async (data: PersonalisationOptionsFormData) => {
    const dataToAdd = {
      ...formData,
      personalisationOptions: data,
    };

    const collectionRef = collection(firestore, "aiSdrSetup");
    const docRef = doc(collectionRef, userInfo?.id.toString());
    try {
      // await setDoc(docRef, dataToAdd);
      console.log("datatoadd: ", dataToAdd);
      toast.success("Document written successfully");
      setCurrentMethod(0);
      setCurrentTab(0);
      // navigate(paths.main.automation.create);
      // goto builder with formData Stored
      navigate(paths.main.automation.create, {
        state: { isAisdrSetupLanding: true, aisdrData: dataToAdd },
      });
    } catch (error) {
      toast.error(error ?? "Document written failed");
    }
  };

  return (
    <>
      <div
        className={`flex items-center justify-between py-10 border-b border-borderColor dark:border-borderColor-dark ${
          currentTab === 1 ? "max-w-1140" : "max-w-1140"
        }`}
      >
        <nav className='grid justify-between w-full grid-cols-3 text-30'>
          {steps.map((step) => (
            <div
              key={step.name}
              className={`whitespace-nowrap border-b-2 py-16 px-1 text-sm font-medium flex justify-center ${
                step?.value === currentTab
                  ? "border-primary text-primary "
                  : "border-transparent text-neutral-600 dark:text-neutral-400"
              }`}
            >
              <p className='text-18'>{step.name}</p>
            </div>
          ))}
        </nav>
      </div>
      {currentTab === 0 && (
        <DefineIcpAndPersona
          currentMethod={currentMethod}
          setCurrentMethod={setCurrentMethod}
          setCurrentTab={setCurrentTab}
          onNext={(data: DefineIcpAndPersonaFormData) => {
            setFormData({
              defineIcpAndPersona: data,
              personalisationOptions: formData?.personalisationOptions,
            });
          }}
        />
      )}
      {currentTab === 1 && (
        <PersonalisationOptions setCurrentTab={setCurrentTab} onSave={handleSave} />
      )}
      {currentTab === 2 && <AisdrBuilder setCurrentTab={setCurrentTab} />}
    </>
  );
};

export default AiSdrSetupPage;
