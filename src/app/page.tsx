"use client";

import { useEffect, useState } from "react";
import ContestService, { IContest } from "@/services/ContestService";
import Link from "next/link";


export default function Home() {
  const [contests, setContests] = useState<IContest[]>([]);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const fetchedContests = await ContestService.getContests();
        setContests(fetchedContests);
      } catch (error) {
        console.error("Error fetching contests:", error);
      }
    };

    fetchContests();
  }, []);

  return (
    <div>
      <h1 className="display-4">Sündmused</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Nimetus</th>
            <th>Avatud kuni</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {contests.length > 0 ? (
            contests.map((contest) => (
              <tr key={contest.id}>
                <td>{contest.name}</td>
                <td>{new Date(contest.openTo).toLocaleString()}</td>
                <td>
                  <Link href={`contests/${contest.id}`}>Osale</Link> | 
                  <Link href={`finalResults/${contest.id}`}>Tulemused</Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No contests available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
