"use client";

import { useEffect, useRef, useState } from "react"

declare global {
    interface Window{
        webkitSpeechRecognition:any;
    }
}

export default function RecordingView(){
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [recordingComplete, setRecordingComplete] = useState<boolean>(false);
    const [transcript, setTranscript] = useState<string>("");

    const recognitionRef = useRef<any>(null);

    const startRecording = () => {
        setIsRecording(true);
        
        recognitionRef.current = new window.webkitSpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'id-ID';

        recognitionRef.current.onresult = (event:any) => {
            const {transcript } = event.results[event.results.length -1][0];

            setTranscript(transcript)
        }

        recognitionRef.current.start();
    };

    useEffect(() => {
        return () => {
            if(recognitionRef.current){
                recognitionRef.current.stop();
            }
        };
    },[]);

    const stopRecording = () => {
        if(recognitionRef.current){
            recognitionRef.current.stop();
            setRecordingComplete(true);
        }
    };

    const handleToogleRecording = () => {
        setIsRecording(!isRecording);
        if(!isRecording){
            startRecording();
        }else{
            stopRecording();
        }
    };

    return (
        <div className="flex items-center justify-center h-screen w-full">
            {/* {Transcript Section} */}
            <div className="w-full">
                {(isRecording || transcript) && (
                    <div className="w-1/4 m-auto rounded-md border p-4 bg-white">
                        <div className="flex-1 flex w-full justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {recordingComplete ? "Recorded" : "Recording"}
                                </p>
                                <p className="text-sm">
                                    {recordingComplete ? "Thanks for talking" : "Start speaking..."}
                                </p>
                            </div>
                        
                            {isRecording && (
                                <div className="rounded-full w-4 h-4 bg-red-400 animate-pulse"></div>
                            )}
                        </div>
                        {transcript && (
                            <div className="border rounded-md p-2 mt-4">
                                <p className="mb-0">{transcript}</p>
                            </div>
                        )}
                    </div>
                )}
                
            
                {/* Button Section */}
                <div className="flex items-center w-full">
                    {isRecording ? (
                        <button 
                            onClick={handleToogleRecording} 
                            className="rounded-full w-20 h-20 mt-10 m-auto flex items-center justify-center bg-red-400 hover:bg-red-500"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="w-12 h-12" 
                                viewBox="0 0 24 24"
                            >
                                <path fill="currentColor" d="M11 17V7H8v10h3Zm5 0V7h-3v10h3Z"/>
                            </svg>                                
                        </button>
                    ) : (
                        <button 
                            onClick={handleToogleRecording} 
                            className="rounded-full w-20 h-20 mt-10 m-auto flex items-center justify-center bg-blue-400 hover:bg-blue-500"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="w-12 h-12"
                                viewBox="0 0 24 24"
                            >
                                <g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2">
                                    <rect width="6" height="11" x="9" y="3" rx="3"/>
                                    <path stroke-linecap="round" d="M5 11a7 7 0 1 0 14 0m-7 10v-2"/>
                                </g>
                            </svg>                                
                        </button>
                    )}    
                </div>
            </div>
        </div>
    );
}