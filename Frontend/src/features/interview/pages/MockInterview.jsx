import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useInterview } from "../hooks/useInterview";
import "../style/mockInterview.scss";

const MockInterview = () => {

    const { interviewId } = useParams();

    const {
        startInterview,
        submitAnswer
    } = useInterview();

    const [sessionId, setSessionId] = useState(null);
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {

        const start = async () => {

            const data = await startInterview(interviewId);

            if (data) {
                setSessionId(data.sessionId);
                setQuestion(data.question);
            }
        };

        start();

    }, []);

    const handleSubmit = async () => {

        if (!answer.trim()) {
            alert("Please enter an answer");
            return;
        }

        const data = await submitAnswer({
            sessionId,
            candidateAnswer: answer
        });

        if (!data) return;

        setFeedback(data.evaluation);

        if (data.completed) {

            setCompleted(true);
            setQuestion(null);

        } else {

            setQuestion(data.nextQuestion);
            setAnswer("");
        }
    };

    return (
        <div className="mock-interview">

            <h1 className="title">
                AI Mock Interview
            </h1>

            {completed ? (

                <div className="completed-card">

                    <h2>
                        🎉 Interview Completed
                    </h2>

                    <p>
                        Great job! You have completed all interview questions.
                    </p>

                </div>

            ) : (

                <>
                    {question && (

                        <div className="question-card">

                            <h3>
                                Question
                            </h3>

                            <p>
                                {question.question}
                            </p>

                        </div>

                    )}

                    <textarea
                        className="answer-box"
                        value={answer}
                        onChange={(e) =>
                            setAnswer(e.target.value)
                        }
                        placeholder="Type your answer here..."
                        rows={8}
                    />

                    <button
                        className="submit-btn"
                        onClick={handleSubmit}
                    >
                        Submit Answer
                    </button>

                    {feedback && (

                        <div className="feedback-card">

                            <h3>
                                Feedback
                            </h3>

                            <p className="score">
                                Score: {feedback.score}/10
                            </p>

                            <p>
                                <strong>Feedback:</strong>{" "}
                                {feedback.feedback}
                            </p>

                            <h4>
                                Strengths
                            </h4>

                            <ul>
                                {feedback.strengths?.map(
                                    (item, index) => (
                                        <li key={index}>
                                            {item}
                                        </li>
                                    )
                                )}
                            </ul>

                            <h4>
                                Weaknesses
                            </h4>

                            <ul>
                                {feedback.weaknesses?.map(
                                    (item, index) => (
                                        <li key={index}>
                                            {item}
                                        </li>
                                    )
                                )}
                            </ul>

                        </div>

                    )}
                </>

            )}
        </div>
    );
};

export default MockInterview;