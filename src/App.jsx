import React, { useState, useRef, useEffect } from 'react';

function TimerAndHiddenWord() {
    const hiddenWord = "secret"; // The secret word
    const maxAttempts = 20; // Max number of attempts before showing an alert
    const [typedText, setTypedText] = useState(""); // Tracks typed text
    const [showHiddenWord, setShowHiddenWord] = useState(false); // Show hidden word
    const [attempts, setAttempts] = useState(0); // Tracks the number of attempts
    const [time, setTime] = useState(0); // Timer in seconds
    const [isRunning, setIsRunning] = useState(false); // Timer running state
    const intervalRef = useRef(null); // Reference to store the interval ID

    // Start the timer
    const startTimer = () => {
        if (!isRunning) {
            setIsRunning(true);
            intervalRef.current = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        }
    };

    // Pause or Resume the timer
    const pauseResumeTimer = () => {
        if (isRunning) {
            clearInterval(intervalRef.current);
        } else {
            intervalRef.current = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        }
        setIsRunning(!isRunning);
    };

    // Reset the timer
    const resetTimer = () => {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setTime(0);
    };

    // Cleanup on component unmount
    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    // Handle input change
    const handleInputChange = (event) => {
        const newText = event.target.value;
        setTypedText(newText);
    };

    // Handle word submission
    const handleWordSubmit = () => {
        setAttempts(prevAttempts => prevAttempts + 1);

        if (typedText.includes(hiddenWord)) {
            setShowHiddenWord(true);
            pauseResumeTimer(); // Pause the timer when the word is found
            alert(`Hidden Word Found: ${hiddenWord} in ${time} seconds!`); // Show alert with elapsed time
        } else {
            alert("Incorrect word, try again!");
            if (attempts + 1 >= maxAttempts) {
                alert("You've reached the maximum attempts without guessing the hidden word!");
                resetTimer(); // Reset timer when max attempts are reached
                setTypedText(""); // Clear typed text
                setAttempts(0); // Reset attempts
            }
        }
    };

    // Calculate typing accuracy
    const calculateAccuracy = () => {
        const correctChars = typedText.split('').filter((char, index) => char === hiddenWord[index]).length;
        const accuracy = ((correctChars / Math.min(typedText.length, hiddenWord.length)) * 100) || 0; // Avoid division by zero
        return accuracy.toFixed(2); // Return accuracy as a percentage with 2 decimal places
    };

    return (
        <div className="container"> {/* Add class for styling */}
            <h1>Timer: {time}s</h1>
            <button onClick={startTimer} disabled={isRunning}>Start Timer</button>
            <button onClick={pauseResumeTimer}>{isRunning ? "Pause" : "Resume"} Timer</button>
            <button onClick={resetTimer}>Reset Timer</button>

            <h2>Type to reveal the hidden word!</h2>
            <input 
                type="text" 
                value={typedText} 
                onChange={handleInputChange} // Update to handle input changes directly
                placeholder="Type here..." 
            />
            <button onClick={handleWordSubmit}>Submit</button> {/* Submit button */}
            {showHiddenWord && <p>Hidden Word: {hiddenWord}</p>}
            <p>Typing Accuracy: {calculateAccuracy()}%</p>
        </div>
    );
}

export default TimerAndHiddenWord;
