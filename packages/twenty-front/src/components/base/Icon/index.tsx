import React from "react";

import { FiLogOut } from "react-icons/fi";
import { GiFairyWand } from "react-icons/gi";
import { GoFilter, GoLog, GoSortAsc, GoSortDesc } from "react-icons/go";
import { ReactComponent as Apartment } from "./icons/apartment.svg";
import { ReactComponent as ArrowLeft } from "./icons/arrowLeft.svg";
import { ReactComponent as ArrowUpDown } from "./icons/arrowUpDown.svg";
import { ReactComponent as Automation } from "./icons/automation.svg";
import { ReactComponent as BarBox } from "./icons/barBox.svg";
import { ReactComponent as BarSetting } from "./icons/barSetting.svg";
import { ReactComponent as Book } from "./icons/book.svg";
import { ReactComponent as Briefcase } from "./icons/briefcase.svg";
import { ReactComponent as Building } from "./icons/building.svg";
import { ReactComponent as Calendar } from "./icons/calender.svg";
import { ReactComponent as Card } from "./icons/card.svg";
import { ReactComponent as CheckRing } from "./icons/checkRing.svg";
import { ReactComponent as Chevron } from "./icons/chevron.svg";
import { ReactComponent as ChevronDown } from "./icons/chevron_down.svg";
import { ReactComponent as ChevronUp } from "./icons/chevron_up.svg";
import { ReactComponent as Chip } from "./icons/chip.svg";
import { ReactComponent as Circuit } from "./icons/circuit.svg";
import { ReactComponent as Coin } from "./icons/coin.svg";
import { ReactComponent as Column } from "./icons/column.svg";
import { ReactComponent as Company } from "./icons/company.svg";
import { ReactComponent as Congratulation } from "./icons/congratulation.svg";
import { ReactComponent as Cross } from "./icons/cross.svg";
import { ReactComponent as DEmail } from "./icons/d_email.svg";
import { ReactComponent as DLinkedin } from "./icons/d_linkedin.svg";
import { ReactComponent as People } from "./icons/d_people.svg";
import { ReactComponent as DTask1 } from "./icons/d_task1.svg";
import { ReactComponent as DTask2 } from "./icons/d_task2.svg";
import { ReactComponent as Dashboard } from "./icons/dashboard.svg";
import { ReactComponent as Dots9 } from "./icons/dots9.svg";
import { ReactComponent as DownLoad } from "./icons/download.svg";
import { ReactComponent as Download2 } from "./icons/download2.svg";
import { ReactComponent as Earth } from "./icons/earth.svg";
import { ReactComponent as EditPen } from "./icons/editPen.svg";
import { ReactComponent as Ellipsis } from "./icons/ellipsis.svg";
import { ReactComponent as EllipsisVertical } from "./icons/ellipsisVertical.svg";
import { ReactComponent as Emoji } from "./icons/emoji.svg";
import { ReactComponent as Envelop } from "./icons/envelop.svg";
import { ReactComponent as Exchange } from "./icons/exchange.svg";
import { ReactComponent as Exclamation } from "./icons/exclamation.svg";
import { ReactComponent as ExclamationDark } from "./icons/exclamationDark.svg";
import { ReactComponent as Eye } from "./icons/eye_black.svg";
import { ReactComponent as EyeSlash } from "./icons/eye_black_slash.svg";
import { ReactComponent as FilterBar } from "./icons/filterbar.svg";
import { ReactComponent as HandUp } from "./icons/handUp2.svg";
import { ReactComponent as HubSpot } from "./icons/hubspot.svg";
import { ReactComponent as Inbox } from "./icons/inbox.svg";
import { ReactComponent as Industry } from "./icons/industry.svg";
import { ReactComponent as Lead } from "./icons/lead.svg";
import { ReactComponent as Link } from "./icons/link.svg";
import { ReactComponent as Link2 } from "./icons/link2.svg";
import { ReactComponent as LinkedinCircle } from "./icons/linkedin-circle.svg";
import { ReactComponent as LinkedInMenu } from "./icons/linkedin-menu.svg";
import { ReactComponent as LinkedIn, ReactComponent as Linkedin } from "./icons/linkedin.svg";
import { ReactComponent as Location } from "./icons/location.svg";
import { ReactComponent as Logo } from "./icons/logo.svg";
import { ReactComponent as LogoBuilder } from "./icons/logobuilder.svg";
import { ReactComponent as MailBox } from "./icons/mailbox.svg";
import { ReactComponent as MessageBox } from "./icons/messageBox.svg";
import { ReactComponent as MessageColor } from "./icons/messageColor.svg";
import { ReactComponent as Moon } from "./icons/moon.svg";
import { ReactComponent as Pause } from "./icons/pause.svg";
import { ReactComponent as Pen } from "./icons/pen.svg";
import { ReactComponent as Phone } from "./icons/phone.svg";
import { ReactComponent as Play } from "./icons/play.svg";
import { ReactComponent as Plus } from "./icons/plus.svg";
import { ReactComponent as Prospect } from "./icons/prospect.svg";
import { ReactComponent as Question } from "./icons/question.svg";
import { ReactComponent as Recycle } from "./icons/recycle.svg";
import { ReactComponent as Reload } from "./icons/reload.svg";
import { ReactComponent as RingPlus } from "./icons/ringPlus.svg";
import { ReactComponent as Rotate } from "./icons/rotate.svg";
import { ReactComponent as Search } from "./icons/search.svg";
import { ReactComponent as Selling } from "./icons/selling.svg";
import { ReactComponent as Setting } from "./icons/setting.svg";
import { ReactComponent as Setting2 } from "./icons/setting2.svg";
import { ReactComponent as Setting3 } from "./icons/setting3.svg";
import { ReactComponent as Sharp } from "./icons/sharp.svg";
import { ReactComponent as Sort } from "./icons/sort.svg";
import { ReactComponent as Sun } from "./icons/sun.svg";
import { ReactComponent as Tag } from "./icons/tag.svg";
import { ReactComponent as Tags } from "./icons/tags.svg";
import { ReactComponent as Team } from "./icons/team.svg";
import { ReactComponent as Template } from "./icons/template.svg";
import { ReactComponent as ThreeBar } from "./icons/threeBar.svg";
import { ReactComponent as ThreeBarLeft } from "./icons/threeBarLeft.svg";
import { ReactComponent as Trash } from "./icons/trash.svg";
import { ReactComponent as Upload } from "./icons/upload.svg";
import { ReactComponent as User } from "./icons/user.svg";
import { ReactComponent as UserGroup } from "./icons/userGroup.svg";
import { ReactComponent as UserPlus } from "./icons/userPlus.svg";
import { ReactComponent as Users } from "./icons/users.svg";
import { ReactComponent as Visitor } from "./icons/visitor.svg";
import { ReactComponent as Warning } from "./icons/warning.svg";
import { ReactComponent as Web } from "./icons/web.svg";
import { ReactComponent as Zapier } from "./icons/zapier.svg";

