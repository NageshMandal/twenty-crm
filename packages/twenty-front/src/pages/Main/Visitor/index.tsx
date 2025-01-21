import React, { useEffect, useMemo, useState } from "react";

import CompanyDetail from "./CompanyDetail";
import ExcludeSection from "./TrackingSetting/excludeSection";
import IncludeSection from "./TrackingSetting/IncludeSection";
import InsightPanel from "./Insight";
import LeftPanel from "./LeftPanel";
import ListPanel from "./ListPanel";
import TrackingSetting from "./TrackingSetting";
import VisitorDetail from "./VisitorDetail";
import { ICompanyVisitor, IPeopleVisitor } from "src/utils/types/visitor";
import { handleGetAccount } from "src/store/Vistor";
import { useAppDispatch, useAppSelector } from "src/hook/redux/useStore";
import { authSelector } from "src/store/Auth";

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const [selectedCompany, setSelectedCompany] = useState<ICompanyVisitor>();
  const [selectedVisitor, setSelectedVisitor] = useState<IPeopleVisitor>();
  const [trackingStep, setTrackingStep] = useState<number>();
  const [companyLoading, setCompanyLoading] = useState(false);

  const [peopleVisitorList, setPeopleVisitorLst] = useState<IPeopleVisitor[]>([]);
  const [companyVisitorList, setCompanyVisitorList] = useState<ICompanyVisitor[]>([]);
  const [hash, setHash] = useState();

  const companyInsight = useMemo(() => {
    if (companyVisitorList.length) {
      const totalCompany = companyVisitorList.length;
      const totalDate = [
        ...new Set(companyVisitorList.map((item) => item.updated_at.split(" ")[0])),
      ].length;
      const companyPerDay = totalCompany / totalDate;
      const countryList = companyVisitorList
        .filter((item) => item.company.locations.length > 0 && item.company.locations[0]?.country)
        ?.map((item2) => item2.company.locations[0].country);

      const countryInfo = [...new Set(countryList)].map((item) => ({
        country: item,
        percent: parseFloat(
          (
            (countryList.filter((country) => country === item).length / countryList.length) *
            100
          ).toFixed(1)
        ),
      }));

      const industryList = companyVisitorList
        .filter((item) => item.company.industry)
        ?.map((item2) => item2.company.industry);

      const industryInfo = [...new Set(industryList)].map((item) => ({
        industry: item,
        percent: parseFloat(
          (
            (industryList.filter((industry) => industry === item).length / industryList.length) *
            100
          ).toFixed(1)
        ),
      }));

      return {
        totalCompany,
        companyPerDay,
        countryInfo,
        industryInfo,
      };
    }
  }, [companyVisitorList]);

  useEffect(() => {
    setTrackingStep(null);
  }, [selectedCompany, selectedVisitor]);

  const handleGetAccountInfo = async () => {
    await dispatch(handleGetAccount());
  };

  useEffect(() => {
    handleGetAccountInfo();
  }, []);

  const { userInfo } = useAppSelector(authSelector);
  const selectedProspects = useMemo(
    () => peopleVisitorList.filter((item) => selectedVisitor?.id?.includes(item.id)),
    [selectedVisitor?.id]
  );

  return (
    <div className='pb-10'>
      <h2 className='font-normal select-none text-25 text-neutral-800 dark:text-neutral-300'>
        Reveal (Visitor identification)
      </h2>
      <div className='flex'>
        <LeftPanel setTrackingStep={setTrackingStep} trackingStep={trackingStep} />
        <ListPanel
          setCompanyLoading={setCompanyLoading}
          companyLoading={companyLoading}
          peopleVisitorList={peopleVisitorList}
          setPeopleVisitorLst={setPeopleVisitorLst}
          companyVisitorList={companyVisitorList}
          setCompanyVisitorList={setCompanyVisitorList}
          selectedCompany={selectedCompany}
          selectedVisitor={selectedVisitor}
          setSelectedCompany={(val) => {
            setSelectedCompany(val);
            setTrackingStep(null);
          }}
          setSelectedVisitor={(val) => {
            setSelectedVisitor(val);
            setTrackingStep(null);
          }}
          setHash={setHash}
        />
        {trackingStep === 1 ? (
          <TrackingSetting />
        ) : trackingStep === 2 ? (
          <IncludeSection />
        ) : trackingStep === 3 ? (
          <ExcludeSection />
        ) : null}
        {!(selectedCompany || selectedVisitor) && trackingStep === null ? (
          <InsightPanel companyLoading={companyLoading} companyInsight={companyInsight} />
        ) : null}
        {selectedCompany && trackingStep === null ? (
          <CompanyDetail company={selectedCompany} />
        ) : null}
        {selectedVisitor && trackingStep === null ? (
          <VisitorDetail
            visitor={selectedVisitor}
            userId={userInfo?.id}
            selectedProspects={selectedProspects}
            hash={hash}
          />
        ) : null}
      </div>
    </div>
  );
};

export default DashboardPage;
