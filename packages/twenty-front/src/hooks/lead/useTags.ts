import { useEffect, useState } from "react";

import { leadApi } from "../../api/leads";
import { ISelectOption } from "../../utils/types";
import { ILeadTag } from "../../utils/types/leads";

export const useTags = () => {
  const [tags, setTags] = useState<ILeadTag[]>([]);
  const [tagOptions, setTagOptions] = useState<ISelectOption[]>([]);

  const handleGetTags = async () => {
    try {
      const res = (await leadApi.getLeadTags()) as unknown as ILeadTag[];
      setTags(res);
      setTagOptions(res?.map((item) => ({ label: item.name, value: item.name })));
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    handleGetTags();
  }, []);

  return { tags, tagOptions, handleGetTags };
};
