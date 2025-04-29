"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ContestService, { ContestData } from "@/services/ContestService";
import Link from "next/link";
import { AppContext } from "@/state/AppContext";

const ContestPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [contestData, setContestData] = useState<ContestData | null>(null);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useContext(AppContext)!;

  const [teamName, setTeamName] = useState("");
  const [contestClassId, setContestClassId] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [registrationError, setRegistrationError] = useState("");

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission prevented");

    if (contestData && userInfo?.jwt) {
      const registrationData = {
        contestId: contestData.contestInfo.id,
        contestClassId,
        teamName,
        teamMembers,
      };

      try {
        const updatedContestData = await ContestService.registerTeam(registrationData, userInfo.jwt);
        setContestData(updatedContestData);
        setTeamName("");
        setContestClassId("");
        setTeamMembers("");
        setRegistrationError("");
        router.push('/');
      } catch (error) {
        console.error("Error registering team:", error);
        setRegistrationError("Registration failed. Please try again later.");
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!contestData) {
    return <p>No contest data available</p>;
  }

  return (
    <div>
      <h2>Sündmus - {contestData.contestInfo.name}</h2>
      <div className="row">
        <div className="col text-right">
          <button
            className="btn btn-info"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseRegistration"
            aria-expanded="false"
            aria-controls="collapseRegistration"
          >
            Registreeru...
          </button>
        </div>
      </div>

      <div className="collapse mt-2" id="collapseRegistration">
        <div className="row">
          <div className="col-md-4">
            <form onSubmit={handleRegister}>
              <input
                type="hidden"
                id="ContestId"
                name="ContestId"
                value={contestData.contestInfo.id}
              />
              <div className="mb-3">
                <label className="control-label" htmlFor="TeamName">
                  Võistkonna nimi
                </label>
                <input
                  className="form-control"
                  type="text"
                  id="TeamName"
                  name="TeamName"
                  required
                  maxLength={128}
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="control-label" htmlFor="ContestClassId">
                  Klass
                </label>
                <select
                  className="form-select"
                  id="ContestClassId"
                  name="ContestClassId"
                  required
                  value={contestClassId}
                  onChange={(e) => setContestClassId(e.target.value)}
                >
                  <option value="">Select an option</option>
                  {contestData.contestClasses.map((contestClass) => (
                    <option key={contestClass.key} value={contestClass.key}>
                      {contestClass.value}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="control-label" htmlFor="TeamMembers">
                  Võistkonna liikmed
                </label>
                <input
                  className="form-control"
                  type="text"
                  id="TeamMembers"
                  name="TeamMembers"
                  required
                  maxLength={255}
                  value={teamMembers}
                  onChange={(e) => setTeamMembers(e.target.value)}
                />
              </div>
              {registrationError && (
                <div className="alert alert-danger" role="alert">
                  {registrationError}
                </div>
              )}
              <div className="mb-3">
                <input
                  type="submit"
                  value="Registreeru üritusele"
                  className="btn btn-primary w-100"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      <table className="table mt-2">
        <thead>
          <tr>
            <th>Võistkond</th>
            <th>Staatus</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {contestData.userTeams.map((team) => (
            <tr key={team.teamId}>
              <td>{team.name}</td>
              <td>{team.startDT ? "Alustanud" : "Pole veel startinud"}</td>
              <td>
                <Link href={`../contestEntry/${team.id}`}>
                  Osale...
                </Link>
              </td>
            </tr>
          ))} 
        </tbody>
      </table>
    </div>
  );
};

export default ContestPage;
