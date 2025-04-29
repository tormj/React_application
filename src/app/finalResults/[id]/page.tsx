"use client";
import { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ContestService, { ContestData } from "@/services/ContestService";
import Head from "next/head";
import { AppContext } from "@/state/AppContext";
import React from "react";

const FinalResults = () => {
  const { id } = useParams<{ id: string }>();
  const [contestData, setContestData] = useState<ContestData | null>(null);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useContext(AppContext)!;

  useEffect(() => {
    if (id && userInfo?.jwt) {
      const fetchContestData = async () => {
        try {
          const data = await ContestService.getContestInfo(id, userInfo.jwt);
          setContestData(data);
        } catch (error) {
          console.error("Error fetching contest data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchContestData();
    }
  }, [id, userInfo]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const millis = ((seconds % 1) * 1000).toFixed(1);
    return `${hrs.toString().padStart(2, '0')}.${Math.floor(mins / 60).toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${millis}`;
  };

  const calculateFinalTime = (start: string, end: string) => {
    if (start && end) {
      const startDateTime = new Date(start);
      const endDateTime = new Date(end);
      const finalTimeInMilliseconds = endDateTime.getTime() - startDateTime.getTime();
      const finalTimeInSeconds = finalTimeInMilliseconds / 1000;
      return formatTime(finalTimeInSeconds);
    }
    return '';
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!contestData) {
    return <p>No contest data available</p>;
  }

  return (
    <div>
      <Head>
        <title>Final Results</title>
      </Head>
      <main className="container">
        <div className="row">
          <div className="col-12 text-center">
            <h2>Demo</h2>
            <h4>Tulemused</h4>
          </div>
          <div className="col-12">
            <table className="table">
              <tbody>
                {contestData.userTeams.filter(team => team.finishDT).map((team, index) => (
                  <React.Fragment key={index}>
                    <tr className="bg-secondary text-white">
                      <th>{team.name}</th>
                      <th className="text-right d-none d-sm-block">Aeg</th>
                      <th className="text-right">Skoor</th>
                      <th className="text-right">Boonus</th>
                      <th className="text-right">Trahv</th>
                      <th className="text-right">Lõplik</th>
                    </tr>
                    <tr>
                      <td>
                        <a role="button" data-bs-toggle="collapse" aria-expanded="false" aria-controls={`collapseTeamInfo${index}`} href={`#collapseTeamInfo${index}`}>
                          {team.name}
                        </a>
                      </td>
                      <td className="text-right d-none d-sm-block">
                        <span>{calculateFinalTime(team.startDT, team.finishDT)}</span>
                      </td>
                      <td className="text-right">N/A</td>
                      <td className="text-right">0</td>
                      <td className="text-right">0</td>
                      <td className="text-right">
                        <b>N/A</b>
                      </td>
                    </tr>
                    <tr className="collapse" id={`collapseTeamInfo${index}`}>
                      <td colSpan={6}>
                        <div>
                          {team.name}
                          <br />
                          <span>Stardi aeg: {team.startDT}</span>
                          <br />
                          <span>Finish aeg: {team.finishDT}</span>
                          <br />
                          <span>Liikmed: {team.memberNames}</span>
                          <br />
                          <span>Koguaeg: {calculateFinalTime(team.startDT, team.finishDT)}</span>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinalResults;