export type IconType =
  | "Apartment"
  | "ArrowLeft"
  | "ArrowUpDown"
  | "Automation"
  | "BarBox"
  | "BarSetting"
  | "Briefcase"
  | "Book"
  | "Building"
  | "Calendar"
  | "Card"
  | "CheckRing"
  | "Chevron"
  | "ChevronDown"
  | "ChevronUp"
  | "Chip"
  | "Coin"
  | "Column"
  | "Company"
  | "Congratulation"
  | "Cross"
  | "DEmail"
  | "DLinkedin"
  | "DTask1"
  | "DTask2"
  | "Dashboard"
  | "Dots9"
  | "DownLoad"
  | "Download2"
  | "Earth"
  | "EditPen"
  | "Ellipsis"
  | "EllipsisVertical"
  | "Emoji"
  | "FilterBar"
  | "Exchange"
  | "Exclamation"
  | "ExclamationDark"
  | "Eye"
  | "EyeSlash"
  | "HandUp"
  | "HubSpot"
  | "Inbox"
  | "Lead"
  | "Envelop"
  | "Link"
  | "Link2"
  | "LinkedIn"
  | "LinkedInMenu"
  | "Location"
  | "Logo"
  | "LogoBuilder"
  | "MailBox"
  | "MessageBox"
  | "MessageColor"
  | "Moon"
  | "Pause"
  | "Pen"
  | "People"
  | "Phone"
  | "Play"
  | "Plus"
  | "Question"
  | "Recycle"
  | "Reload"
  | "RingPlus"
  | "Rotate"
  | "Search"
  | "Selling"
  | "Setting"
  | "Setting2"
  | "Sharp"
  | "Sort"
  | "Sun"
  | "Setting3"
  | "Team"
  | "Template"
  | "ThreeBar"
  | "ThreeBarLeft"
  | "Trash"
  | "User"
  | "UserGroup"
  | "UserPlus"
  | "Upload"
  | "Users"
  | "Visitor"
  | "Warning"
  | "Zapier"
  | "Prospect"
  | "Industry"
  | "LinkedinCircle"
  | "GiFairyWand"
  | "GoLog"
  | "Linkedin"
  | "Tag"
  | "Tags"
  | "Circuit"
  | "FiLogOut"
  | "GoSortAsc"
  | "GoSortDesc"
  | "GoFilter"
  | "Web";

