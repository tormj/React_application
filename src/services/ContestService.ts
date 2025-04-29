
import axios, { AxiosResponse } from "axios";
import { IResultObject } from "./IResultObject";

const API_BASE_URL = "https://smarty.akaver.com/api/v1";

export interface IContest {
  id: string;
  name: string;
  openTo: string;
}
export interface Marking {
  checkPointId: string;
  dt: string; 
}

export interface ContestData {
  contestInfo: {
    allowRegistrations: any;
    id: string;
    name: string;
    openTo: string;
  };
  userTeams: {
    id: string;
    teamId: string;
    name: string;
    memberNames: string;
    startDT: string;
    finishDT: string;
  }[];
  teamMembers: string;
  contestClasses: {
    key: string;
    value: string;
  }[];
}

interface RegistrationData {
  contestId: string;
  contestClassId: string;
  teamName: string;
  teamMembers: string;
}

export interface TeamInfoResponse {
  userTeam: {
      id: string;
      teamId: string;
      name: string;
      memberNames: string;
      startDT: string;
      finishDT: string;
  };
  teamName: string;
  startDT: string;
  finishDT: string;
  score: number;
  bonus: number;
  penalty: number;
  finalScore: number;
  markings: Array<{
      checkPointId: string;
      userTeamId: string;
      lat: string;
      lon: string;
      dt: string;
  }>;
}

export interface MarkCheckPointRequest {
  checkPointId: string;
  userTeamId: string;
  lat: string;
  lon: string;
  dt: string;
}

export interface CheckPointResponse {
  statusOk: boolean;
  statusCode: number;
  message: string;
  result: {
    teamName: string;
    startDT: string;
    finishDT: string;
    score: number;
    bonus: number;
    penalty: number;
    finalScore: number;
    markings: MarkCheckPointRequest[];
  };
}


class ContestService {
  static async getContests(): Promise<IContest[]> {
    const response = await axios.get(`${API_BASE_URL}/contest/contests`);
    return response.data;
  }

  static async getContestInfo(id: string, token: string): Promise<ContestData> {
    const response = await axios.get(`${API_BASE_URL}/contest/contestinfo/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  static async registerTeam(data: RegistrationData, token: string): Promise<ContestData> {
    const response = await axios.post(`${API_BASE_URL}/contest/register`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  static async fetchTranslations(): Promise<any> {
    const response = await axios.get(`${API_BASE_URL}/contest/translations`);
    return response.data;
  }

  static async fetchTeamInfo(teamId: string, jwt: string): Promise<IResultObject<TeamInfoResponse>> {
    try {
        const response = await axios.get<TeamInfoResponse>(`${API_BASE_URL}/contest/participate/${teamId}`, {
            headers: {
                "Authorization": "Bearer " + jwt
            }
        });

        if (response.status < 300) {

            return {
                data: response.data
            }
        }
        return {
            errors: [response.status.toString() + " " + response.statusText]
        }
    } catch (error: any) {
        return {
            errors: [JSON.stringify(error)]
        };
    }
}


static async checkpoint(markCheckPointRequest: MarkCheckPointRequest, jwt: string): Promise<IResultObject<CheckPointResponse>> {
  try {
      const response = await axios.post<CheckPointResponse>(`${API_BASE_URL}/contest/marking`, markCheckPointRequest, {
          headers: {
              "Authorization": "Bearer " + jwt
          }
      });

      if (response.status < 300) {
          return {
              data: response.data
          }
      }
      return {
          errors: [response.status.toString() + " " + response.statusText]
      }
  } catch (error: any) {
      return {
          errors: [error.response?.statusText || error.message || 'An error occurred']
      };
  }
}
}

export default ContestService;