import { v4 as uuidv4 } from "uuid";
import { MenuOption, Submenu, automationMenu, commonLinkedinSubmenus } from "./AutomationMenu";
import { workflowAutomationsArray } from "./TemplateFormOptions";

function AddNewNode(props: any, selectedOptionValue: any, recievedNodeId = "") {
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

  if (
    selectedOptionValue === "Linkedin Sales Navigator Search Extractor" ||
    selectedOptionValue === "Linkedin Search Extractor"
  ) {
    submenus = submenus.filter((submenu) => {
      if (typeof submenu === "object") {
        return submenu.name !== "Automated AI";
      }
      return true; // Keep non-object submenus
    });
  } else {
    submenus = submenus.filter((submenu) => {
      if (typeof submenu === "object") {
        return submenu.name !== "1-1";
      }
      return true; // Keep non-object submenus
    });
  }
  if (selectedOptionValue !== "Send Mail") {
    submenus = submenus.filter((submenu) => {
      if (typeof submenu === "object") {
        return submenu.name !== "AI SDR";
      }
      return true; // Keep non-object submenus
    });
  }
  // if (selectedOptionValue !== "Send Mail") {
  //   submenus = submenus.filter((submenu) => {
  //     if (typeof submenu === "object") {
  //       return submenu.name !== "AISDR Mail";
  //     }
  //     return true; // Keep non-object submenus
  //   });
  // }
  if (selectedOptionValue !== "Linkedin Message Sender") {
    submenus = submenus.filter((submenu) => {
      if (typeof submenu === "object") {
        return submenu.name !== "AI SDR Linkedin";
      }
      return true; // Keep non-object submenus
    });
  }
  // if (selectedOptionValue !== "Linkedin Message Sender") {
  //   submenus = submenus.filter((submenu) => {
  //     if (typeof submenu === "object") {
  //       return submenu.name !== "AISDR Linkedin";
  //     }
  //     return true; // Keep non-object submenus
  //   });
  // }
  if (selectedOptionValue === "1-1") {
    submenus = submenus.filter((submenu) => {
      if (typeof submenu === "object") {
        return submenu.name !== "1-1";
      }
      return true; // Keep non-object submenus
    });
  } else {
    submenus = submenus.filter((submenu) => {
      if (typeof submenu === "object") {
        return submenu.name !== "Automated AI";
      }
      return true; // Keep non-object submenus
    });
  }
  if (selectedOptionValue === "My Companies") {
    submenus = submenus.filter((submenu) => {
      if (typeof submenu === "object") {
        return submenu.name === "Prospect on Linkedin";
      }
      return true; // Keep non-object submenus
    });
  } else {
    submenus = submenus.filter((submenu) => {
      if (typeof submenu === "object") {
        return submenu.name !== "Prospect on Linkedin";
      }
      return true; // Keep non-object submenus
    });
  }
  // if (selectedOptionValue === "Send Mail") {
  //   submenus = submenus.filter((submenu) => {
  //     if (typeof submenu === "object") {
  //       return submenu.name === "AI SDR";
  //     }
  //     return true; // Keep non-object submenus
  //   });
  // } else {
  //   submenus = submenus.filter((submenu) => {
  //     if (typeof submenu === "object") {
  //       return submenu.name !== "AI SDR";
  //     }
  //     return true; // Keep non-object submenus
  //   });
  // }

  const choosenFtn = workflowAutomationsArray.find(
    (item) => item.title === selectedOptionValue
  )?.choosenFunction;

  // if (
  //   selectedOptionValue === "1-1" ||
  //   selectedOptionValue === "Automated AI" ||
  //   selectedOptionValue === "My Contacts" ||
  //   selectedOptionValue === "My Companies"
  // ) {
  //   const choosenFtn = workflowAutomationsArray.find(
  //     (item) => item.title === selectedOptionValue
  //   )?.choosenFunction;
  // }

  // console.log("submenu added to node: " + JSON.stringify(choosenFtn));

  // Check if a selected option was found
  if (submenus) {
    // Extract submenus from the selected option
    // const submenus = selectedMenu.submenus.map((submenu: { name: any }) => submenu.name);
    // const submenus = ("submenus" in selectedMenu ? (selectedMenu as MenuOption).submenus : []).map(
    //   (submenu) => submenu.name
    // );
    // Component logic here
    let uniqueNodeId = uuidv4();
    if (recievedNodeId !== "") {
      uniqueNodeId = recievedNodeId;
    }

    //   const newNodeId = String(nodes.length + 1);
    // const centerX = window.innerWidth / 2; // in middle of window
    // const oldNodeWidth = props.width / 2;
    // const centerX = oldNodeWidth + props.position.x;
    const centerX = window.innerWidth / 2;
    const posx = props.position ? props.position.x : centerX - 250;
    const posy = props.position ? props.position.y : 0;
    const newNode = {
      id: uniqueNodeId,
      type: "addActionNode",
      dragHandle: ".drag",
      position: { x: posx, y: posy + 110 },
      data: {
        label: "Add Action",
        isDelay: false,
        choosenFunction: choosenFtn || "linkedin",
        isFormField: false,
        isRootUrlCorrect: true,
        isInitialNode: false,
        isDropDownDisabled: false,
        menuData: submenus,
        formData: {},
        proNodeId: props.id,
        isOnStep: 0,
        // stats: props?.stats || undefined,
      },
      isConnectable: false,
    };
    const uniqueEdgeId = uuidv4(); // Generate a unique edge ID
    const newEdge = {
      id: `e-${uniqueEdgeId}`,
      source: props.id,
      target: uniqueNodeId,
      style: { strokeWidth: 2 },
      type: "",
      data: {
        label: "",
      },
    };
    // console.log("submenu added to node == : " + JSON.stringify(newNode.data.choosenFunction));
    return { newNode, newEdge };
  } else {
    return null;
  }
}

export default AddNewNode;