type Props = {
  name: IconType;
  className?: string;
  id?: string;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
};

const Icon: React.FC<Props> = ({ name, id, className, onClick }) => {
  if (!name) {
    return null;
  }

  const icons = {
    Apartment,
    ArrowLeft,
    ArrowUpDown,
    Automation,
    BarBox,
    BarSetting,
    Briefcase,
    Book,
    Building,
    Calendar,
    Card,
    CheckRing,
    Chevron,
    ChevronDown,
    ChevronUp,
    Coin,
    Chip,
    FilterBar,
    Column,
    Company,
    Congratulation,
    Cross,
    DEmail,
    DLinkedin,
    DTask1,
    DTask2,
    Dashboard,
    Dots9,
    DownLoad,
    Envelop,
    Download2,
    Earth,
    EditPen,
    Ellipsis,
    EllipsisVertical,
    Emoji,
    Exchange,
    Exclamation,
    ExclamationDark,
    Eye,
    EyeSlash,
    HandUp,
    HubSpot,
    Inbox,
    Lead,
    Link,
    Link2,
    LinkedIn,
    LinkedInMenu,
    Location,
    Logo,
    LogoBuilder,
    MailBox,
    MessageBox,
    MessageColor,
    Moon,
    Pause,
    Pen,
    People,
    Phone,
    Play,
    Plus,
    Question,
    Recycle,
    Reload,
    RingPlus,
    Rotate,
    Search,
    Selling,
    Setting,
    Setting2,
    Setting3,
    Sharp,
    Sort,
    Sun,
    Team,
    Template,
    ThreeBar,
    ThreeBarLeft,
    Trash,
    User,
    Upload,
    UserGroup,
    UserPlus,
    Users,
    Visitor,
    Warning,
    Zapier,
    Prospect,
    LinkedinCircle,
    Industry,
    Linkedin,
    GiFairyWand,
    GoLog,
    Tag,
    Tags,
    Circuit,
    FiLogOut,
    GoSortAsc,
    GoSortDesc,
    GoFilter,
    Web,
  };

  const CurrentIcon = icons[name];

  return <CurrentIcon id={id} className={className} onClick={onClick} role={onClick && "button"} />;
};

export default Icon;
