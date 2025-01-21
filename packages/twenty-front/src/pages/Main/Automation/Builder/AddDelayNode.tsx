import { v4 as uuidv4 } from "uuid";
import { MenuOption, Submenu, automationMenu, commonLinkedinSubmenus } from "./AutomationMenu";

function AddDelayNode(props: any, selectedOptionValue: any, recievedNodeId = "") {
  // const selectedOption = automationMenu.options.find(
  //   (option) => option.name === selectedOptionValue
  // );
  const isCommonLinkedinSubmenu = commonLinkedinSubmenus.some(
    (submenu: { name: any }) => submenu.name === selectedOptionValue
  );
  const findMenu = (
    options: (MenuOption | Submenu)[],
    target: string
  ): (MenuOption | Submenu) | null => {
    for (const option of options) {
      if ("name" in option && option.name === target) {
        return option;
      } else if ("submenus" in option) {
        const submenuResult = findMenu(option.submenus as (MenuOption | Submenu)[], target);
        if (submenuResult) return submenuResult;
      }
    }
    return null;
  };

  function findParentMenu(
    options: (MenuOption | Submenu)[],
    target: string
  ): MenuOption | Submenu | null {
    for (const option of options) {
      if (option.submenus && Array.isArray(option.submenus)) {
        const foundSubmenu = option.submenus.find((submenu) => submenu.name === target);
        if (foundSubmenu && foundSubmenu.name === target) {
          return option;
        }
      }
    }
    return null;
  }

  // const selectedMenu = findMenu(automationMenu.options, selectedOptionValue);
  // let submenus: string[] = [];
  let submenus: Submenu[] = [];
  // Check if a selected option was found
  if (isCommonLinkedinSubmenu) {
    // If selectedOptionValue is "Message Sender," look for its submenu and repeat it
    const parentMenu = findParentMenu(automationMenu.options, selectedOptionValue);

    if (parentMenu && parentMenu.submenus) {
      // submenus = parentMenu.submenus.map((submenu) => submenu.name);
      submenus = parentMenu.submenus as Submenu[];
    }
  } else {
    // For other cases, use the selected submenu
    const selectedMenu = findMenu(automationMenu.options, selectedOptionValue);
    if (selectedMenu && selectedMenu.submenus) {
      // submenus = selectedMenu.submenus.map((submenu) => submenu.name);
      submenus = selectedMenu.submenus as Submenu[];
    }
  }

  // Check if a selected option was found
  if (submenus) {
    let uniqueNodeId = uuidv4();
    if (recievedNodeId !== "") {
      uniqueNodeId = recievedNodeId;
    }
    const newDelayNode = {
      id: uniqueNodeId,
      type: "addActionNode",
      dragHandle: ".drag",
      position: { x: props.position.x, y: props.position.y + 110 },
      data: {
        label: "Delay",
        isFormField: false,
        isRootUrlCorrect: true,
        choosenFunction: "timer",
        isInitialNode: false,
        isDropDownDisabled: false,
        menuData: submenus,
        formData: FormData,
        delayUnit: {
          value: "Days",
          label: "Days",
        },
        value: "Delay",
        delayValue: "2",
        isDelay: true,
        isOnStep: 0,
        // stats: props?.stats || undefined,
      },
      isConnectable: false,
    };
    const uniqueEdgeId = uuidv4();
    const newDelayEdge = {
      id: `e-${uniqueEdgeId}`,
      source: props.id,
      target: uniqueNodeId,
      style: { strokeWidth: 2 },
      type: "",
      data: {
        label: "",
      },
    };
    return { newDelayNode, newDelayEdge };
  } else {
    return null;
  }
}

export default AddDelayNode;
