import { useEffect, useState } from "react";

import { leadApi } from "../../api/leads";
import { OBJECT_TYPES } from "../../utils/constants/lead";
import { IStringObject, ITempSettingRes, ITemplate } from "../../utils/types/leads";

export const useVisitorExportCSV = () => {
  const [exportFields, setExportFields] = useState<IStringObject>({});
  const [templates, setTemplates] = useState<ITemplate[]>([]);

  const handleGetFileExportSetting = async () => {
    try {
      if (Object.keys(exportFields).length === 0) {
        const res = (await leadApi.getFileExportsSetting()) as unknown as ITempSettingRes;
        setExportFields(res?.fields.view);
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const handleGetTemplate = async () => {
    try {
      const objectType = OBJECT_TYPES.inbounds;
      const res = (await leadApi.getFileExportsTemplate(objectType)) as unknown as ITemplate[];
      const newArray = res.map((item) => ({ ...item, name: item.title }));
      setTemplates(newArray);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    handleGetFileExportSetting();
    handleGetTemplate();
  }, []);

  return { exportFields, templates, setTemplates };
};
