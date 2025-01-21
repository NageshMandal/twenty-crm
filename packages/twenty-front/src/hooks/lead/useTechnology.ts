import { useEffect, useState } from "react";

import { leadApi } from "../../api/leads";
import { ISelectOption } from "../../utils/types";
import { ICategory, ISubCategory, ITechAll, ITechnology } from "../../utils/types/leads";

export const useTechnology = () => {
  const [technologyList, setTechnologyList] = useState<ISelectOption[]>([]);
  const [categoryList, setCategoryList] = useState<ISelectOption[]>([]);

  const handleGetTechnology = async () => {
    try {
      const res = await leadApi.getTechnology();
      const categories = res as unknown as ICategory[];
      const subCategories: ISubCategory[] = [],
        technologies: ITechnology[] = [],
        all: ITechAll[] = [];
      categories.forEach((category) => {
        all.push(category);
        category.sub_categories.map((sub) => {
          all.push(sub);
          subCategories.push(sub);
          sub.technologies.map((tech) => {
            all.push(tech);
            technologies.push(tech);
          });
        });
      });

      setTechnologyList(
        technologies?.map((item) => ({
          value: item.key,
          label: item?.name + (item?.category_key ? "" : "(Category)"),
        }))
      );
      setCategoryList(categories?.map((item) => ({ value: item.key, label: item.name })));
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    handleGetTechnology();
  }, []);

  return { technologyList, categoryList };
};
