import Button from "../../../../components/base/Button";
import Icon from "../../../../../components/base/Icon";
import Tooltip from "../../../../components/base/Tooltip";
interface Props {
  typesAndSignals: string[];
  selectedTypesAndSignals: string[];
  onSelect: (value: string) => void;
}
const PersonalisationTypesAndSignals: React.FC<Props> = ({
  typesAndSignals,
  selectedTypesAndSignals,
  onSelect,
}) => (
  <div className='flex flex-col gap-12'>
    <div className='w-full flex px-5 mb-4 gap-3'>
      <span className={`font-bold text-neutral-800 dark:text-neutral-200 text-base`}>
        Personalisation Types and Signals
      </span>
      <span className={`font-normal dark:text-neutral-200 text-base text-[#94A3B8]`}>
        (optional, choose multiple for better reach by selecting the categories and edit setup by
        clicking pencil)
      </span>
    </div>
    <div className='flex flex-wrap items-center gap-12'>
      {typesAndSignals.map((typeAndSignal) => (
        <Tooltip
          key={typeAndSignal}
          label={
            [
              "G2 Review",
              "Podcast Research",
              "Funding Announcement",
              "Recent Technology Install",
              "Recent Technology Drop",
            ].includes(typeAndSignal)
              ? "Coming soon..."
              : typeAndSignal
          }
          className='cursor-pointer'
        >
          <Button
            prefix='Briefcase'
            suffix='EditPen'
            className='flex items-center gap-10'
            buttonStyle={
              selectedTypesAndSignals.includes(typeAndSignal)
                ? "primary"
                : [
                    "G2 Review",
                    "Podcast Research",
                    "Visitor Intent",
                    "Funding Announcement",
                    "Recent Technology Install",
                    "Recent Technology Drop",
                  ].includes(typeAndSignal)
                ? "secondary"
                : "white"
            }
            onClick={() => {
              onSelect(typeAndSignal);
            }}
            disabled={[
              "G2 Review",
              "Podcast Research",
              "Visitor Intent",
              "Funding Announcement",
              "Recent Technology Install",
              "Recent Technology Drop",
            ].includes(typeAndSignal)}
          >
            {typeAndSignal}
          </Button>
        </Tooltip>
      ))}
    </div>
  </div>
);

export default PersonalisationTypesAndSignals;
