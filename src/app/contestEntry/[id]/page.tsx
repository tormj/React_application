"use client";
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Head from 'next/head';
import ContestService, { CheckPointResponse, MarkCheckPointRequest, TeamInfoResponse } from '@/services/ContestService';
import { AppContext } from '@/state/AppContext';
import { useParams, useRouter } from 'next/navigation';

const ActivateEvent = () => {
  const router = useRouter();
  const { id: teamId } = useParams<{ id: string }>();
  const [scanState, setScanState] = useState('START');
  const [statusMessage, setStatusMessage] = useState('');
  const [translations, setTranslations] = useState<any>({});
  const [result, setResult] = useState<TeamInfoResponse>();
  const [newResult, setNewResult] = useState<CheckPointResponse>();
  const [setScore, setScoreState] = useState('');
  const [start, setStart] = useState('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [finalTime, setFinalTime] = useState<string>('');
  const [points, setPoints] = useState<number>(0);
  const [manualCheckpointId, setManualCheckpointId] = useState<string>('');

  const { userInfo } = useContext(AppContext)!;

  useEffect(() => {
    const fetchTeamInfo = async () => {
      try {
        const res = await ContestService.fetchTeamInfo(teamId, userInfo!.jwt);
        if (res.data) {
          setResult(res.data);
        } else {
          console.error('Failed to fetch team info:', res.errors || 'Unknown error');
        }
      } catch (error) {
        console.error('Error fetching team info:', error);
      }
    };

    if (teamId && userInfo?.jwt) {
      fetchTeamInfo();
    }
  }, [teamId, userInfo]);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const data = await ContestService.fetchTranslations();
        setTranslations(data);
      } catch (error) {
        console.error('Error fetching translations:', error);
      }
    };

    fetchTranslations();
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const millis = ((seconds % 1) * 1000).toFixed(1);
    return `${hrs.toString().padStart(2, '0')}.${Math.floor(mins / 60).toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${millis}`;
  };

  const markCheckPoint = useCallback(async (checkPointId: string) => {
    console.log("Marking CP:", checkPointId);
  
    const markCheckPointRequest: MarkCheckPointRequest = {
      checkPointId: checkPointId,
      userTeamId: teamId,
      lat: "0.0",
      lon: "0.0",
      dt: new Date().toISOString(),
    };
  
    try {
      const res = await ContestService.checkpoint(markCheckPointRequest, userInfo!.jwt);
      if (res.data) {
        setNewResult(res.data);
        setStatusMessage(res.data.message || 'Failed to mark CP');
  
        // Update start time if marking START checkpoint
        if (checkPointId === 'START') {
          setStartTime(res.data.result.startDT);
        }
  
        // Update end time if marking FINISH checkpoint
        if (checkPointId === 'FINISH') {
          setEndTime(res.data.result.finishDT);
        }
  
        // Update points
        setPoints(res.data.result.score);
      } else {
        setStatusMessage('Failed to mark CP');
      }
    } catch (error) {
      setStatusMessage('An error occurred while marking the CP');
      console.error('Error marking checkpoint:', error);
    }
  }, [teamId, userInfo]);

  useEffect(() => {
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

    setFinalTime(calculateFinalTime(startTime, endTime));
  }, [startTime, endTime]);

  useEffect(() => {
    if (scanState === 'CHECKPOINT') {
      const html5QrCodeScanner = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      const onScanSuccess = async (decodedText: string) => {
        console.log('QR Code detected:', decodedText);
      
        if (decodedText === 'START') {
          // Mark START checkpoint
          markCheckPoint('START');
        } else if (decodedText.startsWith('DEMO-')) {
          markCheckPoint(decodedText);
        } else if (decodedText === 'FINISH') {
          // Mark FINISH checkpoint
          markCheckPoint('FINISH');
        }
      
        setScanState('START'); 
      };

      const onScanFailure = (error: any) => {
        console.warn(`QR error = ${error}`);
      };

      html5QrCodeScanner.render(onScanSuccess, onScanFailure);

      return () => {
        html5QrCodeScanner.clear().catch((error) => {
          console.error('Failed to clear html5QrCodeScanner.', error);
        });
      };
    }
  }, [scanState, markCheckPoint]);

  const handleScanButtonClick = () => {
    setScanState('CHECKPOINT');
  };

  const handleManualMarkButtonClick = () => {
    if (manualCheckpointId) {
      markCheckPoint(manualCheckpointId);
    }
  };

  return (
    <div>
      <Head>
        <title>{result?.teamName || 'Activate Event'}</title>
      </Head>
      <main className="container">
        <div className="row">
          <div className="col-12 text-center">
            <h1>{result?.teamName || 'Demo'}</h1>
          </div>
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <input
                className="form-control w-50"
                id="cpId"
                placeholder="Enter CP Id..."
                value={manualCheckpointId}
                onChange={(e) => setManualCheckpointId(e.target.value)}
                autoComplete="off"
              />
              <button className="btn btn-secondary ms-3" onClick={handleManualMarkButtonClick}>
                Märgi
              </button>
              <button className="btn btn-success ms-3" onClick={handleScanButtonClick}>Scan</button>
            </div>
          </div>
          <div className="col-12">
            <div>
              <p><strong>Team name</strong>: {result?.teamName}</p>
              <p><strong>Start</strong>: {startTime}</p>
              <p><strong>End</strong>: {endTime}</p>
              <p><strong>Final time</strong>: {finalTime}</p>
              <p><strong>Points</strong>: {points}</p>
            </div>
          </div>
          <div className="col-12">
            <h2>Checkpoints</h2>
            <ul>
              {result?.markings && result?.markings.length > 0 ? (
                result.markings.map((marking, index) => (
                  <li key={index}>
                    <strong>CP ID</strong>: {marking.checkPointId}, <strong>Time</strong>: {marking.dt}
                  </li>
                ))
              ) : (
                <li>{translations.noCheckpoints || 'No checkpoints available'}</li>
              )}
            </ul>
          </div>
          <div className="col-12">
            <div id="qr-reader" style={{ width: '300px', margin: '0 auto' }}></div>
            <div id="qr-reader-results" style={{ marginTop: '20px' }}>{statusMessage}</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ActivateEvent;
