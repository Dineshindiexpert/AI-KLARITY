import React from "react";
import { Accordion, Badge } from "react-bootstrap";

const QuestionAnalysis = ({ questions, answers }) => {
  const difficultyText = (level) => {
    if (level <= 1) return "Beginner";
    if (level <= 3) return "Intermediate";
    return "Advanced";
  };

  return (
    <div className="glass-card p-4">
      <h5 className="section-title mb-4">
        Question By Question Analysis
      </h5>

      <Accordion flush>
        {questions?.map((q, index) => (
          <Accordion.Item
            eventKey={String(index)}
            key={index}
            className="question-accordion mb-3"
          >
            <Accordion.Header>
              Q{index + 1}: {q.question}
            </Accordion.Header>

            <Accordion.Body>

              <Badge bg="secondary" className="mb-3">
                {difficultyText(q.difficulty)}
              </Badge>

              <div className="text-light">
                {answers?.[index]?.answer}
              </div>

            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default QuestionAnalysis;