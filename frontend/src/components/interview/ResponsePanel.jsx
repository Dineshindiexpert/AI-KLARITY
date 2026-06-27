const ResponsePanel = ({
  answer,
  setAnswer,
  onSubmitAnswer,
  loading,
}) => {
  return (
    <div style={{ color: "white" }}>
      
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        style={{ width: "100%", height: 200 }}
      />

      <button
        onClick={onSubmitAnswer}
        disabled={loading || !answer}
      >
        {loading ? "Submitting..." : "Submit Answer"}
      </button>

    </div>
  );
};

export default ResponsePanel;